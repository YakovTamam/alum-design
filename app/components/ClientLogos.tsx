const LOGOS = [
  "בוני הצפון",
  "אינוביה",
  "גלובל בנייה",
  "פרמיום לאנד",
  "יזמות פז",
  "נדל״ן כרמל",
  "אנגלו-סכסון",
  "דניה סיבוס",
];

export default function ClientLogos() {
  return (
    <section className="border-y border-white/5 bg-[#0d0d10] py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          לקוחות מובילים שכבר בחרו בנו
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((name) => (
            <span
              key={name}
              className="text-base font-bold text-zinc-600 transition-colors duration-300 hover:text-zinc-300"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
