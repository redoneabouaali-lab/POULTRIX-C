import { NextResponse } from "next/server";

const TIMEOUT = 5000;

async function fetchWithTimeout(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/* ───────── Image extraction helpers ───────── */

function extractWikipediaTitle(url: string): string | null {
  const match = url.match(/en\.wikipedia\.org\/wiki\/([^?#]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1].replace(/_/g, " "));
}

async function fetchWikipediaThumbnail(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source || data.originalimage?.source || null;
  } catch {
    return null;
  }
}

function extractOGImage(html: string): string | null {
  const patterns = [
    /<meta[^>]*(?:property|name)=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']og:image["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  const firstImg = html.match(/<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);
  if (firstImg) return firstImg[1];
  return null;
}

/* ───────── Strip HTML to plain text ───────── */

function stripHtml(html: string): string {
  return html
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
}

/* ───────── NVIDIA AI: extract + translate + structure ───────── */

async function aiExtract(
  breedName: string,
  sourcesText: string[]
): Promise<{ descriptionAr: string; facts: Record<string, string> } | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  const baseUrl = process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const model = process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct";
  if (!apiKey) return null;

  const combined = sourcesText.join("\n\n---\n\n").slice(0, 6000);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      signal: AbortSignal.timeout(30000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "أنت خبير في سلالات الدجاج. مهمتك: تحليل النص الآتي من صفحات ويب عن سلالة دجاج، واستخراج المعلومات التالية باللغة العربية الفصحى فقط.\n\n" +
              "1. **وصف السلالة**: فقرة كاملة ومفصلة عن السلالة (تاريخ، أصل، خصائص، استخدامات)\n" +
              "2. **حقائق**: قائمة من الحقائق المهمة (مثل الأصل، الوزن، لون البيض، عدد البيض سنوياً، المزاج، الاستخدام)\n\n" +
              "قواعد مهمة:\n" +
              "- تجاهل تماماً أي محتوى يبدو كإعلانات، قوائم تصفح، تعليقات، مناقشات منتديات، أو تجارب شخصية\n" +
              "- ركز فقط على المعلومات الواقعية عن السلالة\n" +
              "- حافظ على الأرقام والقياسات كما هي\n" +
              "- إذا كان النص لا يحتوي على معلومات مفيدة عن السلالة، أعد وصفاً عاماً بناءً على معرفتك\n\n" +
              "أعد النتيجة بتنسيق JSON فقط:\n" +
              '{ "descriptionAr": "...", "facts": { "الأصل": "...", "الوزن": "...", "لون البيض": "...", "المزاج": "..." } }',
          },
          {
            role: "user",
            content: `سلالة: ${breedName}\n\nمحتوى صفحات الويب:\n${combined}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 4096,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      descriptionAr: parsed.descriptionAr || parsed.description || "",
      facts: parsed.facts || {},
    };
  } catch {
    return null;
  }
}

/* ───────── Main Entry ───────── */

export async function POST(req: Request) {
  try {
    const { nameEn, nameAr, sources } = await req.json();
    if (!nameEn) {
      return NextResponse.json({ error: "Missing nameEn" }, { status: 400 });
    }

    /* ── Validate source URLs ── */
    const ALLOWED_SOURCE_PATTERNS = [
      /^https?:\/\/([a-zA-Z0-9-]+\.)?wikipedia\.org\//,
      /^https?:\/\/([a-zA-Z0-9-]+\.)?wikimedia\.org\//,
      /^https?:\/\/([a-zA-Z0-9-]+\.)?chickenapi\.com\//,
    ];
    for (const url of (sources || [])) {
      const allowed = ALLOWED_SOURCE_PATTERNS.some((p) => p.test(url));
      if (!allowed) {
        return NextResponse.json({ error: `Source URL not allowed: ${url}` }, { status: 400 });
      }
    }

    /* ── Fetch all source URLs in parallel ── */
    const fetchResults = await Promise.allSettled(
      (sources || []).map(async (url: string) => {
        const res = await fetchWithTimeout(url);
        if (!res) return null;
        const html = await res.text();
        if (html.length < 200) return null;
        const host = new URL(url).hostname.replace(/^www\./, "");
        return { html, host, url };
      })
    );

    const pages: { html: string; host: string; url: string }[] = [];
    for (const r of fetchResults) {
      if (r.status === "fulfilled" && r.value) pages.push(r.value);
    }

    /* ── Extract images from HTML (before sending to AI) ── */
    let imageUrl: string | null = null;

    for (const page of pages) {
      const img = extractOGImage(page.html);
      if (img) { imageUrl = img; break; }
    }

    if (!imageUrl) {
      for (const url of sources || []) {
        const title = extractWikipediaTitle(url);
        if (title) {
          imageUrl = await fetchWikipediaThumbnail(title);
          if (imageUrl) break;
        }
      }
    }

    /* ── Send stripped text to AI for understanding ── */
    const texts = pages.map((p) => stripHtml(p.html).slice(0, 3000)).filter((t) => t.length > 100);
    const aiResult = await aiExtract(nameEn, texts);

    if (!aiResult) {
      return NextResponse.json({
        descriptionAr: null,
        imageUrl: imageUrl || null,
        source: pages[0]?.host || null,
        sourceUrl: pages[0]?.url || null,
        enrichedFields: null,
      });
    }

    const sourcePage = pages.find((p) => p.host !== "wikipedia.org") || pages[0];

    return NextResponse.json({
      descriptionAr: aiResult.descriptionAr,
      imageUrl: imageUrl || null,
      source: sourcePage?.host || null,
      sourceUrl: sourcePage?.url || null,
      enrichedFields: Object.keys(aiResult.facts).length > 0 ? aiResult.facts : null,
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