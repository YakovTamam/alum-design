// Client-safe definitions only — no server imports (used by admin UI too).

export const TRACKING_PIXELS = [
  {
    key: "pixel-meta",
    label: "Meta Pixel (פייסבוק / אינסטגרם)",
    placeholder: "לדוגמה: 123456789012345",
    help: "Pixel ID מתוך Events Manager בחשבון המודעות של Meta",
  },
  {
    key: "pixel-tiktok",
    label: "TikTok Pixel",
    placeholder: "לדוגמה: C0ABC1DE2FG3HI4JK5",
    help: "Pixel ID מתוך TikTok Ads Manager → Assets → Events",
  },
  {
    key: "pixel-ga",
    label: "Google Analytics 4",
    placeholder: "לדוגמה: G-XXXXXXXXXX",
    help: "Measurement ID מתוך Admin → Data Streams בנכס ה-GA4",
  },
  {
    key: "pixel-clarity",
    label: "Microsoft Clarity (מפות חום)",
    placeholder: "לדוגמה: abcde12345",
    help: "Project ID מתוך הגדרות הפרויקט ב-clarity.microsoft.com",
  },
] as const;

export type TrackingPixelKey = (typeof TRACKING_PIXELS)[number]["key"];

// IDs are interpolated into inline <script> bodies on the public page, so
// anything outside [\w-] is stripped to keep injection impossible.
export function sanitizeTrackingId(value: string): string {
  return value.trim().replace(/[^\w-]/g, "").slice(0, 64);
}
