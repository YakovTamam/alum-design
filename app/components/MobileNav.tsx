"use client";

import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/site-copy";

export default function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="פתיחת תפריט ניווט"
        aria-expanded={open}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-end border-b border-zinc-200 px-4 py-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירת תפריט"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 overflow-y-auto px-6 py-4 text-lg">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
