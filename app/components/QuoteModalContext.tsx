"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type QuoteModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value: QuoteModalContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
  return <QuoteModalContext.Provider value={value}>{children}</QuoteModalContext.Provider>;
}

// Every consumer is rendered under QuoteModalProvider (mounted once in the
// root layout), so a missing provider here means a real wiring bug.
export function useQuoteModal(): QuoteModalContextValue {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error("useQuoteModal must be used within QuoteModalProvider");
  return ctx;
}
