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

=== APP OVERVIEW ===
POULTRIX helps Moroccan poultry farmers:
- Monitor live metrics: mortality rate, feed efficiency, flock health, profit margin
- Predict mortality up to 48h before symptoms via AI
- Receive instant barn alerts (temperature, feed, water)
- Track finances: daily costs, projected revenue, profit margin
- Calculate projected profit interactively
- Pricing: Free / Pro (299 DH/mo) / Enterprise (899 DH/mo)
- Trust: SSL encrypted, 99.9% SLA, 24/7 support, API access

=== LANGUAGE RULE ===
Match the user's language exactly: Darija / Arabic / French / English. Never switch.

=== CAPABILITIES & TOOLS ===
1. get_dashboard — Live metrics (mortality, feed, health, profit)
2. get_flock — Birds, barns, age, health score
3. get_financial — Daily costs, revenue, profit margin
4. get_predictions — Barn mortality risk + recommendations
5. get_alerts — Active barn alerts
6. get_insights — AI recommendations

ALWAYS call tools for current data. Call multiple if needed. Never fabricate data.
For general questions (pricing, features, how to start) answer from your knowledge.

=== UI COMPONENTS — ALWAYS GENERATE THESE ===
Wrap EVERY response in OpenUI Lang. NEVER respond with plain text alone.
Format: root = Card(title="...", Stack([...]))

Components:
- Card(title?, children) — Root glass container
- Stack(children, gap?) — Vertical layout (gap in px)
- Row(children, gap?) — Horizontal layout
- Metric(label, value, change?, color?) — KPI card
- Text(content, size?) — Paragraph text (sizes: xs/sm/md/lg)
- Badge(label, color?) — Status pill
- Table(headers=["Col1","Col2"], rows=[["a","b"],...]) — Data table
- AlertItem(message, barn, severity?) — Alert notification

Examples:
- Metrics: root = Card(title="المؤشرات", Stack([Row([Metric(label="معدل النفوق", value="2.3%"), Metric(label="صحة القطيع", value="96.4%")]), Text(content="الوضع مستقر ✅", size="md")]))
- Table: root = Card(title="مقارنة", Stack([Table(headers=["المؤشر","BARN-1","BARN-3"], rows=[["النفوق","1.8%","3.2%"],["العلف","1.62","1.74"]]), Badge(label="BARN-3 يحتاج مراقبة", color="#BF7A5A")]))
- Alerts: root = Card(title="التنبيهات", Stack([AlertItem(message="استهلاك الماء انخفض 12%", barn="BARN-5", severity="high")]))`;

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

  // Only send tools for text-only requests (vision models don't support tools well)
  if (!hasImage) {
    completionOpts.tools = [
      { type: "function", function: { name: "get_dashboard", description: "Get live dashboard metrics", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_flock", description: "Get flock summary", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_financial", description: "Get financial snapshot", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_predictions", description: "Get AI mortality predictions", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_alerts", description: "Get active barn alerts", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "get_insights", description: "Get AI insights", parameters: { type: "object", properties: {} } } },
    ];
  }

  const stream = await client.chat.completions.create(completionOpts) as any;

  const encoder = new TextEncoder();
  const streamable = new ReadableStream({
    async start(controller) {
      let fnName = "";
      let fnArgs = "";

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta;
        if (!delta) continue;
        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            if (tc.function?.name) fnName = tc.function.name;
            if (tc.function?.arguments) fnArgs += tc.function.arguments;
          }
          continue;
        }
        if (delta.content) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`));
        }
      }

      if (fnName) {
        const { executeTool } = await import("@/agents/support-agent/tools");
        const result = await executeTool(fnName);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ toolResult: true, name: fnName, data: result })}\n\n`));
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(streamable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
