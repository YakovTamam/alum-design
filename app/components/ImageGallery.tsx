"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SerializedGallerySection } from "@/lib/gallery";

export default function ImageGallery({ section }: { section: SerializedGallerySection }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);
  const [shift, setShift] = useState<number | null>(null);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group || section.images.length === 0) return;

    function update() {
      const groupWidth = group!.getBoundingClientRect().width;
      const containerWidth = container!.getBoundingClientRect().width;
      if (groupWidth === 0 || containerWidth === 0) return;
      // One repeat unit = a full set of images plus the gap before the next set
      const setWidth = groupWidth + section.gap;
      // Enough copies that the strip still covers the container after shifting one set
      setCopies(Math.max(2, Math.ceil(containerWidth / setWidth) + 1));
      setShift(setWidth);
      setDuration(setWidth / Math.max(section.speed, 1));
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(group);
    return () => observer.disconnect();
  }, [section.speed, section.gap, section.images]);

  if (!section.enabled || section.images.length === 0) return null;

  return (
    <section className="overflow-hidden bg-panel-light py-12 lg:py-16">
      {section.title && (
        <h2 className="mx-auto mb-8 max-w-7xl px-6 text-center text-2xl font-bold text-zinc-900 sm:text-3xl lg:px-10">
          {section.title}
        </h2>
      )}
      {/* dir=ltr so the overflowing track anchors to the left edge (in RTL it
          would right-align and overflow left, exposing a blank gap mid-loop) */}
      <div ref={containerRef} dir="ltr" className="relative w-full overflow-hidden">
        <div
          className="flex w-max"
          style={
            {
              gap: section.gap,
              "--marquee-shift": shift !== null ? `${shift}px` : undefined,
              animationName: "gallery-marquee",
              animationDuration: `${duration}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDirection: section.direction === "right" ? "reverse" : "normal",
            } as React.CSSProperties
          }
        >
          {Array.from({ length: copies }, (_, c) => (
            <div
              key={c}
              ref={c === 0 ? groupRef : undefined}
              aria-hidden={c > 0}
              className="flex shrink-0"
              style={{ gap: section.gap }}
            >
              {section.images.map((img) => (
                <div
                  key={img.id}
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
          ))}
        </div>
      </div>
    </section>
  );
}
