import { NextResponse } from "next/server";

const insights = [
  {
    id: "ins-001", type: "prediction" as const, severity: "high" as const,
    title: "تحسين كفاءة العلف",
    description: "بناءً على أنماط سلوك القطيع، يتوقع النظام زيادة بنسبة 12.4% في كفاءة تحويل العلف خلال 72 ساعة. يوصى: تعديل نسبة البروتين +3.2%.",
    confidence: 94.7, actionable: true, createdAt: new Date().toISOString(),
  },
  {
    id: "ins-002", type: "opportunity" as const, severity: "medium" as const,
    title: "نافذة الحصاد المثلى",
    description: "القطيع B-42 يصل للوزن المستهدف قبل 2.4 يوم من الموعد. يُنصح بتقديم الحصاد لتحسين تكاليف العلف.",
    confidence: 88.3, actionable: true, createdAt: new Date().toISOString(),
  },
  {
    id: "ins-003", type: "alert" as const, severity: "low" as const,
    title: "تقلب درجة الحرارة في BARN-3",
    description: "BARN-3 يسجل فرق +1.8°C خلال ذروة الظهيرة. يوصى بمعايرة التهوية.",
    confidence: 76.1, actionable: false, createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    data: insights,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
