"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

interface TextRevealProps {
  /** Each entry becomes one masked line. */
 lines: ReactNode[];
 as?: ElementType;
 className?: string;
  /** Delay before the first line, in seconds. */
 delay?: number;
}

/**
 * Reveals a heading line by line from beneath a mask.
 *
 * Reserved for major headings — body copy uses a simple fade so the page is
 * not busy with motion.
 */
export default function TextReveal({
 lines,
 as: Tag ="h2",
 className ="",
 delay = 0,
}: TextRevealProps) {
 const rootRef = useRef<HTMLElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root) return;

 if (prefersReducedMotion()) {
 gsap.set(root.querySelectorAll(".tr-line"), { yPercent: 0, opacity: 1 });
 return;
    }

 const ctx = gsap.context(() => {
 gsap.fromTo(
".tr-line",
        { yPercent: 115, opacity: 0 },
        {
 yPercent: 0,
 opacity: 1,
 duration: 1.3,
 delay,
 stagger: 0.14,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 82%",
 once: true,
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, [delay]);

 return (
    <Tag ref={rootRef} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <span className="tr-line block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
