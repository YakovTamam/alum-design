import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { CONTENT_SLOTS, type ContentSlotKey } from "@/lib/content";
import { SERVICE_ICONS, type ServiceIcon } from "@/lib/services";
import {
  SITE_COPY_COLLECTION,
  DEFAULT_CATEGORIES,
  serializeSiteCopy,
  type SiteCopy,
  type NavLink,
  type CategoryItem,
  type ServiceItem,
  type CategoryVariant,
} from "@/lib/site-copy";
import { getSiteCopy } from "@/lib/site-copy-data";

const CATEGORY_SLOTS = CONTENT_SLOTS.filter((s) => s.key.startsWith("category-")).map(
  (s) => s.key,
) as ContentSlotKey[];

export async function GET() {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
  const copy = await getSiteCopy();
  return NextResponse.json({ copy });
}

export async function PUT(request: Request) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON לא תקין" }, { status: 400 });
  }

  const { navLinks, categories, services } = body;

  const sanitizedNavLinks: NavLink[] = (Array.isArray(navLinks) ? navLinks : [])
    .map((link): NavLink | null => {
      if (!link || typeof link !== "object") return null;
      const label = (link as Record<string, unknown>).label;
      const href = (link as Record<string, unknown>).href;
      if (typeof label !== "string" || typeof href !== "string") return null;
      if (!label.trim() || !href.trim()) return null;
      return { label: label.trim(), href: href.trim() };
    })
    .filter((l): l is NavLink => l !== null);

  const rawCategories = Array.isArray(categories) ? categories : [];
  const sanitizedCategories: CategoryItem[] = CATEGORY_SLOTS.map((slot, i) => {
    const raw = rawCategories[i];
    const fallback = DEFAULT_CATEGORIES[i];
    const title = raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).title === "string"
      ? ((raw as Record<string, unknown>).title as string).trim()
      : fallback.title;
    const desc = raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).desc === "string"
      ? ((raw as Record<string, unknown>).desc as string).trim()
      : fallback.desc;
    const rawVariant = raw && typeof raw === "object" ? (raw as Record<string, unknown>).variant : undefined;
    const variant: CategoryVariant = rawVariant === "warm" || rawVariant === "cool" ? rawVariant : fallback.variant;
    return { slot, title: title || fallback.title, desc, variant };
  });

  const sanitizedServices: ServiceItem[] = (Array.isArray(services) ? services : [])
    .map((svc): ServiceItem | null => {
      if (!svc || typeof svc !== "object") return null;
      const label = (svc as Record<string, unknown>).label;
      if (typeof label !== "string" || !label.trim()) return null;
      const desc = (svc as Record<string, unknown>).desc;
      const id = (svc as Record<string, unknown>).id;
      const icon = (svc as Record<string, unknown>).icon;
      return {
        id: typeof id === "string" && id ? id : crypto.randomUUID(),
        label: label.trim(),
        desc: typeof desc === "string" ? desc.trim() : "",
        icon: SERVICE_ICONS.includes(icon as ServiceIcon) ? (icon as ServiceIcon) : "pergola",
      };
    })
    .filter((s): s is ServiceItem => s !== null);

  const db = await getDb();
  const updated: SiteCopy = {
    _id: "main",
    navLinks: sanitizedNavLinks,
    categories: sanitizedCategories,
    services: sanitizedServices,
    updatedAt: new Date(),
  };

  await db
    .collection<SiteCopy>(SITE_COPY_COLLECTION)
    .replaceOne({ _id: "main" } as never, updated, { upsert: true });

  revalidatePath("/");
  revalidatePath("/projects");

  return NextResponse.json({ ok: true, copy: serializeSiteCopy(updated) });
}
