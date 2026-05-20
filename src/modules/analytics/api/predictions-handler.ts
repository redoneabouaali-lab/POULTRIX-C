import { NextResponse } from "next/server";
import type { BarnAlert } from "@/types";

const predictions = Array.from({ length: 3 }, (_, i) => ({
  id: `pred-${i + 1}`,
  barnId: `BARN-${i + 1}`,
  riskLevel: (["high", "medium", "low"] as const)[i],
  probability: +(0.2 + Math.random() * 0.6).toFixed(2),
  predictedAt: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
  affectedCohort: `القطيع ${String.fromCharCode(65 + i)}-${42 + i * 10}`,
  recommendation: i === 0
    ? "زيد التهوية وقل الكثافة بنسبة 8% في BARN-1"
    : i === 1
      ? "راقب شرب الماء; تحقق من ضغط خط الحلمات في BARN-2"
      : "لا حاجة لإجراء; تابع المراقبة العادية",
  confidence: +(0.75 + Math.random() * 0.2).toFixed(2),
}));

const alerts: BarnAlert[] = [
  { id: "alt-001", farmId: "farm-001", barnId: "BARN-3", type: "temp", severity: "low", message: "Barn 3 temp variance +1.8°C during peak", timestamp: new Date().toISOString(), acknowledged: false },
  { id: "alt-002", farmId: "farm-001", barnId: "BARN-1", type: "feed", severity: "medium", message: "Feed conversion rate deviating 4.2% from optimal", timestamp: new Date(Date.now() - 1800000).toISOString(), acknowledged: false },
  { id: "alt-003", farmId: "farm-001", barnId: "BARN-5", type: "water", severity: "high", message: "Water intake dropped 12% in last 4 hours — possible line blockage", timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sub = url.pathname.split("/").pop();

  if (sub === "alerts") {
    return NextResponse.json({
      data: alerts,
      meta: { timestamp: new Date().toISOString(), version: "", cached: false },
    });
  }

  return NextResponse.json({
    data: predictions,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
