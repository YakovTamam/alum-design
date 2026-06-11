/**
 * Per-client seed configuration.
 *
 * To set up a new client:
 *   1. Copy this file to `client.config.mjs` (gitignored) and fill in their details.
 *   2. Update the code-level branding in lib/site.ts (site name, tagline, URL)
 *      and lib/services.tsx (services list) — these are not seeded here.
 *   3. Set MONGODB_URI / MONGODB_DB in .env.local for the client's database.
 *   4. Run `npm run seed`.
 *
 * The seed script writes these values into a fresh database as the site's
 * initial settings. Re-running it overwrites the settings below with these
 * values again, so it's meant for first-time setup, not ongoing edits —
 * use the admin panel for day-to-day changes.
 */
const config = {
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
};

export default config;
