"use client";

import { motion } from "motion/react";
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
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8 12 4l9 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 8v11M20 8v11M8 8v11M16 8v11M12 8v11" strokeLinecap="round" />
        <path d="M3 8h18" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "window") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M12 4v16M4 12h16" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 21V8l8-4 8 4v13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 21h16M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const fly = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay },
});

function PlannerCard() {
  return (
    <div className="w-full rounded-2xl border border-white/[0.12] bg-white/[0.06] p-5 shadow-2xl shadow-black/50 backdrop-blur-md lg:p-6">
      <h2 className="text-sm font-semibold text-white lg:text-base">
        התחל לתכנן את הפרויקט שלך
      </h2>

      <div className="mt-4">
        <p className="mb-2 text-xs text-zinc-400">בחרי סוג פרופיל</p>
        <div className="grid grid-cols-3 gap-2 lg:gap-3">
          {PROFILE_TYPES.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition-colors lg:gap-2 lg:px-3 lg:py-4 ${
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

      <div className="mt-4 grid grid-cols-2 gap-3 lg:mt-6 lg:gap-4">
        <div>
          <p className="mb-1.5 text-xs text-zinc-400">רוחב (ס&quot;מ)</p>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200">
            <span>300</span><span className="text-zinc-500">▾</span>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-zinc-400">גובה (ס&quot;מ)</p>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200">
            <span>300</span><span className="text-zinc-500">▾</span>
          </div>
        </div>
      </div>

      <div className="mt-4 lg:mt-6">
        <p className="mb-2 text-xs text-zinc-400">צבע</p>
        <div className="flex items-center gap-2.5">
          {COLORS.map((c, i) => (
            <button
              key={c}
              type="button"
              aria-label={`צבע ${i + 1}`}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 lg:h-7 lg:w-7 ${i === 3 ? "border-gold" : "border-white/20"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <a
        href="#configurator"
        className="btn-gold mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-[#1a1308] lg:mt-7"
      >
        קבלי הצעת מחיר ראשונית
        <span aria-hidden>←</span>
      </a>
    </div>
  );
}

export default function Hero({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Radial glow — desktop only, hidden on mobile where image provides visual */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
        <div className="absolute -top-20 left-1/4 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[130px]" />
        <div className="absolute top-1/2 left-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold/[0.05] blur-[100px]" />
      </div>

      {/* ── MOBILE layout: full-bleed image with text overlay ── */}
      <div className="lg:hidden">
        {/* Image fills ~80% of viewport height */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[78svh] overflow-hidden"
        >
          {/* Wrapper takes absolute fill; PhotoPlaceholder fills it naturally */}
          <div className="absolute inset-0">
            <PhotoPlaceholder
              label="וילה מודרנית עם פרגולת אלומיניום | ALUM DESIGN"
              imageUrl={imageUrl}
              className="h-full w-full"
            />
          </div>

          {/* Light top vignette so image blends with header */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
          {/* Main gradient behind text — covers bottom 60% */}
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/75 via-black/55 to-transparent" />

          {/* Text overlay — sits at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
            <motion.p {...fly(0.15)} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/80">
              ALUM DESIGN — פתרונות מקצועיים
            </motion.p>
            <motion.h1 {...fly(0.25)} className="text-[2.6rem] font-extrabold leading-[1.1] text-white">
              פתרונות{" "}
              <span className="gradient-gold">אלומיניום</span>
              <br />
              <span className="gradient-gold">חכמים</span>
            </motion.h1>
            <motion.p {...fly(0.35)} className="mt-2 text-lg font-light text-zinc-200">
              לפרויקטים מודרניים
            </motion.p>
            <motion.p {...fly(0.45)} className="mt-3 text-sm leading-6 text-zinc-300/80">
              תכנון, התאמה והצעת מחיר תוך דקות — הכל במקום אחד.
            </motion.p>
            <motion.a
              {...fly(0.55)}
              href="#configurator"
              className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-[#1a1308]"
            >
              קבל הצעת מחיר
              <span aria-hidden>←</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Planner card — below image on mobile */}
        <motion.div {...fly(0.6)} className="px-5 pb-10 pt-6">
          <PlannerCard />
        </motion.div>
      </div>

      {/* ── DESKTOP layout: two-column grid ── */}
      <div className="relative mx-auto hidden max-w-7xl grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-10 px-10 py-28 lg:grid">
        {/* Text + planner card */}
        <div className="flex flex-col gap-10">
          <div>
            <motion.p {...fly(0.1)} className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">
              ALUM DESIGN — פתרונות מקצועיים
            </motion.p>
            <motion.h1 {...fly(0.2)} className="text-7xl font-extrabold leading-[1.1] text-white">
              פתרונות{" "}
              <span className="gradient-gold">אלומיניום</span>
              <br />
              <span className="gradient-gold">חכמים</span>
            </motion.h1>
            <motion.p {...fly(0.3)} className="mt-4 text-2xl font-light text-zinc-300">
              לפרויקטים מודרניים
            </motion.p>
            <motion.p {...fly(0.4)} className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
              תכנון, התאמה והצעת מחיר תוך דקות — הכל במקום אחד. ALUM DESIGN
              מלווה אתכם משלב הרעיון ועד ההתקנה הסופית.
            </motion.p>
          </div>
          <motion.div {...fly(0.5)}>
            <PlannerCard />
          </motion.div>
        </div>

        {/* Desktop image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <PhotoPlaceholder
            label="וילה מודרנית עם פרגולת אלומיניום | ALUM DESIGN"
            imageUrl={imageUrl}
            className="aspect-[4/5] w-full rounded-3xl border border-white/10 shadow-2xl shadow-black/50"
          />
        </motion.div>
      </div>
    </section>
  );
}
