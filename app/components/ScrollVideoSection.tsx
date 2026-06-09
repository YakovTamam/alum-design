"use client";

import { useRef, useState, useEffect } from "react";
import type { SerializedScrollSection, TextOverlay, FontSize } from "@/lib/scroll-sections";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

const FS: Record<FontSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-4xl",
};

function getOverlayValues(
  o: TextOverlay,
  p: number
): { opacity: number; transform: string } {
  let opacity = 0;
  let t = 0;
  let phase: "pre" | "enter" | "visible" | "exit" | "post" = "pre";

  if (p < o.enterAt) {
    phase = "pre";
    opacity = 0;
    t = 0;
  } else if (p < o.enterAt + o.enterDuration) {
    phase = "enter";
    t = (p - o.enterAt) / o.enterDuration;
    opacity = t;
  } else if (p < o.exitAt) {
    phase = "visible";
    opacity = 1;
    t = 1;
  } else if (p < o.exitAt + o.exitDuration) {
    phase = "exit";
    t = (p - o.exitAt) / o.exitDuration;
    opacity = 1 - t;
  } else {
    phase = "post";
    opacity = 0;
    t = 1;
  }

  const anim =
    phase === "exit" || phase === "post" ? o.exitAnim : o.enterAnim;
  const animT =
    phase === "exit"
      ? t
      : phase === "post"
      ? 1
      : phase === "enter"
      ? t
      : 1;
  const d =
    (1 - (phase === "exit" || phase === "post" ? 1 - animT : animT)) * 36;

  let transform = "none";
  if (anim === "slide-up") {
    transform = `translateY(${
      phase === "pre" || phase === "enter"
        ? d
        : phase === "exit" || phase === "post"
        ? -d
        : 0
    }px)`;
  } else if (anim === "slide-down") {
    transform = `translateY(${
      phase === "pre" || phase === "enter"
        ? -d
        : phase === "exit" || phase === "post"
        ? d
        : 0
    }px)`;
  } else if (anim === "slide-left") {
    transform = `translateX(${
      phase === "pre" || phase === "enter"
        ? d
        : phase === "exit" || phase === "post"
        ? -d
        : 0
    }px)`;
  } else if (anim === "slide-right") {
    transform = `translateX(${
      phase === "pre" || phase === "enter"
        ? -d
        : phase === "exit" || phase === "post"
        ? d
        : 0
    }px)`;
  } else if (anim === "zoom") {
    const s =
      phase === "pre"
        ? 0.85
        : phase === "enter"
        ? 0.85 + animT * 0.15
        : phase === "exit"
        ? 1 - t * 0.15
        : phase === "post"
        ? 0.85
        : 1;
    transform = `scale(${s})`;
  }

  return { opacity, transform };
}

type Props = {
  section: SerializedScrollSection;
};

export default function ScrollVideoSection({ section }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Track the sticky site header's height so the video can fill the
  // remaining viewport below it instead of being covered by it
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setHeaderHeight(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // rAF-throttled scroll progress, robust against 0 / negative scroll range
  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight + headerHeight;
      const p = range > 0 ? clamp((-rect.top / range) * 100, 0, 100) : 0;
      setProgress(p);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerHeight]);

  // Wait for the video to actually be ready before scrubbing it
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function markReady() {
      if (!video) return;
      setReady(true);
      // iOS Safari only renders seeked frames after the video has played once
      const playPromise = video.play();
      if (playPromise) playPromise.then(() => video.pause()).catch(() => {});
    }

    if (video.readyState >= 1) {
      markReady();
    } else {
      video.addEventListener("loadedmetadata", markReady);
      return () => video.removeEventListener("loadedmetadata", markReady);
    }
  }, []);

  // Sync the video frame to scroll progress once it's ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;
    const duration = video.duration;
    if (!isFinite(duration) || duration <= 0) return;

    const target = (progress / 100) * duration;
    if (Math.abs(video.currentTime - target) > 0.05) {
      video.currentTime = target;
    }
  }, [progress, ready]);

  if (!section.videoUrl) return null;

  return (
    <section
      ref={sectionRef}
      style={{ height: `${section.sectionHeight}vh` }}
      className="relative"
    >
      <div
        className="sticky overflow-hidden"
        style={{ top: headerHeight, height: `calc(100svh - ${headerHeight}px)` }}
      >
        <video
          ref={videoRef}
          src={section.videoUrl}
          preload="auto"
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b0a09]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/25 border-t-gold" />
          </div>
        )}

        {section.overlays.map((overlay) => {
          const { opacity, transform } = getOverlayValues(overlay, progress);
          return (
            <div
              key={overlay.id}
              className="absolute"
              style={{
                left: `${overlay.x}%`,
                top: `${overlay.y}%`,
                pointerEvents: opacity > 0.05 ? "auto" : "none",
              }}
            >
              <div
                className={`${FS[overlay.fontSize]} max-w-[70vw]`}
                style={{
                  transform: `translate(-50%, -50%) ${transform}`,
                  opacity,
                  color: overlay.color,
                  fontWeight: overlay.fontWeight,
                  textAlign:
                    overlay.align === "start"
                      ? "right"
                      : overlay.align === "end"
                      ? "left"
                      : "center",
                  willChange: "opacity, transform",
                }}
              >
                {overlay.text}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
