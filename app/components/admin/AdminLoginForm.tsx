"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({ bootstrap }: { bootstrap: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot" | "forgot-sent">("login");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bootstrap ? { name, email, password } : { email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "ההתחברות נכשלה");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "השליחה נכשלה");
        return;
      }

      setMode("forgot-sent");
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  if (mode === "forgot-sent") {
    return (
      <div className="mt-6">
        <p className="text-sm text-zinc-300">
          אם קיים חשבון עם האימייל{" "}
          <span dir="ltr" className="text-zinc-100">
            {email}
          </span>
          , נשלח אליו קישור לאיפוס סיסמה. הקישור תקף לשעה אחת.
        </p>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className="mt-4 text-sm text-gold hover:underline"
        >
          חזרה להתחברות
        </button>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <form onSubmit={handleForgotSubmit}>
        <p className="mt-6 text-sm text-zinc-400">הזינו את האימייל שלכם ונשלח אליו קישור לאיפוס סיסמה.</p>

        <label className="mt-4 block text-xs text-zinc-400" htmlFor="forgot-email">
          אימייל
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          autoFocus
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
        >
          {submitting ? "שולח…" : "שליחת קישור לאיפוס"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className="mt-4 text-sm text-zinc-400 hover:text-zinc-200 hover:underline"
        >
          חזרה להתחברות
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {bootstrap && (
        <>
          <label className="mt-6 block text-xs text-zinc-400" htmlFor="name">
            שם מלא
          </label>
          <input
            id="name"
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
          />
        </>
      )}

      <label className="mt-6 block text-xs text-zinc-400" htmlFor="email">
        אימייל
      </label>
      <input
        id="email"
        type="email"
        required
        autoFocus={!bootstrap}
        dir="ltr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
      />

      <div className="mt-6 flex items-center justify-between">
        <label className="block text-xs text-zinc-400" htmlFor="password">
          סיסמה
        </label>
        {!bootstrap && (
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setError(null);
            }}
            className="text-xs text-zinc-400 hover:text-gold hover:underline"
          >
            שכחתי סיסמה
          </button>
        )}
      </div>
      <input
        id="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
      />

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
      >
        {submitting ? "מתחבר…" : bootstrap ? "יצירת חשבון" : "כניסה"}
      </button>
    </form>
  );
}
