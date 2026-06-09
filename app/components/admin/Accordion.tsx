"use client";

import { useState, type ReactNode } from "react";

type Props = {
  title: ReactNode;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function Accordion({ title, subtitle, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-right"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-white">{title}</span>
          {subtitle && <span className="truncate text-xs text-zinc-500">{subtitle}</span>}
        </div>
        <span
          className={`shrink-0 text-sm text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && <div className="border-t border-white/10">{children}</div>}
    </div>
  );
}
