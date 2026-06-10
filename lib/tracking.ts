import { getSetting } from "./settings";
import {
  TRACKING_PIXELS,
  sanitizeTrackingId,
  type TrackingPixelKey,
} from "./tracking-pixels";

export async function getTrackingIds(): Promise<Record<TrackingPixelKey, string>> {
  const entries = await Promise.all(
    TRACKING_PIXELS.map(
      async ({ key }) => [key, sanitizeTrackingId(await getSetting(key, ""))] as const,
    ),
  );
  return Object.fromEntries(entries) as Record<TrackingPixelKey, string>;
}
