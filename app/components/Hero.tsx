"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import PhotoPlaceholder from "./PhotoPlaceholder";
import type { SerializedHeroSlide } from "@/lib/hero-slides";

const STATS = [
  { value: "500+", label: "פרויקטים הושלמו" },
  { value: "15+", label: "שנות ניסיון" },
  { value: "200+", label: "קבלנים פעילים" },
];

export default function Hero({ slides }: { slides: SerializedHeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedProgressRef = useRef(0);
  const swipeStartX = useRef<number | null>(null);

  const duration = slides[current]?.duration ?? 6;
  const count = slides.length;

  // Auto-advance timer — restarts when current slide or paused state changes
  useEffect(() => {
    if (paused) return;
    const durationMs = duration * 1000;
    const startElapsed = (pausedProgressRef.current / 100) * durationMs;
    const startTime = Date.now() - startElapsed;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= durationMs) {
        clearInterval(interval);
        pausedProgressRef.current = 0;
        setCurrent((c) => (c + 1) % count);
      } else {
        const p = (elapsed / durationMs) * 100;
        pausedProgressRef.current = p;
        setProgress(p);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [current, duration, count, paused]);

  function goTo(i: number) {
    if (i === current) return;
    pausedProgressRef.current = 0;
    setProgress(0);
    setCurrent(i);
  }

  function handlePointerDown(e: React.PointerEvent) {
    swipeStartX.current = e.clientX;
    setPaused(true);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (swipeStartX.current !== null) {
      const delta = e.clientX - swipeStartX.current;
      if (Math.abs(delta) > 50) {
        pausedProgressRef.current = 0;
        setProgress(0);
        if (delta > 0) {
          setCurrent((c) => (c + 1) % count);
        } else {
          setCurrent((c) => (c - 1 + count) % count);
        }
      }
      swipeStartX.current = null;
    }
    setPaused(false);
  }

  function handlePointerLeave() {
    swipeStartX.current = null;
    setPaused(false);
  }

  const slide = slides[current];

  return (
    <section
      className="relative h-[85vh] min-h-[500px] select-none overflow-hidden cursor-grab active:cursor-grabbing lg:h-screen"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >

      {/* ── Slide backgrounds — all rendered, crossfade via CSS opacity ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          {s.imageUrl ? (
            <Image
              src={s.imageUrl}
              alt={s.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0">
              <PhotoPlaceholder label={s.title} className="h-full w-full" />
            </div>
          )}
        </div>
      ))}

      {/* Persistent dark overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />

      {/* ── Slide text — AnimatePresence for enter/exit animation ── */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 lg:justify-center lg:px-16 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold/80">
              ALUM DESIGN — פתרונות מקצועיים
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-[3.8rem] xl:text-[4.5rem]">
              {slide?.title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-200/80 lg:text-lg">
              {slide?.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={slide?.ctaLink}
                className="btn-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-[#1a1308] shadow-lg shadow-gold/20"
              >
                {slide?.ctaText} <span aria-hidden>←</span>
              </a>
              <a
                href="tel:0729444444"
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.85-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.72 16z" />
                </svg>
                072-3944444
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats row — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 hidden items-center gap-10 lg:flex"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Slide number indicator (top-right) ── */}
      <div className="absolute left-6 top-6 z-20 hidden items-center gap-2 text-xs font-medium text-white/50 lg:flex">
        <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
        <span className="h-px w-6 bg-white/30" />
        <span>{String(count).padStart(2, "0")}</span>
      </div>

      {/* ── Dot navigation ── */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`שקופית ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-gold" : "w-2 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* ── Gold progress bar ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/[0.07]">
        <div
          className="h-full bg-gold"
          style={{ width: `${progress}%`, transition: "width 80ms linear" }}
        />
      </div>
    </section>
  );
}
