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

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = clamp(
        ((-rect.top) / (el.offsetHeight - window.innerHeight)) * 100,
        0,
        100
      );
      setProgress(p);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 1) {
      video.currentTime = (progress / 100) * video.duration;
    }
  }, [progress]);

  if (!section.videoUrl) return null;

  return (
    <section
      ref={sectionRef}
      style={{ height: `${section.sectionHeight}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <video
          ref={videoRef}
          src={section.videoUrl}
          preload="auto"
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

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
