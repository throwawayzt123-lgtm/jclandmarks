/**
 * Configuration + path generation for the cinematic hero frame sequence.
 * Change FRAME_COUNT / FRAME_PATH here if the sequence is re-exported.
 */

export interface FrameSequenceConfig {
  /** Total number of frames in the sequence. */
  count: number;
  /** Builds the URL for a 1-based frame number. */
  path: (frameNumber: number) => string;
  /** Intrinsic pixel dimensions of a source frame (used for cover math). */
  width: number;
  height: number;
}

const FRAME_COUNT = 250;

/** Zero-pads to the width used by the exported files (ezgif-frame-001.jpg). */
function pad(n: number, width = 3): string {
  return String(n).padStart(width, "0");
}

/**
 * The cinematic arrival sequence: an aerial establishing shot of the coastal
 * estate, down past the pool terrace, and in through the glazing to the
 * branded arrival hall.
 *
 * Source frames are 1280×720 (250 frames, ~7.2 MB). The canvas draws them
 * object-cover at viewport size. `width`/`height` below must match the real
 * intrinsic size or the cover math crops wrongly, so re-check them whenever
 * the sequence is re-exported.
 */
export const HERO_SEQUENCE: FrameSequenceConfig = {
  count: FRAME_COUNT,
  path: (n) => `/images/frames5/ezgif-frame-${pad(n)}.jpg`,
  width: 1280,
  height: 720,
};

/**
 * Orders frame indices so the network fetches what the viewer needs first:
 *   1. the very first frame (the hero's poster)
 *   2. a coarse stride across the whole sequence, so any scroll position
 *      has *something* to show almost immediately
 *   3. every remaining frame, to fill the gaps for a fully smooth scrub
 *
 * Returns 0-based indices.
 */
export function buildPriorityOrder(count: number, stride = 8): number[] {
  const seen = new Set<number>();
  const order: number[] = [];

  const push = (i: number) => {
    if (i >= 0 && i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };

  push(0);

  // Coarse pass: every `stride`-th frame, progressively halving the gap so the
  // sequence becomes smoother the longer the loader runs.
  for (let step = stride; step >= 2; step = Math.floor(step / 2)) {
    for (let i = 0; i < count; i += step) push(i);
  }

  // Final pass: everything still missing.
  for (let i = 0; i < count; i += 1) push(i);

  return order;
}
