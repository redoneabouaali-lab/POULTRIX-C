import { NextResponse } from "next/server";
import type { Invoice, InvoiceItem } from "@/types";
import { generateKPIReport, type MetricInputs } from "@/skills/calculations";

const items: InvoiceItem[] = [
  { id: "ii-001", invoiceId: "inv-001", description: "بيض بلدي طازج - 30 طبق", quantity: 30, unit: "طبق", unitPrice: 185, total: 5550 },
  { id: "ii-002", invoiceId: "inv-001", description: "دجاج لاحم - 20 كغ", quantity: 20, unit: "كغ", unitPrice: 65, total: 1300 },
  { id: "ii-003", invoiceId: "inv-002", description: "علف باديء - 500 كغ", quantity: 500, unit: "كغ", unitPrice: 4.2, total: 2100 },
  { id: "ii-004", invoiceId: "inv-002", description: "سماد عضوي - 50 كيس", quantity: 50, unit: "كيس", unitPrice: 35, total: 1750 },
  { id: "ii-005", invoiceId: "inv-003", description: "كتاكيت عمر يوم - 500", quantity: 500, unit: "كتكوت", unitPrice: 12, total: 6000 },
  { id: "ii-006", invoiceId: "inv-003", description: "مطاعيم نيوكاسل", quantity: 2, unit: "قارورة", unitPrice: 85, total: 170 },
];

const invoices: Invoice[] = [
  { id: "inv-001", farmId: "farm-001", number: "FCT-2026-0001", customerName: "محمد الفاسي", customerPhone: "0612345678", customerAddress: "فاس، حي الرياض", issueDate: "2026-05-18", dueDate: "2026-06-01", status: "paid", items: items.filter(i => i.invoiceId === "inv-001"), subtotal: 6850, taxRate: 0, taxAmount: 0, discount: 0, total: 6850, paidAmount: 6850, notes: "تم الدفع نقداً", createdAt: "2026-05-18T10:00:00Z", updatedAt: "2026-05-18T14:00:00Z" },
  { id: "inv-002", farmId: "farm-001", number: "FCT-2026-0002", customerName: "تعاونية المنار", customerPhone: "0523456789", customerAddress: "مراكش، المنطقة الصناعية", issueDate: "2026-05-17", dueDate: "2026-06-16", status: "sent", items: items.filter(i => i.invoiceId === "inv-002"), subtotal: 3850, taxRate: 10, taxAmount: 385, discount: 100, total: 4135, paidAmount: 0, notes: "شيك يستحق بعد 30 يوم", createdAt: "2026-05-17T09:00:00Z", updatedAt: "2026-05-17T09:00:00Z" },
  { id: "inv-003", farmId: "farm-001", number: "FCT-2026-0003", customerName: "مشتري الجملة", customerPhone: "0634567890", issueDate: "2026-05-15", dueDate: "2026-05-25", status: "overdue", items: items.filter(i => i.invoiceId === "inv-003"), subtotal: 6170, taxRate: 10, taxAmount: 617, discount: 0, total: 6787, paidAmount: 3000, notes: "باقي 3787 درهم", createdAt: "2026-05-15T11:00:00Z", updatedAt: "2026-05-25T00:00:00Z" },
];

export async function GET() {
  const totals = {
    totalInvoices: invoices.length,
    totalPaid: invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0),
    totalOutstanding: invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.total - i.paidAmount, 0),
    totalOverdue: invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.total - i.paidAmount, 0),
  };
  return NextResponse.json({ data: { invoices, totals }, meta: { timestamp: new Date().toISOString(), version: "", cached: false } });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.customerName || !body.items?.length) {
    return NextResponse.json({ data: null, error: "customerName و items مطلوبان", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  const itemsWithTotals = body.items.map((item: Partial<InvoiceItem>, i: number) => ({
    id: `ii-${Date.now()}-${i}`,
    invoiceId: `inv-${Date.now()}`,
    description: item.description || "",
    quantity: item.quantity || 0,
    unit: item.unit || "قطعة",
    unitPrice: item.unitPrice || 0,
    total: (item.quantity || 0) * (item.unitPrice || 0),
  }));
  const subtotal = itemsWithTotals.reduce((s: number, i: InvoiceItem) => s + i.total, 0);
  const taxRate = body.taxRate || 0;
  const taxAmount = +(subtotal * (taxRate / 100)).toFixed(2);
  const discount = body.discount || 0;
  const total = +(subtotal + taxAmount - discount).toFixed(2);
  const invoice: Invoice = {
    id: `inv-${Date.now()}`,
    farmId: "farm-001",
    number: `FCT-2026-${String(invoices.length + 1).padStart(4, "0")}`,
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    customerAddress: body.customerAddress,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: body.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    status: "draft",
    items: itemsWithTotals,
    subtotal,
    taxRate,
    taxAmount,
    discount,
    total,
    paidAmount: 0,
    notes: body.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json({ data: invoice, meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 201 });
}
