import { NextResponse } from "next/server";

const alerts = [
  { id: "alt-001", barnId: "BARN-3", type: "temp" as const, severity: "low" as const, message: "تغير درجة الحرارة في BARN-3 +1.8°C خلال الذروة", timestamp: new Date().toISOString(), acknowledged: false },
  { id: "alt-002", barnId: "BARN-1", type: "feed" as const, severity: "medium" as const, message: "معدل تحويل العلف ينحرف 4.2% عن المثالي", timestamp: new Date(Date.now() - 1800000).toISOString(), acknowledged: false },
  { id: "alt-003", barnId: "BARN-5", type: "water" as const, severity: "high" as const, message: "استهلاك الماء انخفض 12% في آخر 4 ساعات — احتمال انسداد الخط", timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
];

export async function GET() {
  return NextResponse.json({
    data: alerts,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
