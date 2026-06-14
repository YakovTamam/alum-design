import { getSetting } from "./settings";
import { DEFAULT_CONTACT_PHONE, DEFAULT_CONTACT_EMAIL, DEFAULT_SOCIAL_LINKS, type ContactInfo } from "./contact";

export async function getContactInfo(): Promise<ContactInfo> {
  const [phone, email, instagram, facebook, waze] = await Promise.all([
    getSetting("contact-phone", DEFAULT_CONTACT_PHONE),
    getSetting("contact-email", DEFAULT_CONTACT_EMAIL),
    getSetting("social-instagram", DEFAULT_SOCIAL_LINKS.instagram),
    getSetting("social-facebook", DEFAULT_SOCIAL_LINKS.facebook),
    getSetting("social-waze", DEFAULT_SOCIAL_LINKS.waze),
  ]);
  return { phone, email, social: { instagram, facebook, waze } };
}
