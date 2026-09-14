import Image from "next/image";
import { phoneToTelHref, type SocialLinks } from "@/lib/contact";
import { logoScale } from "@/lib/logo";
import { isServicePageSlug } from "@/lib/service-pages";
import { getSiteName, type ServiceItem, type SiteIdentity } from "@/lib/site-copy";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WazeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function SiteFooter({
  logoUrl,
  phone,
  email,
  logoSize,
  footerBg,
  footerText,
  services,
  siteIdentity,
  social,
}: {
  logoUrl?: string;
  phone: string;
  email: string;
  logoSize?: string;
  footerBg?: string;
  footerText?: string;
  services: ServiceItem[];
  siteIdentity: SiteIdentity;
  social: SocialLinks;
}) {
  const scale = logoScale(logoSize ?? "100");
  const footerStyle = {
    ...(footerBg ? { backgroundColor: footerBg } : {}),
    ...(footerText ? { "--footer-text": footerText } : {}),
  } as React.CSSProperties;

  const columns: { title: string; links: { label: string; href?: string }[] }[] = [
    {
      title: "ניווט",
      links: [
        { label: "דף הבית", href: "/" },
        { label: "מערכות", href: "/#systems" },
        { label: "פרויקטים", href: "/projects" },
        { label: "אודות", href: "/about" },
      ],
    },
    {
      title: "מערכות",
      links: services.map((s) => ({
        label: s.label,
        href: isServicePageSlug(s.id) ? `/services/${s.id}` : "/#systems",
      })),
    },
    {
      title: "החברה",
      links: [
        { label: "לקוחותינו", href: "/#categories" },
        { label: "שאלות נפוצות", href: "/faq" },
        { label: "צור קשר", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-zinc-800 bg-[#1a1614]" style={footerStyle}>
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            {logoUrl ? (
              <div className="relative" style={{ width: 160 * scale, height: 48 * scale }}>
                <Image src={logoUrl} alt={getSiteName(siteIdentity)} fill sizes="160px" className="object-contain object-center" />
              </div>
            ) : (
              <div className="flex flex-col items-start leading-none">
                <span className="text-xl font-semibold tracking-[0.2em] text-[var(--footer-text,#ffffff)]">
                  {siteIdentity.namePrimary}
                </span>
                <span className="text-[10px] tracking-[0.4em] text-gold">{siteIdentity.nameSecondary}</span>
              </div>
            )}
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--footer-text,#a1a1aa)]">
              {siteIdentity.tagline} לפרויקטים מודרניים — תכנון, ייצור והתקנה
              במקום אחד.
            </p>
            {(social.instagram || social.facebook || social.waze) && (
              <div className="mt-4 flex items-center gap-3 text-[var(--footer-text,#a1a1aa)]">
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="transition-colors hover:text-gold"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="transition-colors hover:text-gold"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {social.waze && (
                  <a
                    href={social.waze}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Waze"
                    className="transition-colors hover:text-gold"
                  >
                    <WazeIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between gap-2 sm:contents">
            {columns.map((col) => (
              <div key={col.title} className="w-[30%] sm:w-auto">
                <h3 className="text-sm font-semibold text-[var(--footer-text,#ffffff)]">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--footer-text,#a1a1aa)]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a href={link.href} className="transition-colors hover:text-gold">
                          {link.label}
                        </a>
                      ) : (
                        <span>{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-sm text-[var(--footer-text,#a1a1aa)] sm:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} {getSiteName(siteIdentity)}. כל הזכויות שמורות.</span>
            <a href="/privacy" className="transition-colors hover:text-gold">מדיניות פרטיות</a>
            <a href="/accessibility" className="transition-colors hover:text-gold">הצהרת נגישות</a>
          </p>
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
