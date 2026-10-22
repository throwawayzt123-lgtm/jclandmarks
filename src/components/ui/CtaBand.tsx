import RevealScope from "@/components/ui/RevealScope";

import Link from "next/link";
/**
 * Dark closing band used at the foot of every inner page: one line, one
 * action, nothing boxed.
 */
interface CtaBandProps {
  eyebrow?: string;
  title: string;
  body?: string;
  action: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export default function CtaBand({ eyebrow = "Begin a Conversation", title, body, action, secondary }: CtaBandProps) {
  return (
    <RevealScope as="section" className="relative bg-[#0b0d12] py-[clamp(6rem,15vh,10rem)] text-[#f4f2ee]">
      <div className="u-shell">
        <span data-r="up" className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">
          {eyebrow}
        </span>
        <div className="mt-10 grid items-end gap-y-10 lg:grid-cols-12 lg:gap-x-16">
          <h2 data-r="words" className="col-span-full max-w-3xl font-serif text-[clamp(2rem,4.2vw,3.6rem)] font-light leading-[1.12] tracking-[-0.01em] lg:col-span-8">
            {title}
          </h2>
          <div data-r="stagger" className="col-span-full flex flex-col items-start gap-6 lg:col-span-4 lg:items-end">
            {body && <p className="max-w-sm text-[0.95rem] leading-[1.8] text-[rgba(244,242,238,0.62)] lg:text-right">{body}</p>}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {secondary && (
                <Link href={secondary.href} className="group inline-flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.26em] text-[rgba(244,242,238,0.8)] transition-colors hover:text-[#D8B479]">
                  {secondary.label}
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </Link>
              )}
              <Link
                href={action.href}
                className="group inline-flex items-center gap-4 bg-[#D8B479] px-9 py-5 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-[#11141b] transition-colors duration-500 hover:bg-white"
              >
                {action.label}
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RevealScope>
  );
}
