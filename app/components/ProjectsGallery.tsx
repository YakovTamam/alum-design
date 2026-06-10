"use client";

import { useState } from "react";
import PhotoPlaceholder from "./PhotoPlaceholder";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_CATEGORY_LABELS,
  type PortfolioCategory,
  type SerializedPortfolioItem,
} from "@/lib/portfolio-types";

const WARM_CATEGORIES: ReadonlySet<PortfolioCategory> = new Set(["pergola", "gate", "facade"]);

export default function ProjectsGallery({ items }: { items: SerializedPortfolioItem[] }) {
  const [filter, setFilter] = useState<PortfolioCategory | "all">("all");

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "border-gold bg-gold text-[#1a1308]"
              : "border-zinc-300 text-zinc-600 hover:border-gold/60 hover:text-zinc-900"
          }`}
        >
          הכל
        </button>
        {PORTFOLIO_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === c
                ? "border-gold bg-gold text-[#1a1308]"
                : "border-zinc-300 text-zinc-600 hover:border-gold/60 hover:text-zinc-900"
            }`}
          >
            {PORTFOLIO_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="mt-12 text-center text-sm text-zinc-500">אין עדיין פרויקטים בקטגוריה זו.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200"
            >
              <PhotoPlaceholder
                label={PORTFOLIO_CATEGORY_LABELS[item.category]}
                variant={WARM_CATEGORIES.has(item.category) ? "warm" : "cool"}
                imageUrl={item.imageUrl}
                className="aspect-[4/3] w-full"
              />
              <div className="p-4">
                <p className="text-xs font-medium text-gold">{PORTFOLIO_CATEGORY_LABELS[item.category]}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">{item.title}</p>
                {item.description && <p className="mt-1 text-xs leading-5 text-zinc-500">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
