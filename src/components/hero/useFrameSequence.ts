"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildPriorityOrder,
  type FrameSequenceConfig,
} from "@/lib/frameSequence";

/** How many frames must arrive before we reveal the hero. */
export const REVEAL_RATIO = 0.35;
/** Parallel in-flight requests. Keeps the connection pool healthy. */
const CONCURRENCY = 8;
/** Frames kept decoded either side of the playhead. */
const DECODE_RADIUS = 10;

export interface FrameSequenceState {
  /**
   * Returns the decoded bitmap for `index`, or the nearest decoded neighbour
   * while it is still on its way. Also keeps the window around `index`
   * decoding in the background.
   */
  frameAt: (index: number) => ImageBitmap | undefined;
  /** 0..1 — share of the sequence downloaded so far. */
  progress: number;
  /** True once enough frames exist to start the cinematic scrub. */
  ready: boolean;
  /** Bumps whenever a newly decoded bitmap lands, so the hero can repaint. */
  decodedTick: number;
  /** True when `bmp` is the exact decoded bitmap for `index` (not a stand-in). */
  isExact: (index: number, bmp: ImageBitmap | null) => boolean;
}

/**
 * Streams an image sequence and decodes it on demand.
 *
 * A long sequence defeats the browser's own image cache: 250 frames at
 * 1280×720 are ~920 MB once decoded, so Chrome keeps discarding them and
 * re-decodes on the main thread the moment the canvas draws — which is what
 * made the scrub stutter. Instead, every frame is fetched as a compressed
 * Blob (~7 MB for the whole sequence), and only a small window around the
 * playhead is decoded, with createImageBitmap(blob), which decodes off the
 * main thread. Bitmaps outside the window are released.
 *
 * Nothing here is React state except the coarse progress number and a
 * "new bitmap" tick, both coalesced to one update per animation frame.
 */
export function useFrameSequence(config: FrameSequenceConfig): FrameSequenceState {
  const blobsRef = useRef<(Blob | undefined)[]>([]);
  const bitmapsRef = useRef(new Map<number, ImageBitmap>());
  const pendingRef = useRef(new Set<number>());
  const centerRef = useRef(0);
  const tickRafRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [decodedTick, setDecodedTick] = useState(0);

  const decode = useCallback((i: number) => {
    const blob = blobsRef.current[i];
    if (!blob || bitmapsRef.current.has(i) || pendingRef.current.has(i)) return;
    pendingRef.current.add(i);
    createImageBitmap(blob)
      .then((bmp) => {
        pendingRef.current.delete(i);
        // The playhead may have moved well away while this decoded.
        if (Math.abs(i - centerRef.current) > DECODE_RADIUS + 6) {
          bmp.close();
          return;
        }
        bitmapsRef.current.set(i, bmp);
        if (!tickRafRef.current) {
          tickRafRef.current = requestAnimationFrame(() => {
            tickRafRef.current = 0;
            setDecodedTick((t) => t + 1);
          });
        }
      })
      .catch(() => pendingRef.current.delete(i));
  }, []);

  const warmAround = useCallback(
    (center: number) => {
      centerRef.current = center;
      const cache = bitmapsRef.current;
      for (const [i, bmp] of cache) {
        if (Math.abs(i - center) > DECODE_RADIUS + 4) {
          bmp.close();
          cache.delete(i);
        }
      }
      const count = blobsRef.current.length;
      for (let d = 0; d <= DECODE_RADIUS; d += 1) {
        if (center + d < count) decode(center + d);
        if (d > 0 && center - d >= 0) decode(center - d);
      }
    },
    [decode]
  );

  const frameAt = useCallback(
    (index: number) => {
      warmAround(index);
      const cache = bitmapsRef.current;
      const exact = cache.get(index);
      if (exact) return exact;
      // Nearest decoded neighbour, so the canvas never flashes empty.
      for (let d = 1; d <= DECODE_RADIUS + 4; d += 1) {
        const near = cache.get(index - d) ?? cache.get(index + d);
        if (near) return near;
      }
      return undefined;
    },
    [warmAround]
  );

  const isExact = useCallback((index: number, bmp: ImageBitmap | null) => !!bmp && bitmapsRef.current.get(index) === bmp, []);

  useEffect(() => {
    const { count, path } = config;
    blobsRef.current = new Array<Blob | undefined>(count);
    const bitmaps = bitmapsRef.current;

    let cancelled = false;
    let loaded = 0;
    let rafId = 0;
    let pendingProgress = 0;
    const controller = new AbortController();

    // Coalesce progress updates into one state write per frame.
    const flushProgress = () => {
      rafId = 0;
      if (cancelled) return;
      setProgress(pendingProgress);
      if (pendingProgress >= REVEAL_RATIO) setReady(true);
    };
    const reportProgress = () => {
      pendingProgress = loaded / count;
      if (!rafId) rafId = requestAnimationFrame(flushProgress);
    };

    const order = buildPriorityOrder(count);
    let cursor = 0;

    const loadNext = (): void => {
      if (cancelled) return;
      while (cursor < order.length && blobsRef.current[order[cursor]]) cursor += 1;
      if (cursor >= order.length) return;
      const index = order[cursor];
      cursor += 1;

      fetch(path(index + 1), {
        signal: controller.signal,
        // The first frame is the hero's poster — ask for it urgently.
        priority: index === 0 ? "high" : "low",
      } as RequestInit)
        .then((r) => (r.ok ? r.blob() : undefined))
        .then((blob) => {
          if (cancelled) return;
          if (blob) {
            blobsRef.current[index] = blob;
            // Frames near the playhead are decoded as soon as they land.
            if (Math.abs(index - centerRef.current) <= DECODE_RADIUS) decode(index);
          }
        })
        .catch(() => {})
        // A missing frame must not stall the sequence; count it and move on.
        .finally(() => {
          if (cancelled) return;
          loaded += 1;
          reportProgress();
          loadNext();
        });
    };

    for (let i = 0; i < Math.min(CONCURRENCY, count); i += 1) loadNext();

    return () => {
      cancelled = true;
      controller.abort();
      if (rafId) cancelAnimationFrame(rafId);
      if (tickRafRef.current) cancelAnimationFrame(tickRafRef.current);
      bitmaps.forEach((b) => b.close());
      bitmaps.clear();
      pendingRef.current.clear();
    };
  }, [config, decode]);

  return { frameAt, progress, ready, decodedTick, isExact };
}
