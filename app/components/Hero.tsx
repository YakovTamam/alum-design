"use client";

import { motion } from "motion/react";
import PhotoPlaceholder from "./PhotoPlaceholder";

const STATS = [
  { value: "500+", label: "פרויקטים הושלמו" },
  { value: "15+", label: "שנות ניסיון" },
  { value: "200+", label: "קבלנים פעילים" },
];

const TAGS = ["פרגולות אלומיניום", "חלונות ודלתות", "שערים חשמליים", "סגירות זכוכית"];

const fly = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function Hero({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative overflow-hidden bg-[#f0ece5]">

      {/* ── MOBILE layout: full-bleed image + overlay ── */}
      <div className="lg:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[78svh] overflow-hidden"
        >
          <div className="absolute inset-0">
            <PhotoPlaceholder
              label="וילה מודרנית עם פרגולת אלומיניום | ALUM DESIGN"
              imageUrl={imageUrl}
              className="h-full w-full"
            />
          </div>

          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-black/85 via-black/65 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8">
            <motion.span
              {...fly(0.1)}
              className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/20 px-3 py-1 text-[10px] font-semibold tracking-widest text-gold backdrop-blur-sm"
            >
              ✦ פתרונות לקבלנים ויזמים
            </motion.span>

            <motion.h1 {...fly(0.2)} className="text-[2.4rem] font-extrabold leading-[1.1] text-white">
              הספק שקבלנים{" "}
              <span className="gradient-gold">מסתמכים עליו</span>
            </motion.h1>

            <motion.p {...fly(0.3)} className="mt-3 max-w-xs text-sm leading-6 text-zinc-200/85">
              פרגולות, חלונות, שערים וסגירות זכוכית — בהיקפים גדולים ואיכות פרימיום
            </motion.p>

            <motion.div {...fly(0.4)} className="mt-5 flex flex-wrap gap-3">
              <a
                href="#contractor"
                className="btn-gold flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#1a1308]"
              >
                השאר פרטים <span aria-hidden>←</span>
              </a>
              <a
                href="#systems"
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                המערכות שלנו
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile stats strip */}
        <motion.div
          {...fly(0.5)}
          className="flex divide-x divide-x-reverse divide-zinc-200 border-b border-zinc-200 bg-white"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 py-5 text-center">
              <p className="text-xl font-extrabold text-zinc-900">{s.value}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="relative mx-auto hidden max-w-7xl items-center gap-14 px-10 py-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:py-28">

        {/* Left: headline + CTAs + stats */}
        <div>
          <motion.span
            {...fly(0.05)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold"
          >
            ✦ שותפים מועדפים לקבלנים ויזמים
          </motion.span>

          <motion.h1
            {...fly(0.15)}
            className="mt-5 text-[3.8rem] font-extrabold leading-[1.1] text-zinc-900 xl:text-[4.5rem]"
          >
            הספק שקבלנים{" "}
            <span className="gradient-gold">מסתמכים עליו</span>
            <br />
            בפרויקטים גדולים
          </motion.h1>

          <motion.p {...fly(0.25)} className="mt-6 max-w-lg text-base leading-7 text-zinc-600">
            ALUM DESIGN מתמחה בפתרונות אלומיניום לקבלנים, יזמים ומפתחי נדל&quot;ן —
            פרגולות, חלונות, שערים וסגירות זכוכית בהיקפים גדולים, עם מחירי נפח
            וליווי מקצועי צמוד.
          </motion.p>

          <motion.div {...fly(0.35)} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contractor"
              className="btn-gold flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-[#1a1308] shadow-lg shadow-gold/20 transition-shadow hover:shadow-gold/30"
            >
              השאר פרטים לפרויקט
              <span aria-hidden>←</span>
            </a>
            <a
              href="#systems"
              className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-7 py-4 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900"
            >
              המערכות שלנו
            </a>
          </motion.div>

          {/* Product tags */}
          <motion.div {...fly(0.42)} className="mt-6 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500"
              >
                {t}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fly(0.5)}
            className="mt-10 flex items-center gap-10 border-t border-zinc-200 pt-8"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-zinc-900">{s.value}</p>
                <p className="mt-0.5 text-sm text-zinc-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: image with floating badge */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative"
        >
          <PhotoPlaceholder
            label="וילה מודרנית עם פרגולת אלומיניום | ALUM DESIGN"
            imageUrl={imageUrl}
            className="aspect-[4/5] w-full rounded-3xl border border-zinc-200 shadow-2xl shadow-zinc-300/50"
          />

          {/* Floating trust badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-6 -right-6 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-xl shadow-zinc-200/70"
          >
            <p className="text-xs font-semibold text-zinc-400">ביצועים מוכחים</p>
            <p className="mt-1 text-xl font-extrabold text-zinc-900">
              500+ <span className="text-sm font-medium text-zinc-500">פרויקטים</span>
            </p>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#cfa15c">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </motion.div>

          {/* Top-left accent badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -left-6 top-8 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-xl shadow-zinc-200/70"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-zinc-900">אחריות מלאה</p>
              <p className="text-[10px] text-zinc-500">על כל פרויקט</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
