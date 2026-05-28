import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://poultrix.abouaaliahmed.com"),
  title: {
    default: "POULTRIX — منصة ذكاء الدواجن",
    template: "%s | POULTRIX",
  },
  description: "منصة ذكاء اصطناعي متكاملة لإدارة ضيعات الدواجن. تتبع إنتاج البيض، حساب FCR، إدارة القطيع، تشخيص بيطري بالذكاء الاصطناعي، وموسوعة سلالات الدجاج.",
  keywords: ["إدارة ضيعات الدواجن", "برنامج إدارة الدجاج", "ذكاء اصطناعي دواجن", "poultry management", "chicken farm software", "poultry SaaS", "FCR calculator", "بيض", "دجاج", "مزرعة دواجن", "POULTRIX"],
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
  appleWebApp: { title: "POULTRIX" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="poultrix-body">
        <link rel="preconnect" href="https://clerk.accounts.dev" />
        <link rel="dns-prefetch" href="https://clerk.accounts.dev" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preload" href="/fonts/Geist-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Geist-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <ClerkProvider>{children}</ClerkProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-YJSX3N34M0" strategy="afterInteractive" data-cfasync="false" />
        <Script id="google-analytics" strategy="afterInteractive" data-cfasync="false">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-YJSX3N34M0');`}
        </Script>
      </body>
    </html>
  );
}
