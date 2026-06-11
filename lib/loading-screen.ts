export type LoadingScreenSettings = {
  enabled: boolean;
  useSiteLogo: boolean;
  backgroundColor: string;
  accentColor: string;
  minDuration: number;
  maxDuration: number;
};

export const DEFAULT_LOADING_SCREEN: LoadingScreenSettings = {
  enabled: true,
  useSiteLogo: false,
  backgroundColor: "#0b0a09",
  accentColor: "#cfa15c",
  minDuration: 1100,
  maxDuration: 4000,
};

export const LOADING_SCREEN_SETTING_KEYS: Record<keyof LoadingScreenSettings, string> = {
  enabled: "loading-screen-enabled",
  useSiteLogo: "loading-screen-use-site-logo",
  backgroundColor: "loading-screen-bg-color",
  accentColor: "loading-screen-accent-color",
  minDuration: "loading-screen-min-duration",
  maxDuration: "loading-screen-max-duration",
};
