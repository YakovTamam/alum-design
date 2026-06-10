import Image from "next/image";
import type { SerializedTestimonial } from "@/lib/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-gold" dir="ltr" aria-label={`דירוג ${rating} מתוך 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "" : "text-zinc-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials }: { testimonials: SerializedTestimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-b border-zinc-200 bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
          מה <span className="gradient-gold">הלקוחות</span> שלנו אומרים
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t._id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-lg shadow-zinc-200"
            >
              <Stars rating={t.rating} />
              <blockquote className="flex-1 text-sm leading-7 text-zinc-700">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-3">
                {t.imageUrl ? (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.imageUrl} alt={t.name} fill sizes="44px" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                    {t.name.slice(0, 1)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                  {t.role && <p className="text-xs text-zinc-500">{t.role}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
