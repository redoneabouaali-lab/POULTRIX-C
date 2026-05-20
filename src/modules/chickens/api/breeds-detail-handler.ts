import { NextResponse } from "next/server";

const arabicNames: Record<string, string> = {
  "Leghorn": "لجهورن", "Rhode Island Red": "رود آيلاند الأحمر", "Orpington": "أوربينغتون",
  "Silkie": "سيلكي", "Plymouth Rock": "بليموث روك", "Australorp": "أسترالورب",
  "Ameraucana": "أميروكانا", "Marans": "ماران", "Sussex": "ساسكس",
  "Wyandotte": "وياندوت", "Easter Egger": "إيستر إيغر", "Cream Legbar": "كريم ليغبار",
  "Welsummer": "ويلسامر", "Barnevelder": "بارنيفيلدر", "ISA Brown": "آيزا براون",
  "Dominique": "دومينيك", "Cochin": "كوتشين", "Faverolles": "فافيرول",
  "Polish": "بوليش", "Naked Neck": "نيكد نيك", "Bresse": "بريس",
  "Malay": "مالاي", "Araucana": "أراوكانا", "Langshan": "لانغشان",
  "New Hampshire": "نيو هامبشاير", "Norwegian Jaerhon": "يارهون النرويجي",
  "Swedish Flower Hen": "الدجاجة السويدية المزهرة", "Icelandic Chicken": "الدجاج الآيسلندي",
  "Serama": "سيراما", "Booted Bantam": "بانتام", "Barbu d'Uccle": "باربو ديكل",
  "Pekin Bantam": "بانتام بكين", "Sultan": "سلطان",
  "Crevecoeur": "كريفكور", "Appenzeller Spitzhauben": "أبينزيلر",
  "Yokohama": "يوكوهاما", "Phoenix": "فينيكس", "Sumatra": "سومطرة",
  "Lakenvelder": "لاكنفيلدر", "Hamburg": "هامبورغ", "Campine": "كامبين",
  "Ancona": "أنكونا", "Brahma": "براهما", "Dorking": "دوركينغ",
  "Buckeye": "بكاي", "Chantecler": "شانتكلير", "Delaware": "ديلاوير",
  "Cream Crested Legbar": "كريم كريستد ليغبار", "Yokohama Red": "يوكوهاما الأحمر",
};

const originsAr: Record<string, string> = {
  "Italy": "إيطاليا", "USA": "الولايات المتحدة", "France": "فرنسا",
  "England": "إنجلترا", "China": "الصين", "Australia": "أستراليا",
  "Netherlands": "هولندا", "Belgium": "بلجيكا", "Germany": "ألمانيا",
  "Canada": "كندا", "Turkey": "تركيا", "Norway": "النرويج",
  "Sweden": "السويد", "Iceland": "آيسلندا", "Malaysia": "ماليزيا",
  "Chile": "تشيلي", "Poland": "بولندا", "Switzerland": "سويسرا",
  "Transylvania (Romania)": "رومانيا", "Southeast Asia": "جنوب شرق آسيا",
  "India": "الهند", "Indonesia": "إندونيسيا", "Japan": "اليابان",
  "United Kingdom": "المملكة المتحدة",
  "South America": "أمريكا الجنوبية",
  "Massachusetts & Rhode Island": "ماساتشوستس ورود آيلاند",
  "Sussex, Kent, Surrey": "ساسكس، كينت، سري",
  "Bresse region": "منطقة بريس",
  "Ohio": "أوهايو",
  "New Hampshire": "نيو هامبشاير",
  "United States (Ohio)": "الولايات المتحدة (أوهايو)",
  "United States (derived from Chinese stock)": "الولايات المتحدة (من أصل صيني)",
  "USA (Massachusetts & Rhode Island)": "الولايات المتحدة",
  "England (Sussex, Kent, Surrey)": "إنجلترا",
  "France (Bresse region)": "فرنسا (منطقة بريس)",
  "Germany (derived from Japanese imports)": "ألمانيا (من أصل ياباني)",
  "Japan (refined in Germany)": "اليابان (طورت في ألمانيا)",
  "Netherlands (also developed in Belgium and Germany)": "هولندا",
  "China (popularized in the United Kingdom in the 1800s)": "الصين",
  "England (derived from Chinese stock)": "إنجلترا",
  "Netherlands & Belgium & Germany": "هولندا وبلجيكا وألمانيا",
};

const eggColorsAr: Record<string, string> = {
  "White": "أبيض", "Brown": "بني", "Blue": "أزرق", "Green": "أخضر",
  "Dark Brown": "بني غامق", "Cream": "كريمي", "Light Brown": "بني فاتح",
  "Pink": "وردي", "Tiny": "صغير جداً",
};

const eggSizesAr: Record<string, string> = {
  "Small": "صغير", "Medium": "وسط", "Large": "كبير", "Extra Large": "كبير جداً",
  "small": "صغير", "medium": "وسط", "large": "كبير", "extra large": "كبير جداً",
};

const temperamentTranslations: Record<string, string> = {
  "Active": "نشيط", "active": "نشيط",
  "Calm": "هادئ", "calm": "هادئ",
  "Friendly": "ودود", "friendly": "ودود",
  "Docile": "أليف", "docile": "أليف",
  "Curious": "فضولي", "curious": "فضولي",
  "Gentle": "لطيف", "gentle": "لطيف",
  "Flighty": "سريع الهياج", "flighty": "سريع الهياج",
  "Alert": "يقظ", "alert": "يقظ",
  "Independent": "مستقل", "independent": "مستقل",
  "Broody": "حاضن", "broody": "حاضن",
  "Energetic": "نشيط", "energetic": "نشيط",
  "Loud": "صاخب", "loud": "صاخب",
  "Noisy": "صاخب", "noisy": "صاخب",
  "Quiet": "هادئ", "quiet": "هادئ",
  "Shy": "خجول", "shy": "خجول",
  "Friendly Curious": "ودود فضولي",
  "Friendly Docile": "ودود أليف",
  "Calm Friendly Docile": "هادئ ودود أليف",
  "Active Flighty Alert": "نشيط سريع الهياج يقظ",
  "Active Alert": "نشيط يقظ",
  "Active Flighty": "نشيط سريع الهياج",
  "Calm Docile": "هادئ أليف",
  "Friendly Curious Gentle": "ودود فضولي لطيف",
  "Independent Broody": "مستقل حاضن",
  "Active Energetic Alert": "نشيط نشيط يقظ",
  "Calm Friendly": "هادئ ودود",
  "Docile Quiet": "أليف هادئ",
  "Active Hardy Alert": "نشيط قوي يقظ",
  "Active Alert Flighty": "نشيط يقظ سريع الهياج",
  "Active and alert": "نشيط ويقظ",
  "Active and flighty": "نشيط وسريع الهياج",
  "Alert and flighty": "يقظ وسريع الهياج",
  "Active alert": "نشيط يقظ",
  "Calm and friendly": "هادئ وودود",
  "Calm and docile": "هادئ وأليف",
  "Friendly and docile": "ودود وأليف",
  "Friendly and curious": "ودود وفضولي",
  "Curious and gentle": "فضولي ولطيف",
  "Calm friendly": "هادئ ودود",
  "Active hardy": "نشيط قوي",
  "Docile quiet": "أليف هادئ",
  "Hardy alert": "قوي يقظ",
  "Active hardy alert": "نشيط قوي يقظ",
  "Docile friendly": "أليف ودود",
  "hens may be broody": "قد يكون حاضن",
  "roosters occasionally assertive": "الديك قد يكون حازم",
  "hens are often broody": "غالباً ما يكون حاضن",
  "roosters may be aggressive": "الديك قد يكون عدواني",
  "Docile friendly; hens may be broody; roosters occasionally assertive": "أليف ودود، قد يكون حاضن، الديك قد يكون حازم",
  "Calm docile; roosters may be protective": "هادئ أليف، الديك قد يكون حامي",
  "Active flighty; roosters may be aggressive": "نشيط سريع الهياج، الديك قد يكون عدواني",
  "Calm friendly; roosters may be protective": "هادئ ودود، الديك قد يكون حامي",
  "Friendly docile; roosters may be noisy": "ودود أليف، الديك قد يكون صاخب",
};

function translateTemperament(en: string): string {
  if (!en) return "";
  const cleaned = en.trim();
  if (temperamentTranslations[cleaned]) return temperamentTranslations[cleaned];
  const words = cleaned.split(/[,.\s]+/).filter(w => w && w !== "and" && w !== "&" && w !== "the");
  const translated = words.map(w => temperamentTranslations[w] || w);
  return translated.join(" ");
}

async function fetchWikipediaImage(breedName: string): Promise<string | null> {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(breedName + " chicken")}&format=json&srlimit=3&origin=*`,
      { signal: AbortSignal.timeout(3000) }
    );
    const searchData = await searchRes.json();
    const pageTitle = searchData?.query?.search?.[0]?.title;
    if (!pageTitle) return null;

    const imageRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
      { signal: AbortSignal.timeout(3000) }
    );
    const imageData = await imageRes.json();
    const pages = imageData?.query?.pages;
    if (!pages) return null;
    const pageKey = Object.keys(pages)[0];
    return pages[pageKey]?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

async function fetchArabicDescription(arabicName: string): Promise<string | null> {
  try {
    const searchRes = await fetch(
      `https://ar.wikipedia.org/w/api.php?action=query&list=search&srwhat=text&srsearch=${encodeURIComponent(arabicName + " دجاج")}&format=json&srlimit=1&origin=*`,
      { signal: AbortSignal.timeout(3000) }
    );
    const searchData = await searchRes.json();
    const pageTitle = searchData?.query?.search?.[0]?.title;
    if (!pageTitle) return null;

    const extractRes = await fetch(
      `https://ar.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&format=json&exintro&explaintext&origin=*`,
      { signal: AbortSignal.timeout(3000) }
    );
    const extractData = await extractRes.json();
    const pages = extractData?.query?.pages;
    if (!pages) return null;
    const pageKey = Object.keys(pages)[0];
    if (pageKey === "-1") return null;
    const extract = pages[pageKey]?.extract;
    return extract?.trim() || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const breedId = parseInt(id, 10);
  if (isNaN(breedId) || breedId < 1) {
    return NextResponse.json({ error: "Invalid breed ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://chickenapi.com/api/v1/breeds/${breedId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return NextResponse.json({ error: "Breed not found" }, { status: 404 });

    const b = await res.json();
    const nameEn = b.name;
    const nameAr = arabicNames[nameEn] || nameEn;

    const [wikiImage, descriptionAr] = await Promise.all([
      fetchWikipediaImage(nameEn),
      fetchArabicDescription(nameAr),
    ]);
    const imageUrl = wikiImage || b.imageUrl;

    return NextResponse.json({
      id: breedId,
      nameAr,
      nameEn,
      originAr: originsAr[b.origin] || b.origin || "غير معروف",
      originEn: b.origin,
      eggColorAr: eggColorsAr[b.eggColor] || b.eggColor || "—",
      eggColorEn: b.eggColor,
      eggSize: b.eggSize || null,
      eggSizeAr: eggSizesAr[b.eggSize] || b.eggSize || "—",
      eggNumber: b.eggNumber ?? null,
      temperamentAr: translateTemperament(b.temperament),
      temperamentEn: b.temperament,
      description: b.description || null,
      descriptionAr,
      imageUrl,
      sources: b.sources || [],
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch breed" }, { status: 502 });
  }
}
