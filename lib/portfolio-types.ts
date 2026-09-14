export const PORTFOLIO_CATEGORIES = ["pergola", "window", "gate", "glass", "facade", "shade"] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  pergola: "פרגולות",
  window: "חלונות",
  gate: "שערים",
  glass: "סגירות זכוכית",
  facade: "חזיתות",
  shade: "הצללות",
};

export type PortfolioImage = { url: string; mediaId?: string };

export type SerializedPortfolioItem = {
  _id: string;
  title: string;
  category: PortfolioCategory;
  description?: string;
  imageUrl?: string;
  mediaId?: string;
  images?: PortfolioImage[];
  order: number;
  createdAt: string;
  updatedAt: string;
};

// All images for a project's gallery/lightbox: the cover image first (if
// set), followed by any additional gallery images, de-duplicated by URL.
export function getPortfolioGallery(item: Pick<SerializedPortfolioItem, "imageUrl" | "images">): string[] {
  const urls = [item.imageUrl, ...(item.images?.map((i) => i.url) ?? [])].filter(
    (u): u is string => Boolean(u),
  );
  return Array.from(new Set(urls));
}
