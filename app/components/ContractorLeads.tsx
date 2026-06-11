"use client";

import { useState, type FormEvent } from "react";
import { phoneToTelHref } from "@/lib/contact";
import { SITE_NAME } from "@/lib/site";

const PROJECT_TYPES = [
  "פרגולות אלומיניום",
  "חלונות ודלתות",
  "שערים ממונעים",
  "סגירות זכוכית",
  "חזיתות בניין",
  "פרויקט מסחרי / מגורים",
  "אחר",
] as const;

const PROJECT_SCALES = [
  "יחידה בודדת",
  "2–10 יחידות",
  "10–50 יחידות",
  "50+ יחידות (פרויקט גדול)",
] as const;

const BENEFITS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
      </svg>
    ),
    title: "מחירי נפח לקבלנים",
    desc: "תמחור מיוחד לפרויקטים חוזרים ורכישות גדולות",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" />
      </svg>
    ),
    title: "מסירה מהירה ומדויקת",
    desc: "לוחות זמנים ברורים וציוד שמגיע בזמן לאתר",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "ליווי טכני צמוד",
    desc: "נציג ייעודי לכל קבלן — מהתכנון ועד לאחר ההתקנה",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "אחריות מלאה על כל פרויקט",
    desc: "אנחנו עומדים מאחורי כל מוצר — גם שנה אחרי",
  },
];

export default function ContractorLeads({ phone: contactPhone }: { phone: string }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectScale, setProjectScale] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contractor-leads",
          name,
          phone,
          city,
          message: [company && `חברה: ${company}`, projectType && `סוג: ${projectType}`, projectScale && `היקף: ${projectScale}`, message].filter(Boolean).join(" | "),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contractor" className="bg-[#f0ece5] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:items-start lg:gap-16">

          {/* Left: messaging */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold">
              ✦ שותפים מועדפים לקבלנים ויזמים
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              הספק שקבלנים{" "}
              <span className="gradient-gold">מסתמכים עליו</span>
              <br className="hidden sm:block" /> בפרויקטים גדולים
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600">
              {SITE_NAME} מתמחה בפתרונות אלומיניום לקבלנים, יזמים ומפתחי
              נדל&quot;ן — פרגולות, חלונות, שערים וסגירות זכוכית בהיקפים גדולים,
              עם מחירי נפח, לוחות זמנים ברורים וליווי מקצועי צמוד.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    {b.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{b.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-zinc-500">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-zinc-200 pt-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                עובדים עם קבלנים מובילים בכל הארץ
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
                {["בנייה רוויה", "וילות יוקרה", "מרכזים מסחריים", "מתחמי מגורים"].map((tag) => (
                  <span key={tag} className="text-sm font-medium text-zinc-600">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: lead form */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-200/60 lg:sticky lg:top-24">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold">✓</span>
                <h3 className="text-lg font-bold text-zinc-900">הפנייה התקבלה!</h3>
                <p className="text-sm text-zinc-500">נחזור אליכם תוך שעות ספורות עם הצעה מותאמת.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">שלח פנייה עסקית</h3>
                  <p className="mt-1 text-sm text-zinc-500">נחזור אליכם תוך שעות ספורות</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">שם מלא *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ישראל ישראלי"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">חברה / תפקיד</label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="קבלן ראשי / יזם"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">טלפון *</label>
                    <input
                      required
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="050-0000000"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">עיר *</label>
                    <input
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="תל אביב"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">סוג עבודה</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    >
                      <option value="">בחר סוג...</option>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">היקף הפרויקט</label>
                    <select
                      value={projectScale}
                      onChange={(e) => setProjectScale(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    >
                      <option value="">בחר היקף...</option>
                      {PROJECT_SCALES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-500">פרטים נוספים (לא חובה)</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ספר לנו על הפרויקט — כמות יחידות, מיקום, לוחות זמנים..."
                    className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-500">משהו השתבש, נסו שוב.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-gold mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-[#1a1308] disabled:opacity-60"
                >
                  {status === "submitting" ? "שולח…" : <>שלח פנייה עסקית <span aria-hidden>←</span></>}
                </button>

                <p className="text-center text-xs text-zinc-400">
                  או התקשר עכשיו:{" "}
                  <a href={phoneToTelHref(contactPhone)} className="font-medium text-gold hover:underline">{contactPhone}</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
