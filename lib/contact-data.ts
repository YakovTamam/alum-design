import { getSetting } from "./settings";
import { DEFAULT_CONTACT_PHONE, DEFAULT_CONTACT_EMAIL, type ContactInfo } from "./contact";

export async function getContactInfo(): Promise<ContactInfo> {
  const [phone, email] = await Promise.all([
    getSetting("contact-phone", DEFAULT_CONTACT_PHONE),
    getSetting("contact-email", DEFAULT_CONTACT_EMAIL),
  ]);
  return { phone, email };
}
