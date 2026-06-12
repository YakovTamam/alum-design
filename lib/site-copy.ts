import type { ContentSlotKey } from "./content";
import type { ServiceIcon } from "./services";

export const SITE_COPY_COLLECTION = "site_copy";

export type NavLink = {
  label: string;
  href: string;
};

export type CategoryVariant = "warm" | "cool";

export type CategoryItem = {
  slot: ContentSlotKey;
  title: string;
  desc: string;
  variant: CategoryVariant;
};

export type ServiceItem = {
  id: string;
  label: string;
  desc: string;
  icon: ServiceIcon;
};

export type SiteIdentity = {
  namePrimary: string;
  nameSecondary: string;
  tagline: string;
};

export type SiteCopy = {
  _id: "main";
  navLinks: NavLink[];
  categories: CategoryItem[];
  services: ServiceItem[];
  siteIdentity: SiteIdentity;
  updatedAt: Date;
};

export type SerializedSiteCopy = Omit<SiteCopy, "_id" | "updatedAt"> & {
  updatedAt: string;
};

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "דף הבית", href: "#" },
  { label: "מערכות", href: "#systems" },
  { label: "פרויקטים", href: "/projects" },
  { label: "לקוחותינו", href: "#categories" },
  { label: "אודות", href: "#" },
  { label: "צור קשר", href: "#contact" },
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    slot: "category-luxury-villas",
    title: "וילות יוקרה",
    desc: "פרויקטי בית יוקרתיים בהתאמה אישית מלאה",
    variant: "warm",
  },
  {
    slot: "category-residential",
    title: "בנייני מגורים",
    desc: "פתרונות אלומיניום מתקדמים לבנייה רוויה",
    variant: "cool",
  },
  {
    slot: "category-business",
    title: "עסקים ומסעדות",
    desc: "חזיתות, פרגולות ופרטיזיציה מקצועית",
    variant: "warm",
  },
  {
    slot: "category-commercial",
    title: "מתחמים מסחריים",
    desc: "פתרונות אלומיניום למרכזים מסחריים",
    variant: "cool",
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "pergolas", label: "פרגולות", desc: "פתרונות צל מודרניים ומעוצבים", icon: "pergola" },
  { id: "windows", label: "חלונות", desc: "חלונות אלומיניום לכל פתח ומידה", icon: "window" },
  { id: "gates", label: "שערים", desc: "שערי כניסה ממונעים ובטיחותיים", icon: "gate" },
  { id: "glass", label: "סגירות זכוכית", desc: "מערכות אלומיניום עם זכוכית להגדלים", icon: "glass" },
  { id: "facades", label: "חזיתות", desc: "חזיתות אלומיניום מודרניות למבנים", icon: "facade" },
  { id: "shading", label: "הצללות", desc: "מערכות הצללה אלגנטיות ומתקדמות", icon: "shade" },
];

export const DEFAULT_SITE_IDENTITY: SiteIdentity = {
  namePrimary: "ALUM",
  nameSecondary: "DESIGN",
  tagline: "פתרונות אלומיניום חכמים",
};

export const DEFAULT_SITE_COPY: SerializedSiteCopy = {
  navLinks: DEFAULT_NAV_LINKS,
  categories: DEFAULT_CATEGORIES,
  services: DEFAULT_SERVICES,
  siteIdentity: DEFAULT_SITE_IDENTITY,
  updatedAt: new Date(0).toISOString(),
};

export function serializeSiteCopy(s: SiteCopy): SerializedSiteCopy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = s;
  return { ...rest, updatedAt: s.updatedAt.toISOString() };
}

export function getSiteName(identity: SiteIdentity): string {
  return `${identity.namePrimary} ${identity.nameSecondary}`;
}
