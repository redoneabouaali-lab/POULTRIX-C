import { NextResponse } from "next/server";
import type { EggRecord } from "@/types";

const records: EggRecord[] = [
  { id: "egg-001", farmId: "farm-001", flockId: "flock-001", recordDate: "2026-05-18", quantity: 8400, eggsPerTray: 30, trays: 280, pricePerTray: 185, totalRevenue: 51800, sold: true, notes: "جمع صباحي", createdAt: new Date().toISOString() },
  { id: "egg-002", farmId: "farm-001", flockId: "flock-001", recordDate: "2026-05-17", quantity: 7950, eggsPerTray: 30, trays: 265, pricePerTray: 180, totalRevenue: 47700, sold: true, notes: "", createdAt: new Date().toISOString() },
  { id: "egg-003", farmId: "farm-001", flockId: "flock-002", recordDate: "2026-05-18", quantity: 6200, eggsPerTray: 30, trays: 206.7, pricePerTray: 190, totalRevenue: 39273, sold: true, notes: "قطيع جديد - إنتاج في ازدياد", createdAt: new Date().toISOString() },
  { id: "egg-004", farmId: "farm-001", flockId: "flock-002", recordDate: "2026-05-16", quantity: 5800, eggsPerTray: 30, trays: 193.3, pricePerTray: 185, totalRevenue: 35760, sold: false, notes: "", createdAt: new Date().toISOString() },
  { id: "egg-005", farmId: "farm-001", flockId: "flock-003", recordDate: "2026-05-18", quantity: 10200, eggsPerTray: 30, trays: 340, pricePerTray: 175, totalRevenue: 59500, sold: true, notes: "", createdAt: new Date().toISOString() },
];

export async function GET() {
  const live = records.map(r => ({
    ...r,
    quantity: Math.round(r.quantity + (Math.random() - 0.5) * 200),
    trays: Math.round((r.quantity + (Math.random() - 0.5) * 200) / r.eggsPerTray * 10) / 10,
  }));
  return NextResponse.json({ data: live, meta: { timestamp: new Date().toISOString(), version: "", cached: false } });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.flockId || !body.quantity) {
    return NextResponse.json({ data: null, error: "flockId و quantity مطلوبان", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  const newRecord = { id: `egg-${Date.now()}`, ...body, createdAt: new Date().toISOString() };
  records.push(newRecord as any);
  return NextResponse.json({
    data: newRecord,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}
