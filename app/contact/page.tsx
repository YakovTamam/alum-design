import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import StickyLeadButton from "../components/StickyLeadButton";
import AccessibilityWidget from "../components/AccessibilityWidget";
import CookieBanner from "../components/CookieBanner";
import ContactSection from "../components/ContactSection";
import { phoneToTelHref } from "@/lib/contact";
import { whatsAppLink } from "@/lib/email-templates";
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
    title: "צור קשר",
    description: `צרו קשר עם ${siteName} — טלפון, אימייל, וואטסאפ או השאירו פרטים ונחזור אליכם עם ייעוץ ראשוני ללא עלות.`,
  };
}

export default async function ContactPage() {
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
      <StickyLeadButton />
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
        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
            <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
              בואו <span className="gradient-gold">נדבר</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500">
              יש לכם שאלה, בקשה להצעת מחיר, או פרויקט שאתם עדיין רק חושבים עליו?
              {siteName} עובד עם לקוחות פרטיים, קבלנים ועסקים בכל הארץ — השאירו
              פרטים בטופס למטה, או פנו אלינו ישירות באחת מהדרכים הבאות.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-3">
              <a
                href={phoneToTelHref(phone)}
                className="flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm text-zinc-700 transition-colors hover:border-gold/60 hover:text-zinc-900"
              >
                <span aria-hidden>☎</span> {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm text-zinc-700 transition-colors hover:border-gold/60 hover:text-zinc-900"
              >
                <span aria-hidden>✉</span> {email}
              </a>
              <a
                href={whatsAppLink(phone, "היי, אני מעוניין לשמוע עוד פרטים")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#25d366]/40 bg-[#25d366]/10 px-5 py-2.5 text-sm text-[#1a7d43] transition-colors hover:border-[#25d366]/70"
              >
                <span aria-hidden>💬</span> וואטסאפ
              </a>
            </div>
          </div>
        </section>

        <ContactSection phone={phone} email={email} />
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
