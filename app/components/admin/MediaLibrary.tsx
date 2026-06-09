"use client";

import { useRef, useState, useCallback, type ChangeEvent } from "react";
import Image from "next/image";
import type { SerializedMedia } from "@/lib/media";

type UploadQueueItem = {
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

type MediaLibraryProps = {
  initialMedia: SerializedMedia[];
};

export default function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [media, setMedia] = useState(initialMedia);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUploading = uploadQueue.some((item) => item.status === "pending" || item.status === "uploading");

  const uploadFile = useCallback(async (file: File, index: number): Promise<void> => {
    setUploadQueue((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: "uploading" };
      return next;
    });

    try {
      // Step 1: Get signature from server
      const signRes = await fetch("/api/admin/media/sign", { method: "POST" });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData?.error ?? "חתימה נכשלה");

      const { signature, timestamp, apiKey, cloudName, folder } = signData as {
        signature: string;
        timestamp: number;
        apiKey: string;
        cloudName: string;
        folder: string;
      };

      // Step 2: Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: formData }
      );
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData?.error?.message ?? "ההעלאה נכשלה");

      // Step 3: Save metadata to MongoDB
      const metaRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: uploadData.public_id,
          url: uploadData.secure_url,
          width: uploadData.width ?? 0,
          height: uploadData.height ?? 0,
          format: uploadData.format ?? "",
          bytes: uploadData.bytes ?? 0,
          fileType: uploadData.resource_type,
        }),
      });
      const metaData = await metaRes.json();
      if (!metaRes.ok) throw new Error(metaData?.error ?? "שמירת המטא-דאטה נכשלה");

      setMedia((prev) => [metaData.media as SerializedMedia, ...prev]);

      setUploadQueue((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], status: "done" };
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "ההעלאה נכשלה";
      setUploadQueue((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], status: "error", error: message };
        return next;
      });
    }
  }, []);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";
      if (files.length === 0) return;

      setError(null);

      const initialQueue: UploadQueueItem[] = files.map((f) => ({
        name: f.name,
        status: "pending",
      }));
      setUploadQueue(initialQueue);

      // Upload sequentially
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], i);
      }
    },
    [uploadFile]
  );

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("למחוק את הקובץ? פעולה זו תסיר אותו גם מכל מקום באתר שבו הוא משויך.")) return;

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
  }, []);

  const uploadingCount = uploadQueue.filter((item) => item.status === "uploading").length;
  const doneCount = uploadQueue.filter((item) => item.status === "done").length;
  const totalCount = uploadQueue.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
        >
          {isUploading ? `מעלה ${doneCount + (uploadingCount > 0 ? 1 : 0)}/${totalCount}...` : "העלאת קבצים"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-xs text-zinc-500">
          JPEG · PNG · WebP · GIF · AVIF · MP4 · WebM — ללא הגבלת גודל
        </span>
      </div>

      {/* Upload queue status */}
      {uploadQueue.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {uploadQueue.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span
                className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                  item.status === "done"
                    ? "bg-green-400"
                    : item.status === "error"
                    ? "bg-red-400"
                    : item.status === "uploading"
                    ? "bg-gold animate-pulse"
                    : "bg-zinc-500"
                }`}
              />
              <span className="truncate text-zinc-400">{item.name}</span>
              {item.status === "error" && item.error && (
                <span className="text-red-400">— {item.error}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {media.length === 0 ? (
        <p className="text-sm text-zinc-400">עדיין לא הועלו קבצים.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-panel/60"
            >
              <div className="relative aspect-square w-full">
                {item.fileType === "video" ? (
                  <video
                    src={item.url + "#t=0.001"}
                    className="absolute inset-0 h-full w-full object-cover"
                    preload="metadata"
                    muted
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                )}
                {/* Video badge */}
                {item.fileType === "video" && (
                  <span className="absolute left-2 top-2 rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-semibold text-[#1a1308]">
                    וידאו
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="truncate text-xs text-zinc-400">
                  {item.fileType === "video"
                    ? `${Math.round(item.bytes / 1024 / 1024)}MB`
                    : `${item.width}×${item.height} · ${Math.round(item.bytes / 1024)}KB`}
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
