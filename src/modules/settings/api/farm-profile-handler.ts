import { NextResponse } from "next/server";
import type { Farm } from "@/types";

const farm: Farm = {
  id: "farm-001",
  name: "ضيعة النخيل للدواجن",
  location: "الدار البيضاء، المغرب",
  capacity: 30000,
  currentStock: 28470,
  licenseNumber: "FL-2024-MA-0842",
  certifications: ["المعيار البيطري المغربي", "ISO 22000"],
  employeeCount: 8,
  description: "ضيعة متخصصة في إنتاج الدجاج اللاحم والبيض، تأسست 2024",
  createdAt: "2024-01-15T00:00:00Z",
  updatedAt: "2026-05-18T12:00:00Z",
};

export async function GET() {
  return NextResponse.json({
    data: farm,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const updated = { ...farm, ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json({
    data: updated,
    meta: { timestamp: new Date().toISOString(), version: "", cached: false },
  });
}
