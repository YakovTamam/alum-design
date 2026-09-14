import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import StickyLeadButton from "../components/StickyLeadButton";
import AccessibilityWidget from "../components/AccessibilityWidget";
import CookieBanner from "../components/CookieBanner";
import StatsSection from "../components/StatsSection";
import ProcessSteps from "../components/ProcessSteps";
import TrustBar from "../components/TrustBar";
import { getSiteContentMap } from "@/lib/content";
import { getClientSession, getStaffSession } from "@/lib/auth";
import { getContactInfo } from "@/lib/contact-data";
import { getLogoSize, getFooterLogoSize } from "@/lib/logo-data";
import { getSiteTheme } from "@/lib/theme-data";
import { getSiteCopy } from "@/lib/site-copy-data";
import { getSiteName } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const siteCopy = await getSiteCopy();
  const siteName = getSiteName(siteCopy.siteIdentity);
  return {
    title: "אודות",
    description: `${siteName} — ${siteCopy.siteIdentity.tagline}. למעלה מ-15 שנות ניסיון, ייצור עצמי ולמעלה מ-500 פרויקטים ברחבי הארץ.`,
  };
}

export default async function AboutPage() {
  let images: Awaited<ReturnType<typeof getSiteContentMap>> = {};
  try {
    images = await getSiteContentMap();
  } catch (err) {
    console.error("Failed to load site content images", err);
  }

  const staffSession = await getStaffSession();
  const clientSession = await getClientSession();
  const { phone, email, social } = await getContactInfo();
  const logoSize = await getLogoSize();
  const footerLogoSize = await getFooterLogoSize();
  const theme = await getSiteTheme();
  const siteCopy = await getSiteCopy();
  const siteName = getSiteName(siteCopy.siteIdentity);

  return (
    <div className="flex flex-1 flex-col">
      <FloatingWhatsApp phone={phone} />
      <AccessibilityWidget />
      <StickyLeadButton phone={phone} />
      <CookieBanner />
      <SiteHeader
        logoUrl={images["site-logo"]}
        isStaff={Boolean(staffSession)}
        isClient={Boolean(clientSession)}
        logoSize={logoSize}
        headerBg={theme.headerBg}
        headerText={theme.headerText}
        navLinks={siteCopy.navLinks}
        siteIdentity={siteCopy.siteIdentity}
      />
      <main className="flex flex-1 flex-col bg-white">
        <section className="bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
            <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
              <span className="gradient-gold">{siteName}</span> — {siteCopy.siteIdentity.tagline}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600">
              אנחנו מתכננים, מייצרים ומתקינים פתרונות אלומיניום — פרגולות, חלונות, שערים,
              סגירות זכוכית, חזיתות ומערכות הצללה — תחת קורת גג אחת: מהתכנון הראשוני
              ועד ההתקנה הסופית באתר. אנחנו עובדים עם בעלי בתים פרטיים ווילות יוקרה,
              בנייני מגורים, עסקים ומסעדות, מתחמים מסחריים, וכן קבלנים ויזמים בפרויקטים
              בהיקפים גדולים.
            </p>
          </div>
        </section>

        <StatsSection />

        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
              ייצור <span className="gradient-gold">משלנו</span>, מתחילתו ועד סופו
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-zinc-600">
              המערכות מיוצרות במפעל שלנו, כך שאנחנו שולטים על כל שלב — מבחירת החומרים,
              דרך דיוק הייצור, ועד לוחות הזמנים למסירה. הליווי לא נגמר בהתקנה: כל פרויקט
              מגובה באחריות מלאה וזמינות לתמיכה טכנית גם אחרי שהעבודה הושלמה.
            </p>
          </div>
        </section>

        <ProcessSteps />
        <TrustBar />
      </main>
      <SiteFooter
        logoUrl={images["footer-logo"] ?? images["site-logo"]}
        phone={phone}
        email={email}
        logoSize={footerLogoSize}
        footerBg={theme.footerBg}
        footerText={theme.footerText}
        services={siteCopy.services}
        siteIdentity={siteCopy.siteIdentity}
        social={social}
      />
    </div>
  );
}
