import { NextResponse } from "next/server";

function breedSlug(nameEn: string): string {
  return nameEn.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const TIMEOUT = 5000;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(TIMEOUT),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        ...options?.headers,
      },
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

interface SourceResult {
  text: string;
  source: string;
  sourceUrl: string;
  imageUrl: string | null;
  facts: Record<string, string>;
}

function parseLivestockContent(html: string, slug: string): SourceResult | null {
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#8230;/g, "...")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const breedName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const stopMarkers = [
    "Did you know:",
    "You may be interested in",
    "Search for:",
    "Donations submitted",
    "&copy; Copyright",
    "© Copyright",
    "Page load link",
    "Go to Top",
    "Facebook Instagram",
    "All Rights Reserved",
  ];

  const nameHeading = text.includes(breedName.toUpperCase())
    ? text.toUpperCase().indexOf(breedName.toUpperCase())
    : -1;

  let description = "";

  if (nameHeading >= 0) {
    const afterHeading = text.slice(nameHeading);
    let earliestStop = afterHeading.length;
    for (const marker of stopMarkers) {
      const idx = afterHeading.indexOf(marker);
      if (idx >= 0 && idx < earliestStop) earliestStop = idx;
    }
    const raw = afterHeading.slice(0, earliestStop).trim();
    const headingEnd = raw.indexOf("\n");
    description = (headingEnd >= 0 ? raw.slice(headingEnd) : raw).trim();
  }

  if (description.length < 100) {
    const paragraphs = text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 100);
    if (paragraphs.length > 0) {
      description = paragraphs.slice(0, 8).join("\n\n");
    }
  }

  if (description.length < 50) return null;

  const facts: Record<string, string> = {};
  const factLines = text.match(/[A-Z][a-zA-Z\s]+:\s[^\n]+/g);
  if (factLines) {
    for (const line of factLines) {
      const parts = line.split(/:\s(.+)/);
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts[1].trim();
        if (key && val && key.length < 30) facts[key] = val;
      }
    }
  }

  let imageUrl: string | null = null;
  const imgMatch = html.match(
    /<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*wp-image[^"']*["']/
  );
  if (imgMatch) imageUrl = imgMatch[1].startsWith("http") ? imgMatch[1] : `https://livestockconservancy.org${imgMatch[1]}`;

  return {
    text: description,
    source: "livestockconservancy.org",
    sourceUrl: `https://livestockconservancy.org/heritage-chickens/${slug}/`,
    imageUrl,
    facts,
  };
}

async function scrapeLivestockConservancy(slug: string): Promise<SourceResult | null> {
  const patterns = [
    `https://livestockconservancy.org/heritage-chickens/${slug}/`,
  ];
  for (const url of patterns) {
    const res = await fetchWithTimeout(url);
    if (!res) continue;
    const html = await res.text();
    const result = parseLivestockContent(html, slug);
    if (result) return result;
  }
  return null;
}

async function scrapeWikipedia(nameEn: string): Promise<SourceResult | null> {
  const pageNames = [
    `${nameEn}_chicken`,
    `${nameEn.replace(/\s+/g, "_")}`,
  ];
  for (const pageName of pageNames) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageName)}`;
    const res = await fetchWithTimeout(url);
    if (!res) continue;
    const data = await res.json();
    if (!data || !data.extract) continue;

    const fullUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(data.title || pageName)}`;
    const fullRes = await fetchWithTimeout(fullUrl);
    let fullText = data.extract;
    if (fullRes) {
      const fullHtml = await fullRes.text();
      const parsed = fullHtml
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
      if (parsed.length > data.extract.length) {
        fullText = parsed.slice(0, 3000);
      }
    }

    return {
      text: fullText,
      source: "wikipedia.org",
      sourceUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${pageName}`,
      imageUrl: data.thumbnail?.source || data.originalimage?.source || null,
      facts: {
        description: data.description || "",
      },
    };
  }
  return null;
}

async function scrapeOkstate(slug: string): Promise<SourceResult | null> {
  const patterns = [
    `https://breeds.okstate.edu/poultry/chickens/${slug}-chickens.html`,
    `https://breeds.okstate.edu/poultry/chickens/${slug}.html`,
  ];
  for (const url of patterns) {
    const res = await fetchWithTimeout(url);
    if (!res) continue;
    const html = await res.text();
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length < 200) continue;

    return {
      text: text.slice(0, 2000),
      source: "okstate.edu",
      sourceUrl: url,
      imageUrl: null,
      facts: {},
    };
  }
  return null;
}

function pickRichest(results: SourceResult[]): SourceResult | null {
  const valid = results.filter((r) => r.text.length > 50);
  if (valid.length === 0) return null;
  valid.sort((a, b) => b.text.length - a.text.length);
  return valid[0];
}

async function translateToArabic(text: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  const baseUrl =
    process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const model =
    process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct";

  if (!apiKey) return text;

  const truncated =
    text.length > 1800 ? text.slice(0, text.lastIndexOf(".", 1800) + 1) : text;
  if (truncated.length < 50) return text;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      signal: AbortSignal.timeout(20000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "أنت مترجم متخصص في مجال الزراعة والدواجن. الترجمة إلى العربية الفصحى. حافظ على الأرقام والقياسات والأسماء العلمية. أعد الترجمة فقط.",
          },
          { role: "user", content: truncated },
        ],
        temperature: 0.05,
        max_tokens: 4096,
      }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    const translated = data.choices?.[0]?.message?.content?.trim();
    return translated && translated.length > 20 ? translated : text;
  } catch {
    return text;
  }
}

export async function POST(req: Request) {
  try {
    const { nameEn, nameAr } = await req.json();
    if (!nameEn) {
      return NextResponse.json({ error: "Missing nameEn" }, { status: 400 });
    }

    const slug = breedSlug(nameEn);

    const results = await Promise.allSettled([
      scrapeLivestockConservancy(slug).catch(() => null),
      scrapeWikipedia(nameEn).catch(() => null),
      scrapeOkstate(slug).catch(() => null),
    ]);

    const validResults: SourceResult[] = [];
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) validResults.push(r.value);
    }

    const best = pickRichest(validResults);
    if (!best) {
      return NextResponse.json({
        descriptionAr: null,
        imageUrl: null,
        source: null,
        sourceUrl: null,
        enrichedFields: null,
      });
    }

    let descriptionAr = best.text;
    if (best.text.length > 100) {
      descriptionAr = await translateToArabic(best.text);
    }

    return NextResponse.json({
      descriptionAr,
      imageUrl: best.imageUrl,
      source: best.source,
      sourceUrl: best.sourceUrl,
      enrichedFields: Object.keys(best.facts).length > 0 ? best.facts : null,
    });
  } catch {
    return NextResponse.json({
      descriptionAr: null,
      imageUrl: null,
      source: null,
      sourceUrl: null,
      enrichedFields: null,
    });
  }
}
