import { ServiceIconSvg } from "@/lib/services";
import { getSiteName, type ServiceItem, type SiteIdentity } from "@/lib/site-copy";

export default function SolutionsSystem({ services, siteIdentity }: { services: ServiceItem[]; siteIdentity: SiteIdentity }) {
  return (
    <section id="systems" className="border-y border-zinc-100 bg-[#f0ece5]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
        <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
          מערכת פתרונות{" "}
          <span className="text-gold">אלומיניום</span> מתקדמים
        </h2>

        <div className="relative mt-8 lg:mt-14">
          <div
            aria-hidden
            className="absolute top-9 right-0 left-0 hidden h-px bg-[repeating-linear-gradient(to_left,rgba(207,161,92,0.5)_0_8px,transparent_8px_16px)] lg:block"
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {services.map((s) => (
              <div key={s.id} className="relative flex flex-col items-center text-center">
                <span className="z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-zinc-200 bg-white text-gold shadow-lg shadow-zinc-200">
                  <ServiceIconSvg kind={s.icon} />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900">{s.label}</h3>
                <p className="mt-1 max-w-[11rem] text-xs leading-5 text-zinc-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-zinc-500 lg:mt-14">
          כל המערכות מתחברות לחוויה אחת מושלמת — מהבחירה הראשונית ועד ההתקנה
          הסופית, בליווי צמוד של צוות {getSiteName(siteIdentity)}.
        </p>
      </div>
    </section>
  );
}
