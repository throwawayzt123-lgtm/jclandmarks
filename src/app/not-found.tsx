import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/sections/Footer";

/**
 * 404 — a page that is not there. Next.js serves this with a 404 status and a
 * noindex tag, so it never enters search results; the links send visitors
 * (and crawlers) back into the site instead of a dead end.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Our projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <>
      <main id="top" className="relative flex min-h-[80vh] items-end bg-[#000000] text-[#f4f2ee]">
        <div className="u-shell w-full pb-[clamp(5rem,12vh,8rem)] pt-[clamp(10rem,24vh,14rem)]">
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#D8B479]">Error 404</span>
          <h1 className="mt-8 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4.3rem)] font-light leading-[1.1] tracking-[-0.01em]">
            This page is not on <em className="italic text-[#D8B479]">our map.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1rem] leading-[1.8] text-white/65">
            The address may have changed, or the link may be mistyped. Everything else is where we left it.
          </p>
          <nav aria-label="Helpful links" className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.26em] text-[#f4f2ee] transition-colors hover:text-[#D8B479]"
              >
                {l.label}
                <span aria-hidden="true" className="text-[#D8B479] transition-transform duration-500 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
