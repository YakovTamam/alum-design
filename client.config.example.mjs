/**
 * Per-client seed configuration.
 *
 * To set up a new client:
 *   1. Copy this file to `client.config.mjs` (gitignored) and fill in their details.
 *   2. Update SITE_URL in lib/site.ts to the client's domain — this is not seeded here.
 *   3. Set MONGODB_URI / MONGODB_DB in .env.local for the client's database.
 *   4. Run `npm run seed`.
 *
 * The seed script writes these values into a fresh database as the site's
 * initial settings. Re-running it overwrites the settings below with these
 * values again, so it's meant for first-time setup, not ongoing edits —
 * use the admin panel for day-to-day changes.
 */
const config = {
  // Site name (shown in the header/footer logo, browser tab title, etc.)
  // and the marketing tagline used across the site and emails.
  siteIdentity: {
    namePrimary: "ALUM",
    nameSecondary: "DESIGN",
    tagline: "פתרונות אלומיניום חכמים",
  },

  contact: {
    phone: "058-0000000",
    email: "info@example.co.il",
  },

  // Header/footer colors. Leave empty strings to use the site's default theme.
  theme: {
    headerBg: "",
    headerText: "",
    footerBg: "",
    footerText: "",
  },

  // Logo size as a percentage of its original size (50–200).
  logoSize: "100",
  footerLogoSize: "100",

  loadingScreen: {
    enabled: true,
    useSiteLogo: false,
    backgroundColor: "#0b0a09",
    accentColor: "#cfa15c",
    minDuration: 1100,
    maxDuration: 4000,
  },

  // Infinite-scrolling image gallery section. Images are uploaded later via
  // the admin panel — this only seeds the section's display settings.
  gallery: {
    title: "",
    enabled: false,
    speed: 50,
    direction: "left",
    height: 220,
    gap: 16,
  },

  // Leave blank to skip a pixel.
  trackingPixels: {
    "pixel-meta": "",
    "pixel-tiktok": "",
    "pixel-ga": "",
    "pixel-clarity": "",
  },

  // Navigation links shown in the header. "href" can be an in-page anchor
  // (e.g. "#contact") or a separate page route (e.g. "/projects").
  navLinks: [
    { label: "דף הבית", href: "#" },
    { label: "מערכות", href: "#systems" },
    { label: "פרויקטים", href: "/projects" },
    { label: "לקוחותינו", href: "#categories" },
    { label: "אודות", href: "#" },
    { label: "צור קשר", href: "#contact" },
  ],

  // The 4 project-category cards. Each "slot" maps to one of the image slots
  // configured in the admin panel — keep the slots as-is and only change the
  // title/desc/variant ("warm" or "cool") to match the new client's business.
  categories: [
    { slot: "category-luxury-villas", title: "וילות יוקרה", desc: "פרויקטי בית יוקרתיים בהתאמה אישית מלאה", variant: "warm" },
    { slot: "category-residential", title: "בנייני מגורים", desc: "פתרונות אלומיניום מתקדמים לבנייה רוויה", variant: "cool" },
    { slot: "category-business", title: "עסקים ומסעדות", desc: "חזיתות, פרגולות ופרטיזיציה מקצועית", variant: "warm" },
    { slot: "category-commercial", title: "מתחמים מסחריים", desc: "פתרונות אלומיניום למרכזים מסחריים", variant: "cool" },
  ],

  // Service cards shown in the "מערכת פתרונות" section and the footer.
  // "icon" must be one of: pergola, window, gate, glass, facade, shade.
  services: [
    { id: "pergolas", label: "פרגולות", desc: "פתרונות צל מודרניים ומעוצבים", icon: "pergola" },
    { id: "windows", label: "חלונות", desc: "חלונות אלומיניום לכל פתח ומידה", icon: "window" },
    { id: "gates", label: "שערים", desc: "שערי כניסה ממונעים ובטיחותיים", icon: "gate" },
    { id: "glass", label: "סגירות זכוכית", desc: "מערכות אלומיניום עם זכוכית להגדלים", icon: "glass" },
    { id: "facades", label: "חזיתות", desc: "חזיתות אלומיניום מודרניות למבנים", icon: "facade" },
    { id: "shading", label: "הצללות", desc: "מערכות הצללה אלגנטיות ומתקדמות", icon: "shade" },
  ],
};

export default config;
