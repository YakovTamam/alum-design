import CategoryCarousel from "./CategoryCarousel";
import type { ContentSlotKey } from "@/lib/content";

type ProjectCategoriesProps = {
  images?: Partial<Record<ContentSlotKey, string>>;
};

export default function ProjectCategories({ images = {} }: ProjectCategoriesProps) {
  return (
    <section id="categories" className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          כל פתרונות{" "}
          <span className="text-gold">האלומיניום</span> לפרויקט שלך
        </h2>
      </div>

      <div className="mt-8 lg:mt-10">
        <CategoryCarousel images={images} />
      </div>

    </section>
  );
}
