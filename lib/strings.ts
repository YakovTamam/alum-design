// Browsers sometimes insert invisible bidi-direction control characters into
// LTR inputs (like email fields) when typed inside an RTL page. The visible
// text looks correct, but these characters fail native `type="email"`
// validation with a confusing browser-localized error.
const BIDI_CONTROL_CHARS = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

export function sanitizeEmailInput(value: string): string {
  return value.replace(BIDI_CONTROL_CHARS, "").trim();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
