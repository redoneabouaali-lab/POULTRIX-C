import { NextRequest, NextResponse } from "next/server";
import { diseases } from "@/modules/chickens/data/diseases";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "لم يتم إرسال صورة" }, { status: 400 });
    }

    // Check if FastAPI is accessible
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      await fetch(`${FASTAPI_URL}/predict/`, { method: "HEAD", signal: controller.signal });
    } catch {
      clearTimeout(timeoutId);
      return NextResponse.json({ error: "خادم التشخيص غير متصل. تأكد من تشغيل Python API على المنفذ 8000.", offline: true }, { status: 503 });
    }
    clearTimeout(timeoutId);

    // Forward image to FastAPI
    const forwardForm = new FormData();
    forwardForm.append("file", file);

    const res = await fetch(`${FASTAPI_URL}/predict/`, {
      method: "POST",
      body: forwardForm,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "فشل تحليل الصورة" }, { status: 502 });
    }

    const data = await res.json();
    const prediction = data.prediction?.toLowerCase() || "unknown";
    const diseaseInfo = diseases[prediction as keyof typeof diseases];

    if (!diseaseInfo) {
      return NextResponse.json({ error: "تعذر التعرف على المرض", prediction });
    }

    return NextResponse.json({
      prediction,
      disease: diseaseInfo,
    });
  } catch (err: any) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return NextResponse.json({ error: "انتهت مهلة الاتصال بخادم التشخيص" }, { status: 504 });
    }
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
