import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import StickyLeadButton from "../components/StickyLeadButton";
import AccessibilityWidget from "../components/AccessibilityWidget";
import CookieBanner from "../components/CookieBanner";
import ProjectsGallery from "../components/ProjectsGallery";
import { getSiteContentMap } from "@/lib/content";
import { getStaffSession } from "@/lib/auth";
import { getPortfolioItems } from "@/lib/portfolio-data";
import { getContactInfo } from "@/lib/contact-data";
import { getLogoSize, getFooterLogoSize } from "@/lib/logo-data";
import { getSiteTheme } from "@/lib/theme-data";
import { getSiteCopy } from "@/lib/site-copy-data";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "פרויקטים",
  description: `גלריית פרויקטים נבחרים — פרגולות, חלונות, שערים, סגירות זכוכית, חזיתות ומערכות הצללה מתוצרת ${SITE_NAME}.`,
};

export default async function ProjectsPage() {
  let images: Awaited<ReturnType<typeof getSiteContentMap>> = {};
  try {
    images = await getSiteContentMap();
  } catch (err) {
    console.error("Failed to load site content images", err);
  }

  const staffSession = await getStaffSession();
  const items = await getPortfolioItems();
  const { phone, email } = await getContactInfo();
  const logoSize = await getLogoSize();
  const footerLogoSize = await getFooterLogoSize();
  const theme = await getSiteTheme();
  const siteCopy = await getSiteCopy();

  return (
    <div className="flex flex-1 flex-col">
      <FloatingWhatsApp phone={phone} />
      <AccessibilityWidget />
      <StickyLeadButton phone={phone} />
      <CookieBanner />
      <SiteHeader
        logoUrl={images["site-logo"]}
        isStaff={Boolean(staffSession)}
        logoSize={logoSize}
        headerBg={theme.headerBg}
        headerText={theme.headerText}
        navLinks={siteCopy.navLinks}
      />
      <main className="flex flex-1 flex-col">
        <section className="bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h1 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
              <span className="gradient-gold">הפרויקטים</span> שלנו
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-zinc-500">
              מבחר עבודות שביצענו עבור לקוחות פרטיים, קבלנים ועסקים — סננו לפי סוג המערכת לצפייה בפרויקטים רלוונטיים.
            </p>

            <div className="mt-10">
              <ProjectsGallery items={items} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        logoUrl={images["footer-logo"] ?? images["site-logo"]}
        phone={phone}
        email={email}
        logoSize={footerLogoSize}
        footerBg={theme.footerBg}
        footerText={theme.footerText}
        services={siteCopy.services}
      />
    </div>
  );
}
