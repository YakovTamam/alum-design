"use client";

import { useState } from "react";
import type { SerializedSiteCopy, NavLink, ServiceItem, CategoryVariant, SiteIdentity } from "@/lib/site-copy";
import { ServiceIconSvg, SERVICE_ICONS, type ServiceIcon } from "@/lib/services";
import { useSaveAll } from "./SaveAllContext";

const VARIANT_LABELS: Record<CategoryVariant, string> = {
  warm: "חם (כתום)",
  cool: "קר (כחול)",
};

type Props = {
  initialCopy: SerializedSiteCopy;
  categorySlots: ReadonlyArray<{ key: string; label: string }>;
};

export default function SiteCopyManager({ initialCopy, categorySlots }: Props) {
  const slotLabels: Record<string, string> = Object.fromEntries(
    categorySlots.map((s) => [s.key, s.label]),
  );
  const [copy, setCopy] = useState(initialCopy);
  const [persisted, setPersisted] = useState(initialCopy);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function persist(): Promise<void> {
    const res = await fetch("/api/admin/site-copy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copy),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "השמירה נכשלה");
    setCopy(data.copy);
    setPersisted(data.copy);
  }

  const dirty = JSON.stringify(copy) !== JSON.stringify(persisted);
  useSaveAll("site-copy", dirty, persist);

  async function save() {
    setStatus("saving");
    setError(null);
    try {
      await persist();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "השמירה נכשלה");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // --- Nav links ---
  function updateNavLink(index: number, patch: Partial<NavLink>) {
    setCopy((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }));
  }

  function addNavLink() {
    setCopy((prev) => ({ ...prev, navLinks: [...prev.navLinks, { label: "", href: "" }] }));
  }

  function removeNavLink(index: number) {
    setCopy((prev) => ({ ...prev, navLinks: prev.navLinks.filter((_, i) => i !== index) }));
  }

  function moveNavLink(index: number, dir: -1 | 1) {
    setCopy((prev) => {
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= prev.navLinks.length) return prev;
      const next = [...prev.navLinks];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return { ...prev, navLinks: next };
    });
  }

  // --- Site identity ---
  function updateSiteIdentity(patch: Partial<SiteIdentity>) {
    setCopy((prev) => ({ ...prev, siteIdentity: { ...prev.siteIdentity, ...patch } }));
  }

  // --- Categories ---
  function updateCategory(index: number, patch: Partial<{ title: string; desc: string; variant: CategoryVariant }>) {
    setCopy((prev) => ({
      ...prev,
      categories: prev.categories.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
  }

  // --- Services ---
  function updateService(index: number, patch: Partial<ServiceItem>) {
    setCopy((prev) => ({
      ...prev,
      services: prev.services.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  function addService() {
    setCopy((prev) => ({
      ...prev,
      services: [...prev.services, { id: crypto.randomUUID(), label: "", desc: "", icon: "pergola" }],
    }));
  }

  function removeService(index: number) {
    setCopy((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
  }

  function moveService(index: number, dir: -1 | 1) {
    setCopy((prev) => {
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= prev.services.length) return prev;
      const next = [...prev.services];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return { ...prev, services: next };
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Site identity */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-white">זהות האתר</h3>
        <p className="mb-3 text-xs text-zinc-500">
          שם האתר (מוצג בלוגו הטקסטואלי בכותרת, בפוטר ובמסכי ניהול) והטאגליין המשווקת.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={copy.siteIdentity.namePrimary}
            onChange={(e) => updateSiteIdentity({ namePrimary: e.target.value })}
            placeholder="שם ראשי (לדוגמה ALUM)"
            dir="ltr"
            className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
          />
          <input
            value={copy.siteIdentity.nameSecondary}
            onChange={(e) => updateSiteIdentity({ nameSecondary: e.target.value })}
            placeholder="שם משני (לדוגמה DESIGN)"
            dir="ltr"
            className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
          />
          <input
            value={copy.siteIdentity.tagline}
            onChange={(e) => updateSiteIdentity({ tagline: e.target.value })}
            placeholder="טאגליין"
            className="flex-[2] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
          />
        </div>
      </div>

      {/* Nav links */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">קישורי ניווט בכותרת</h3>
          <button
            type="button"
            onClick={addNavLink}
            className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold transition-colors hover:bg-gold/20"
          >
            + הוספת קישור
          </button>
        </div>
        <p className="mb-3 text-xs text-zinc-500">
          הטקסט וכתובת הקישור (לדוגמה <span dir="ltr">#contact</span> לעוגן בעמוד, או <span dir="ltr">/projects</span> לעמוד נפרד).
        </p>
        <div className="flex flex-col gap-2">
          {copy.navLinks.map((link, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 p-2">
              <input
                value={link.label}
                onChange={(e) => updateNavLink(idx, { label: e.target.value })}
                placeholder="טקסט הקישור"
                className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
              />
              <input
                value={link.href}
                onChange={(e) => updateNavLink(idx, { href: e.target.value })}
                placeholder="#contact"
                dir="ltr"
                className="w-40 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveNavLink(idx, -1)}
                  disabled={idx === 0}
                  className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="הזז למעלה"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveNavLink(idx, 1)}
                  disabled={idx === copy.navLinks.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="הזז למטה"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeNavLink(idx)}
                  className="flex h-7 w-7 items-center justify-center rounded text-red-400 transition-colors hover:bg-red-500/10"
                  aria-label="הסר"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-white">קטגוריות פרויקטים</h3>
        <p className="mb-3 text-xs text-zinc-500">
          כותרת ותיאור לכל קטגוריה. התמונה של כל קטגוריה מוגדרת בנפרד בסקשן &quot;קטגוריות פרויקטים&quot; שמופיע במקום אחר בעמוד זה.
        </p>
        <div className="flex flex-col gap-3">
          {copy.categories.map((cat, idx) => (
            <div key={cat.slot} className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
              <p className="mb-2 text-[11px] text-zinc-500">{slotLabels[cat.slot] ?? cat.slot}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={cat.title}
                  onChange={(e) => updateCategory(idx, { title: e.target.value })}
                  placeholder="כותרת"
                  className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
                />
                <input
                  value={cat.desc}
                  onChange={(e) => updateCategory(idx, { desc: e.target.value })}
                  placeholder="תיאור"
                  className="flex-[2] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
                />
                <div className="flex gap-1">
                  {(Object.keys(VARIANT_LABELS) as CategoryVariant[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateCategory(idx, { variant: v })}
                      className={`flex-1 rounded px-2 py-2 text-[11px] font-medium transition-colors ${
                        cat.variant === v ? "bg-gold/20 text-gold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {VARIANT_LABELS[v]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">מערכת השירותים</h3>
          <button
            type="button"
            onClick={addService}
            className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold transition-colors hover:bg-gold/20"
          >
            + הוספת שירות
          </button>
        </div>
        <p className="mb-3 text-xs text-zinc-500">
          הכרטיסים המוצגים בסקשן &quot;מערכת פתרונות&quot; ובעמודת &quot;מערכות&quot; בפוטר.
        </p>
        <div className="flex flex-col gap-3">
          {copy.services.map((svc, idx) => (
            <div key={svc.id} className="rounded-lg border border-white/[0.07] bg-black/20 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="flex gap-1">
                  {SERVICE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => updateService(idx, { icon })}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        svc.icon === icon ? "border-gold/60 bg-gold/10 text-gold" : "border-white/10 text-zinc-500 hover:text-zinc-300"
                      }`}
                      aria-label={icon}
                    >
                      <span className="scale-[0.7]">
                        <ServiceIconSvg kind={icon as ServiceIcon} />
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input
                    value={svc.label}
                    onChange={(e) => updateService(idx, { label: e.target.value })}
                    placeholder="שם השירות"
                    className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
                  />
                  <input
                    value={svc.desc}
                    onChange={(e) => updateService(idx, { desc: e.target.value })}
                    placeholder="תיאור"
                    className="flex-[2] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveService(idx, -1)}
                    disabled={idx === 0}
                    className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    aria-label="הזז למעלה"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveService(idx, 1)}
                    disabled={idx === copy.services.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    aria-label="הזז למטה"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeService(idx)}
                    className="flex h-7 w-7 items-center justify-center rounded text-red-400 transition-colors hover:bg-red-500/10"
                    aria-label="הסר"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={status === "saving"}
        className={`rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
          status === "saved"
            ? "border border-green-500/40 bg-green-500/10 text-green-400"
            : status === "error"
              ? "border border-red-500/40 bg-red-500/10 text-red-400"
              : "border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
        }`}
      >
        {status === "saving" ? "שומר…" : status === "saved" ? "✓ נשמר" : status === "error" ? "שגיאה" : "שמור שינויים"}
      </button>
    </div>
  );
}
