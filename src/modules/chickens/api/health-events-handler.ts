import { NextResponse } from "next/server";
import type { HealthEvent } from "@/types";

const events: HealthEvent[] = [
  { id: "hlth-001", farmId: "farm-001", flockId: "flock-001", eventDate: "2026-05-15", eventType: "vaccination", description: "مطعوم النيوكاسل - جرعة ثانية", birdsAffected: 8400, mortalityCount: 0, cost: 1200, performedBy: "د. أحمد", nextFollowUp: "2026-06-15", notes: "", createdAt: new Date().toISOString() },
  { id: "hlth-002", farmId: "farm-001", flockId: "flock-002", eventDate: "2026-05-14", eventType: "disease", description: "ظهور أعراض تنفسية خفيفة", birdsAffected: 200, mortalityCount: 5, cost: 850, treatment: "مضاد حيوي في ماء الشرب", performedBy: "د. كريم", nextFollowUp: "2026-05-21", notes: "تم عزل الطيور المصابة", createdAt: new Date().toISOString() },
  { id: "hlth-003", farmId: "farm-001", flockId: "flock-003", eventDate: "2026-05-10", eventType: "inspection", description: "تفتيش روتيني", cost: 0, performedBy: "المربّي", notes: "القطيع بحالة جيدة", createdAt: new Date().toISOString() },
  { id: "hlth-004", farmId: "farm-001", eventDate: "2026-05-08", eventType: "medication", description: "تعقيم العنابر", cost: 2400, treatment: "مطهر", performedBy: "عمال النظافة", nextFollowUp: "2026-06-08", notes: "جميع العنابر", createdAt: new Date().toISOString() },
  { id: "hlth-005", farmId: "farm-001", flockId: "flock-001", eventDate: "2026-05-18", eventType: "mortality", description: "نفوق مفاجئ - ارتفاع الحرارة", mortalityCount: 12, cost: 0, notes: "تم تعديل التهوية", createdAt: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({
    data: events,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.eventType) {
    return NextResponse.json({ data: null, error: "eventType مطلوب", meta: { timestamp: new Date().toISOString(), version: "", cached: false } }, { status: 400 });
  }
  return NextResponse.json({
    data: { id: `hlth-${Date.now()}`, ...body, createdAt: new Date().toISOString() },
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  }, { status: 201 });
}
