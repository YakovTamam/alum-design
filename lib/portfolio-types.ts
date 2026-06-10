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

export type SerializedPortfolioItem = {
  _id: string;
  title: string;
  category: PortfolioCategory;
  description?: string;
  imageUrl?: string;
  mediaId?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};
