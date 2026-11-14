"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { CONTACT, NAV, OFFICES, SOCIAL, directionsUrl, isActive } from "@/lib/site";
import { FACADES, INTERIORS, type Still } from "@/lib/media";
import SocialIcon from "@/components/ui/SocialIcon";
import { setScrollLocked } from "@/components/SmoothScrollProvider";

/**
 * HEADER — logo on the left, a "MENU" control on the right.
 *
 * One quiet bar on every screen size: the Jay-Cee mark, and the word MENU
 * beside two fine lines. It opens a full-screen black menu with the pages
 * set large in the display serif, and contact details alongside.
 *
 * Transparent over the hero; once the page scrolls it sits on a black bar.
 * Hides while scrolling down and returns on scroll up.
 */
/** What each page is, for the menu: a short tag beside the link, and the
 *  photograph and line shown on the plate when the link is pointed at. */
const PAGE_INFO: Record<string, { tag: string; line: string; still: Still }> = {
  "/": { tag: "Start here", line: "Design & build in Lahore", still: FACADES.phase7Villa },
  "/about": { tag: "Who we are", line: "One team, from plot to keys", still: INTERIORS.staircaseCantilever },
  "/services": { tag: "What we build", line: "Homes & commercial buildings", still: FACADES.phase7Curtain },
  "/projects": { tag: "Our work", line: "Homes we have delivered", still: FACADES.spanishEstate },
  "/journal": { tag: "Field notes", line: "What we have learned on site", still: INTERIORS.studyEquestrian },
  "/ongoing": { tag: "On site now", line: "Being built across Lahore", still: FACADES.prismMonolith },
  "/for-sale": { tag: "Homes available", line: "Ready to move into", still: INTERIORS.loungeDoubleHeight },
  "/contact": { tag: "Talk to us", line: "Start your project", still: INTERIORS.diningGrand },
};

export default function Navbar() {
  const barRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // The page shown on the menu's plate: the link pointed at, else this page.
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? NAV.find((n) => isActive(n, pathname))?.href ?? "/";
  const office = OFFICES[0];

  /* ---------- Hide on scroll down, return on scroll up ---------- */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // 6px dead-zone stops sub-pixel jitter and Lenis easing tails from
      // flickering the bar; above 120px it always stays visible.
      const delta = y - lastYRef.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 120);
        lastYRef.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Entrance, once ---------- */
  useEffect(() => {
    // Unscoped: the logo and the MENU control sit on separate layers.
    const ctx = gsap.context(() => {
      gsap.fromTo(".nav-item", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "power3.out", delay: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  /* ---------- Menu ---------- */
  // Close the menu when the page changes (adjusting state during render,
  // rather than in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    setScrollLocked("menu", menuOpen);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    // Move focus into the menu when it opens, so keyboard users land in it.
    if (menuOpen) drawerRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    return () => {
      setScrollLocked("menu", false);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // The bar itself is transparent and click-through; only the logo and the
  // MENU control take the pointer.
  const barCls = [
    "pointer-events-none fixed inset-x-0 top-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    hidden && !menuOpen ? "-translate-y-[130%]" : "translate-y-0",
  ].join(" ");
  const rowCls = [
    // Set down from the top edge; the same at every scroll position, and the
    // MENU row uses the same classes so the two always line up.
    "relative mx-auto flex w-full max-w-[1680px] items-center justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12 lg:pt-9",
  ].join(" ");
  const logoSize = [
    "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "h-[4.5rem] w-[4.5rem] sm:h-[5.5rem] sm:w-[5.5rem] lg:h-[6.5rem] lg:w-[6.5rem]",
  ].join(" ");

  return (
    <>
      <header ref={barRef} className={`${barCls} z-[100]`}>
        <nav aria-label="Primary" className={rowCls}>
          {/* Logo */}
          <Link
            href="/"
            aria-label="Jay-Cee Landmarks — home"
            className={`nav-item pointer-events-auto relative grid shrink-0 place-items-center rounded-full bg-[#000000] hover:scale-[1.04] ${logoSize}`}
            style={{
              boxShadow:
                "inset 0 0 0 1.5px rgba(216,180,121,0.7), 0 0 0 5px rgba(216,180,121,0.1), 0 0 34px -4px rgba(216,180,121,0.4), 0 16px 36px -12px rgba(0,0,0,0.75)",
            }}
          >
            <span className="relative block h-[72%] w-[72%] overflow-hidden rounded-full">
              <Image
                src="/images/jc-logo-gold.png"
                alt="Jay-Cee Landmarks"
                fill
                priority
                sizes="(max-width: 640px) 56px, (max-width: 1024px) 64px, 80px"
                className="object-contain"
              />
            </span>
          </Link>
        </nav>
      </header>

      {/* MENU — the word and two fine lines. It sits on its own layer with a
          "difference" blend, so with no bar behind it, it reads white over the
          dark hero and black sections and turns black over white ones. */}
      <div className={`${barCls} z-[101]`}>
        <div className={rowCls}>
          {/* Holds the logo's place so the control lines up with it */}
          <span aria-hidden="true" className={`block shrink-0 ${logoSize}`} />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setMenuOpen((v) => !v);
            }}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="nav-item group pointer-events-auto flex items-center gap-3.5 bg-[#000000]/85 px-4 py-2.5 text-[#D8B479] backdrop-blur-sm transition-[background-color,color] duration-500 outline-none hover:bg-[#D8B479] hover:text-[#000000] focus-visible:bg-[#D8B479] focus-visible:text-[#000000] sm:gap-4 sm:px-5 sm:py-3"
          >
            <span className="relative block h-[1.1em] overflow-hidden text-[0.72rem] font-semibold uppercase leading-[1.1] tracking-[0.26em] sm:text-[0.78rem]">
              <span className={`block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "-translate-y-1/2" : ""}`}>
                <span className="block">Menu</span>
                <span className="block">Close</span>
              </span>
            </span>
            <span aria-hidden="true" className="relative block h-[7px] w-6 sm:w-7">
              <span
                className={`absolute right-0 top-0 block h-[1.5px] origin-center bg-current transition-[transform,width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "w-5 -translate-x-0.5 translate-y-[2.75px] rotate-45" : "w-full"
                }`}
              />
              <span
                className={`absolute bottom-0 right-0 block h-[1.5px] origin-center bg-current transition-[transform,width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "w-5 -translate-x-0.5 -translate-y-[2.75px] -rotate-45" : "w-full group-hover:w-2/3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* The menu — full screen, slides in from the right. It stays mounted
          (inert while closed) so it can animate both ways.

          Plain black, set out like a drawing sheet: a faint drafting grid,
          and on desktop a "plate" beside the links — a photograph framed by
          gold crop marks under a dimension line, which changes to match
          whichever page is pointed at. */}
      <div
        ref={drawerRef}
        id="site-menu"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={[
          "fixed inset-0 z-[99] flex flex-col overflow-y-auto overscroll-contain bg-[#000000]",
          // Tailwind v4's translate-* utilities set the CSS `translate` property,
          // so that is what must transition. Visibility switches on at once when
          // opening (so focus can land), and off only after the slide-out.
          menuOpen
            ? "pointer-events-auto visible translate-x-0 [transition:translate_850ms_cubic-bezier(0.76,0,0.24,1),visibility_0s]"
            : "pointer-events-none invisible translate-x-full [transition:translate_850ms_cubic-bezier(0.76,0,0.24,1),visibility_0s_linear_850ms]",
          "motion-reduce:[transition:none]",
        ].join(" ")}
      >
        {/* Drafting grid, fading out toward the links */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(216,180,121,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(216,180,121,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 55% 75% at 78% 45%, #000 15%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 55% 75% at 78% 45%, #000 15%, transparent 75%)",
          }}
        />

        <nav
          aria-label="Site"
          className="relative mx-auto flex min-h-full w-full max-w-[1680px] flex-col px-6 pb-7 pt-[7.5rem] sm:px-10 sm:pt-[9.5rem] lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-12 lg:pb-12 lg:pt-[11rem]"
        >
          <ul className="flex flex-col lg:col-span-6" onPointerLeave={() => setPreview(null)}>
            {NAV.map((item, i) => {
              const on = isActive(item, pathname);
              const info = PAGE_INFO[item.href];
              // Each row slides in after the panel, one after another.
              const delay = menuOpen ? `${260 + i * 55}ms` : "0ms";
              return (
                <li
                  key={item.href}
                  className={`transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                  style={{ transitionDelay: delay }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    onPointerEnter={() => setPreview(item.href)}
                    // Only keyboard focus moves the plate — not the focus placed on the
                    // first link when the menu opens.
                    onFocus={(e) => e.currentTarget.matches(":focus-visible") && setPreview(item.href)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="group relative flex items-baseline gap-4 py-[clamp(0.55rem,1.5vh,0.9rem)] lg:gap-6"
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/[0.07]" />
                    {/* Gold rule that draws across on hover */}
                    <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-left bg-[#D8B479] [transform:scaleX(0)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:scaleX(1)] group-focus-visible:[transform:scaleX(1)]" />
                    <span className="w-6 text-[0.6rem] tabular-nums tracking-[0.2em] text-[#D8B479]/70">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`font-serif text-[clamp(1.45rem,5.8vw,2rem)] font-light leading-none transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 lg:text-[clamp(1.9rem,4.8vh,3.2rem)] ${
                        on ? "italic text-[#D8B479]" : "text-[#f4f2ee] group-hover:text-[#D8B479]"
                      }`}
                    >
                      {item.label}
                    </span>
                    {info && (
                      <span className="ml-auto hidden self-center text-[0.58rem] uppercase tracking-[0.24em] text-white/35 transition-colors duration-500 group-hover:text-[#D8B479] sm:block">
                        {info.tag}
                      </span>
                    )}
                  </Link>
                  {item.children && (
                    <ul className="flex gap-6 pb-2 pl-10 pt-2.5 lg:pl-12">
                      {item.children
                        .filter((c) => c.href !== item.href)
                        .map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setMenuOpen(false)}
                              onPointerEnter={() => setPreview(item.href)}
                              className={`inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em] transition-colors ${
                                pathname.startsWith(c.href) ? "text-[#D8B479]" : "text-white/60 hover:text-white"
                              }`}
                            >
                              <span aria-hidden="true" className="block h-[4px] w-[4px] rounded-full bg-[#D8B479]" />
                              {c.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right column: the plate (desktop), then contact */}
          <div
            className={`mt-auto pt-8 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:col-span-5 lg:col-start-8 lg:mt-0 lg:flex lg:flex-col lg:pt-1 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? `${260 + NAV.length * 55}ms` : "0ms" }}
          >
            <figure aria-hidden="true" className="hidden lg:block">
              {/* Dimension line */}
              <div className="flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.26em] text-[#D8B479]/75">
                <span className="h-2.5 w-px bg-[#D8B479]/60" />
                <span className="h-px flex-1 bg-[#D8B479]/35" />
                <span className="tabular-nums">Sheet {String(NAV.findIndex((n) => n.href === shown) + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-[#D8B479]/35" />
                <span className="h-2.5 w-px bg-[#D8B479]/60" />
              </div>
              {/* Plate with crop marks */}
              <div className="relative mt-5 h-[clamp(12rem,37vh,24rem)]">
                {[
                  "left-0 top-0 border-l border-t",
                  "right-0 top-0 border-r border-t",
                  "bottom-0 left-0 border-b border-l",
                  "bottom-0 right-0 border-b border-r",
                ].map((c) => (
                  <span key={c} className={`absolute z-10 -m-2.5 h-5 w-5 border-[#D8B479]/80 ${c}`} />
                ))}
                <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
                  {Object.entries(PAGE_INFO).map(([href, p]) => (
                    <Image
                      key={href}
                      src={p.still.src}
                      alt=""
                      fill
                      sizes="40vw"
                      className={`object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        href === shown ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                      }`}
                      style={{ objectPosition: p.still.position ?? "center" }}
                    />
                  ))}
                </div>
              </div>
              <figcaption className="mt-5 flex items-baseline justify-between gap-6">
                <span className="font-serif text-[1.35rem] font-light italic text-[#f4f2ee]">{PAGE_INFO[shown]?.line}</span>
                <span className="shrink-0 text-[0.55rem] uppercase tracking-[0.24em] text-white/35">Jay-Cee Landmarks · Lahore</span>
              </figcaption>
            </figure>

            <div className="lg:mt-auto">
              {/* Very short screens (e.g. iPhone SE) keep just the enquiry button. */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-[0.78rem] lg:grid-cols-3 lg:pt-8 lg:text-[0.84rem] [@media(max-height:620px)]:hidden">
                {office && (
                  <a href={directionsUrl(office)} target="_blank" rel="noopener noreferrer" className="hidden transition-colors hover:text-[#D8B479] lg:block">
                    <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-white/40">{office.name}</span>
                    <span className="mt-1 block leading-[1.6] text-white/85">{office.lines.slice(0, 2).join(", ")}</span>
                  </a>
                )}
                <a href={CONTACT.phoneHref} className="block transition-colors hover:text-[#D8B479]">
                  <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-white/40">Call</span>
                  <span className="mt-1 block text-white/85">{CONTACT.phone}</span>
                </a>
                <a href={`mailto:${CONTACT.email}`} className="block transition-colors hover:text-[#D8B479]">
                  <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-white/40">Email</span>
                  <span className="mt-1 block text-white/85">{CONTACT.email}</span>
                </a>
              </div>
              {/* Enquiry + social */}
              <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5 lg:mt-7 lg:pt-7">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="group inline-flex h-[2.6rem] flex-1 items-center justify-between gap-3 whitespace-nowrap rounded-full px-5 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#D8B479] shadow-[inset_0_0_0_1px_rgba(216,180,121,0.55)] transition-colors duration-300 hover:bg-[#D8B479] hover:text-[#11141b] active:bg-[#D8B479] active:text-[#11141b] lg:h-12"
                >
                  Start an enquiry
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </Link>
                {SOCIAL.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Jay-Cee Landmarks on ${s.label}`}
                    className="grid h-[2.6rem] w-[2.6rem] shrink-0 place-items-center rounded-full text-white/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition-colors duration-300 hover:text-[#D8B479] hover:shadow-[inset_0_0_0_1px_rgba(216,180,121,0.55)] lg:h-12 lg:w-12"
                  >
                    <SocialIcon name={s.icon} className="h-[15px] w-[15px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
