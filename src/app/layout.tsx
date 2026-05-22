import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "POULTRIX — منصة ذكاء الدواجن",
  description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
  openGraph: {
    title: "POULTRIX — منصة ذكاء الدواجن",
    description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
    locale: "ar_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "POULTRIX — منصة ذكاء الدواجن",
    description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="poultrix-body">
        <link rel="preconnect" href="https://flowing-impala-8.clerk.accounts.dev" />
        <link rel="dns-prefetch" href="https://flowing-impala-8.clerk.accounts.dev" />
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
