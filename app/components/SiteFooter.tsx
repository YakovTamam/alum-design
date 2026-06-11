import Image from "next/image";
import { phoneToTelHref } from "@/lib/contact";

const COLUMNS = [
  {
    title: "ניווט",
    links: ["דף הבית", "מערכות", "פרויקטים", "אודות"],
  },
  {
    title: "מערכות",
    links: ["פרגולות", "חלונות", "שערים", "סגירות זכוכית"],
  },
  {
    title: "החברה",
    links: ["אודותינו", "לקוחותינו", "קריירה", "צור קשר"],
  },
];

export default function SiteFooter({ logoUrl, phone, email }: { logoUrl?: string; phone: string; email: string }) {
  return (
    <footer className="border-t border-zinc-800 bg-[#1a1614]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            {logoUrl ? (
              <div className="relative h-12 w-40">
                <Image src={logoUrl} alt="ALUM DESIGN" fill sizes="160px" className="object-contain object-right" />
              </div>
            ) : (
              <div className="flex flex-col items-start leading-none">
                <span className="text-xl font-semibold tracking-[0.2em] text-white">
                  ALUM
                </span>
                <span className="text-[10px] tracking-[0.4em] text-gold">DESIGN</span>
              </div>
            )}
            <p className="mt-4 max-w-xs text-sm leading-7 text-zinc-400">
              פתרונות אלומיניום חכמים לפרויקטים מודרניים — תכנון, ייצור והתקנה
              במקום אחד.
            </p>
          </div>

          <div className="flex justify-between gap-2 sm:contents">
            {COLUMNS.map((col) => (
              <div key={col.title} className="w-[30%] sm:w-auto">
                <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-sm text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} ALUM DESIGN. כל הזכויות שמורות.</p>
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
