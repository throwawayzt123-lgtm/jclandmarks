"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

interface SectionLabelProps {
  /** Section title, e.g."THE RESIDENCE" or"ABOUT US · THE ATELIER". */
 label: string;
  /** Legacy optional index, omitted per user requirement. */
 index?: string;
 className?: string;
}

/**
 * Editorial architectural section header without numbers:
 *   ● THE RESIDENCE  ──────────────────────────
 */
export default function SectionLabel({
 label,
 className ="",
}: SectionLabelProps) {
 const rootRef = useRef<HTMLDivElement>(null);

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
 gsap.fromTo(
".sl-rule",
        { scaleX: 0 },
        {
 scaleX: 1,
 duration: 1.4,
 ease:"power3.inOut",
 scrollTrigger: {
 trigger: root,
 start:"top 85%",
 once: true,
          },
        }
      );
 gsap.fromTo(
".sl-text",
        { opacity: 0, y: 8 },
        {
 opacity: 1,
 y: 0,
 duration: 1,
 ease:"power2.out",
 scrollTrigger: {
 trigger: root,
 start:"top 85%",
 once: true,
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <div ref={rootRef} className={`flex items-center gap-4 ${className}`}>
      <span className="sl-text flex items-center gap-2.5 shrink-0 text-[#11141b] font-medium tracking-[0.25em] text-[0.72rem] uppercase">
        <span className="h-1.5 w-1.5 rotate-45 bg-[#D8B479] shadow-[0_0_6px_#D8B479]" />
        <span>{label}</span>
      </span>
      <span
 aria-hidden="true"
 className="sl-rule h-px flex-1 origin-left bg-gradient-to-r from-[#D8B479] via-[rgba(216,180,121,0.35)] to-transparent"
      />
    </div>
  );
}
