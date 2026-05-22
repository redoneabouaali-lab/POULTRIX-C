import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://poultrix.abouaaliahmed.com"),
  title: "POULTRIX — منصة ذكاء الدواجن",
  description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
  openGraph: {
    title: "POULTRIX — منصة ذكاء الدواجن",
    description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
    url: "/",
    siteName: "POULTRIX",
    images: [{ url: "/fallback-chicken.svg", width: 1200, height: 630 }],
    locale: "ar_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "POULTRIX — منصة ذكاء الدواجن",
    description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
    images: ["/fallback-chicken.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="poultrix-body">
        <link rel="preconnect" href="https://flowing-impala-8.clerk.accounts.dev" />
        <link rel="dns-prefetch" href="https://flowing-impala-8.clerk.accounts.dev" />
        <link rel="preload" href="/fonts/Geist-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Geist-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
