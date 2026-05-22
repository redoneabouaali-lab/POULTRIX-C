import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return new NextResponse("Image not found", { status: 404 });

    const buffer = await res.arrayBuffer();
    const headers: Record<string, string> = {
      "Content-Type": res.headers.get("content-type") || "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    };

    return new NextResponse(buffer, { status: 200, headers });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
