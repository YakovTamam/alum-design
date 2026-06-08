const NAV_LINKS = [
  { label: "דף הבית", href: "#" },
  { label: "מערכות", href: "#systems" },
  { label: "פרויקטים", href: "#projects" },
  { label: "לקוחותינו", href: "#categories" },
  { label: "אודות", href: "#" },
  { label: "צור קשר", href: "#contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0b0d]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a href="#" className="flex flex-col items-start leading-none">
          <span className="text-xl font-semibold tracking-[0.2em] text-white">
            ALUM
          </span>
          <span className="text-[10px] tracking-[0.4em] text-gold">DESIGN</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-zinc-300 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
        >
          <span>צור קשר</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 5.5C3 4.67 3.67 4 4.5 4h2.6c.5 0 .94.34 1.07.83l1 3.6a1.1 1.1 0 0 1-.32 1.13l-1.4 1.25a12.5 12.5 0 0 0 5.74 5.74l1.25-1.4a1.1 1.1 0 0 1 1.13-.32l3.6 1c.5.13.83.57.83 1.07v2.6c0 .83-.67 1.5-1.5 1.5C10.6 21 3 13.4 3 5.5Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}
