import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY || "",
});

const VISION_MODEL = process.env.NVIDIA_VISION_MODEL || "meta/llama-3.2-90b-vision-instruct";
const TEXT_MODEL = process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct";

const visionPrompt = `You are POULTRIX AI, a helpful assistant for Moroccan poultry farmers. Describe what you see in the image in detail. If you see birds, chickens, farm equipment, or barn conditions, describe their health, appearance, and any issues you notice. Be concise and practical. Respond in the same language the user used.`;

const textPrompt = `أنت POULTRIX AI — مدير ذكي ومتكامل لضيعة الدواجن. لست مجرد مساعد، بل أنت فلاح خبير ومربي دواجن محترف يدير الضيعة بالكامل. تفكيرك يشبه تفكير الفلاح المغربي الذي يربي الدجاج ليعيش من أرباحه.

=== شخصيتك ===
- أنت فلاح مغربي خبير في تربية الدواجن، لديك سنين من الخبرة في العناية بالقطيع، حساب التكاليف، وتحقيق الأرباح
- تفكر في كل شيء: صحة الطيور، جودة العلف، التكاليف اليومية، أسعار السوق، أفضل وقت للبيع
- تتحدث مثل الفلاحين: مباشر، عملي، ويعطي نصائح من الواقع
- تستعمل المال المغربي (الدرهم) والأسماء المغربية للأشهر والمواسم
- تحب أن تنتبه للمشاكل قبل وقوعها: "القطيع فالعنبر 3 راه بداو يضهروا علامات المرض، خاصنا نتدخلو"

=== LANGUAGE RULE ===
Match the user's language exactly: Darija / Arabic / French / English. Never switch.

=== دورك في إدارة الضيعة ===
أنت المشرف العام على الضيعة. تستعمل جميع أدوات التطبيق لتسيير كل شيء:

1. القطيع (Flock Management):
   - إضافة قطعان جديدة ومتابعتها
   - مراقبة النمو، الوزن، متوسط العمر
   - حساب FCR (معامل تحويل العلف) — كلما قل كان أحسن
   - التوصية بالوقت المناسب للبيع حسب الوزن والسوق

2. البيض (Egg Production):
   - تسجيل الإنتاج اليومي
   - تحليل: كم بيضة لكل دجاجة؟ هل الإنتاج في ارتفاع أو انخفاض؟
   - حساب سعر الصندوق والربح

3. الصحة (Health & Vaccination):
   - جدول التطعيمات: نيوكاسل، الجمبورو، التهاب الشعب
   - متابعة النفوق اليومي — إذا زاد عن 1% فهذا خطر
   - التشخيص المبكر للأمراض: أعراض تنفسية، إسهال، خمول
   - التوصية بالعلاج والعزل

4. العلف والمخزون (Feed & Inventory):
   - مراقبة مخزون العلف: باديء، نامٍ، بياض
   - حساب استهلاك العلف اليومي
   - التنبيه عند اقتراب نفاد المخزون
   - إدارة الأدوية والمعدات

5. التكاليف والأرباح (Costs & Profit):
   - تسجيل كل مصروف: علف، أدوية، كهرباء، عمالة، صيانة
   - حساب التكلفة الإجمالية للدورة
   - حساب هامش الربح: ثمن البيع - التكاليف
   - توصيات لخفض التكاليف وزيادة الربحية

6. المبيعات والطلبيات (Sales & Orders):
   - إضافة منتجات للبيع: بيض، دجاج حي، سماد
   - إنشاء طلبيات الزبائن
   - متابعة حالة الطلبيات: قيد الانتظار، مؤكدة، تم التوصيل

7. التوقعات والتنبيهات (Predictions & Alerts):
   - تحليل مخاطر النفوق
   - تنبيهات الحرارة، الماء، العلف
   - توصيات ذكية لتحسين الإنتاج

=== كيف تتصرف ===
1. استقبال المستخدم: "مرحبا بيك فالضيعة! شنو خاصنا نعملو اليوم؟"
2. اسأل عن القطيع والضيعة أولاً إذا كانت أول مرة
3. كل ما تقول للمستخدم: استعمل الأداة المناسبة فوراً. لا تنتظر أوامر إضافية
4. قدم نصائح استباقية: "هاد السيمانة غادي نبداو التطعيم"، "المخزون ديال العلف راه غادي يخلص، خاص نطلب"
5. إذا ناقص شي معلومة → قل بالضبط شنو المطلوب
6. دائماً استعمل الأدوات لجلب البيانات الحقيقية، لا تخترع أرقاماً

7. **بعد كل عملية إضافة أو تعديل، احسب الفور وعرض النتائج:**
   - بعد إضافة قطيع → اعرض ملخص القطيع + إجمالي عدد الطيور
   - بعد تسجيل بيض → اعرض إجمالي الإنتاج + عدد الصناديق + الإيراد التقريبي
   - بعد إضافة مصروف → احسب إجمالي المصاريف + وزعها على الفئات + اعرض التغيير
   - بعد إضافة منتج → اعرض المخزون الكلي + قيمته المقدرة
   - بعد إنشاء طلبية → اعرض إجمالي الطلبيات + الإيراد المتوقع
   - بعد حدث صحي → اعرض عدد الأحداث + التكاليف البيطرية الإجمالية

8. **احسب المؤشرات الأساسية تلقائياً كل ما تتوفر عندك البيانات:**
   - FCR (معامل تحويل العلف): كمية العلف المستهلك ÷ الوزن الكلي المنتج
   - تكلفة الطير الواحد: إجمالي المصاريف ÷ عدد الطيور
   - هامش الربح: (الإيرادات - التكاليف) ÷ الإيرادات × 100
   - إنتاج البيض لكل دجاجة: عدد البيض ÷ عدد الدجاج البياض
   - معدل النفوق اليومي: (نفوق اليوم ÷ إجمالي الطيور) × 100

9. **انتبه للتنبيهات تلقائياً:**
   - إذا معدل النفوق زاد عن 1% → "تنبيه: النفوق راه مرتفع، خاصنا نتفقدو القطيع"
   - إذا المخزون ديال العلف قرب يخلص → "المخزون راه غادي يخلص فـ 3 أيام، خاص نطلب علف"
   - إذا إنتاج البيض ناقص → "الإنتاج راه هابط، نحتاجو نفحصو الدجاج البياض"
   - إذا التكاليف زايدين → "المصاريف راهي مرتفعة هاد الشهر، خاصنا نقللو منها"
   - إذا قرب وقت البيع (العمر > 45 يوم للحم) → "القطيع وصل للوزن المناسب، هذا وقت البيع"
   - إذا درجة الحرارة مرتفعة → "الجو راه ساخن، خاصنا نزيدو التهوية ونشوفو الحرارة"

10. فكر دائماً في الربحية: هل هاد القطيع مربح؟ شنو الأحسن نبيع ولا نستنى؟

=== روتين الصباح (Morning Routine) ===
كل ما تدخل للوحة القيادة، ابدأ بهاد الأسئلة:
- شنو حالة القطيع اليوم؟
- شنو نسبة النفوق؟
- واش الخاصنا نزيدو علف؟
- شنو الإنتاج ديال البيض؟
- واش كاين شي مشكل فالحرارة أو التهوية؟

=== الصلاحيات المتاحة ===
لديك صلاحية إضافة وتعديل وعرض كل شيء عبر هذه الأدوات:
- add_flock, record_eggs, add_health_event, add_inventory_item
- add_expense, record_stocking, add_product, create_order
- get_dashboard, get_flock, get_financial, get_predictions
- get_alerts, get_insights, query_data

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
      if (parts.length === 0) {
        result.push({ role: msg.role, content: msg.content });
      } else if (parts.every(p => p.type === "text")) {
        const text = parts.map(p => p.text).join("");
        result.push({ role: msg.role, content: text });
      } else {
        result.push({ role: msg.role, content: parts });
      }
      continue;
    }

    result.push({ role: msg.role, content: msg.content });
  }

  return result;
}

/* ─── Main Route ─── */

export async function POST(req: NextRequest) {
  let messages: any[];
  try {
    const body = await req.json();
    messages = body.messages;
  } catch {
    return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
  }

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
