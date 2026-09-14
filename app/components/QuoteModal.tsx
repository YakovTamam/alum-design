"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { phoneToTelHref } from "@/lib/contact";
import { useQuoteModal } from "./QuoteModalContext";
import HoneypotField from "./HoneypotField";

const PROJECT_TYPES = [
  "פרגולות אלומיניום",
  "חלונות ודלתות",
  "שערים ממונעים",
  "סגירות זכוכית",
  "אחר",
];

export default function QuoteModal({ phone: contactPhone }: { phone: string }) {
  const { isOpen, close } = useQuoteModal();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleClose() {
    close();
    // Reset after close animation
    setTimeout(() => {
      setStatus("idle");
      setName("");
      setPhone("");
      setCity("");
      setEmail("");
      setProjectType("");
      setWebsite("");
    }, 300);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "sticky-cta",
          name,
          phone,
          city,
          message: [
            projectType && `סוג עבודה: ${projectType}`,
            email && `מייל: ${email}`,
          ].filter(Boolean).join(" | "),
          website,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={handleClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold">
                  ✓
                </span>
                <h3 className="text-lg font-bold text-zinc-900">הפנייה התקבלה!</h3>
                <p className="text-sm text-zinc-500">נחזור אליכם תוך שעות ספורות.</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400"
                >
                  סגור
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                <HoneypotField value={website} onChange={setWebsite} />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">לפנייה מהירה</h3>
                    <p className="mt-0.5 text-sm text-zinc-500">נחזור אליכם תוך שעות ספורות</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="סגור"
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    ✕
                  </button>
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">אימייל</label>
                    <input
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">סוג עבודה</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/10"
                    >
                      <option value="">בחר...</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-500">משהו השתבש, נסו שוב.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-gold mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-[#1a1308] disabled:opacity-60"
                >
                  {status === "submitting" ? "שולח…" : <>שליחת פנייה <span aria-hidden>←</span></>}
                </button>

                <p className="text-center text-xs text-zinc-400">
                  או חייגו:{" "}
                  <a href={phoneToTelHref(contactPhone)} className="font-medium text-gold hover:underline">{contactPhone}</a>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
