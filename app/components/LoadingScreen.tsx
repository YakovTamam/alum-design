"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { DEFAULT_LOADING_SCREEN, type LoadingScreenSettings } from "@/lib/loading-screen";
import { getSiteName, DEFAULT_SITE_IDENTITY, type SiteIdentity } from "@/lib/site-copy";

function AlumMark({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="shrink-0">
      <rect x="2" y="2" width="28" height="28" rx="3" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="2" width="2" height="28" fill={color} opacity="0.5" />
      <rect x="20" y="2" width="2" height="28" fill={color} opacity="0.5" />
      <rect x="2" y="12" width="28" height="2" fill={color} opacity="0.5" />
      <rect x="2" y="20" width="28" height="2" fill={color} opacity="0.5" />
      <rect x="6" y="6" width="4" height="4" fill={color} opacity="0.2" />
      <rect x="14" y="6" width="4" height="4" fill={color} opacity="0.2" />
      <rect x="22" y="6" width="4" height="4" fill={color} opacity="0.2" />
    </svg>
  );
}

type Props = {
  settings?: LoadingScreenSettings;
  logoUrl?: string;
  siteIdentity?: SiteIdentity;
};

export default function LoadingScreen({ settings = DEFAULT_LOADING_SCREEN, logoUrl, siteIdentity = DEFAULT_SITE_IDENTITY }: Props) {
  const [loading, setLoading] = useState(settings.enabled);

  useEffect(() => {
    if (!settings.enabled) return;

    const start = Date.now();
    let settled = false;
    let minTimer: number;

    function finish() {
      if (settled) return;
      settled = true;
      const remaining = Math.max(0, settings.minDuration - (Date.now() - start));
      minTimer = window.setTimeout(() => setLoading(false), remaining);
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }
    const maxTimer = window.setTimeout(finish, settings.maxDuration);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, [settings.enabled, settings.minDuration, settings.maxDuration]);

  useEffect(() => {
    if (!settings.enabled) return;
    document.documentElement.style.overflow = loading ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [loading, settings.enabled]);

  if (!settings.enabled) return null;

  const showLogo = settings.useSiteLogo && Boolean(logoUrl);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7"
          style={{ backgroundColor: settings.backgroundColor }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            {showLogo ? (
              <div className="relative h-12 w-40">
                <Image src={logoUrl!} alt={getSiteName(siteIdentity)} fill sizes="160px" className="object-contain" />
              </div>
            ) : (
              <>
                <AlumMark color={settings.accentColor} />
                <div className="flex flex-col items-center leading-none">
                  <span className="text-xl font-black tracking-[0.4em] text-white">{siteIdentity.namePrimary}</span>
                  <span
                    className="mt-2 text-[11px] font-light tracking-[0.65em]"
                    style={{ color: settings.accentColor }}
                  >
                    {siteIdentity.nameSecondary}
                  </span>
                </div>
              </>
            )}
          </motion.div>
          <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-1/3"
              style={{ background: `linear-gradient(to right, transparent, ${settings.accentColor}, transparent)` }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
