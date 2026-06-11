"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "איפוס הסיסמה נכשל");
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

  return (
    <form onSubmit={handleSubmit}>
      <label className="mt-6 block text-xs text-zinc-400" htmlFor="password">
        סיסמה חדשה (לפחות 8 תווים)
      </label>
      <input
        id="password"
        type="password"
        required
        autoFocus
        minLength={8}
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
        {submitting ? "מעדכן…" : "עדכון סיסמה"}
      </button>
    </form>
  );
}
