import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "POULTRIX — منصة ذكاء الدواجن لإدارة ضيعات الدجاج",
  description: "منصة ذكاء اصطناعي متكاملة لإدارة ضيعات الدواجن. تتبع وتحليل وإنتاجية — من الفوضى إلى السيطرة. حل متكامل لمربي الدجاج في المغرب والعالم العربي.",
  keywords: ["إدارة ضيعات الدواجن", "برنامج إدارة الدجاج", "ذكاء اصطناعي دواجن", "poultry management", "chicken farm software", "منصة دواجن", "تتبع إنتاج البيض", "FCR", "إدارة مزارع الدجاج", "POULTRIX"],
  openGraph: {
    title: "POULTRIX — منصة ذكاء الدواجن",
    description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
    url: "https://poultrix.abouaaliahmed.com",
    siteName: "POULTRIX",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    locale: "ar_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "POULTRIX — منصة ذكاء الدواجن",
    description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://poultrix.abouaaliahmed.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "POULTRIX",
      url: "https://poultrix.abouaaliahmed.com",
      description: "منصة ذكاء اصطناعي متكاملة لإدارة ضيعات الدواجن",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "MAD" },
      author: { "@type": "Person", name: "Redone Abouaali" },
      inLanguage: ["ar", "fr", "en"],
    },
    {
      "@type": "Organization",
      name: "POULTRIX",
      url: "https://poultrix.abouaaliahmed.com",
      logo: "https://poultrix.abouaaliahmed.com/og-image.svg",
      description: "منصة ذكاء اصطناعي متكاملة لإدارة ضيعات الدواجن",
      sameAs: [
        "https://poultrix.abouaaliahmed.com",
      ],
      founder: { "@type": "Person", name: "Redone Abouaali" },
      knowsAbout: { "@type": "Thing", name: "Poultry Management, AI, Smart Farming" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ما هي منصة POULTRIX؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "POULTRIX هي منصة ذكاء اصطناعي متكاملة لإدارة ضيعات الدواجن. توفر تتبع الإنتاج، تحليل الأداء، إدارة القطيع، والتوصل بذكاء اصطناعي لمساعدة مربي الدجاج.",
          },
        },
        {
          "@type": "Question",
          name: "هل POULTRIX مناسبة لمزارع الدواجن في المغرب؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "نعم، POULTRIX مصممة خصيصًا لمربي الدواجن في المغرب والعالم العربي. الواجهة بالعربية وتدعم المقاييس المحلية.",
          },
        },
        {
          "@type": "Question",
          name: "ما هي ميزات POULTRIX؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "تشمل الميزات: تتبع إنتاج البيض، حساب FCR، إدارة القطيع، تحليلات مالية، تشخيص بيطري بالذكاء الاصطناعي، موسوعة سلالات الدجاج، وتقارير الأداء.",
          },
        },
        {
          "@type": "Question",
          name: "What is POULTRIX?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "POULTRIX is a comprehensive AI-powered poultry management platform. It offers flock tracking, production analytics, FCR calculations, AI veterinary diagnosis, and breed encyclopedia — designed for poultry farmers.",
          },
        },
        {
          "@type": "Question",
          name: "Is POULTRIX free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "POULTRIX offers a free tier to get started with poultry management. Premium features are available for larger operations.",
          },
        },
      ],
    },
  ],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
