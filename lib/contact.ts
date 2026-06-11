export const DEFAULT_CONTACT_PHONE = "058-7886764";
export const DEFAULT_CONTACT_EMAIL = "Contact@alum-design.co.il";

export type ContactInfo = {
  phone: string;
  email: string;
};

/** Local Israeli phone (e.g. "058-7886764") to a tel: href (e.g. "tel:0587886764"). */
export function phoneToTelHref(phone: string): string {
  return `tel:${phone.replace(/\D/g, "")}`;
}

/** Local Israeli phone to international digits, for wa.me links / JSON-LD (e.g. "972587886764"). */
export function phoneToInternational(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("972") ? digits : digits.replace(/^0/, "972");
}
