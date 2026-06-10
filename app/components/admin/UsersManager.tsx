"use client";

import { useState, type FormEvent } from "react";
import { ROLE_LABELS, type SerializedUser, type UserRole } from "@/lib/user-roles";
import type { SerializedInvitation } from "@/lib/invitations";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(value),
  );
}

function invitationStatus(invite: SerializedInvitation): { label: string; className: string } {
  if (invite.usedAt) return { label: "נוצלה", className: "border-zinc-500/40 bg-zinc-500/10 text-zinc-400" };
  if (new Date(invite.expiresAt).getTime() < Date.now()) {
    return { label: "פגה", className: "border-red-500/40 bg-red-500/10 text-red-300" };
  }
  return { label: "ממתינה", className: "border-gold/50 bg-gold/10 text-gold" };
}

export default function UsersManager({
  initialUsers,
  initialInvitations,
  canInviteAdmins,
}: {
  initialUsers: SerializedUser[];
  initialInvitations: SerializedInvitation[];
  canInviteAdmins: boolean;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [mode, setMode] = useState<"invite" | "direct">("invite");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "direct" ? { email, role, name, password } : { email, role },
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "הפעולה נכשלה");
        return;
      }

      if (mode === "direct") {
        setUsers((curr) => [data.user, ...curr]);
        setName("");
        setPassword("");
        setSuccess("המשתמש נוצר בהצלחה");
      } else {
        setInvitations((curr) => [data.invitation, ...curr]);
        setSuccess("ההזמנה נשלחה בהצלחה");
      }
      setEmail("");
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Invite / create form */}
      <div className="rounded-2xl border border-white/10 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">הוספת משתמש חדש</h2>

        {/* Mode toggle */}
        <div className="mb-4 inline-flex rounded-xl border border-white/10 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("invite")}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              mode === "invite" ? "bg-gold/15 text-gold" : "text-zinc-400 hover:text-white"
            }`}
          >
            הזמנה באימייל
          </button>
          <button
            type="button"
            onClick={() => setMode("direct")}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              mode === "direct" ? "bg-gold/15 text-gold" : "text-zinc-400 hover:text-white"
            }`}
          >
            יצירה ישירה עם סיסמה
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
          {mode === "direct" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="invite-name">
                שם
              </label>
              <input
                id="invite-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-40 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400" htmlFor="invite-email">
              אימייל
            </label>
            <input
              id="invite-email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-64 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
            />
          </div>

          {mode === "direct" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="invite-password">
                סיסמה
              </label>
              <input
                id="invite-password"
                type="text"
                required
                minLength={8}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="לפחות 8 תווים"
                className="w-44 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              />
            </div>
          )}

          {canInviteAdmins && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="invite-role">
                תפקיד
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              >
                <option value="client" className="bg-panel">
                  {ROLE_LABELS.client}
                </option>
                <option value="admin" className="bg-panel">
                  {ROLE_LABELS.admin}
                </option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {submitting ? "שולח…" : mode === "direct" ? "יצירת משתמש" : "שליחת הזמנה"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-400">{success}</p>}
      </div>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">הזמנות</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[600px] text-right text-sm">
              <thead className="bg-panel-light text-xs text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">אימייל</th>
                  <th className="px-4 py-3 font-medium">תפקיד</th>
                  <th className="px-4 py-3 font-medium">נשלחה</th>
                  <th className="px-4 py-3 font-medium">תוקף</th>
                  <th className="px-4 py-3 font-medium">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invitations.map((invite) => {
                  const status = invitationStatus(invite);
                  return (
                    <tr key={invite._id} className="text-zinc-200">
                      <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                        {invite.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{ROLE_LABELS[invite.role]}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                        {formatDate(invite.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                        {formatDate(invite.expiresAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Existing users */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">משתמשים</h2>
        {users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
            אין משתמשים להצגה.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[600px] text-right text-sm">
              <thead className="bg-panel-light text-xs text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">שם</th>
                  <th className="px-4 py-3 font-medium">אימייל</th>
                  <th className="px-4 py-3 font-medium">תפקיד</th>
                  <th className="px-4 py-3 font-medium">נוצר</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="text-zinc-200">
                    <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                    <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{ROLE_LABELS[user.role]}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
