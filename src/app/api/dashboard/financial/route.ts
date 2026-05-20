import { NextResponse } from "next/server";

const financial = {
  dailyFeedCost: 2847.50,
  dailyWaterCost: 423.80,
  projectedRevenue: 12480.00,
  profitMargin: 34.2,
  marginTrend: "up" as const,
  yoyGrowth: 18.7,
  costPerBird: 8.47,
  breakEvenPrice: 18.50,
  roi: 34.2,
  feedCostPercentage: 48,
  laborCost: 1240.00,
  medicationCost: 385.00,
  utilitiesCost: 210.00,
  revenueHistory: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
    amount: Math.round(8000 + Math.random() * 4000),
  })),
  expenseBreakdown: [
    { category: "العلف", amount: 2847.50, percentage: 48 },
    { category: "الماء", amount: 423.80, percentage: 12 },
    { category: "الدواء", amount: 385.00, percentage: 8 },
    { category: "العمالة", amount: 1240.00, percentage: 22 },
    { category: "المرافق", amount: 210.00, percentage: 10 },
  ],
  budgetVsActual: [
    { month: "يناير", budgeted: 28500, actual: 27400, variance: 1100 },
    { month: "فبراير", budgeted: 27500, actual: 28100, variance: -600 },
    { month: "مارس", budgeted: 29500, actual: 28900, variance: 600 },
    { month: "أبريل", budgeted: 28000, actual: 27200, variance: 800 },
    { month: "ماي", budgeted: 30000, actual: 31400, variance: -1400 },
    { month: "يونيو", budgeted: 29000, actual: 27800, variance: 1200 },
  ],
  projections: [
    { month: "يوليو", projectedRevenue: 32000, projectedCost: 21000 },
    { month: "أغسطس", projectedRevenue: 33500, projectedCost: 21800 },
    { month: "سبتمبر", projectedRevenue: 34800, projectedCost: 22500 },
  ],
};

export async function GET() {
  const live = {
    ...financial,
    profitMargin: +(34.2 + (Math.random() - 0.5) * 1.2).toFixed(1),
    dailyFeedCost: +(2847.50 + (Math.random() - 0.5) * 200).toFixed(2),
    projectedRevenue: +(12480 + (Math.random() - 0.5) * 500).toFixed(2),
  };

  return NextResponse.json({
    data: live,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
