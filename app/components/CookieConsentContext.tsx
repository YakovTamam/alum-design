"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "cookie-consent";

type CookieConsentContextValue = {
  bannerVisible: boolean;
  accept: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      if (!localStorage.getItem(STORAGE_KEY)) setBannerVisible(true);
    } catch {
      setBannerVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setBannerVisible(false);
  }

  return (
    <CookieConsentContext.Provider value={{ bannerVisible, accept }}>{children}</CookieConsentContext.Provider>
  );
}

// Every consumer is rendered under CookieConsentProvider (mounted once in
// the root layout), so a missing provider here means a real wiring bug.
export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}
