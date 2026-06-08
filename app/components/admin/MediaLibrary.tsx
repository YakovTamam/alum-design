"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { SerializedMedia } from "@/lib/media";

type MediaLibraryProps = {
  initialMedia: SerializedMedia[];
};

export default function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "ההעלאה נכשלה");
      setMedia((prev) => [data.media as SerializedMedia, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ההעלאה נכשלה");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק את התמונה? פעולה זו תסיר אותה גם מכל מקום באתר שבו היא משויכת.")) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "המחיקה נכשלה");
      setMedia((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "המחיקה נכשלה");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
        >
          {uploading ? "מעלה…" : "העלאת תמונה"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-xs text-zinc-500">JPEG · PNG · WebP · GIF · AVIF — עד 8MB</span>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {media.length === 0 ? (
        <p className="text-sm text-zinc-400">עדיין לא הועלו תמונות.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-panel/60"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={item.url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="truncate text-xs text-zinc-400">
                  {item.width}×{item.height} · {Math.round(item.bytes / 1024)}KB
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="shrink-0 rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                >
                  {deletingId === item._id ? "מוחק…" : "מחיקה"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
