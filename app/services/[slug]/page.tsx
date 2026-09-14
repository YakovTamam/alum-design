import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import StickyLeadButton from "../../components/StickyLeadButton";
import AccessibilityWidget from "../../components/AccessibilityWidget";
import CookieBanner from "../../components/CookieBanner";
import QuoteModalButton from "../../components/QuoteModalButton";
import { ServiceIconSvg } from "@/lib/services";
import { SERVICE_PAGES, SERVICE_PAGE_SLUGS, isServicePageSlug } from "@/lib/service-pages";
import { PORTFOLIO_CATEGORY_LABELS } from "@/lib/portfolio-types";
import { getSiteContentMap } from "@/lib/content";
import { getClientSession, getStaffSession } from "@/lib/auth";
import { getContactInfo } from "@/lib/contact-data";
import { getLogoSize, getFooterLogoSize } from "@/lib/logo-data";
import { getSiteTheme } from "@/lib/theme-data";
import { getSiteCopy } from "@/lib/site-copy-data";
import { getSiteName } from "@/lib/site-copy";

export function generateStaticParams() {
  return SERVICE_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isServicePageSlug(slug)) return {};

  const content = SERVICE_PAGES[slug];
  const siteCopy = await getSiteCopy();
  const siteName = getSiteName(siteCopy.siteIdentity);

  return {
    title: content.title,
    description: `${content.metaDescription} — ${siteName}.`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isServicePageSlug(slug)) notFound();

  const content = SERVICE_PAGES[slug];

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

  // Prefer the admin-editable short description for this service if one
  // exists (matched by id), falling back to the static copy otherwise.
  const liveService = siteCopy.services.find((s) => s.id === content.slug);
  const shortDesc = liveService?.desc;

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
        <section className="bg-[#f0ece5] py-14 lg:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center lg:px-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-white text-gold shadow-lg shadow-zinc-200">
              <ServiceIconSvg kind={content.icon} />
            </span>
            <h1 className="mt-5 text-3xl font-bold text-zinc-900 sm:text-4xl">{content.title}</h1>
            {shortDesc && <p className="mt-3 text-sm font-medium text-gold">{shortDesc}</p>}
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">{content.intro}</p>
            <QuoteModalButton className="btn-gold mt-7 flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-[#1a1308]">
              קבלו הצעת מחיר <span aria-hidden>←</span>
            </QuoteModalButton>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2 lg:px-10">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">מה כולל הפתרון</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {content.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs text-gold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">מתאים במיוחד עבור</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {content.useCases.map((u) => (
                  <li key={u} className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs text-gold">←</span>
                    {u}
                  </li>
                ))}
              </ul>

              <a
                href={`/projects?category=${content.portfolioCategory}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm text-zinc-700 transition-colors hover:border-gold/60 hover:text-zinc-900"
              >
                ראו פרויקטים שביצענו בתחום {PORTFOLIO_CATEGORY_LABELS[content.portfolioCategory]}
                <span aria-hidden>←</span>
              </a>
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
        siteIdentity={siteCopy.siteIdentity}
        social={social}
      />
    </div>
  );
}
