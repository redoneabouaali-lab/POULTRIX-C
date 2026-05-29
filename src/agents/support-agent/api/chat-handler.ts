import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY || "",
});

const VISION_MODEL = process.env.NVIDIA_VISION_MODEL || "meta/llama-3.2-90b-vision-instruct";
const TEXT_MODEL = process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct";

const visionPrompt = `You are POULTRIX AI, a helpful assistant for Moroccan poultry farmers. Describe what you see in the image in detail. If you see birds, chickens, farm equipment, or barn conditions, describe their health, appearance, and any issues you notice. Be concise and practical. Respond in the same language the user used.`;

const textPrompt = `You are POULTRIX AI - the official AI assistant of the POULTRIX poultry intelligence platform for Moroccan farmers.

=== LANGUAGE RULE ===
Match the user's language exactly: Darija / Arabic / French / English. Never switch.

=== APP OVERVIEW ===
POULTRIX helps Moroccan poultry farmers monitor flocks, track health, manage inventory, handle sales/orders, record expenses, and more.

=== ACTION TOOLS — Use these to DO things ===
When the user asks to add/create/record something, use the appropriate tool. VALIDATE required fields BEFORE calling. If any required field is missing, tell the user exactly which info is missing and ask for it. NEVER auto-fill defaults without asking.

Available write tools:
- add_flock: Add new batch (requires: name, breed, totalBirds, avgAge)
- record_eggs: Record egg production (requires: flockId, quantity)
- add_health_event: Record health/vaccination event (requires: eventType, description)
- add_inventory_item: Add inventory item (requires: type, name, quantity, unit, cost, minimumThreshold)
- add_expense: Record expense (requires: amount, expenseDate, category)
- record_stocking: Record bird stocking change (requires: flockId)
- add_product: Add product for sale (requires: name, type, quantity, price)
- create_order: Create customer order (requires: customerName, totalAmount, items)

=== READ TOOLS — Use these to LOOK UP data ===
- get_dashboard: Live metrics (mortality, feed, health, profit)
- get_flock: Flock summary (birds, barns, age, health)
- get_financial: Daily costs, revenue, profit margin
- get_predictions: Barn mortality risk + recommendations
- get_alerts: Active barn alerts
- get_insights: AI recommendations
- query_data: Query any endpoint (flock, egg-records, health-events, inventory, expenses, stocking, products, orders, invoices)

=== WORKFLOW ===
1. If user wants to add data → VALIDATE all required fields → if anything missing, say "تحتاج إلى توفير: [list]" → only call tool when all required fields are provided
2. If user asks a question → call the appropriate read tool for real data
3. Answer from tool results, never fabricate data

=== RESPONSE FORMAT ===
Respond in plain text with proper Arabic/Darija/French/English formatting. Use markdown headings (##, ###), bullet lists, and bold/italic for emphasis. Do NOT use OpenUI Lang, JSX, or any special component syntax. Just write naturally formatted text.`;

/* ─── Audio Transcription ─── */

async function transcribeAudio(audioBase64: string): Promise<string> {
  try {
    const whisper = new OpenAI({
      baseURL: process.env.NVIDIA_AUDIO_BASE_URL || "https://api.nvcf.nvidia.com/v1",
      apiKey: process.env.NVIDIA_API_KEY || "",
    });
    const buf = Buffer.from(audioBase64, "base64");
    const blob = new Blob([buf], { type: "audio/webm" });
    const file = new File([blob], "audio.webm", { type: "audio/webm" });
    const transcript = await whisper.audio.transcriptions.create({
      model: process.env.NVIDIA_WHISPER_MODEL || "nvidia/parakeet-ctc-0.6b",
      file,
    });
    return transcript.text || "";
  } catch {
    return "";
  }
}

/* ─── Build Messages ─── */

async function buildMessages(rawMessages: any[]) {
  const result: any[] = [];

  for (const msg of rawMessages) {
    if (typeof msg.content === "string") {
      result.push({ role: msg.role, content: msg.content });
      continue;
    }

    if (Array.isArray(msg.content)) {
      if (msg.role === "assistant") {
        const text = msg.content.map((p: any) => p.text || "").join("");
        result.push({ role: "assistant", content: text || "[silence]" });
        continue;
      }
      const parts: any[] = [];
      for (const part of msg.content) {
        if (part.type === "text") {
          parts.push({ type: "text", text: part.text });
        } else if (part.type === "image" && part.base64) {
          parts.push({
            type: "image_url",
            image_url: { url: `data:${part.mime};base64,${part.base64}` },
          });
        } else if (part.type === "audio" && part.base64) {
          const transcript = await transcribeAudio(part.base64);
          if (transcript) parts.push({ type: "text", text: `[Audio transcription: ${transcript}]` });
        } else if (part.type === "video" && part.base64) {
          parts.push({ type: "text", text: "[User sent a video. Describe what you see based on context.]" });
        }
      }
      result.push({ role: msg.role, content: parts.length > 0 ? parts : msg.content });
      continue;
    }

    result.push({ role: msg.role, content: msg.content });
  }

  return result;
}

/* ─── Main Route ─── */

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages)) {
    return Response.json({ error: "Messages must be an array" }, { status: 400 });
  }
  if (messages.length > 20) {
    return Response.json({ error: "Too many messages. Maximum is 20." }, { status: 400 });
  }
  const totalLength = messages.reduce((sum: number, m: any) => {
    if (typeof m.content === "string") return sum + m.content.length;
    if (Array.isArray(m.content)) {
      return sum + m.content.reduce((s: number, p: any) => s + (typeof p.text === "string" ? p.text.length : 0), 0);
    }
    return sum;
  }, 0);
  if (totalLength > 50000) {
    return Response.json({ error: "Total content too long. Maximum 50000 characters." }, { status: 400 });
  }

  if (!process.env.NVIDIA_API_KEY) {
    return Response.json({
      choices: [{ delta: { content: "⚠️ NVIDIA API key not configured. Add NVIDIA_API_KEY to .env.local" }, finish_reason: "stop" }],
    });
  }

  const hasImage = messages.some((m: any) =>
    Array.isArray(m.content) && m.content.some((p: any) => p.type === "image")
  );
  const model = hasImage ? VISION_MODEL : TEXT_MODEL;
  const systemPrompt = hasImage ? visionPrompt : textPrompt;

  const builtMessages = await buildMessages(messages);

  const completionOpts: any = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...builtMessages.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    stream: true,
    temperature: 0.3,
    max_tokens: 4096,
  };

  if (!hasImage) {
    completionOpts.tools = [
      { type: "function", function: { name: "get_dashboard", description: "Get live dashboard metrics", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_flock", description: "Get flock summary", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_financial", description: "Get financial snapshot", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_predictions", description: "Get AI mortality predictions", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_alerts", description: "Get active barn alerts", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_insights", description: "Get AI insights", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "query_data", description: "Query any farm data endpoint", parameters: { type: "object", properties: { endpoint: { type: "string", description: "e.g. flock, egg-records, health-events, inventory, expenses, stocking, products, orders" } }, required: ["endpoint"] } } },
      { type: "function", function: { name: "add_flock", description: "Add a new chicken batch. VALIDATE: name, breed, totalBirds, avgAge required. If missing, tell user.", parameters: { type: "object", properties: { name: { type: "string" }, breed: { type: "string" }, totalBirds: { type: "number" }, avgAge: { type: "number" }, houseShedId: { type: "string" }, notes: { type: "string" } }, required: ["name", "breed", "totalBirds", "avgAge"] } } },
      { type: "function", function: { name: "record_eggs", description: "Record egg production. Required: flockId, quantity.", parameters: { type: "object", properties: { flockId: { type: "string" }, quantity: { type: "number" }, pricePerTray: { type: "number" }, broken: { type: "number" }, notes: { type: "string" } }, required: ["flockId", "quantity"] } } },
      { type: "function", function: { name: "add_health_event", description: "Record health event. Required: eventType, description.", parameters: { type: "object", properties: { eventType: { type: "string", enum: ["vaccination", "medication", "inspection", "disease", "mortality", "checkup", "treatment"] }, description: { type: "string" }, flockId: { type: "string" }, birdsAffected: { type: "number" }, mortalityCount: { type: "number" }, cost: { type: "number" }, treatment: { type: "string" }, performedBy: { type: "string" }, notes: { type: "string" } }, required: ["eventType", "description"] } } },
      { type: "function", function: { name: "add_inventory_item", description: "Add inventory item. Required: type, name, quantity, unit, cost, minimumThreshold.", parameters: { type: "object", properties: { type: { type: "string", enum: ["feed", "medicine", "equipment", "supplies"] }, name: { type: "string" }, quantity: { type: "number" }, unit: { type: "string" }, cost: { type: "number" }, minimumThreshold: { type: "number" }, supplier: { type: "string" }, notes: { type: "string" } }, required: ["type", "name", "quantity", "unit", "cost", "minimumThreshold"] } } },
      { type: "function", function: { name: "add_expense", description: "Record expense. Required: amount, expenseDate, category.", parameters: { type: "object", properties: { amount: { type: "number" }, expenseDate: { type: "string" }, category: { type: "string", description: "أعلاف / أدوية / تجهيزات / صيانة / كهرباء / مياه / نقل / عمالة / أخرى" }, description: { type: "string" }, paymentMethod: { type: "string", enum: ["cash", "bank_transfer", "cheque", "card"] }, notes: { type: "string" } }, required: ["amount", "expenseDate", "category"] } } },
      { type: "function", function: { name: "record_stocking", description: "Record stocking change. Required: flockId.", parameters: { type: "object", properties: { flockId: { type: "string" }, birdsAdded: { type: "number" }, birdsRemoved: { type: "number" }, mortality: { type: "number" }, notes: { type: "string" } }, required: ["flockId"] } } },
      { type: "function", function: { name: "add_product", description: "Add product for sale. Required: name, type, quantity, price.", parameters: { type: "object", properties: { name: { type: "string" }, type: { type: "string", enum: ["eggs", "meat", "chicks", "manure"] }, quantity: { type: "number" }, price: { type: "number" }, quality: { type: "string", enum: ["premium", "standard", "economy"] }, notes: { type: "string" } }, required: ["name", "type", "quantity", "price"] } } },
      { type: "function", function: { name: "create_order", description: "Create customer order. Required: customerName, totalAmount, items.", parameters: { type: "object", properties: { customerName: { type: "string" }, totalAmount: { type: "number" }, items: { type: "array", items: { type: "object", properties: { productId: { type: "string" }, productName: { type: "string" }, quantity: { type: "number" }, price: { type: "number" } }, required: ["productId", "quantity", "price"] } }, deliveryAddress: { type: "string" }, notes: { type: "string" } }, required: ["customerName", "totalAmount", "items"] } } },
    ];
  }

  const stream = await client.chat.completions.create(completionOpts) as any;

  const encoder = new TextEncoder();
  const streamable = new ReadableStream({
    async start(controller) {
      const pendingCalls = new Map<number, { name: string; args: string }>();

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta;
        if (!delta) continue;
        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index ?? 0;
            if (!pendingCalls.has(idx)) pendingCalls.set(idx, { name: "", args: "" });
            const call = pendingCalls.get(idx)!;
            if (tc.function?.name) call.name = tc.function.name;
            if (tc.function?.arguments) call.args += tc.function.arguments;
          }
          continue;
        }
        if (delta.content) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`));
        }
      }

      if (pendingCalls.size > 0) {
        const { executeTool } = await import("@/agents/support-agent/tools");
        const toolResults: { name: string; args: any; result: string }[] = [];
        for (const [, call] of pendingCalls) {
          if (!call.name) continue;
          let args: any = {};
          try { if (call.args) args = JSON.parse(call.args); } catch {}
          const result = await executeTool(call.name, args);
          toolResults.push({ name: call.name, args, result });
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ toolResult: true, name: call.name, args, data: result })}\n\n`));
        }
        const toolContext = toolResults
          .map((tr) => `Result of "${tr.name}":\n${tr.result}`)
          .join("\n\n");
        const secondStream = await client.chat.completions.create({
          model: TEXT_MODEL,
          messages: [
            { role: "system", content: "You are POULTRIX AI. Summarize the tool execution result in a natural, helpful response. Use the same language as the user (Arabic/Darija/French/English). Be concise and clear." },
            ...builtMessages.map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
            { role: "user", content: `The tool returned the following result. Please summarize it naturally:\n\n${toolContext}` },
          ],
          stream: true,
          temperature: 0.3,
          max_tokens: 4096,
        }) as any;
        for await (const chunk of secondStream) {
          const delta = chunk.choices?.[0]?.delta;
          if (delta?.content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`));
          }
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(streamable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
