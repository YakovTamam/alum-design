import Image from "next/image";

const NAV_LINKS = [
  { label: "דף הבית", href: "#" },
  { label: "מערכות", href: "#systems" },
  { label: "פרויקטים", href: "/projects" },
  { label: "לקוחותינו", href: "#categories" },
  { label: "אודות", href: "#" },
  { label: "צור קשר", href: "#contact" },
];

function AlumLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
      <rect x="2" y="2" width="28" height="28" rx="3" stroke="#cfa15c" strokeWidth="1.5" />
      <rect x="10" y="2" width="2" height="28" fill="#cfa15c" opacity="0.5" />
      <rect x="20" y="2" width="2" height="28" fill="#cfa15c" opacity="0.5" />
      <rect x="2" y="12" width="28" height="2" fill="#cfa15c" opacity="0.5" />
      <rect x="2" y="20" width="28" height="2" fill="#cfa15c" opacity="0.5" />
      <rect x="6" y="6" width="4" height="4" fill="#cfa15c" opacity="0.2" />
      <rect x="14" y="6" width="4" height="4" fill="#cfa15c" opacity="0.2" />
      <rect x="22" y="6" width="4" height="4" fill="#cfa15c" opacity="0.2" />
    </svg>
  );
}

export default function SiteHeader({ logoUrl, isStaff }: { logoUrl?: string; isStaff?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a href="#" className="flex items-center gap-3">
          {logoUrl ? (
            <div className="relative h-10 w-32 shrink-0">
              <Image src={logoUrl} alt="ALUM DESIGN" fill sizes="128px" className="object-contain object-right" />
            </div>
          ) : (
            <>
              <AlumLogo />
              <div className="flex flex-col items-start leading-none">
                <span className="text-base font-black tracking-[0.22em] text-zinc-900">
                  ALUM
                </span>
                <span className="text-[10px] font-light tracking-[0.45em] text-gold">
                  DESIGN
                </span>
              </div>
            </>
          )}
        </a>

        <nav className="hidden items-center gap-8 text-sm text-zinc-500 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-zinc-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isStaff && (
            <a
              href="/admin"
              className="flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:border-zinc-400 hover:text-zinc-900"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" strokeLinejoin="round" />
                <path d="M4 10h16M10 10v10" strokeLinecap="round" />
              </svg>
              <span>פאנל ניהול</span>
            </a>
          )}
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-full border border-gold/60 bg-gold/[0.08] px-5 py-2.5 text-sm font-medium text-gold transition-all hover:bg-gold/15 hover:border-gold/80"
          >
            <span>צור קשר</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 5.5C3 4.67 3.67 4 4.5 4h2.6c.5 0 .94.34 1.07.83l1 3.6a1.1 1.1 0 0 1-.32 1.13l-1.4 1.25a12.5 12.5 0 0 0 5.74 5.74l1.25-1.4a1.1 1.1 0 0 1 1.13-.32l3.6 1c.5.13.83.57.83 1.07v2.6c0 .83-.67 1.5-1.5 1.5C10.6 21 3 13.4 3 5.5Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
