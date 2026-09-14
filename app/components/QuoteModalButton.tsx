"use client";

import type { ReactNode } from "react";
import { useQuoteModal } from "./QuoteModalContext";

export default function QuoteModalButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { open } = useQuoteModal();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
