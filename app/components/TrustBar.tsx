const BADGES = [
  { label: "אחריות מלאה", icon: "shield" },
  { label: "ייעוץ ללא עלות", icon: "spark" },
  { label: "תמיכה טכנית", icon: "gear" },
  { label: "אספקה מהירה", icon: "clock" },
] as const;

function BadgeIcon({ kind }: { kind: (typeof BADGES)[number]["icon"] }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6 };
  switch (kind) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M5 5l2.5 2.5M16.5 16.5 19 19M3 12h4M17 12h4M5 19l2.5-2.5M16.5 7.5 19 5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2 12h2.2M19.8 12H22M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-panel/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#configurator"
            className="btn-gold flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#1a1308]"
          >
            <span aria-hidden>←</span>
            קבל הצעת מחיר
          </a>
          <a
            href="#projects"
            className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-zinc-200 transition-colors hover:border-white/40 hover:text-white"
          >
            <span aria-hidden>↻</span>
            צפה בתוכניות
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm text-zinc-200 sm:flex sm:flex-wrap sm:items-center sm:gap-8">
          {BADGES.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08] text-gold">
                <BadgeIcon kind={b.icon} />
              </span>
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
