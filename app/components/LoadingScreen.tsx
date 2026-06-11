"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SITE_NAME_PRIMARY, SITE_NAME_SECONDARY } from "@/lib/site";

function AlumMark() {
  return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="shrink-0">
      <rect x="2" y="2" width="28" height="28" rx="3" stroke="#cfa15c" strokeWidth="1.5" />
      <rect x="10" y="2" width="2" height="28" fill="#cfa15c" opacity="0.5" />
      <rect x="20" y="2" width="2" height="28" fill="#cfa15c" opacity="0.5" />
      <rect x="2" y="12" width="28" height="2" fill="#cfa15c" opacity="0.5" />
      <rect x="2" y="20" width="28" height="2" fill="#cfa15c" opacity="0.5" />
      <rect x="6" y="6" width="4" height="4" fill="#cfa15c" opacity="0.2" />
      <rect x="14" y="6" width="4" height="4" fill="#cfa15c" opacity="0.2" />
      <rect x="22" y="6" width="4" height="4" fill="#cfa15c" opacity="0.2" />
    </svg>
  );
}

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const MIN_DURATION = 1100;
    const MAX_DURATION = 4000;
    let settled = false;
    let minTimer: number;

    function finish() {
      if (settled) return;
      settled = true;
      const remaining = Math.max(0, MIN_DURATION - (Date.now() - start));
      minTimer = window.setTimeout(() => setLoading(false), remaining);
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }
    const maxTimer = window.setTimeout(finish, MAX_DURATION);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = loading ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-[#0b0a09]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <AlumMark />
            <div className="flex flex-col items-center leading-none">
              <span className="text-xl font-black tracking-[0.4em] text-white">{SITE_NAME_PRIMARY}</span>
              <span className="mt-2 text-[11px] font-light tracking-[0.65em] text-gold">
                {SITE_NAME_SECONDARY}
              </span>
            </div>
          </motion.div>
          <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
