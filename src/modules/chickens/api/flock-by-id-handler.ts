import { NextResponse } from "next/server";
import type { Flock } from "@/types";

const flocks: Record<string, Flock> = {
  "flock-001": { id: "flock-001", farmId: "farm-001", name: "القطيع أ-42", breed: "Cobb 500", status: "active", totalBirds: 8400, avgAge: 32, healthScore: 96.4, houseShedId: "العنبر 1", notes: "قطيع اللاحم الأساسي", startDate: "2026-04-15", createdAt: "2026-04-15T00:00:00Z", updatedAt: "2026-05-18T12:00:00Z" },
  "flock-002": { id: "flock-002", farmId: "farm-001", name: "القطيع ب-41", breed: "ISA Brown", status: "active", totalBirds: 6200, avgAge: 48, healthScore: 92.1, houseShedId: "العنبر 2", notes: "قطيع بياض", startDate: "2026-03-20", createdAt: "2026-03-20T00:00:00Z", updatedAt: "2026-05-18T10:00:00Z" },
  "flock-003": { id: "flock-003", farmId: "farm-001", name: "القطيع ج-30", breed: "Ross 308", status: "active", totalBirds: 10200, avgAge: 18, healthScore: 98.7, houseShedId: "العنبر 3", notes: "قطيع جديد", startDate: "2026-05-01", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-18T09:00:00Z" },
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const flock = flocks[id];
  if (!flock) {
    return NextResponse.json({ data: null, error: "القطيع غير موجود", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 404 });
  }
  return NextResponse.json({ data: flock, meta: { timestamp: new Date().toISOString(), version: "", cached: false } });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!flocks[id]) {
    return NextResponse.json({ data: null, error: "القطيع غير موجود", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 404 });
  }
  const body = await req.json();
  const updated: Flock = { ...flocks[id], ...body, updatedAt: new Date().toISOString() };
  flocks[id] = updated;
  return NextResponse.json({ data: updated, meta: { timestamp: new Date().toISOString(), version: "", cached: false } });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!flocks[id]) {
    return NextResponse.json({ data: null, error: "القطيع غير موجود", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 404 });
  }
  const deleted = { ...flocks[id], status: "completed" as const };
  flocks[id] = deleted;
  return NextResponse.json({ data: { deleted: true, id }, meta: { timestamp: new Date().toISOString(), version: "", cached: false } });
}
