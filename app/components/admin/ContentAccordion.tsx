"use client";

import { useState, type ReactNode } from "react";

type Section = {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
};

export default function ContentAccordion({ sections }: { sections: Section[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => {
        const open = openId === section.id;
        return (
          <div
            key={section.id}
            className={`overflow-hidden rounded-2xl border bg-panel/40 transition-colors ${
              open ? "border-gold/30" : "border-white/10"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : section.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right transition-colors hover:bg-white/[0.03]"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                    open ? "border-gold bg-gold/10 text-gold" : "border-white/15 text-zinc-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{section.title}</span>
                  <span className="mt-0.5 block text-xs text-zinc-500">{section.description}</span>
                </span>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`shrink-0 text-zinc-500 transition-transform duration-300 ${
                  open ? "rotate-180 text-gold" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-white/5 p-5">{section.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
