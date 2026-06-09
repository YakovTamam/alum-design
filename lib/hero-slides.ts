import { getDb } from "./mongodb";

export const HERO_SLIDES_COLLECTION = "hero_slides";

export const TITLE_SIZES = ["sm", "md", "lg", "xl"] as const;
export const SUBTITLE_SIZES = ["sm", "md", "lg"] as const;
export const OVERLAY_DIRECTIONS = ["bottom", "top", "left", "right", "full", "none"] as const;
export type TitleSize = (typeof TITLE_SIZES)[number];
export type SubtitleSize = (typeof SUBTITLE_SIZES)[number];
export type OverlayDirection = (typeof OVERLAY_DIRECTIONS)[number];

export type HeroSlide = {
  _id: number; // 1, 2, 3
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
  mediaId?: string;
  mediaType?: "image" | "video";
  duration: number; // seconds
  titleSize?: TitleSize;
  titleColor?: string;
  subtitleSize?: SubtitleSize;
  subtitleColor?: string;
  overlayDirection?: OverlayDirection;
  overlayIntensity?: number;
  updatedAt: Date;
};

export type SerializedHeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
  mediaId?: string;
  mediaType?: "image" | "video";
  duration: number;
  titleSize?: TitleSize;
  titleColor?: string;
  subtitleSize?: SubtitleSize;
  subtitleColor?: string;
  overlayDirection?: OverlayDirection;
  overlayIntensity?: number;
  updatedAt: string;
};

export const DEFAULT_SLIDES: Array<Omit<HeroSlide, "updatedAt">> = [
  {
    _id: 1,
    title: "הספק שקבלנים מסתמכים עליו",
    subtitle: "פרגולות, חלונות, שערים וסגירות זכוכית — בהיקפים גדולים ואיכות פרימיום",
    ctaText: "השאר פרטים לפרויקט",
    ctaLink: "#contractor",
    duration: 6,
  },
  {
    _id: 2,
    title: "פרגולות אלומיניום יוקרתיות",
    subtitle: "תכנון מותאם אישית, ייצור מדויק והתקנה מקצועית בכל הארץ",
    ctaText: "צפה בפרויקטים",
    ctaLink: "#categories",
    duration: 6,
  },
  {
    _id: 3,
    title: "ליווי מקצועי מהתכנון ועד ההתקנה",
    subtitle: "נציג ייעודי לכל פרויקט — מהסקיצה הראשונה ועד מסירת המפתח",
    ctaText: "צור קשר",
    ctaLink: "#contact",
    duration: 6,
  },
];

export function serializeHeroSlide(slide: HeroSlide): SerializedHeroSlide {
  const { _id, updatedAt, ...rest } = slide;
  return { ...rest, id: _id, updatedAt: updatedAt.toISOString(), mediaType: slide.mediaType };
}

export async function getHeroSlides(): Promise<SerializedHeroSlide[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<HeroSlide>(HERO_SLIDES_COLLECTION)
      .find({})
      .sort({ _id: 1 })
      .toArray();

    return DEFAULT_SLIDES.map((def) => {
      const dbSlide = docs.find((d) => d._id === def._id);
      if (dbSlide) return serializeHeroSlide(dbSlide);
      return {
        id: def._id,
        title: def.title,
        subtitle: def.subtitle,
        ctaText: def.ctaText,
        ctaLink: def.ctaLink,
        duration: def.duration,
        updatedAt: new Date(0).toISOString(),
      };
    });
  } catch {
    return DEFAULT_SLIDES.map((def) => ({
      id: def._id,
      title: def.title,
      subtitle: def.subtitle,
      ctaText: def.ctaText,
      ctaLink: def.ctaLink,
      duration: def.duration,
      updatedAt: new Date(0).toISOString(),
    }));
  }
}
