import CategoryCarousel from "./CategoryCarousel";
import type { ContentSlotKey } from "@/lib/content";
import type { CategoryItem } from "@/lib/site-copy";

type ProjectCategoriesProps = {
  images?: Partial<Record<ContentSlotKey, string>>;
  categories: CategoryItem[];
};

export default function ProjectCategories({ images = {}, categories }: ProjectCategoriesProps) {
  return (
    <section id="categories" className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
          כל פתרונות{" "}
          <span className="gradient-gold">האלומיניום</span> לפרויקט שלך
        </h2>
      </div>

      <div className="mt-8 lg:mt-10">
        <CategoryCarousel images={images} categories={categories} />
      </div>

    </section>
  );
}
