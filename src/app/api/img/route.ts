import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "images.unsplash.com",
  "upload.wikimedia.org",
  "media.istockphoto.com",
  "i.imgur.com",
];

function isPrivateIP(hostname: string): boolean {
  const m = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const p = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseInt(m[4])];
  if (p[0] === 10) return true;
  if (p[0] === 127) return true;
  if (p[0] === 169 && p[1] === 254) return true;
  if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
  if (p[0] === 192 && p[1] === 168) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) return new NextResponse("Missing url", { status: 400 });

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlParam);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (parsedUrl.protocol !== "https:") {
    return new NextResponse("Only HTTPS allowed", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return new NextResponse("Host not allowed", { status: 400 });
  }

  if (isPrivateIP(parsedUrl.hostname)) {
    return new NextResponse("Private IP not allowed", { status: 400 });
  }

  try {
    const res = await fetch(urlParam, { signal: AbortSignal.timeout(10000) });
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
