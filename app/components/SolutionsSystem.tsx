const SOLUTIONS = [
  { label: "פרגולות", desc: "פתרונות צל מודרניים ומעוצבים", icon: "pergola" },
  { label: "חלונות", desc: "חלונות אלומיניום לכל פתח ומידה", icon: "window" },
  { label: "שערים", desc: "שערי כניסה ממונעים ובטיחותיים", icon: "gate" },
  { label: "סגירות זכוכית", desc: "מערכות אלומיניום עם זכוכית להגדלים", icon: "glass" },
  { label: "חזיתות", desc: "חזיתות אלומיניום מודרניות למבנים", icon: "facade" },
  { label: "הצללות", desc: "מערכות הצללה אלגנטיות ומתקדמות", icon: "shade" },
] as const;

function SolutionIcon({ kind }: { kind: (typeof SOLUTIONS)[number]["icon"] }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 };
  switch (kind) {
    case "pergola":
      return (
        <svg {...common}>
          <path d="M3 8 12 4l9 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 8v11M20 8v11M8 8v11M16 8v11M12 8v11" strokeLinecap="round" />
          <path d="M3 8h18" strokeLinecap="round" />
        </svg>
      );
    case "window":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M12 4v16M4 12h16" />
        </svg>
      );
    case "gate":
      return (
        <svg {...common}>
          <path d="M4 21V8l8-4 8 4v13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 21h16M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "glass":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M9 3v18M15 3v18" />
        </svg>
      );
    case "facade":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M4 8h16M4 12h16M4 16h16" />
        </svg>
      );
  }
}

export default function SolutionsSystem() {
  return (
    <section id="systems" className="border-y border-white/5 bg-panel/30">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          מערכת פתרונות{" "}
          <span className="text-gold">אלומיניום</span> מתקדמים
        </h2>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute top-9 right-0 left-0 hidden h-px bg-[repeating-linear-gradient(to_left,rgba(207,161,92,0.5)_0_8px,transparent_8px_16px)] lg:block"
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {SOLUTIONS.map((s) => (
              <div key={s.label} className="relative flex flex-col items-center text-center">
                <span className="z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/10 bg-panel text-gold shadow-lg shadow-black/30">
                  <SolutionIcon kind={s.icon} />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-white">{s.label}</h3>
                <p className="mt-1 max-w-[11rem] text-xs leading-5 text-zinc-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-sm leading-7 text-zinc-400">
          כל המערכות מתחברות לחוויה אחת מושלמת — מהבחירה הראשונית ועד ההתקנה
          הסופית, בליווי צמוד של צוות ALUM DESIGN.
        </p>
      </div>
    </section>
  );
}
