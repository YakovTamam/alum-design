import { getDb } from "./mongodb";
import {
  HERO_SLIDES_COLLECTION,
  DEFAULT_SLIDES,
  serializeHeroSlide,
  type HeroSlide,
  type SerializedHeroSlide,
} from "./hero-slides";

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
