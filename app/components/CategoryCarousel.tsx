"use client";

import { useRef, useEffect, useCallback } from "react";
import PhotoPlaceholder from "./PhotoPlaceholder";
import type { ContentSlotKey } from "@/lib/content";

const CATEGORIES = [
  {
    title: "וילות יוקרה",
    desc: "פרויקטי בית יוקרתיים בהתאמה אישית מלאה",
    variant: "warm" as const,
    slot: "category-luxury-villas" as ContentSlotKey,
  },
  {
    title: "בנייני מגורים",
    desc: "פתרונות אלומיניום מתקדמים לבנייה רוויה",
    variant: "cool" as const,
    slot: "category-residential" as ContentSlotKey,
  },
  {
    title: "עסקים ומסעדות",
    desc: "חזיתות, פרגולות ופרטיזיציה מקצועית",
    variant: "warm" as const,
    slot: "category-business" as ContentSlotKey,
  },
  {
    title: "מתחמים מסחריים",
    desc: "פתרונות אלומיניום למרכזים מסחריים",
    variant: "cool" as const,
    slot: "category-commercial" as ContentSlotKey,
  },
];

// Triple-duplicate: [copy][original][copy] — start at original, loop infinitely
const TRACK = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];
const N = CATEGORIES.length; // 4

type Props = { images?: Partial<Record<ContentSlotKey, string>> };

export default function CategoryCarousel({ images = {} }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getStep = (): number => {
    const el = scrollRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!card) return 0;
    return card.offsetWidth + 16; // card width + gap-4 (16px)
  };

  const jumpTo = useCallback((index: number) => {
    const el = scrollRef.current;
    const step = getStep();
    if (!el || !step) return;
    // RTL: scrollLeft is 0 at right (index 0), increasingly negative going left
    el.scrollTo({ left: -(index * step), behavior: "instant" });
  }, []);

  // On mount: position at the center copy (index N) so there's room to swipe both ways
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => jumpTo(N)));
  }, [jumpTo]);

  // After each swipe settles, teleport from a clone back to the equivalent original
  const checkLoop = useCallback(() => {
    const el = scrollRef.current;
    const step = getStep();
    if (!el || !step) return;
    const idx = Math.round(Math.abs(el.scrollLeft) / step);
    if (idx < N) {
      jumpTo(idx + N); // entered right clone → jump to center copy
    } else if (idx >= N * 2) {
      jumpTo(idx - N); // entered left clone → jump to center copy
    }
  }, [jumpTo]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // scrollend fires once snap settles; fall back to debounced scroll
    const supportsScrollEnd = "onscrollend" in window;
    if (supportsScrollEnd) {
      el.addEventListener("scrollend", checkLoop);
      return () => el.removeEventListener("scrollend", checkLoop);
    }
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(checkLoop, 150);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [checkLoop]);

  return (
    <div
      ref={scrollRef}
      className="carousel-snap flex gap-4 overflow-x-auto snap-x snap-mandatory ps-4 pe-4 scroll-ps-4 lg:ps-10 lg:pe-10 lg:scroll-ps-10"
    >
      {TRACK.map((c, i) => (
        <a
          key={i}
          href="#projects"
          className="group snap-start shrink-0 w-[75vw] sm:w-[44vw] lg:w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/80 backdrop-blur-md transition-all hover:border-gold/50 hover:shadow-gold/10"
        >
          <PhotoPlaceholder
            label={c.title}
            variant={c.variant}
            imageUrl={images[c.slot]}
            className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="flex items-center justify-between gap-3 p-5">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">{c.title}</h3>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{c.desc}</p>
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform group-hover:-translate-x-1">
              ←
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
