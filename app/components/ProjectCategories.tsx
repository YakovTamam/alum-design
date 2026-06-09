import CategoryCarousel from "./CategoryCarousel";
import ProjectCarousel from "./ProjectCarousel";
import type { ContentSlotKey } from "@/lib/content";

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
      </div>

      <div className="mt-10">
        <CategoryCarousel images={images} />
      </div>

      <div className="mt-10">
        <ProjectCarousel />
      </div>
    </section>
  );
}
