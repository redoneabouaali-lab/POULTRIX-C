import { NextResponse } from "next/server";
import OpenAI from "openai";

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

async function translateFacts(facts: Fact[]): Promise<Fact[]> {
  const apiKey = process.env.NVIDIA_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1";
  if (!apiKey) return facts;

  const client = new OpenAI({ apiKey, baseURL });

  const texts = facts.map((f) => f.text);
  const prompt = `أنت مترجم. التالي مصفوفة حقائق بالإنكليزية عن الدجاج. ترجم كل حقيقة إلى العربية الفصحى. أجب فقط بصيغة JSON:\n{\"translations\": [\"ترجمة الحقيقة الأولى\", \"ترجمة الحقيقة الثانية\", ...]}\n\nالحقائق:\n${JSON.stringify(texts)}`;

    try {
    const response = await client.chat.completions.create({
      model: process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 16000,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) return facts;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch?.[0] || content;
    const parsed = JSON.parse(jsonStr);
    const translatedTexts: string[] = parsed.translations || parsed.translated || parsed.facts || parsed;

    if (Array.isArray(translatedTexts) && translatedTexts.length === facts.length) {
      return facts.map((f, i) => ({
        ...f,
        text: translatedTexts[i] || f.text,
      }));
    }

    return facts;
  } catch {
    return facts;
  }
}

let cachedFacts: Fact[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 60_000;

export async function GET() {
  try {
    const now = Date.now();
    if (!cachedFacts || now - lastFetch > CACHE_TTL) {
      const facts = await fetchFacts();
      cachedFacts = await translateFacts(facts);
      lastFetch = now;
    }
    return NextResponse.json(cachedFacts, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch facts" }, { status: 502 });
  }
}
