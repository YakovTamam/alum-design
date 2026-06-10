"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SaveAllContextValue = {
  setDirty: (id: string, dirty: boolean) => void;
  registerSave: (id: string, save: () => Promise<void>) => void;
  unregister: (id: string) => void;
};

const SaveAllContext = createContext<SaveAllContextValue | null>(null);

export function useSaveAll(id: string, dirty: boolean, save: () => Promise<void>) {
  const ctx = useContext(SaveAllContext);

  // Keep the latest save closure registered on every render.
  useEffect(() => {
    ctx?.registerSave(id, save);
  });

  useEffect(() => {
    ctx?.setDirty(id, dirty);
  }, [ctx, id, dirty]);

  useEffect(() => {
    return () => ctx?.unregister(id);
  }, [ctx, id]);
}

export function SaveAllProvider({ children }: { children: ReactNode }) {
  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const saveFns = useRef(new Map<string, () => Promise<void>>());

  const setDirty = useCallback((id: string, dirty: boolean) => {
    setDirtyMap((prev) => {
      if (Boolean(prev[id]) === dirty) return prev;
      return { ...prev, [id]: dirty };
    });
    if (dirty) setStatus("idle");
  }, []);

  const registerSave = useCallback((id: string, save: () => Promise<void>) => {
    saveFns.current.set(id, save);
  }, []);

  const unregister = useCallback((id: string) => {
    saveFns.current.delete(id);
    setDirtyMap((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ setDirty, registerSave, unregister }),
    [setDirty, registerSave, unregister],
  );

  const dirtyIds = Object.keys(dirtyMap).filter((id) => dirtyMap[id]);
  const dirtyCount = dirtyIds.length;

  async function saveAll() {
    setStatus("saving");
    setErrorMessage(null);
    try {
      for (const id of dirtyIds) {
        const fn = saveFns.current.get(id);
        if (fn) await fn();
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "השמירה נכשלה");
    }
  }

  return (
    <SaveAllContext.Provider value={value}>
      <div className="sticky top-0 z-40 -mx-4 mb-4 border-b border-white/10 bg-[#0e0e11]/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            {dirtyCount > 0 ? (
              <span className="font-medium text-amber-400">
                יש {dirtyCount} שינויים שלא נשמרו
              </span>
            ) : status === "saved" ? (
              <span className="font-medium text-green-400">✓ הכל נשמר</span>
            ) : (
              <span className="text-zinc-500">אין שינויים שלא נשמרו</span>
            )}
            {errorMessage && <p className="mt-0.5 text-xs text-red-400">{errorMessage}</p>}
          </div>
          <button
            type="button"
            onClick={saveAll}
            disabled={dirtyCount === 0 || status === "saving"}
            className="rounded-xl border border-gold/40 bg-gold/10 px-5 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "saving" ? "שומר…" : "שמירה כללית"}
          </button>
        </div>
      </div>
      {children}
    </SaveAllContext.Provider>
  );
}
