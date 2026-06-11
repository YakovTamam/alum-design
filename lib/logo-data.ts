import { getSetting } from "./settings";
import { DEFAULT_LOGO_SIZE } from "./logo";

export async function getLogoSize(): Promise<string> {
  return getSetting("logo-size", DEFAULT_LOGO_SIZE);
}

export async function getFooterLogoSize(): Promise<string> {
  return getSetting("footer-logo-size", DEFAULT_LOGO_SIZE);
}
