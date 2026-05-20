import { NextResponse } from "next/server";
import type { Order } from "@/types";

const orders: Order[] = [
  {
    id: "ord-001", farmId: "farm-001", customerName: "محمد الفاسي", totalAmount: 4320, status: "shipped", paymentStatus: "paid", deliveryAddress: "فاس، حي الرياض", deliveryDate: "2026-05-20",
    items: [
      { id: "oi-001", orderId: "ord-001", productId: "prd-001", productName: "بيض بلدي طازج", quantity: 1200, price: 1.80 },
      { id: "oi-002", orderId: "ord-001", productId: "prd-002", productName: "بيض عادي", quantity: 1800, price: 1.20 },
    ],
    notes: "توصيل صباحاً", createdAt: "2026-05-17T10:30:00Z", updatedAt: "2026-05-18T08:00:00Z",
  },
  {
    id: "ord-002", farmId: "farm-001", customerName: "تعاونية المنار", totalAmount: 22100, status: "confirmed", paymentStatus: "pending", deliveryAddress: "مراكش، المنطقة الصناعية", deliveryDate: "2026-05-22",
    items: [
      { id: "oi-003", orderId: "ord-002", productId: "prd-003", productName: "دجاج لاحم طازج", quantity: 340, price: 65 },
    ],
    notes: "", createdAt: "2026-05-16T14:00:00Z", updatedAt: "2026-05-17T09:00:00Z",
  },
  {
    id: "ord-003", farmId: "farm-001", customerName: "سوق الجملة", totalAmount: 11900, status: "pending", paymentStatus: "pending", deliveryAddress: "الدار البيضاء، سوق الجملة",
    items: [
      { id: "oi-004", orderId: "ord-003", productId: "prd-004", productName: "سماد عضوي", quantity: 200, price: 3.50 },
      { id: "oi-005", orderId: "ord-003", productId: "prd-002", productName: "بيض عادي", quantity: 4000, price: 1.20 },
      { id: "oi-006", orderId: "ord-003", productId: "prd-001", productName: "بيض بلدي طازج", quantity: 2000, price: 1.80 },
    ],
    notes: "قيد المراجعة", createdAt: "2026-05-18T07:15:00Z", updatedAt: "2026-05-18T07:15:00Z",
  },
];

export async function GET() {
  return NextResponse.json({
    data: orders,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.customerName || !body.items?.length) {
    return NextResponse.json({ data: null, error: "customerName و items مطلوبان", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({
    data: { id: `ord-${Date.now()}`, ...body, status: "pending", paymentStatus: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}
