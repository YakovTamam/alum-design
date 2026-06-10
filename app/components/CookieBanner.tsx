"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[55] border-t border-white/10 bg-[#1a1614]/95 backdrop-blur-md"
          role="dialog"
          aria-label="הודעת עוגיות"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-4 text-sm leading-7 text-zinc-300 sm:flex-row sm:justify-between lg:px-10">
            <p>
              אנו משתמשים בעוגיות (Cookies) כדי לשפר את חוויית הגלישה שלכם, להציג
              תוכן מותאם אישית ולנתח את השימוש באתר. בהמשך הגלישה הינכם מסכימים
              למדיניות העוגיות שלנו.
            </p>
            <button
              type="button"
              onClick={accept}
              className="btn-gold shrink-0 whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold text-[#1a1308]"
            >
              אישור
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
