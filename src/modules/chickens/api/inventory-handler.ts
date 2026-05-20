import { NextResponse } from "next/server";
import type { InventoryItem } from "@/types";

const items: InventoryItem[] = [
  { id: "inv-001", farmId: "farm-001", type: "feed", name: "علف باديء (Starter)", quantity: 2480, unit: "كغ", minimumThreshold: 500, cost: 4.20, supplier: "أعلاف المغرب", expiryDate: "2026-08-01", notes: "", createdAt: new Date().toISOString() },
  { id: "inv-002", farmId: "farm-001", type: "feed", name: "علف نامٍ (Grower)", quantity: 1850, unit: "كغ", minimumThreshold: 400, cost: 3.80, supplier: "أعلاف المغرب", expiryDate: "2026-08-15", notes: "", createdAt: new Date().toISOString() },
  { id: "inv-003", farmId: "farm-001", type: "feed", name: "علف بياض (Layer)", quantity: 920, unit: "كغ", minimumThreshold: 600, cost: 3.95, supplier: "مطاحن الدار البيضاء", expiryDate: "2026-07-20", notes: "مخزون منخفض", createdAt: new Date().toISOString() },
  { id: "inv-004", farmId: "farm-001", type: "medicine", name: "مطعوم نيوكاسل", quantity: 15, unit: "قارورة", minimumThreshold: 5, cost: 85, supplier: "صيدلية بيطرية", expiryDate: "2026-12-01", notes: "", createdAt: new Date().toISOString() },
  { id: "inv-005", farmId: "farm-001", type: "medicine", name: "مضاد حيوي واسع", quantity: 8, unit: "عبوة", minimumThreshold: 3, cost: 120, supplier: "صيدلية بيطرية", expiryDate: "2026-10-01", notes: "", createdAt: new Date().toISOString() },
  { id: "inv-006", farmId: "farm-001", type: "equipment", name: "مصابيح تدفئة", quantity: 25, unit: "قطعة", minimumThreshold: 10, cost: 45, supplier: "معدات فلاحية", notes: "", createdAt: new Date().toISOString() },
  { id: "inv-007", farmId: "farm-001", type: "supplies", name: "فرشة نشارة خشب", quantity: 80, unit: "كيس", minimumThreshold: 20, cost: 18, supplier: "مطحنة الخشب", notes: "", createdAt: new Date().toISOString() },
];

export async function GET() {
  const lowStock = items.filter(i => i.quantity < i.minimumThreshold * 1.5).map(i => ({
    ...i, status: i.quantity < i.minimumThreshold ? "critical" : "warning"
  }));
  return NextResponse.json({
    data: { items, lowStock },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.type || !body.name) {
    return NextResponse.json({ data: null, error: "type و name مطلوبان", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({
    data: { id: `inv-${Date.now()}`, ...body, createdAt: new Date().toISOString() },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ data: null, error: "id مطلوب", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({ data: { deleted: true, id }, meta: { timestamp: new Date().toISOString(), version: "", cached: false } });
}
