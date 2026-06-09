import { Resend } from "resend";
import { SOURCE_LABELS, type Lead } from "./leads";

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

/**
 * Best-effort notifications: a missing/invalid Resend setup must never block
 * lead capture, so every failure is swallowed and logged.
 */
export async function sendLeadEmails(lead: Lead): Promise<void> {
  const resend = getClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL;
  const notifyTo = process.env.RESEND_NOTIFY_TO;

  const sourceLabel = SOURCE_LABELS[lead.source];
  const details = [
    `מקור: ${sourceLabel}`,
    `שם: ${lead.name}`,
    `טלפון: ${lead.phone}`,
    lead.city ? `עיר: ${lead.city}` : null,
    lead.email ? `אימייל: ${lead.email}` : null,
    lead.message ? `הודעה: ${lead.message}` : null,
    lead.configurator
      ? `הגדרת קונפיגורטור: ${lead.configurator.systemType} · ${lead.configurator.model} · ${lead.configurator.color} · ${lead.configurator.width}x${lead.configurator.height} ס"מ · מחיר משוער: ₪${lead.configurator.estimatedPrice}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (from && notifyTo) {
    try {
      await resend.emails.send({
        from,
        to: notifyTo,
        subject: `ליד חדש מהאתר — ${lead.name}`,
        text: `התקבל ליד חדש דרך ${sourceLabel}:\n\n${details}`,
      });
    } catch (err) {
      console.error("Failed to send admin lead notification email", err);
    }
  }

  if (from && lead.email) {
    try {
      await resend.emails.send({
        from,
        to: lead.email,
        subject: "תודה שפנית אלינו — ALUM DESIGN",
        text: `שלום ${lead.name},\n\nתודה שפנית ל-ALUM DESIGN. קיבלנו את פנייתך ונחזור אליך בהקדם האפשרי.\n\nבברכה,\nצוות ALUM DESIGN`,
      });
    } catch (err) {
      console.error("Failed to send lead auto-reply email", err);
    }
  }
}
