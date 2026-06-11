import Image from "next/image";
import { phoneToTelHref } from "@/lib/contact";
import { logoScale } from "@/lib/logo";
import { SITE_NAME, SITE_NAME_PRIMARY, SITE_NAME_SECONDARY, SITE_TAGLINE } from "@/lib/site";
import { SERVICES } from "@/lib/services";

const COLUMNS = [
  {
    title: "ניווט",
    links: ["דף הבית", "מערכות", "פרויקטים", "אודות"],
  },
  {
    title: "מערכות",
    links: SERVICES.map((s) => s.label),
  },
  {
    title: "החברה",
    links: ["אודותינו", "לקוחותינו", "קריירה", "צור קשר"],
  },
];

export default function SiteFooter({
  logoUrl,
  phone,
  email,
  logoSize,
  footerBg,
  footerText,
}: {
  logoUrl?: string;
  phone: string;
  email: string;
  logoSize?: string;
  footerBg?: string;
  footerText?: string;
}) {
  const scale = logoScale(logoSize ?? "100");
  const footerStyle = {
    ...(footerBg ? { backgroundColor: footerBg } : {}),
    ...(footerText ? { "--footer-text": footerText } : {}),
  } as React.CSSProperties;

  return (
    <footer className="border-t border-zinc-800 bg-[#1a1614]" style={footerStyle}>
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            {logoUrl ? (
              <div className="relative" style={{ width: 160 * scale, height: 48 * scale }}>
                <Image src={logoUrl} alt={SITE_NAME} fill sizes="160px" className="object-contain object-right" />
              </div>
            ) : (
              <div className="flex flex-col items-start leading-none">
                <span className="text-xl font-semibold tracking-[0.2em] text-[var(--footer-text,#ffffff)]">
                  {SITE_NAME_PRIMARY}
                </span>
                <span className="text-[10px] tracking-[0.4em] text-gold">{SITE_NAME_SECONDARY}</span>
              </div>
            )}
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--footer-text,#a1a1aa)]">
              {SITE_TAGLINE} לפרויקטים מודרניים — תכנון, ייצור והתקנה
              במקום אחד.
            </p>
          </div>

          <div className="flex justify-between gap-2 sm:contents">
            {COLUMNS.map((col) => (
              <div key={col.title} className="w-[30%] sm:w-auto">
                <h3 className="text-sm font-semibold text-[var(--footer-text,#ffffff)]">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--footer-text,#a1a1aa)]">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="transition-colors hover:text-gold">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-sm text-[var(--footer-text,#a1a1aa)] sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. כל הזכויות שמורות.</p>
          <div className="flex items-center gap-6">
            <a href={phoneToTelHref(phone)} className="flex items-center gap-2 transition-colors hover:text-gold">
              <span aria-hidden>☎</span> {phone}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 transition-colors hover:text-gold">
              <span aria-hidden>✉</span> {email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
