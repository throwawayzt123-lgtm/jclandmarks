"use client";

import { useLayoutEffect, useRef } from"react";
import { gsap, ScrollTrigger, prefersReducedMotion } from"@/lib/gsap";

export default function ScrollProgress() {
 const barRef = useRef<HTMLDivElement>(null);

 useLayoutEffect(() => {
 const bar = barRef.current;
 if (!bar || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      ScrollTrigger.create({
 start: 0,
 end:"max",
 onUpdate: (self) => {
 gsap.set(bar, { scaleX: self.progress });
        },
      });
    });

 return () => ctx.revert();
  }, []);

 return (
    <div
 aria-hidden="true"
 className="fixed inset-x-0 top-0 z-[110] h-[2px] bg-transparent pointer-events-none"
    >
      <div
 ref={barRef}
 className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#D8B479] via-[#ecd4a4] to-[#b58c49] shadow-[0_0_8px_rgba(216,180,121,0.7)]"
      />
    </div>
  );
}
