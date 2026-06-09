const STEPS = [
  { label: "ייעוץ ראשוני", desc: "שיחת היכרות והבנת הצרכים שלך", icon: "headset" },
  { label: "תכנון", desc: "סקיצה ראשונית והתאמת הפתרון", icon: "ruler" },
  { label: "התאמה במערכת", desc: "בחירת דגם, מידות וגוונים", icon: "monitor" },
  { label: "ייצור", desc: "ייצור מדויק במפעל שלנו", icon: "factory" },
  { label: "התקנה", desc: "התקנה מקצועית באתר שלך", icon: "tools" },
] as const;

function StepIcon({ kind }: { kind: (typeof STEPS)[number]["icon"] }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6 };
  switch (kind) {
    case "headset":
      return (
        <svg {...common}>
          <path d="M4 13a8 8 0 0 1 16 0" strokeLinecap="round" />
          <rect x="3" y="13" width="4" height="6" rx="1.5" />
          <rect x="17" y="13" width="4" height="6" rx="1.5" />
          <path d="M19 19v1a2 2 0 0 1-2 2h-3" strokeLinecap="round" />
        </svg>
      );
    case "ruler":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(-20 12 12)" />
          <path d="M8.5 9.5 10 11.5M11.5 8 13 10M14.5 6.5 16 8.5" strokeLinecap="round" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="13" rx="1.5" />
          <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        </svg>
      );
    case "factory":
      return (
        <svg {...common}>
          <path d="M4 21V11l4 2.5V11l4 2.5V11l4 2.5V21" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M4 21h16M16 8V6h2v2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="m14 7 3 3-8 8H6v-3l8-8Z" strokeLinejoin="round" />
          <path d="m14 7 1.5-1.5a1.5 1.5 0 0 1 2 0l.5.5a1.5 1.5 0 0 1 0 2L16.5 9.5" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default function ProcessSteps() {
  return (
    <section className="border-y border-white/5 bg-[#0e0e11]">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          מתכנון ועד התקנה —{" "}
          <span className="gradient-gold">בצורה פשוטה וברורה</span>
        </h2>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute top-7 right-[8%] left-[8%] hidden h-px bg-[repeating-linear-gradient(to_left,rgba(207,161,92,0.4)_0_8px,transparent_8px_16px)] sm:block"
          />
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-5 sm:gap-x-4">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <span className="z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-panel/80 text-gold shadow-lg shadow-black/30 backdrop-blur-sm">
                  <StepIcon kind={s.icon} />
                </span>
                <span className="mt-3 text-xs font-semibold text-gold/80">שלב {i + 1}</span>
                <h3 className="mt-1 text-sm font-semibold text-white">{s.label}</h3>
                <p className="mt-1 max-w-[10rem] text-xs leading-5 text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
