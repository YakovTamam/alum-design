"use client";

import { useState, type FormEvent } from "react";
import { sanitizeEmailInput } from "@/lib/strings";

export default function SignupRequestForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/signup-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, city, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "שליחת הבקשה נכשלה");
        return;
      }

      setSuccess(true);
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-6">
        <p className="text-sm text-zinc-300">
          הבקשה שלך נשלחה בהצלחה. לאחר אישור מנהל המערכת יישלח אליך אימייל עם קישור להשלמת ההרשמה.
        </p>
        <a href="/login" className="mt-4 inline-block text-sm text-gold hover:underline">
          חזרה להתחברות
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="mt-6 block text-xs text-zinc-400" htmlFor="signup-name">
        שם מלא
      </label>
      <input
        id="signup-name"
        type="text"
        required
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
      />

      <label className="mt-6 block text-xs text-zinc-400" htmlFor="signup-phone">
        טלפון
      </label>
      <input
        id="signup-phone"
        type="tel"
        dir="ltr"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
      />

      <label className="mt-6 block text-xs text-zinc-400" htmlFor="signup-city">
        עיר
      </label>
      <input
        id="signup-city"
        type="text"
        required
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
      />

      <label className="mt-6 block text-xs text-zinc-400" htmlFor="signup-email">
        אימייל
      </label>
      <input
        id="signup-email"
        type="text"
        inputMode="email"
        required
        dir="ltr"
        value={email}
        onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
      />

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
      >
        {submitting ? "שולח…" : "שליחת בקשה"}
      </button>
    </form>
  );
}
