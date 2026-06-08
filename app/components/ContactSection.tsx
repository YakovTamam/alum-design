"use client";

import { useState, type FormEvent } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact-form",
          name,
          phone,
          email: email || undefined,
          message: message || undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-[#0e0e11] py-20">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-10">
        <div>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            יש לכם <span className="text-gold">פרויקט בראש</span>?
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
            השאירו פרטים ונחזור אליכם תוך זמן קצר עם ייעוץ ראשוני ללא עלות —
            או חייגו אלינו ישירות.
          </p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-zinc-300">
            <a href="tel:0729444444" className="flex items-center gap-2 hover:text-gold">
              <span aria-hidden>☎</span> 072-3944444
            </a>
            <a href="mailto:info@alum-design.co.il" className="flex items-center gap-2 hover:text-gold">
              <span aria-hidden>✉</span> info@alum-design.co.il
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel/60 p-6 shadow-xl shadow-black/30"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                ✓
              </span>
              <h3 className="text-base font-semibold text-white">הפנייה נשלחה!</h3>
              <p className="text-sm text-zinc-400">נחזור אליכם בהקדם האפשרי.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs text-zinc-400">
                    שם מלא
                  </label>
                  <input
                    id="contact-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-xs text-zinc-400">
                    טלפון
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    dir="ltr"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs text-zinc-400">
                  אימייל (לא חובה)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-xs text-zinc-400">
                  ספרו לנו על הפרויקט (לא חובה)
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-400">משהו השתבש, נסו שוב בעוד רגע.</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-1 flex items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
              >
                {status === "submitting" ? "שולח…" : "שליחת פנייה"}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
