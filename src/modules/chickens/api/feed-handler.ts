import { NextResponse } from "next/server";
import type { FeedReceipt, InventoryItem } from "@/types";
import { calculateFCR, calculateFeedCostPerBird, generateKPIReport } from "@/skills/calculations";

const feedStock: InventoryItem[] = [
  { id: "inv-001", farmId: "farm-001", type: "feed", name: "علف باديء (Starter)", quantity: 2480, unit: "كغ", minimumThreshold: 500, cost: 4.20, supplier: "أعلاف المغرب", expiryDate: "2026-08-01", notes: "", createdAt: new Date().toISOString() },
  { id: "inv-002", farmId: "farm-001", type: "feed", name: "علف نامٍ (Grower)", quantity: 1850, unit: "كغ", minimumThreshold: 400, cost: 3.80, supplier: "أعلاف المغرب", expiryDate: "2026-08-15", notes: "", createdAt: new Date().toISOString() },
  { id: "inv-003", farmId: "farm-001", type: "feed", name: "علف بياض (Layer)", quantity: 920, unit: "كغ", minimumThreshold: 600, cost: 3.95, supplier: "مطاحن الدار البيضاء", expiryDate: "2026-07-20", notes: "مخزون منخفض", createdAt: new Date().toISOString() },
];

const feedReceipts: FeedReceipt[] = [
  { id: "fr-001", farmId: "farm-001", flockId: "flock-001", dateReceived: "2026-05-15", quantity: 2000, unit: "كغ", unitCost: 4.20, totalCost: 8400, supplier: "أعلاف المغرب", feedType: "باديء", notes: "", createdAt: new Date().toISOString() },
  { id: "fr-002", farmId: "farm-001", flockId: "flock-002", dateReceived: "2026-05-14", quantity: 1500, unit: "كغ", unitCost: 3.95, totalCost: 5925, supplier: "مطاحن الدار البيضاء", feedType: "بياض", notes: "", createdAt: new Date().toISOString() },
  { id: "fr-003", farmId: "farm-001", flockId: "flock-001", dateReceived: "2026-05-10", quantity: 2000, unit: "كغ", unitCost: 4.15, totalCost: 8300, supplier: "أعلاف المغرب", feedType: "باديء", notes: "", createdAt: new Date().toISOString() },
  { id: "fr-004", farmId: "farm-001", flockId: "flock-003", dateReceived: "2026-05-08", quantity: 2500, unit: "كغ", unitCost: 4.30, totalCost: 10750, supplier: "أعلاف المغرب", feedType: "باديء", notes: "قطيع جديد", createdAt: new Date().toISOString() },
];

const dailyConsumption = [
  { barnId: "BARN-1", kgConsumed: 320, cost: 1280, feedType: "باديء" },
  { barnId: "BARN-2", kgConsumed: 280, cost: 1064, feedType: "باديء" },
  { barnId: "BARN-3", kgConsumed: 245, cost: 968, feedType: "نامٍ" },
  { barnId: "BARN-4", kgConsumed: 190, cost: 722, feedType: "بياض" },
  { barnId: "BARN-5", kgConsumed: 210, cost: 798, feedType: "نامٍ" },
  { barnId: "BARN-6", kgConsumed: 175, cost: 691, feedType: "بياض" },
];

const history = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  totalKg: Math.round(1200 + Math.random() * 300),
  totalCost: Math.round(4500 + Math.random() * 1000),
}));

export async function GET() {
  const totalFeedKg = feedStock.reduce((s, f) => s + f.quantity, 0);
  const totalFeedCost = feedReceipts.reduce((s, r) => s + r.totalCost, 0);
  const dailyTotalKg = dailyConsumption.reduce((s, d) => s + d.kgConsumed, 0);
  const dailyTotalCost = dailyConsumption.reduce((s, d) => s + d.cost, 0);

  const fcr = calculateFCR(totalFeedKg, 21250);
  const feedCostPerBird = calculateFeedCostPerBird(totalFeedCost, 8400);

  const kpi = generateKPIReport({
    feedConsumedKg: totalFeedKg, weightGainedKg: 21250, deaths: 120, totalBirds: 8400,
    eggsProduced: 168000, hensCount: 6200, days: 30, revenue: 124800,
    expenses: 82150, totalFeedCost, laborCost: 12400, medicationCost: 3850, utilitiesCost: 2100,
  });

  const lowStockAlerts = feedStock.map(f => ({
    feedType: f.name,
    currentKg: f.quantity,
    threshold: f.minimumThreshold,
    status: f.quantity < f.minimumThreshold ? "critical" as const : f.quantity < f.minimumThreshold * 1.5 ? "warning" as const : "ok" as const,
  })).filter(a => a.status !== "ok");

  return NextResponse.json({
    data: {
      feedStock, feedReceipts, dailyConsumption, history, lowStockAlerts,
      metrics: { fcr, feedCostPerBird, dailyTotalKg, dailyTotalCost, totalFeedKg, totalFeedCost },
      kpi,
    },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.feedType || !body.quantity) {
    return NextResponse.json({ data: null, error: "feedType و quantity مطلوبان", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({
    data: { id: `fr-${Date.now()}`, ...body, createdAt: new Date().toISOString() },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}
