const BRAND_GRADIENT = "linear-gradient(135deg, #b8882e 0%, #cfa15c 55%, #e8c896 100%)";

export const COMPANY_WHATSAPP = "972729444444";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Builds a wa.me link from a phone number in any common Israeli format. */
export function whatsAppLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("972") ? digits : digits.replace(/^0/, "972");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${intl}${query}`;
}

export function detailRow(label: string, value: string, opts?: { ltr?: boolean }): string {
  return `<tr>
    <td style="padding:10px 12px 10px 0;border-top:1px solid #f0ece5;color:#9a948c;font-size:13px;width:100px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-top:1px solid #f0ece5;color:#1a1614;font-size:14px;font-weight:600;${opts?.ltr ? "direction:ltr;text-align:right;" : ""}">${escapeHtml(value)}</td>
  </tr>`;
}

export function emailButton(href: string, label: string, color: string, textColor: string): string {
  return `<a href="${href}" style="display:inline-block;background-color:${color};color:${textColor};text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:999px;">${escapeHtml(label)}</a>`;
}

export function emailButtonRow(buttons: Array<{ href: string; label: string; color: string; textColor: string }>): string {
  const cells = buttons
    .map(
      (b, i) =>
        `<td style="${i > 0 ? "padding-left:12px;" : ""}">${emailButton(b.href, b.label, b.color, b.textColor)}</td>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>${cells}</tr></table>`;
}

export function renderEmailLayout({ previewText, bodyHtml }: { previewText?: string; bodyHtml: string }): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background-color:#f0ece5;font-family:Arial,Helvetica,sans-serif;">
    ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ece5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e1da;">
            <tr>
              <td style="background:${BRAND_GRADIENT};padding:24px 32px;">
                <span style="font-size:20px;font-weight:800;color:#1a1308;letter-spacing:0.08em;">ALUM DESIGN</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#1a1614;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background-color:#f7f5f2;border-top:1px solid #e5e1da;text-align:center;">
                <span style="font-size:12px;color:#9a948c;">ALUM DESIGN — פרגולות, חלונות ומערכות אלומיניום</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
