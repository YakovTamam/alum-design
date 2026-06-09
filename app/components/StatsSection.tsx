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
    <section className="border-b border-white/10 bg-[#0e0e11] py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.12] bg-white/[0.05] px-4 py-10 text-center shadow-lg shadow-black/30 backdrop-blur-sm"
            >
              <div className="h-px w-10 rounded-full bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
              <p className="stat-number text-5xl font-extrabold tabular-nums">
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm font-medium text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
