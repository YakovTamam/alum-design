"use client";

import { useState, type FormEvent } from "react";
import { ROLE_LABELS, type SerializedUser, type UserRole, type UserStatus } from "@/lib/user-roles";
import type { SerializedInvitation } from "@/lib/invitations";
import type { SerializedSignupRequest } from "@/lib/signup-requests";
import { sanitizeEmailInput, isValidEmail } from "@/lib/strings";

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

function signupRequestStatus(request: SerializedSignupRequest): { label: string; className: string } {
  if (request.status === "approved") {
    return { label: "אושרה", className: "border-green-500/40 bg-green-500/10 text-green-300" };
  }
  if (request.status === "rejected") {
    return { label: "נדחתה", className: "border-red-500/40 bg-red-500/10 text-red-300" };
  }
  return { label: "ממתינה", className: "border-gold/50 bg-gold/10 text-gold" };
}

export default function UsersManager({
  initialUsers,
  initialInvitations,
  initialSignupRequests,
  canInviteAdmins,
  currentUserId,
}: {
  initialUsers: SerializedUser[];
  initialInvitations: SerializedInvitation[];
  initialSignupRequests: SerializedSignupRequest[];
  canInviteAdmins: boolean;
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [signupRequests, setSignupRequests] = useState(initialSignupRequests);
  const [mode, setMode] = useState<"invite" | "direct">("invite");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidEmail(email)) {
      setError("כתובת אימייל לא תקינה");
      return;
    }

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

  async function handleToggleStatus(user: SerializedUser) {
    const nextStatus: UserStatus = user.status === "disabled" ? "active" : "disabled";
    setStatusError(null);
    setTogglingId(user._id);

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatusError(data.error || "הפעולה נכשלה");
        return;
      }

      setUsers((curr) => curr.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u)));
    } catch {
      setStatusError("שגיאת רשת, נסו שוב");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSignupReview(request: SerializedSignupRequest, action: "approve" | "reject") {
    setSignupError(null);
    setReviewingId(request._id);

    try {
      const res = await fetch(`/api/admin/signup-requests/${request._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSignupError(data.error || "הפעולה נכשלה");
        return;
      }

      setSignupRequests((curr) =>
        curr.map((r) => (r._id === request._id ? data.request : r)),
      );
    } catch {
      setSignupError("שגיאת רשת, נסו שוב");
    } finally {
      setReviewingId(null);
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
              type="text"
              inputMode="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
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

      {/* Signup requests */}
      {signupRequests.length > 0 && (
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">בקשות הרשמה</h2>
          {signupError && <p className="mb-3 text-sm text-red-400">{signupError}</p>}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[700px] text-right text-sm">
              <thead className="bg-panel-light text-xs text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">שם</th>
                  <th className="px-4 py-3 font-medium">אימייל</th>
                  <th className="px-4 py-3 font-medium">טלפון</th>
                  <th className="px-4 py-3 font-medium">עיר</th>
                  <th className="px-4 py-3 font-medium">נשלחה</th>
                  <th className="px-4 py-3 font-medium">סטטוס</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {signupRequests.map((request) => {
                  const status = signupRequestStatus(request);
                  return (
                    <tr key={request._id} className="text-zinc-200">
                      <td className="px-4 py-3 font-medium text-white">{request.name}</td>
                      <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                        {request.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                        {request.phone}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{request.city}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSignupReview(request, "approve")}
                              disabled={reviewingId === request._id}
                              className="rounded-lg border border-gold/50 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10 disabled:opacity-60"
                            >
                              {reviewingId === request._id ? "מעדכן…" : "אישור"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSignupReview(request, "reject")}
                              disabled={reviewingId === request._id}
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-300 disabled:opacity-60"
                            >
                              {reviewingId === request._id ? "מעדכן…" : "דחייה"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
        {statusError && <p className="mb-3 text-sm text-red-400">{statusError}</p>}
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
                  <th className="px-4 py-3 font-medium">סטטוס</th>
                  <th className="px-4 py-3 font-medium">נוצר</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => {
                  const isDisabled = user.status === "disabled";
                  const canManage =
                    user._id !== currentUserId &&
                    user.role !== "super-admin" &&
                    (canInviteAdmins || user.role === "client");
                  return (
                    <tr key={user._id} className="text-zinc-200">
                      <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                      <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{ROLE_LABELS[user.role]}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs ${
                            isDisabled
                              ? "border-red-500/40 bg-red-500/10 text-red-300"
                              : "border-green-500/40 bg-green-500/10 text-green-300"
                          }`}
                        >
                          {isDisabled ? "מושבת" : "פעיל"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            disabled={togglingId === user._id}
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-60"
                          >
                            {togglingId === user._id ? "מעדכן…" : isDisabled ? "הפעלה" : "השבתה"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
