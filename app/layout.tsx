import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import LoadingScreen from "./components/LoadingScreen";

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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <noscript>
          <style>{`#loading-screen{display:none!important}`}</style>
        </noscript>
        <LoadingScreen />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
