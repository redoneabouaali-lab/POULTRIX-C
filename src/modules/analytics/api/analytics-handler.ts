import { NextResponse } from "next/server";
import type { AnalyticsReport } from "@/types";
import { generateKPIReport } from "@/skills/calculations";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = parseInt(url.searchParams.get("period") || "30");
  const days = Math.min(Math.max(period, 7), 90);
  const now = Date.now();

  const totalFeedKg = 5250;
  const totalWeightGained = 21250;
  const totalBirds = 8400;
  const totalDeaths = 120;
  const eggsProduced = 168000;
  const hensCount = 6200;
  const totalRevenue = 124800;
  const totalFeedCost = 33375;
  const laborCost = 12400;
  const medicationCost = 3850;
  const utilitiesCost = 2100;
  const totalExpenses = totalFeedCost + laborCost + medicationCost + utilitiesCost;

  const kpi = generateKPIReport({
    feedConsumedKg: totalFeedKg, weightGainedKg: totalWeightGained,
    deaths: totalDeaths, totalBirds,
    eggsProduced, hensCount, days,
    revenue: totalRevenue, expenses: totalExpenses,
    totalFeedCost, laborCost, medicationCost, utilitiesCost,
  });

  const mortalityTrend = Array.from({ length: days }, (_, i) => ({
    date: new Date(now - (days - 1 - i) * 86400000).toISOString().split("T")[0],
    rate: +(1.8 + Math.random() * 1.2).toFixed(2),
  }));

  const eggProduction = Array.from({ length: Math.ceil(days / 7) }, (_, i) => ({
    week: `الأسبوع ${i + 1}`,
    count: Math.round(7000 + Math.random() * 2000),
    previousCount: Math.round(6500 + Math.random() * 1500),
  }));

  const revenueHistory = Array.from({ length: days }, (_, i) => ({
    date: new Date(now - (days - 1 - i) * 86400000).toISOString().split("T")[0],
    amount: Math.round(kpi.revenuePerBird * totalBirds / days + Math.random() * 500),
  }));

  const expenseBreakdown = [
    { category: "علف", amount: totalFeedCost },
    { category: "عمالة", amount: laborCost },
    { category: "علاج", amount: medicationCost },
    { category: "كهرباء وماء", amount: utilitiesCost },
    { category: "نقل", amount: 4200 },
    { category: "صيانة", amount: 3800 },
    { category: "أخرى", amount: 3500 },
  ];

  const report: AnalyticsReport = {
    period: `${days} يوم`,
    mortalityRate: kpi.mortalityRate,
    feedConversionRatio: kpi.fcr,
    productionRate: kpi.productionRate,
    revenue: totalRevenue,
    expenses: totalExpenses,
    profitMargin: kpi.profitMargin,
    revenueHistory,
    expenseBreakdown,
  };

  return NextResponse.json({
    data: {
      ...report,
      kpi,
      mortalityTrend,
      eggProduction,
    },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
