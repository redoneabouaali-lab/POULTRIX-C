import { NextResponse } from "next/server";
import type { DashboardMetric, FinancialSnapshot, AIInsight } from "@/types";

const metrics: DashboardMetric[] = [
  { id: "mortality",  label: "معدل النفوق",   value: "2.3%",  change: -12, trend: "down",  bar: 23, color: "#C4893A", unit: "%" },
  { id: "feed",       label: "كفاءة العلف",   value: "1.68",  change: -5,  trend: "down",  bar: 42, color: "#BF7A5A", unit: "ratio" },
  { id: "health",     label: "صحة القطيع",     value: "96.4%", change: 3,   trend: "up",   bar: 78, color: "#2D5541", unit: "%" },
  { id: "profit",     label: "هامش الربح",     value: "+34.2%",change: 8,   trend: "up",   bar: 65, color: "#F5EDE3", unit: "%" },
];

const financial: FinancialSnapshot = {
  id: "fin-001",
  farmId: "farm-001",
  dailyFeedCost: 2847.50,
  dailyWaterCost: 423.80,
  projectedRevenue: 12480.00,
  profitMargin: 34.2,
  marginTrend: "up",
  yoyGrowth: 18.7,
  costPerBird: 8.47,
  breakEvenPrice: 18.50,
  roi: 34.2,
  feedCostPercentage: 48,
  laborCost: 1240.00,
  medicationCost: 385.00,
  utilitiesCost: 210.00,
  createdAt: new Date().toISOString(),
};

const insights: AIInsight[] = [
  {
    id: "ins-001", farmId: "farm-001", type: "prediction", severity: "high",
    title: "تحسن كفاءة العلف متوقع",
    description: "بناءً على أنماط سلوك القطيع الحالية، يتوقع النظام تحسن 12.4% في كفاءة تحويل العلف خلال 72 ساعة. الموصى به: ضبط نسبة البروتين +3.2%.",
    confidence: 94.7, actionable: true, createdAt: new Date().toISOString(),
  },
  {
    id: "ins-002", farmId: "farm-001", type: "opportunity", severity: "medium",
    title: "نافذة الحصاد المثلى",
    description: "القطيع B-42 يصل للوزن المستهدف قبل 2.4 يوم من الموعد. النظر في تقديم الحصاد لتحسين تكاليف العلف.",
    confidence: 88.3, actionable: true, createdAt: new Date().toISOString(),
  },
  {
    id: "ins-003", farmId: "farm-001", type: "alert", severity: "low",
    title: "تقلب درجة الحرارة في BARN-3",
    description: "BARN-3 يظهر فرق +1.8°C خلال فترات الذروة بعد الظهر. يوصى بمعايرة التهوية.",
    confidence: 76.1, actionable: false, createdAt: new Date().toISOString(),
  },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sub = url.pathname.split("/").pop();

  if (sub === "financial") {
    return NextResponse.json({
      data: financial,
      meta: { timestamp: new Date().toISOString(), version: "", cached: false },
    });
  }

  if (sub === "insights") {
    return NextResponse.json({
      data: insights,
      meta: { timestamp: new Date().toISOString(), version: "", cached: false },
    });
  }

  const liveMetrics = metrics.map((m) => ({
    ...m,
    value: m.id === "mortality"
      ? `${(2.3 + (Math.random() - 0.5) * 0.2).toFixed(1)}%`
      : m.id === "feed"
        ? (1.68 + (Math.random() - 0.5) * 0.04).toFixed(2)
        : m.id === "health"
          ? `${(96.4 + (Math.random() - 0.5) * 0.6).toFixed(1)}%`
          : `+${(34.2 + (Math.random() - 0.5) * 0.8).toFixed(1)}%`,
  }));

  return NextResponse.json({
    data: liveMetrics,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
