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

export const revalidate = 60;

export const metadata: Metadata = {
  title: "פרויקטים | ALUM DESIGN",
  description: "גלריית פרויקטים נבחרים — פרגולות, חלונות, שערים, סגירות זכוכית, חזיתות ומערכות הצללה מתוצרת ALUM DESIGN.",
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

  return (
    <div className="flex flex-1 flex-col">
      <FloatingWhatsApp phone={phone} />
      <AccessibilityWidget />
      <StickyLeadButton phone={phone} />
      <CookieBanner />
      <SiteHeader logoUrl={images["site-logo"]} isStaff={Boolean(staffSession)} />
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
      <SiteFooter logoUrl={images["site-logo"]} phone={phone} email={email} />
    </div>
  );
}
