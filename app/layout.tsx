import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "ALUM DESIGN | פתרונות אלומיניום חכמים",
  description:
    "ALUM DESIGN - פתרונות אלומיניום חכמים לפרויקטים מודרניים: פרגולות, חלונות, שערים, סגירות זכוכית, חזיתות והצללות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b0b0d] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
