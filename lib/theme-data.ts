import { getSetting } from "./settings";
import { DEFAULT_SITE_THEME, type SiteTheme } from "./theme";

export async function getSiteTheme(): Promise<SiteTheme> {
  const [headerBg, headerText, footerBg, footerText] = await Promise.all([
    getSetting("header-bg-color", DEFAULT_SITE_THEME.headerBg),
    getSetting("header-text-color", DEFAULT_SITE_THEME.headerText),
    getSetting("footer-bg-color", DEFAULT_SITE_THEME.footerBg),
    getSetting("footer-text-color", DEFAULT_SITE_THEME.footerText),
  ]);
  return { headerBg, headerText, footerBg, footerText };
}
