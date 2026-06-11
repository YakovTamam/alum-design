import { getSetting } from "./settings";
import { DEFAULT_LOADING_SCREEN, LOADING_SCREEN_SETTING_KEYS, type LoadingScreenSettings } from "./loading-screen";

export async function getLoadingScreenSettings(): Promise<LoadingScreenSettings> {
  const [enabled, useSiteLogo, backgroundColor, accentColor, minDuration, maxDuration] = await Promise.all([
    getSetting(LOADING_SCREEN_SETTING_KEYS.enabled, String(DEFAULT_LOADING_SCREEN.enabled)),
    getSetting(LOADING_SCREEN_SETTING_KEYS.useSiteLogo, String(DEFAULT_LOADING_SCREEN.useSiteLogo)),
    getSetting(LOADING_SCREEN_SETTING_KEYS.backgroundColor, DEFAULT_LOADING_SCREEN.backgroundColor),
    getSetting(LOADING_SCREEN_SETTING_KEYS.accentColor, DEFAULT_LOADING_SCREEN.accentColor),
    getSetting(LOADING_SCREEN_SETTING_KEYS.minDuration, String(DEFAULT_LOADING_SCREEN.minDuration)),
    getSetting(LOADING_SCREEN_SETTING_KEYS.maxDuration, String(DEFAULT_LOADING_SCREEN.maxDuration)),
  ]);

  const min = Number(minDuration);
  const max = Number(maxDuration);

  return {
    enabled: enabled === "true",
    useSiteLogo: useSiteLogo === "true",
    backgroundColor,
    accentColor,
    minDuration: Number.isFinite(min) && min >= 0 ? min : DEFAULT_LOADING_SCREEN.minDuration,
    maxDuration: Number.isFinite(max) && max > 0 ? max : DEFAULT_LOADING_SCREEN.maxDuration,
  };
}
