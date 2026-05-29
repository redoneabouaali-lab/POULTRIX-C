import { NextResponse } from "next/server";
import type { Expense } from "@/types";

const expenses: Expense[] = [
  { id: "exp-001", farmId: "farm-001", flockId: "flock-001", expenseDate: "2026-05-18", category: "علف", description: "شراء علف باديء", amount: 12800, paymentMethod: "نقداً", notes: "", createdAt: new Date().toISOString() },
  { id: "exp-002", farmId: "farm-001", expenseDate: "2026-05-17", category: "كهرباء", description: "فاتورة الكهرباء الشهرية", amount: 3450, paymentMethod: "تحويل بنكي", notes: "", createdAt: new Date().toISOString() },
  { id: "exp-003", farmId: "farm-001", flockId: "flock-003", expenseDate: "2026-05-16", category: "دواجن", description: "شراء كتاكيت عمر يوم", amount: 22500, paymentMethod: "نقداً", notes: "500 كتكوت", createdAt: new Date().toISOString() },
  { id: "exp-004", farmId: "farm-001", flockId: "flock-002", expenseDate: "2026-05-15", category: "علاج", description: "مطاعيم نيوكاسل", amount: 1800, paymentMethod: "نقداً", notes: "", createdAt: new Date().toISOString() },
  { id: "exp-005", farmId: "farm-001", expenseDate: "2026-05-14", category: "صيانة", description: "صيانة نظام التهوية", amount: 4200, paymentMethod: "شيك", notes: "العنبر 3", createdAt: new Date().toISOString() },
  { id: "exp-006", farmId: "farm-001", flockId: "flock-001", expenseDate: "2026-05-13", category: "عمالة", description: "أجر عمال الموسم", amount: 6000, paymentMethod: "تحويل بنكي", notes: "", createdAt: new Date().toISOString() },
  { id: "exp-007", farmId: "farm-001", flockId: "flock-003", expenseDate: "2026-05-12", category: "علف", description: "علف نامٍ 2 طن", amount: 7600, paymentMethod: "نقداً", notes: "", createdAt: new Date().toISOString() },
];

export async function GET() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category || "أخرى"] = (acc[e.category || "أخرى"] || 0) + e.amount;
    return acc;
  }, {});
  return NextResponse.json({
    data: { items: expenses, total, byCategory },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.amount) {
    return NextResponse.json({ data: null, error: "amount مطلوب", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  const newExpense = { id: `exp-${Date.now()}`, ...body, createdAt: new Date().toISOString() };
  expenses.push(newExpense as any);
  return NextResponse.json({
    data: newExpense,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ data: null, error: "id مطلوب", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({
    data: { deleted: true, id },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
