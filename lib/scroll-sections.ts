export const SCROLL_SECTIONS_COLLECTION = "scroll_sections";

export const ANIM_TYPES = ["fade", "slide-up", "slide-down", "slide-left", "slide-right", "zoom"] as const;
export type AnimationType = (typeof ANIM_TYPES)[number];

export const FONT_SIZES = ["sm", "md", "lg", "xl", "2xl"] as const;
export type FontSize = (typeof FONT_SIZES)[number];

export const FONT_FAMILIES = ["heebo", "rubik", "frank-ruhl", "suez-one"] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

export const FONT_FAMILY_LABELS: Record<FontFamily, string> = {
  heebo: "Heebo (ברירת מחדל)",
  rubik: "Rubik",
  "frank-ruhl": "Frank Ruhl Libre",
  "suez-one": "Suez One",
};

export const FONT_FAMILY_CSS: Record<FontFamily, string> = {
  heebo: "var(--font-heebo)",
  rubik: "var(--font-rubik)",
  "frank-ruhl": "var(--font-frank-ruhl)",
  "suez-one": "var(--font-suez-one)",
};

export type TextOverlay = {
  id: string;
  text: string;
  x: number;         // 0–100 (% of width)
  y: number;         // 0–100 (% of height)
  enterAt: number;   // scroll % (0–100) when enter starts
  enterDuration: number; // scroll % span of enter transition
  exitAt: number;    // scroll % when exit starts
  exitDuration: number;  // scroll % span of exit transition
  enterAnim: AnimationType;
  exitAnim: AnimationType;
  fontSize: FontSize;
  fontFamily: FontFamily;
  color: string;     // hex
  fontWeight: "normal" | "bold";
  align: "start" | "center" | "end";
};

export type ScrollSection = {
  _id: "main";
  videoUrl?: string;
  mediaId?: string;
  sectionHeight: number; // vh units, e.g. 400
  overlays: TextOverlay[];
  updatedAt: Date;
};

export type SerializedScrollSection = Omit<ScrollSection, "_id" | "updatedAt"> & {
  updatedAt: string;
};

export const DEFAULT_SCROLL_SECTION: SerializedScrollSection = {
  sectionHeight: 400,
  overlays: [],
  updatedAt: new Date(0).toISOString(),
};

export function serializeScrollSection(s: ScrollSection): SerializedScrollSection {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = s;
  return {
    ...rest,
    overlays: rest.overlays.map((o) => ({ ...o, fontFamily: o.fontFamily ?? "heebo" })),
    updatedAt: s.updatedAt.toISOString(),
  };
}
