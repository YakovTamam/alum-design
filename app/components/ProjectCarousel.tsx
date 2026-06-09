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

// Duplicate for seamless loop
const TRACK = [...CARDS, ...CARDS];

export default function ProjectCarousel() {
  return (
    <div className="overflow-hidden" aria-hidden>
      <div className="carousel-track flex gap-4" style={{ width: "max-content" }}>
        {TRACK.map((card, i) => (
          <div
            key={i}
            className="w-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-panel/60 sm:w-64"
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
    </div>
  );
}
