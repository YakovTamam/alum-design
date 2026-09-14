import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import StickyLeadButton from "../../components/StickyLeadButton";
import AccessibilityWidget from "../../components/AccessibilityWidget";
import CookieBanner from "../../components/CookieBanner";
import ProjectGalleryViewer from "../../components/ProjectGalleryViewer";
import { getSiteContentMap } from "@/lib/content";
import { getClientSession, getStaffSession } from "@/lib/auth";
import { getPortfolioItemById } from "@/lib/portfolio-data";
import { getPortfolioGallery, PORTFOLIO_CATEGORY_LABELS } from "@/lib/portfolio-types";
import { getContactInfo } from "@/lib/contact-data";
import { getLogoSize, getFooterLogoSize } from "@/lib/logo-data";
import { getSiteTheme } from "@/lib/theme-data";
import { getSiteCopy } from "@/lib/site-copy-data";
import { getSiteName } from "@/lib/site-copy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolioItemById(id);
  if (!item) return {};

  const siteCopy = await getSiteCopy();
  const siteName = getSiteName(siteCopy.siteIdentity);

  return {
    title: item.title,
    description: item.description || `${PORTFOLIO_CATEGORY_LABELS[item.category]} מתוצרת ${siteName} — ${item.title}.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPortfolioItemById(id);
  if (!item) notFound();

  const images = getPortfolioGallery(item);

  let siteImages: Awaited<ReturnType<typeof getSiteContentMap>> = {};
  try {
    siteImages = await getSiteContentMap();
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

  return (
    <div className="flex flex-1 flex-col">
      <FloatingWhatsApp phone={phone} />
      <AccessibilityWidget />
      <StickyLeadButton />
      <CookieBanner />
      <SiteHeader
        logoUrl={siteImages["site-logo"]}
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
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Link href="/projects" className="text-sm text-zinc-500 hover:text-gold">
              ← כל הפרויקטים
            </Link>

            <span className="mt-5 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              {PORTFOLIO_CATEGORY_LABELS[item.category]}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">{item.title}</h1>
            {item.description && (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{item.description}</p>
            )}

            <div className="mt-8">
              {images.length > 0 ? (
                <ProjectGalleryViewer images={images} title={item.title} />
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-sm text-zinc-400">
                  אין עדיין תמונות לפרויקט זה
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-[#f0ece5] p-6">
              <p className="text-sm text-zinc-700">רוצים פרויקט דומה בבית שלכם?</p>
              <Link
                href="/#contact"
                className="btn-gold flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-[#1a1308]"
              >
                קבלו הצעת מחיר <span aria-hidden>←</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        logoUrl={siteImages["footer-logo"] ?? siteImages["site-logo"]}
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
