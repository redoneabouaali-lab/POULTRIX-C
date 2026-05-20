import { NextResponse } from "next/server";
import type { Product } from "@/types";

const products: Product[] = [
  { id: "prd-001", farmId: "farm-001", name: "بيض بلدي طازج", type: "eggs", quantity: 2400, price: 1.80, available: true, quality: "premium", batchNumber: "B-42", productionDate: "2026-05-18", expiryDate: "2026-06-01", notes: "إنتاج اليوم", createdAt: new Date().toISOString() },
  { id: "prd-002", farmId: "farm-001", name: "بيض عادي", type: "eggs", quantity: 5600, price: 1.20, available: true, quality: "standard", batchNumber: "B-41", productionDate: "2026-05-17", expiryDate: "2026-05-31", notes: "", createdAt: new Date().toISOString() },
  { id: "prd-003", farmId: "farm-001", name: "دجاج لاحم طازج", type: "meat", quantity: 340, price: 65, available: true, quality: "premium", batchNumber: "A-30", productionDate: "2026-05-16", expiryDate: "2026-05-20", notes: "وزن متوسط 2.2كغ", createdAt: new Date().toISOString() },
  { id: "prd-004", farmId: "farm-001", name: "سماد عضوي", type: "manure", quantity: 1200, price: 3.50, available: true, quality: "standard", batchNumber: "F-2026", productionDate: "2026-05-01", notes: "كيس 25كغ", createdAt: new Date().toISOString() },
  { id: "prd-005", farmId: "farm-001", name: "كتاكيت عمر يوم", type: "chicks", quantity: 0, price: 12, available: false, quality: "standard", batchNumber: "", productionDate: "2026-05-10", notes: "نفذ المخزون", createdAt: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({
    data: products,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.type) {
    return NextResponse.json({ data: null, error: "name و type مطلوبان", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({
    data: { id: `prd-${Date.now()}`, ...body, createdAt: new Date().toISOString() },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}
