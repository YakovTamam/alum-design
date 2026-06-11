export const DEFAULT_LOGO_SIZE = "100";

const MIN_LOGO_SIZE = 50;
const MAX_LOGO_SIZE = 200;

/** Converts a logo-size setting (percentage string, e.g. "125") to a numeric scale factor (e.g. 1.25). */
export function logoScale(size: string): number {
  const n = Number(size);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.min(Math.max(n, MIN_LOGO_SIZE), MAX_LOGO_SIZE) / 100;
}
