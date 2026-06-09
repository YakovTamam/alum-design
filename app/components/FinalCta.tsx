import PhotoPlaceholder from "./PhotoPlaceholder";

export default function FinalCta({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative overflow-hidden">
      <PhotoPlaceholder
        label="פרויקט ALUM DESIGN | תכנון חכם, ביצוע מדויק"
        imageUrl={imageUrl}
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/70 to-black/90" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 py-24 lg:px-10">
        <h2 className="max-w-xl text-3xl font-bold leading-snug text-white sm:text-4xl">
          הפרויקט הבא שלך,
          <br />
          <span className="text-gold">מתוכנן חכם יותר.</span>
        </h2>
        <p className="max-w-lg text-sm leading-7 text-zinc-300">
          מגוון רחב של פתרונות אלומיניום — פרגולות, חלונות, שערים וסגירות
          זכוכית — מתוכננים ומותאמים במקום אחד, בליווי צמוד של צוות{" "}
          <span className="text-gold">ALUM DESIGN</span> משלב הרעיון ועד
          ההתקנה הסופית.
        </p>
        <a
          href="#configurator"
          className="btn-gold mt-2 flex w-fit items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-[#1a1308]"
        >
          בואו נתחיל <span aria-hidden>←</span>
        </a>
      </div>
    </section>
  );
}
