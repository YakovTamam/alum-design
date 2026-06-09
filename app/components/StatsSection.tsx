"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 15, suffix: "+", label: "שנות ניסיון" },
  { value: 500, suffix: "+", label: "פרויקטים הושלמו" },
  { value: 98, suffix: "%", label: "שביעות רצון לקוחות" },
  { value: 3, suffix: "", label: "ימי תגובה ממוצעים" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          function step(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          }
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="border-b border-zinc-200 bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-7 text-center shadow-lg shadow-zinc-200 backdrop-blur-sm lg:gap-4 lg:px-4 lg:py-10"
            >
              <div className="h-px w-8 rounded-full bg-gradient-to-r from-transparent via-gold/70 to-transparent lg:w-10" />
              <p className="stat-number text-4xl font-extrabold tabular-nums lg:text-5xl">
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs font-medium text-zinc-500 lg:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
