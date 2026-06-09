import PhotoPlaceholder from "./PhotoPlaceholder";

const PROFILE_TYPES = [
  { label: "פרגולה", icon: "pergola" },
  { label: "חלונות", icon: "window" },
  { label: "שער כניסה", icon: "gate" },
] as const;

const COLORS = ["#2b2b2e", "#6b6b6f", "#a6a6a6", "#cfa15c", "#171717"];

function ProfileIcon({ kind }: { kind: (typeof PROFILE_TYPES)[number]["icon"] }) {
  if (kind === "pergola") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8 12 4l9 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 8v11M20 8v11M8 8v11M16 8v11M12 8v11" strokeLinecap="round" />
        <path d="M3 8h18" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "window") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M12 4v16M4 12h16" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 21V8l8-4 8 4v13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 21h16M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Radial glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[120px]" />
        <div className="absolute top-1/2 left-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-gold/[0.04] blur-[80px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:px-10 lg:py-28">
        {/* Text + planner card */}
        <div className="order-2 flex flex-col gap-10 lg:order-1">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">
              ALUM DESIGN — פתרונות מקצועיים
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              פתרונות{" "}
              <span className="gradient-gold">אלומיניום</span>
              <br />
              <span className="gradient-gold">חכמים</span>
            </h1>
            <p className="mt-4 text-xl font-light text-zinc-300 sm:text-2xl">
              לפרויקטים מודרניים
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
              תכנון, התאמה והצעת מחיר תוך דקות — הכל במקום אחד. ALUM DESIGN
              מלווה אתכם משלב הרעיון ועד ההתקנה הסופית.
            </p>
          </div>

          {/* Planner card — glassmorphism */}
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-md">
            <h2 className="text-base font-semibold text-white">
              התחל לתכנן את הפרויקט שלך
            </h2>

            <div className="mt-5">
              <p className="mb-3 text-xs text-zinc-400">בחרי סוג פרופיל</p>
              <div className="grid grid-cols-3 gap-3">
                {PROFILE_TYPES.map((p, i) => (
                  <button
                    key={p.label}
                    type="button"
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-xs transition-colors ${
                      i === 0
                        ? "border-gold/60 bg-gold/10 text-gold"
                        : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200"
                    }`}
                  >
                    <ProfileIcon kind={p.icon} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-xs text-zinc-400">רוחב (ס&quot;מ)</p>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200">
                  <span>300</span>
                  <span className="text-zinc-500">▾</span>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-zinc-400">גובה (ס&quot;מ)</p>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200">
                  <span>300</span>
                  <span className="text-zinc-500">▾</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs text-zinc-400">צבע</p>
              <div className="flex items-center gap-3">
                {COLORS.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`צבע ${i + 1}`}
                    className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      i === 3 ? "border-gold" : "border-white/20"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <a
              href="#configurator"
              className="btn-gold mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-[#1a1308]"
            >
              קבלי הצעת מחיר ראשונית
              <span aria-hidden>←</span>
            </a>
          </div>
        </div>

        {/* Hero image */}
        <div className="order-1 lg:order-2">
          <PhotoPlaceholder
            label="וילה מודרנית עם פרגולת אלומיניום | ALUM DESIGN"
            imageUrl={imageUrl}
            className="aspect-[4/5] w-full rounded-3xl border border-white/10 shadow-2xl shadow-black/50 sm:aspect-[16/11] lg:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  );
}
