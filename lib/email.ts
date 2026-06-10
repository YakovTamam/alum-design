import { Resend } from "resend";
import { SOURCE_LABELS, type Lead } from "./leads";
import { ROLE_LABELS, type UserRole } from "./user-roles";
import {
  COMPANY_WHATSAPP,
  detailRow,
  emailButtonRow,
  escapeHtml,
  renderEmailLayout,
  whatsAppLink,
} from "./email-templates";

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
    const rows = [
      detailRow("מקור", sourceLabel),
      detailRow("שם", lead.name),
      detailRow("טלפון", lead.phone, { ltr: true }),
      lead.city ? detailRow("עיר", lead.city) : "",
      lead.email ? detailRow("אימייל", lead.email, { ltr: true }) : "",
      lead.message ? detailRow("הודעה", lead.message) : "",
      lead.configurator
        ? detailRow(
            "קונפיגורטור",
            `${lead.configurator.systemType} · ${lead.configurator.model} · ${lead.configurator.color} · ${lead.configurator.width}x${lead.configurator.height} ס"מ · מחיר משוער: ₪${lead.configurator.estimatedPrice}`,
          )
        : "",
    ]
      .filter(Boolean)
      .join("");

    const buttons = emailButtonRow([
      {
        href: whatsAppLink(lead.phone, `שלום ${lead.name}, מדברים מ-ALUM DESIGN לגבי הפנייה שלך באתר.`),
        label: "פתיחת וואטסאפ",
        color: "#25d366",
        textColor: "#ffffff",
      },
      { href: `tel:${lead.phone}`, label: "התקשרות", color: "#cfa15c", textColor: "#1a1308" },
    ]);

    const bodyHtml = `
      <h1 style="margin:0 0 4px;font-size:20px;font-weight:800;">ליד חדש מהאתר</h1>
      <p style="margin:0 0 20px;font-size:13px;color:#9a948c;">התקבל דרך ${escapeHtml(sourceLabel)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
      ${buttons}
    `;

    try {
      const { error } = await resend.emails.send({
        from,
        to: notifyTo,
        subject: `ליד חדש מהאתר — ${lead.name}`,
        html: renderEmailLayout({ previewText: `ליד חדש מ-${lead.name} דרך ${sourceLabel}`, bodyHtml }),
        text: `התקבל ליד חדש דרך ${sourceLabel}:\n\n${details}`,
      });
      if (error) console.error("Failed to send admin lead notification email", error);
    } catch (err) {
      console.error("Failed to send admin lead notification email", err);
    }
  }

  if (from && lead.email) {
    const bodyHtml = `
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;">תודה שפנית אלינו, ${escapeHtml(lead.name)}</h1>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#4a443c;">קיבלנו את פנייתך ונחזור אליך בהקדם האפשרי.</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4a443c;">לפנייה מהירה יותר אפשר גם ליצור איתנו קשר ישירות בוואטסאפ.</p>
      ${emailButtonRow([
        {
          href: whatsAppLink(COMPANY_WHATSAPP, `שלום, פניתי דרך האתר ושמי ${lead.name}.`),
          label: "פתיחת וואטסאפ",
          color: "#25d366",
          textColor: "#ffffff",
        },
      ])}
    `;

    try {
      const { error } = await resend.emails.send({
        from,
        to: lead.email,
        subject: "תודה שפנית אלינו — ALUM DESIGN",
        html: renderEmailLayout({ previewText: "קיבלנו את פנייתך ונחזור אליך בהקדם", bodyHtml }),
        text: `שלום ${lead.name},\n\nתודה שפנית ל-ALUM DESIGN. קיבלנו את פנייתך ונחזור אליך בהקדם האפשרי.\n\nבברכה,\nצוות ALUM DESIGN`,
      });
      if (error) console.error("Failed to send lead auto-reply email", error);
    } catch (err) {
      console.error("Failed to send lead auto-reply email", err);
    }
  }
}

/**
 * Best-effort: a missing/invalid Resend setup must never block invitation
 * creation, so failures are swallowed and logged.
 */
export async function sendInvitationEmail(data: {
  email: string;
  role: UserRole;
  inviteUrl: string;
}): Promise<void> {
  const resend = getClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) return;

  const roleLabel = ROLE_LABELS[data.role];

  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;">הוזמנת למערכת הניהול</h1>
    <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#4a443c;">
      הוזמנת להצטרף למערכת הניהול של ALUM DESIGN בתפקיד <strong>${escapeHtml(roleLabel)}</strong>.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#4a443c;">להשלמת ההרשמה, לחצו על הכפתור הבא (תקף ל-7 ימים):</p>
    ${emailButtonRow([{ href: data.inviteUrl, label: "השלמת ההרשמה", color: "#cfa15c", textColor: "#1a1308" }])}
  `;

  try {
    const { error } = await resend.emails.send({
      from,
      to: data.email,
      subject: "הזמנה למערכת הניהול — ALUM DESIGN",
      html: renderEmailLayout({ previewText: `הוזמנת למערכת הניהול בתפקיד ${roleLabel}`, bodyHtml }),
      text: `שלום,\n\nהוזמנת להצטרף למערכת הניהול של ALUM DESIGN בתפקיד ${roleLabel}.\n\nלהשלמת ההרשמה, לחצו על הקישור הבא (תקף ל-7 ימים):\n${data.inviteUrl}\n\nבברכה,\nצוות ALUM DESIGN`,
    });
    if (error) console.error("Failed to send invitation email", error);
  } catch (err) {
    console.error("Failed to send invitation email", err);
  }
}
