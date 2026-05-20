import { NextResponse } from "next/server";
import type { StockingRecord } from "@/types";

const records: StockingRecord[] = [
  { id: "stk-001", farmId: "farm-001", flockId: "flock-001", recordDate: "2026-04-15", birdsAdded: 8500, birdsRemoved: 0, mortality: 0, currentBirdCount: 8500, notes: "بداية القطيع", createdAt: new Date().toISOString() },
  { id: "stk-002", farmId: "farm-001", flockId: "flock-001", recordDate: "2026-04-22", birdsAdded: 0, birdsRemoved: 0, mortality: 45, currentBirdCount: 8455, notes: "نفوق أسبوع أول", createdAt: new Date().toISOString() },
  { id: "stk-003", farmId: "farm-001", flockId: "flock-001", recordDate: "2026-04-29", birdsAdded: 0, birdsRemoved: 0, mortality: 28, currentBirdCount: 8427, notes: "", createdAt: new Date().toISOString() },
  { id: "stk-004", farmId: "farm-001", flockId: "flock-001", recordDate: "2026-05-06", birdsAdded: 0, birdsRemoved: 0, mortality: 15, currentBirdCount: 8412, notes: "", createdAt: new Date().toISOString() },
  { id: "stk-005", farmId: "farm-001", flockId: "flock-001", recordDate: "2026-05-13", birdsAdded: 0, birdsRemoved: 0, mortality: 12, currentBirdCount: 8400, notes: "", createdAt: new Date().toISOString() },
  { id: "stk-006", farmId: "farm-001", flockId: "flock-003", recordDate: "2026-05-01", birdsAdded: 10500, birdsRemoved: 0, mortality: 0, currentBirdCount: 10500, notes: "بداية القطيع", createdAt: new Date().toISOString() },
  { id: "stk-007", farmId: "farm-001", flockId: "flock-002", recordDate: "2026-05-18", birdsAdded: 0, birdsRemoved: 300, mortality: 0, currentBirdCount: 6200, notes: "بيع دفعة", createdAt: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({
    data: records,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.flockId) {
    return NextResponse.json({ data: null, error: "flockId مطلوب", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({
    data: { id: `stk-${Date.now()}`, ...body, createdAt: new Date().toISOString() },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}
