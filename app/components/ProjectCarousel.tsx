import PhotoPlaceholder from "./PhotoPlaceholder";

const CARDS = [
  { title: "פרגולת אלומיניום", desc: "תכנון ממוחשב, ביצוע מדויק", variant: "warm" as const },
  { title: "חלונות מעוצבים", desc: "בידוד תרמי ואקוסטי מתקדם", variant: "cool" as const },
  { title: "שערי כניסה חכמים", desc: "אוטומציה ואבטחה משולבות", variant: "warm" as const },
  { title: "סגירות זכוכית", desc: "מרחב מוגן ואסתטי", variant: "cool" as const },
  { title: "חזיתות בניין", desc: "עיצוב ארכיטקטוני מרהיב", variant: "warm" as const },
  { title: "מערכות הצללה", desc: "נוחות תרמית לכל עונה", variant: "cool" as const },
  { title: "גגות אלומיניום", desc: "עמידות לאורך עשרות שנים", variant: "warm" as const },
  { title: "מחיצות זכוכית", desc: "עיצוב פנים מודרני ופתוח", variant: "cool" as const },
];

export default function ProjectCarousel() {
  return (
    <div
      className="carousel-snap flex gap-4 overflow-x-auto snap-x snap-mandatory ps-4 pe-4 scroll-ps-4 lg:ps-10 lg:pe-10 lg:scroll-ps-10"
    >
      {CARDS.map((card, i) => (
        <div
          key={i}
          className="snap-start shrink-0 w-[75vw] sm:w-[44vw] lg:w-72 overflow-hidden rounded-2xl border border-white/[0.14] bg-white/[0.06] shadow-xl shadow-black/40"
        >
          <PhotoPlaceholder
            label={card.title}
            variant={card.variant}
            className="aspect-[4/3] w-full"
          />
          <div className="p-4">
            <p className="text-sm font-semibold text-white">{card.title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
