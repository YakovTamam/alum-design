"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuoteModal } from "./QuoteModalContext";
import { useCookieConsent } from "./CookieConsentContext";

export default function StickyLeadButton() {
  const [visible, setVisible] = useState(false);
  const { open } = useQuoteModal();
  const { bannerVisible } = useCookieConsent();

  // Show button once user scrolls past ~80% of the hero section
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed left-1/2 z-40 -translate-x-1/2 transition-[bottom] duration-300 ${
            bannerVisible ? "bottom-28 sm:bottom-24" : "bottom-6"
          }`}
        >
          <button
            type="button"
            onClick={open}
            className="btn-gold flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-[#1a1308] shadow-xl shadow-gold/30 transition-shadow hover:shadow-gold/50"
          >
            לפנייה מהירה
            <span aria-hidden>←</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
