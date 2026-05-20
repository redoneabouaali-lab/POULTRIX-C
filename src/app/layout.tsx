import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "POULTRIX — منصة ذكاء الدواجن",
  description: "من الفوضى إلى السيطرة. منصة ذكاء اصطناعي لإدارة ضيعات الدواجن.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="poultrix-body">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
