"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SerializedGallerySection } from "@/lib/gallery";

export default function ImageGallery({ section }: { section: SerializedGallerySection }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || section.images.length === 0) return;

    function update() {
      const trackWidth = el!.scrollWidth / 2;
      const speed = Math.max(section.speed, 1);
      setDuration(trackWidth / speed);
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [section.speed, section.images]);

  if (!section.enabled || section.images.length === 0) return null;

  const items = [...section.images, ...section.images];

  return (
    <section className="overflow-hidden bg-panel-light py-12 lg:py-16">
      {section.title && (
        <h2 className="mx-auto mb-8 max-w-7xl px-6 text-center text-2xl font-bold text-zinc-900 sm:text-3xl lg:px-10">
          {section.title}
        </h2>
      )}
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          dir="ltr"
          className="flex w-max"
          style={{
            gap: section.gap,
            animationName: "gallery-marquee",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: section.direction === "right" ? "reverse" : "normal",
          }}
        >
          {items.map((img, i) => (
            <div
              key={`${img.id}-${i}`}
              className="shrink-0 overflow-hidden rounded-2xl"
              style={{ height: section.height }}
            >
              <Image
                src={img.url}
                alt=""
                width={img.width}
                height={img.height}
                className="object-cover"
                style={{ height: section.height, width: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
