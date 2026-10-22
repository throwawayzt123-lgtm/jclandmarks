"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, prefersReducedMotion, revealStart } from "@/lib/gsap";
import { splitWords } from "@/lib/splitWords";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * Declarative scroll motion for server-rendered markup.
 *
 * Wrap any block in <RevealScope> and tag elements inside it:
 *
 *   data-r="words"     headline rises word by word
 *   data-r="up"        element fades up
 *   data-r="stagger"   each direct child fades up in turn
 *   data-r="plate"     image frame unmasks upward; a child [data-r-img] settles from overscale
 *   data-r="rule"      hairline draws left to right (give it origin-left)
 *   data-r="bar"       progress bar fills to data-value (0–100)
 *   data-r="count"     number counts up to data-value
 *   data-r="drift"     slow scrubbed parallax while crossing the screen
 *
 * The markup is always authored in its FINAL state, so with reduced motion
 * (or before hydration) everything is simply visible and correct.
 */
interface RevealScopeProps {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}

export default function RevealScope({ as: Tag = "div", className, id, children }: RevealScopeProps) {
  const rootRef = useRef<HTMLElement>(null);

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const all = (sel: string) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(sel));
      const once = (el: Element, start = "top 86%") => ({
        trigger: el,
        start: revealStart(start),
        once: true,
      });

      all('[data-r="words"]').forEach((el) => {
        gsap.fromTo(
          splitWords(el),
          { yPercent: 118, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.045, ease: "power4.out", scrollTrigger: once(el, "top 88%") }
        );
      });

      all('[data-r="up"]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.05, ease: "power3.out", scrollTrigger: once(el) });
      });

      all('[data-r="stagger"]').forEach((el) => {
        gsap.fromTo(
          el.children,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: once(el) }
        );
      });

      all('[data-r="plate"]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut", scrollTrigger: once(el, "top 90%") }
        );
        const img = el.querySelector("[data-r-img]");
        if (img) {
          gsap.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 1.8, ease: "power3.out", scrollTrigger: once(el, "top 90%") });
        }
      });

      all('[data-r="rule"]').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut", scrollTrigger: once(el, "top 92%") });
      });

      all('[data-r="bar"]').forEach((el) => {
        const to = Math.max(0, Math.min(100, Number(el.dataset.value ?? 0))) / 100;
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: to, duration: 1.6, ease: "power3.out", scrollTrigger: once(el, "top 90%") });
      });

      all('[data-r="count"]').forEach((el) => {
        const end = Number(el.dataset.value ?? 0);
        const suffix = el.dataset.suffix ?? "";
        const state = { v: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(state, {
          v: end,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: once(el, "top 90%"),
          onUpdate: () => {
            el.textContent = `${Math.round(state.v)}${suffix}`;
          },
        });
      });

      all('[data-r="drift"]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={rootRef} id={id} className={className}>
      {children}
    </Tag>
  );
}
