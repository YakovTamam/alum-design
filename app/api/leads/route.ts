import { NextResponse, after } from "next/server";
import { getDb } from "@/lib/mongodb";
import { LEADS_COLLECTION, type Lead, type LeadSource } from "@/lib/leads";
import { sendLeadEmails } from "@/lib/email";

const SOURCES: LeadSource[] = ["contact-form", "configurator", "contractor-leads", "sticky-cta"];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { source, name, phone, email, city, message, configurator } = body;

  if (!SOURCES.includes(source as LeadSource)) {
    return NextResponse.json({ error: "מקור הליד אינו תקין" }, { status: 400 });
  }
  if (!isNonEmptyString(name) || !isNonEmptyString(phone)) {
    return NextResponse.json({ error: "יש למלא שם וטלפון" }, { status: 400 });
  }

  const lead: Lead = {
    source: source as LeadSource,
    name: name.trim().slice(0, 200),
    phone: phone.trim().slice(0, 50),
    status: "new",
    createdAt: new Date(),
  };

  if (isNonEmptyString(email)) lead.email = email.trim().slice(0, 200);
  if (isNonEmptyString(city)) lead.city = city.trim().slice(0, 100);
  if (isNonEmptyString(message)) lead.message = message.trim().slice(0, 2000);

  if (configurator && typeof configurator === "object") {
    const c = configurator as Record<string, unknown>;
    if (
      isNonEmptyString(c.systemType) &&
      isNonEmptyString(c.model) &&
      isNonEmptyString(c.color) &&
      typeof c.width === "number" &&
      typeof c.height === "number" &&
      typeof c.lighting === "boolean" &&
      typeof c.estimatedPrice === "number"
    ) {
      lead.configurator = {
        systemType: c.systemType,
        model: c.model,
        color: c.color,
        width: c.width,
        height: c.height,
        lighting: c.lighting,
        estimatedPrice: c.estimatedPrice,
      };
    }
  }

  try {
    const db = await getDb();
    await db.collection<Lead>(LEADS_COLLECTION).insertOne(lead);
  } catch (err) {
    console.error("Failed to save lead", err);
    return NextResponse.json({ error: "שמירת הפנייה נכשלה, נסו שוב מאוחר יותר" }, { status: 500 });
  }

  // On serverless, a fire-and-forget promise is killed when the response
  // returns; after() keeps the invocation alive until the emails are sent.
  after(() => sendLeadEmails(lead));

  return NextResponse.json({ ok: true });
}
