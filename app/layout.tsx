import type { Metadata, Viewport } from "next";
import { Heebo, Rubik, Frank_Ruhl_Libre, Suez_One } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import LoadingScreen from "./components/LoadingScreen";
import { SITE_URL, SITE_NAME, SITE_PHONE, SITE_EMAIL } from "@/lib/site";
import { getSiteContentMap } from "@/lib/content";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
});

const suezOne = Suez_One({
  variable: "--font-suez-one",
  subsets: ["hebrew", "latin"],
  weight: "400",
});

const TITLE = "ALUM DESIGN | פתרונות אלומיניום חכמים";
const DESCRIPTION =
  "ALUM DESIGN - פתרונות אלומיניום חכמים לפרויקטים מודרניים: פרגולות, חלונות, שערים, סגירות זכוכית, חזיתות והצללות.";

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "/favicon.ico";
  try {
    const content = await getSiteContentMap();
    if (content.favicon) faviconUrl = content.favicon;
  } catch {
    // MongoDB unavailable — fall back to the default /favicon.ico
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DESCRIPTION,
    keywords: ["אלומיניום", "פרגולות", "חלונות אלומיניום", "שערים חשמליים", "סגירות זכוכית", "חזיתות אלומיניום", "ALUM DESIGN"],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: "he_IL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
    icons: { icon: faviconUrl },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#cfa15c",
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: SITE_NAME,
  url: SITE_URL,
  telephone: SITE_PHONE,
  email: SITE_EMAIL,
  image: `${SITE_URL}/opengraph-image`,
  areaServed: "IL",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${rubik.variable} ${frankRuhlLibre.variable} ${suezOne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
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
