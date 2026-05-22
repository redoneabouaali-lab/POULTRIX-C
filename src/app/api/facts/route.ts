import { NextResponse } from "next/server";

type Fact = {
  text: string;
  source: string;
  date: string;
};

async function fetchFacts(): Promise<Fact[]> {
  const res = await fetch("https://chickenapi.com/facts", {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error("Failed to fetch facts page");
  const html = await res.text();

  const facts: Fact[] = [];
  const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  let match: RegExpExecArray | null;

  while ((match = articleRegex.exec(html)) !== null) {
    const article = match[1];

    const textMatch = article.match(
      /<p class="text-base text-slate-800 flex-1">([\s\S]*?)<\/p>/
    );
    if (!textMatch) continue;

    const sourceMatch = article.match(
      /<a[\s\S]*?href="([^"]+)"[\s\S]*?View Source<\/a>/
    );
    const dateMatch = article.match(
      /<time[^>]*>([\s\S]*?)<\/time>/
    );

    const text = textMatch[1]
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
      .trim();

    facts.push({
      text,
      source: sourceMatch?.[1] || "",
      date: dateMatch?.[1]?.trim() || "",
    });
  }

  return facts;
}

let cachedFacts: Fact[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 60_000;

export async function GET() {
  try {
    const now = Date.now();
    if (!cachedFacts || now - lastFetch > CACHE_TTL) {
      cachedFacts = await fetchFacts();
      lastFetch = now;
    }
    return NextResponse.json(cachedFacts, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch facts" }, { status: 502 });
  }
}
