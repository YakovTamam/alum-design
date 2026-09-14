import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import StickyLeadButton from "../components/StickyLeadButton";
import AccessibilityWidget from "../components/AccessibilityWidget";
import CookieBanner from "../components/CookieBanner";
import QuoteModalButton from "../components/QuoteModalButton";
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
    title: "שאלות נפוצות",
    description: `תשובות לשאלות נפוצות על תהליך העבודה, אחריות, זמני אספקה ותחומי הפעילות של ${siteName}.`,
  };
}

export default async function FaqPage() {
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

  const faqs = [
    {
      q: "איך מתחילים ומה כלול בייעוץ הראשוני?",
      a: `הייעוץ הראשוני אצלנו ללא עלות וללא התחייבות. אתם משאירים פרטים (בטופס באתר, בטלפון או בוואטסאפ), ומחזירים אליכם לשיחת היכרות קצרה כדי להבין את הצורך ולתת הערכה ראשונית.`,
    },
    {
      q: "איך נראה התהליך מההזמנה ועד ההתקנה?",
      a: `התהליך בנוי מ-5 שלבים: ייעוץ ראשוני, תכנון (סקיצה והתאמת הפתרון), התאמה במערכת (בחירת דגם, מידות וגוונים), ייצור במפעל שלנו, ולבסוף התקנה מקצועית באתר שלכם.`,
    },
    {
      q: "האם אתם מייצרים בעצמכם או מייבאים מוצר מוגמר?",
      a: `המערכות מיוצרות במפעל שלנו, כך שאנחנו שולטים על כל שלב — מבחירת החומרים ועד דיוק הייצור ולוחות הזמנים למסירה.`,
    },
    {
      q: "יש אחריות על המוצר ועל ההתקנה?",
      a: `כן, כל פרויקט מגובה באחריות מלאה, וזמינים לתמיכה טכנית גם לאחר שהעבודה הושלמה.`,
    },
    {
      q: "כמה זמן לוקח לקבל את המוצר המוגמר?",
      a: `זמן האספקה משתנה לפי סוג המערכת, המידות והיקף ההזמנה. נספק לכם לוח זמנים מדויק כחלק מהצעת המחיר, לפני שמתחייבים.`,
    },
    {
      q: "אילו מוצרים אתם מציעים?",
      a: `פרגולות אלומיניום, חלונות, שערים ממונעים, סגירות זכוכית, חזיתות אלומיניום למבנים, ומערכות הצללה. לכל אחד מהם יש עמוד ייעודי באתר עם פירוט נוסף.`,
    },
    {
      q: "אתם עובדים גם עם קבלנים ויזמים בהיקפים גדולים?",
      a: `כן — יש לנו מסלול ייעודי לקבלנים ויזמים עם מחירי נפח, לוחות זמנים ברורים וליווי טכני צמוד לאורך כל הפרויקט.`,
    },
    {
      q: "באילו אזורים בארץ אתם פועלים?",
      a: `אנחנו עובדים עם לקוחות פרטיים, קבלנים ועסקים בכל הארץ.`,
    },
    {
      q: "איך יוצרים איתכם קשר?",
      a: `דרך טופס יצירת הקשר באתר, בטלפון, במייל, או בוואטסאפ — כל הפרטים נמצאים בעמוד "צור קשר".`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
        <section className="bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <h1 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
              שאלות <span className="gradient-gold">נפוצות</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-7 text-zinc-500">
              לא מצאתם תשובה לשאלה שלכם? {siteName} כאן בשבילכם — פנו אלינו ישירות.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-zinc-200 px-5 py-4 open:border-gold/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-900 marker:content-none">
                    {item.q}
                    <span
                      aria-hidden
                      className="shrink-0 text-lg text-zinc-400 transition-transform group-open:rotate-45 group-open:text-gold"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-[#f0ece5] p-6 text-center">
              <p className="text-sm text-zinc-700">עדיין יש לכם שאלות? נשמח לעזור.</p>
              <QuoteModalButton className="btn-gold flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-[#1a1308]">
                לפנייה מהירה <span aria-hidden>←</span>
              </QuoteModalButton>
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
