import { NextResponse } from "next/server";
import type { Flock } from "@/types";

const flocks: Flock[] = [
  { id: "flock-001", farmId: "farm-001", name: "القطيع أ-42", breed: "Cobb 500", status: "active", totalBirds: 8400, avgAge: 32, healthScore: 96.4, houseShedId: "العنبر 1", notes: "قطيع اللاحم الأساسي", startDate: "2026-04-15", createdAt: "2026-04-15T00:00:00Z", updatedAt: "2026-05-18T12:00:00Z" },
  { id: "flock-002", farmId: "farm-001", name: "القطيع ب-41", breed: "ISA Brown", status: "active", totalBirds: 6200, avgAge: 48, healthScore: 92.1, houseShedId: "العنبر 2", notes: "قطيع بياض", startDate: "2026-03-20", createdAt: "2026-03-20T00:00:00Z", updatedAt: "2026-05-18T10:00:00Z" },
  { id: "flock-003", farmId: "farm-001", name: "القطيع ج-30", breed: "Ross 308", status: "active", totalBirds: 10200, avgAge: 18, healthScore: 98.7, houseShedId: "العنبر 3", notes: "قطيع جديد", startDate: "2026-05-01", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-18T09:00:00Z" },
  { id: "flock-004", farmId: "farm-001", name: "القطيع د-38", breed: "Cobb 500", status: "sold", totalBirds: 0, avgAge: 0, houseShedId: "العنبر 1", notes: "تم البيع", startDate: "2026-02-01", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z" },
];

export async function GET() {
  const live = flocks.map(f => ({
    ...f,
    ...(f.healthScore != null ? { healthScore: +(f.healthScore + (Math.random() - 0.5) * 0.8).toFixed(1) } : {}),
  }));
  return NextResponse.json({
    data: live,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.breed) {
    return NextResponse.json(
      { data: null, error: "name و breed مطلوبان", meta: { timestamp: new Date().toISOString(), version: "", cached: false } },
      { status: 400 }
    );
  }
  const newFlock = { id: `flock-${Date.now()}`, farmId: "farm-001", ...body, status: "active", startDate: new Date().toISOString().split("T")[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  flocks.push(newFlock as any);
  return NextResponse.json({
    data: newFlock,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  if (!body.id) {
    return NextResponse.json(
      { data: null, error: "id مطلوب لتحديث القطيع" },
      { status: 400 }
    );
  }
  const idx = flocks.findIndex(f => f.id === body.id);
  if (idx === -1) {
    return NextResponse.json(
      { data: null, error: `القطيع ${body.id} غير موجود` },
      { status: 404 }
    );
  }
  const { id, ...updates } = body;
  flocks[idx] = { ...flocks[idx], ...updates, updatedAt: new Date().toISOString() };
  return NextResponse.json({
    data: flocks[idx],
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
