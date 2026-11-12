"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { setScrollLocked } from "@/components/SmoothScrollProvider";
import type { Shot } from "@/lib/portfolio";

/**
 * PHOTO VIEWER — a photograph full screen, on black, with its title and a
 * short description beneath.
 *
 * Arrow keys, the side buttons or a swipe move between photographs; Esc, the
 * close button or a click on the empty black closes it and returns focus to
 * whatever was focused when it opened. The caption sits in its own band below
 * the picture, never over it. Mount it only while it is open.
 */
interface PhotoViewerProps {
  shots: Shot[];
  index: number;
  /** Names the viewer for screen readers. */
  name: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}

const circle =
  "grid h-11 w-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)] transition-colors duration-300 hover:bg-[#D8B479] hover:text-black hover:shadow-none focus-visible:bg-[#D8B479] focus-visible:text-black focus-visible:outline-none sm:h-12 sm:w-12";

export default function PhotoViewer({ shots, index, name, onIndex, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<number | null>(null);
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const total = shots.length;
  const shot = shots[index];

  /* Lock the page behind, take focus, give it back on the way out. */
  useEffect(() => {
    setScrollLocked("photo-viewer", true);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      setScrollLocked("photo-viewer", false);
      opener?.focus({ preventScroll: true });
    };
  }, [opener]);

  /* Keyboard. */
  useEffect(() => {
    const step = (d: number) => onIndex((index + d + total) % total);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        // Keep keyboard focus inside the viewer.
        const f = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!f || !f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onIndex, onClose]);

  if (!shot) return null;
  const step = (d: number) => onIndex((index + d + total) % total);
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photographs`}
      className="fixed inset-0 z-[160] flex flex-col bg-[#000000] text-white"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-10 sm:pt-7">
        <span className="text-[0.66rem] tabular-nums uppercase tracking-[0.28em] text-white/60">{counter}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close full-screen view" className={circle}>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3 3 13" />
          </svg>
        </button>
      </div>

      {/* Photograph */}
      <div
        className="relative min-h-0 flex-1 touch-pan-y"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onPointerDown={(e) => {
          swipe.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
        }}
      >
        <div className="absolute inset-x-4 inset-y-0 sm:inset-x-24" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <Image
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            fill
            priority
            quality={85}
            sizes="100vw"
            className="u-fade-up object-contain"
            draggable={false}
          />
        </div>
        {total > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Previous photograph" className={`${circle} absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 max-sm:bottom-2 max-sm:top-auto max-sm:translate-y-0 sm:left-8`}>
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3 5 8l5 5" />
              </svg>
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next photograph" className={`${circle} absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 max-sm:bottom-2 max-sm:top-auto max-sm:translate-y-0 sm:right-8`}>
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 3 5 5-5 5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Caption, in its own band under the picture */}
      <div key={shot.title} className="u-fade-up mx-auto w-full max-w-3xl px-6 pb-7 pt-5 text-center sm:pb-9">
        <p className="font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] font-light leading-[1.2]">{shot.title}</p>
        <p className="mx-auto mt-3 max-w-xl text-[0.92rem] leading-[1.75] text-white/65">{shot.note}</p>
      </div>
    </div>,
    document.body
  );
}
