"use client";

import { useState, type FormEvent } from "react";
import type { ConfiguratorSnapshot } from "@/lib/leads";

type LeadCaptureModalProps = {
  open: boolean;
  onClose: () => void;
  configurator: ConfiguratorSnapshot;
};

export default function LeadCaptureModal({ open, onClose, configurator }: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "configurator",
          name,
          phone,
          email: email || undefined,
          configurator,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl shadow-black/50">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
              ✓
            </span>
            <h2 className="text-lg font-semibold text-white">הפנייה התקבלה!</h2>
            <p className="text-sm text-zinc-400">
              נציג של ALUM DESIGN יחזור אליך בהקדם עם הצעת מחיר מדויקת.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light"
            >
              סגירה
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">השאירו פרטים לקבלת הצעת מחיר</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  נשמור את הבחירות שלכם ונחזור עם הצעה מדויקת בהתאמה אישית.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="סגירה"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-xs text-zinc-300">
              <p>
                {configurator.systemType} · {configurator.model} · {configurator.width}×
                {configurator.height} ס&quot;מ
              </p>
              <p className="mt-1 font-semibold text-gold">
                מחיר משוער: ₪ {new Intl.NumberFormat("he-IL").format(configurator.estimatedPrice)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <div>
                <label htmlFor="lead-name" className="mb-1.5 block text-xs text-zinc-400">
                  שם מלא
                </label>
                <input
                  id="lead-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                />
              </div>
              <div>
                <label htmlFor="lead-phone" className="mb-1.5 block text-xs text-zinc-400">
                  טלפון
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                />
              </div>
              <div>
                <label htmlFor="lead-email" className="mb-1.5 block text-xs text-zinc-400">
                  אימייל (לא חובה)
                </label>
                <input
                  id="lead-email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
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
                {status === "submitting" ? "שולח…" : "שליחה לקבלת הצעת מחיר"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
