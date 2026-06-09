import PhotoPlaceholder from "./PhotoPlaceholder";
import ProjectCarousel from "./ProjectCarousel";
import type { ContentSlotKey } from "@/lib/content";

const CATEGORIES = [
  {
    title: "וילות יוקרה",
    desc: "פרויקטי בית יוקרתיים בהתאמה אישית מלאה",
    variant: "warm" as const,
    slot: "category-luxury-villas" as ContentSlotKey,
  },
  {
    title: "בנייני מגורים",
    desc: "פתרונות אלומיניום מתקדמים לבנייה רוויה",
    variant: "cool" as const,
    slot: "category-residential" as ContentSlotKey,
  },
  {
    title: "עסקים ומסעדות",
    desc: "חזיתות, פרגולות ופרטיזיציה מקצועית",
    variant: "warm" as const,
    slot: "category-business" as ContentSlotKey,
  },
  {
    title: "מתחמים מסחריים",
    desc: "פתרונות אלומיניום למרכזים מסחריים",
    variant: "cool" as const,
    slot: "category-commercial" as ContentSlotKey,
  },
];

type ProjectCategoriesProps = {
  images?: Partial<Record<ContentSlotKey, string>>;
};

export default function ProjectCategories({ images = {} }: ProjectCategoriesProps) {
  return (
    <section id="categories" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          כל פתרונות{" "}
          <span className="text-gold">האלומיניום</span> לפרויקט שלך
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <a
              key={c.title}
              href="#projects"
              className="group overflow-hidden rounded-2xl border border-white/10 bg-panel/60 transition-colors hover:border-gold/40"
            >
              <PhotoPlaceholder
                label={c.title}
                variant={c.variant}
                imageUrl={images[c.slot]}
                className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{c.desc}</p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform group-hover:-translate-x-1">
                  ←
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <ProjectCarousel />
      </div>
    </section>
  );
}
