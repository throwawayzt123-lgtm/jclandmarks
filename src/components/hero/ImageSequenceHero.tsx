"use client";

import {
 useCallback,
 useEffect,
 useLayoutEffect,
 useRef,
 useState,
} from"react";
import { gsap, ScrollTrigger, prefersReducedMotion } from"@/lib/gsap";
import { HERO_SEQUENCE, type FrameSequenceConfig } from"@/lib/frameSequence";
import { useFrameSequence } from"./useFrameSequence";
import FrameLoader from"./FrameLoader";
import { REVEAL_RATIO } from"./useFrameSequence";
import HeroOverlay from"./HeroOverlay";

interface ImageSequenceHeroProps {
  /** Sequence to scrub. Defaults to the villa arrival sequence. */
 sequence?: FrameSequenceConfig;
  /**
   * Scroll distance, in viewport heights, consumed by the pinned sequence.
   * Higher = slower, more cinematic.
   */
 scrollLengthVh?: number;
}

/** Cap DPR — beyond 2x the extra pixels cost far more than they show. */
const MAX_DPR = 2;

/** Below this width the frame is biased upward to protect the architecture. */
const MOBILE_BREAKPOINT = 768;

/**
 * Cinematic scroll-scrubbed image sequence rendered to a single canvas.
 *
 * The section is pinned for `scrollLengthVh` viewports; scroll progress maps
 * linearly onto the frame index, so scrolling up scrubs backwards.
 */
export default function ImageSequenceHero({
 sequence = HERO_SEQUENCE,
 scrollLengthVh = 5.5,
}: ImageSequenceHeroProps) {
 const sectionRef = useRef<HTMLElement>(null);
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  /** Frame currently painted — guards against redundant draws. */
 const paintedRef = useRef(-1);
  /** The bitmap actually drawn — may be a neighbour while the exact frame decodes. */
 const paintedBitmapRef = useRef<ImageBitmap | null>(null);
  /** Scrub target, written by ScrollTrigger, read when repainting. */
 const targetFrameRef = useRef(0);
  /** Canvas box size in CSS pixels, plus the DPR it was sized for. */
 const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

 const { frameAt, progress, ready, decodedTick, isExact } = useFrameSequence(sequence);
 const [curtainGone, setCurtainGone] = useState(false);

  /**
   * Paints one frame using object-cover math.
   * Never reads layout here — all geometry comes from sizeRef, which is only
   * written by the resize handler.
   */
 const renderFrame = useCallback(
    (frameIndex: number) => {
 const ctx = contextRef.current;
 if (!ctx) return;

 const clamped = Math.max(0, Math.min(sequence.count - 1, frameIndex));
 // A pre-decoded bitmap (or its nearest decoded neighbour while it lands).
 const img = frameAt(clamped);
 if (!img) return;

 const { width: cw, height: ch } = sizeRef.current;
 if (cw === 0 || ch === 0) return;

 const iw = img.width || sequence.width;
 const ih = img.height || sequence.height;

      // object-cover: scale to the larger ratio, then crop the overflow.
 const scale = Math.max(cw / iw, ch / ih);
 const dw = iw * scale;
 const dh = ih * scale;
 const dx = (cw - dw) / 2;

      // Horizontal centring is always correct. Vertically, narrow/portrait
      // viewports bias upward so the entrance and atrium stay in frame
      // instead of cropping down to the floor.
 const isPortrait = cw < MOBILE_BREAKPOINT || ch > cw;
 const verticalBias = isPortrait ? 0.42 : 0.5;
 const dy = (ch - dh) * verticalBias;

 // The canvas is opaque and every frame covers it edge to edge, so there
 // is no clear before drawing.
 ctx.drawImage(img, dx, dy, dw, dh);
 paintedBitmapRef.current = img;
 paintedRef.current = clamped;
    },
 [frameAt, sequence]
  );

  /** Sync the backing store to the element box and the device pixel ratio. */
 const resizeCanvas = useCallback(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;

 const rect = canvas.getBoundingClientRect();
 // Never allocate more backing pixels than the cover-scaled source can
 // fill: the frames are sequence.width px wide, so a larger canvas only
 // holds upscaled copies of the same pixels — and every one of them is
 // re-uploaded to the GPU on each scroll frame. The browser scales the
 // canvas element itself for free, with no visible difference.
 const coverScale = Math.max(rect.width / sequence.width, rect.height / sequence.height);
 const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR, 1 / Math.max(coverScale, 1e-3), 2);
 const width = Math.round(rect.width);
 const height = Math.round(rect.height);
 if (width === 0 || height === 0) return;

 const prev = sizeRef.current;
 if (prev.width === width && prev.height === height && prev.dpr === dpr) {
 return; // nothing changed; avoid a needless backing-store reallocation
    }

 canvas.width = Math.round(width * dpr);
 canvas.height = Math.round(height * dpr);

 const ctx = canvas.getContext("2d", { alpha: false });
 if (!ctx) return;
    // Draw in CSS pixels; the transform handles the Retina upscale.
 ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 ctx.imageSmoothingQuality ="high";
 contextRef.current = ctx;

 sizeRef.current = { width, height, dpr };
 paintedRef.current = -1; // force a repaint at the new size
 renderFrame(targetFrameRef.current);
  }, [renderFrame, sequence.width, sequence.height]);

  // --- Canvas sizing -------------------------------------------------------
 useLayoutEffect(() => {
 resizeCanvas();

 const canvas = canvasRef.current;
 if (!canvas) return;

    // ResizeObserver also catches mobile URL-bar height changes.
 const observer = new ResizeObserver(() => resizeCanvas());
 observer.observe(canvas);
 return () => observer.disconnect();
  }, [resizeCanvas]);

  // Paint as soon as the first frame decodes, and again whenever the exact
  // target frame lands after a stand-in neighbour was drawn.
 useEffect(() => {
 const want = targetFrameRef.current;
    // Already showing the exact frame — nothing to do (the common case while
    // scrolling, so no extra draw per frame).
 if (paintedRef.current === want && isExact(want, paintedBitmapRef.current)) return;
 renderFrame(want);
  }, [progress, decodedTick, renderFrame, isExact]);

  // --- Scroll scrubbing ----------------------------------------------------
 useLayoutEffect(() => {
 const section = sectionRef.current;
 if (!section) return;

 const reduced = prefersReducedMotion();
 const lastFrame = sequence.count - 1;

 const ctx = gsap.context(() => {
      // Reduced motion: no pin, no scrub. Show one representative frame and
      // leave the page as an ordinary scrolling document.
 if (reduced) {
 targetFrameRef.current = lastFrame;
 renderFrame(lastFrame);
 return;
      }

 const state = { frame: 0 };

      // One master ScrollTrigger drives the entire sequence.
      // refreshPriority: 10 guarantees the hero pinSpacing is calculated FIRST
      // before any subsequent section (like ThreeWorlds) calculates its trigger offsets.
 gsap.to(state, {
 frame: lastFrame,
 ease:"none",
 scrollTrigger: {
 id:"hero-sequence-pin",
 trigger: section,
 start:"top top",
 end: () => `+=${window.innerHeight * scrollLengthVh}`,
 pin: true,
 pinSpacing: true,
 // Lenis already smooths the scroll; a long scrub on top of it reads as
          // rubbery lag. A short one just rounds off the frame steps.
 scrub: 0.3,
 anticipatePin: 1,
 invalidateOnRefresh: true,
 refreshPriority: 10,
        },
 onUpdate: () => {
 const next = Math.round(state.frame);
 targetFrameRef.current = next;
          // Redraw only when the frame index actually changes.
 if (next !== paintedRef.current) renderFrame(next);
        },
      });

      ScrollTrigger.sort();
    }, section);

 return () => ctx.revert();
  }, [renderFrame, scrollLengthVh, sequence.count]);

  // When frames finish loading or when the loader exits, redraw current target frame
 useEffect(() => {
 if (ready) {
 renderFrame(targetFrameRef.current);
    }
  }, [ready, renderFrame]);

  // The pin is measured against a page whose height changes when the loader
  // unmounts — refresh and sort once the curtain is gone.
 useEffect(() => {
 if (curtainGone) {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }
  }, [curtainGone]);

 return (
    <>
      {!curtainGone && (
        <FrameLoader
          // The hero reveals at REVEAL_RATIO of the frames, so that point is 100%.
 progress={Math.min(1, progress / REVEAL_RATIO)}
 done={ready}
 onExited={() => setCurtainGone(true)}
        />
      )}

      <section
 ref={sectionRef}
 aria-label="Cinematic tour of the residence"
 className="relative h-[100svh] w-full overflow-hidden bg-[var(--cine-ground)]"
      >
        <canvas
 ref={canvasRef}
 aria-hidden="true"
 className="absolute inset-0 block h-full w-full"
        />

        {/* Atmospheric grade — depth without touching the architecture. */}
        <div
 aria-hidden="true"
 className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,13,18,0.3)_0%,rgba(11,13,18,0)_18%,rgba(11,13,18,0)_66%,rgba(11,13,18,0.26)_100%)]"
        />

        <HeroOverlay sectionRef={sectionRef} active={curtainGone} scrollLengthVh={scrollLengthVh} />

        {/* Subtle cinematic camera badge */}
        <div
 aria-hidden="true"
 className="pointer-events-none absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 text-[0.6rem] tracking-[0.26em] uppercase text-[rgba(247,246,242,0.4)]"
        >
          <span className="h-1.5 w-1.5 rotate-45 bg-[var(--cine-accent)] animate-pulse" />
          <span>Cinematic Walkthrough</span>
        </div>

        {/* The sequence is decorative; this is its accessible equivalent. */}
        <p className="u-sr-only">
          A cinematic aerial approach to a coastal private estate: the camera
 descends over the black-marble villa, its infinity pool and the sea
 beyond, passes the pool terrace, and settles inside the arrival hall
 beneath a sculptural chandelier, facing the Jay-Cee Landmarks wall.
        </p>
      </section>
    </>
  );
}
