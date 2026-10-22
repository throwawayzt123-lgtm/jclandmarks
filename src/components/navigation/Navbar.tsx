"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CONTACT, NAV, SOCIAL, isActive } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";
import { setScrollLocked } from "@/components/SmoothScrollProvider";

/**
 * BUBBLE NAVIGATION
 *
 * A floating glass pill of links with a gold "bubble" that rests behind the
 * current page and glides to whichever link is pointed at or focused. Because
 * the navbar persists across client-side navigation, the bubble also slides
 * from the old page to the new one when the route changes.
 *
 * The logo sits in its own glass disc with a gold ring, without the wordmark
 * text beside it — the logo already carries the name.
 *
 * Rounded shapes are intentional here (the client asked for a bubble menu);
 * the rest of the site keeps its sharp corners.
 *
 * Behaviour kept from before: hides while scrolling down, returns on scroll
 * up; "Projects" opens on hover and on keyboard focus.
 */
const CTA = NAV.find((n) => n.href === "/contact");
const PILL = NAV.filter((n) => n.href !== "/contact");

export default function Navbar() {
  const barRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLUListElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /* ---------- Hide on scroll down, return on scroll up ---------- */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSettled(y > 80);
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
    const ctx = gsap.context(() => {
      gsap.fromTo(".nav-item", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "power3.out", delay: 0.3 });
    }, barRef);
    return () => ctx.revert();
  }, []);

  /* ---------- The bubble ---------- */
  useLayoutEffect(() => {
    const pill = pillRef.current;
    const bubble = bubbleRef.current;
    if (!pill || !bubble) return;
    const reduced = prefersReducedMotion();

    const activeItem = () => pill.querySelector<HTMLElement>("li[data-pill][data-active]");
    const place = (li: HTMLElement | null, animate: boolean) => {
      const duration = animate && !reduced ? 0.55 : 0;
      if (!li) {
        gsap.to(bubble, { opacity: 0, scale: 0.9, duration, ease: "power3.out", overwrite: true });
        return;
      }
      gsap.to(bubble, {
        x: li.offsetLeft,
        width: li.offsetWidth,
        opacity: 1,
        scale: 1,
        duration,
        ease: "power3.out",
        overwrite: true,
      });
    };

    // Start where the bubble already was (so a route change glides), else snap.
    const firstPlacement = !bubble.style.width;
    place(activeItem(), !firstPlacement);

    const itemFrom = (e: Event) => (e.target as HTMLElement).closest<HTMLElement>("li[data-pill]");
    const onOver = (e: PointerEvent) => place(itemFrom(e), true);
    const onFocus = (e: FocusEvent) => place(itemFrom(e), true);
    const home = () => place(activeItem(), true);
    const onFocusOut = (e: FocusEvent) => {
      if (!pill.contains(e.relatedTarget as Node | null)) home();
    };
    const onResize = () => place(activeItem(), false);

    pill.addEventListener("pointerover", onOver);
    pill.addEventListener("pointerleave", home);
    pill.addEventListener("focusin", onFocus);
    pill.addEventListener("focusout", onFocusOut);
    window.addEventListener("resize", onResize);
    // Web fonts change link widths once they load.
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      pill.removeEventListener("pointerover", onOver);
      pill.removeEventListener("pointerleave", home);
      pill.removeEventListener("focusin", onFocus);
      pill.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  /* ---------- Mobile menu ---------- */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

  const glass = settled
    ? "bg-[#0b0d12]/90 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.09)]"
    : "bg-[#0b0d12]/72 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.12)]";
  // No backdrop-filter on the always-visible bubbles: re-blurring everything
  // that scrolls beneath them every frame was a measurable share of scroll cost.

  return (
    <>
    <header
      ref={barRef}
      className={[
        // The header itself is click-through; only the bubbles take pointer events.
        "pointer-events-none fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        // The menu panel is rendered outside the header (below), so this
        // slide can never resize it. Stays visible while the menu is open.
        hidden && !menuOpen ? "-translate-y-[130%]" : "translate-y-0",
      ].join(" ")}
    >
      <nav
        aria-label="Primary"
        className={[
          "relative z-10 mx-auto flex w-full max-w-[1680px] items-center justify-between gap-6 px-4 transition-[padding] duration-500 sm:px-8 lg:px-12",
          settled ? "pt-3" : "pt-5",
        ].join(" ")}
      >
        {/* Logo disc */}
        <Link
          href="/"
          aria-label="Jay-Cee Landmarks — home"
          className="nav-item group pointer-events-auto relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#0b0d12] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] sm:h-[4.75rem] sm:w-[4.75rem] lg:h-[5.25rem] lg:w-[5.25rem]"
          style={{
            boxShadow:
              "inset 0 0 0 1.5px rgba(216,180,121,0.7), 0 0 0 5px rgba(216,180,121,0.1), 0 0 40px -2px rgba(216,180,121,0.45), 0 16px 36px -12px rgba(0,0,0,0.75)",
          }}
        >
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_38%,rgba(216,180,121,0.2),transparent_68%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative block h-[2.9rem] w-[2.9rem] sm:h-[3.45rem] sm:w-[3.45rem] lg:h-[3.9rem] lg:w-[3.9rem]">
            <Image
              src="/logo-gold.png"
              alt="Jay-Cee Landmarks"
              fill
              priority
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 56px, 64px"
              className="object-contain drop-shadow-[0_0_10px_rgba(216,180,121,0.45)]"
            />
          </span>
        </Link>

        {/* Desktop: pill + Contact */}
        <div className="nav-item pointer-events-auto hidden items-center gap-3 lg:flex">
          <ul ref={pillRef} className={`relative flex items-center rounded-full p-1.5 transition-[background-color,box-shadow] duration-500 ${glass}`}>
            {/* The bubble */}
            <span
              ref={bubbleRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1.5 left-0 top-1.5 rounded-full bg-[rgba(216,180,121,0.16)] opacity-0 shadow-[inset_0_0_0_1px_rgba(216,180,121,0.45),0_0_22px_-6px_rgba(216,180,121,0.55)]"
            />

            {PILL.map((item) => {
              const on = isActive(item, pathname);
              const linkCls = [
                "relative z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[0.64rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 xl:px-5 xl:text-[0.68rem] xl:tracking-[0.2em]",
                on ? "text-[#D8B479]" : "text-white/80 hover:text-white",
              ].join(" ");

              if (!item.children) {
                return (
                  <li key={item.href} data-pill="" data-active={on ? "" : undefined}>
                    <Link href={item.href} aria-current={on ? "page" : undefined} className={linkCls}>
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.href} data-pill="" data-active={on ? "" : undefined} className="group/dd relative">
                  <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} aria-haspopup="true" className={linkCls}>
                    {item.label}
                    <svg aria-hidden="true" className="h-3 w-3 transition-transform duration-300 group-hover/dd:rotate-180 group-focus-within/dd:rotate-180" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {/* Visibility flips on instantly (Tab reaches the links on the
                      first frame) and off only after the fade. */}
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 [transition:opacity_220ms,visibility_0s_linear_220ms] group-hover/dd:visible group-hover/dd:opacity-100 group-hover/dd:[transition-delay:0s] group-focus-within/dd:visible group-focus-within/dd:opacity-100 group-focus-within/dd:[transition-delay:0s]">
                    <ul className="w-60 rounded-[1.4rem] bg-[#0b0d12]/92 p-2 shadow-[0_24px_50px_-14px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.09)] backdrop-blur-xl">
                      {item.children.map((c) => {
                        const cOn = pathname === c.href || (c.href !== item.href && pathname.startsWith(`${c.href}/`));
                        return (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              aria-current={cOn ? "page" : undefined}
                              className={[
                                "flex items-center justify-between rounded-full px-4 py-3 text-[0.64rem] uppercase tracking-[0.18em] transition-colors",
                                cOn ? "bg-[rgba(216,180,121,0.14)] text-[#D8B479]" : "text-white/80 hover:bg-white/[0.06] hover:text-white",
                              ].join(" ")}
                            >
                              {c.label}
                              <span aria-hidden="true" className="text-[#D8B479]">→</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          {CTA && (
            <Link
              href={CTA.href}
              aria-current={pathname === CTA.href ? "page" : undefined}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#D8B479] px-5 py-[0.95rem] text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#11141b] shadow-[0_12px_30px_-10px_rgba(216,180,121,0.6)] transition-[background-color,transform] duration-300 hover:-translate-y-px hover:bg-[#e6c58d] xl:px-6 xl:text-[0.68rem]"
            >
              {CTA.label}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={`nav-item pointer-events-auto grid h-12 w-12 place-items-center rounded-full text-white transition-colors hover:text-[#D8B479] lg:hidden ${glass}`}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 top-0 block h-[1.5px] w-5 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[5px] block h-[1.5px] w-5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[10px] block h-[1.5px] w-5 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

    </header>
      {/* Mobile menu — a full-height panel that slides in from the right.
          It stays mounted (inert while closed) so it can animate both ways. */}
      <div
        ref={drawerRef}
        id="mobile-menu"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={[
          "fixed inset-0 z-[99] flex flex-col overflow-y-auto overscroll-contain bg-[#0b0d12] lg:hidden",
          // Tailwind v4's translate-* utilities set the CSS `translate` property,
          // so that is what must transition. Visibility switches on at once when
          // opening (so focus can land), and off only after the slide-out.
          menuOpen
            ? "pointer-events-auto visible translate-x-0 [transition:translate_850ms_cubic-bezier(0.76,0,0.24,1),visibility_0s]"
            : "pointer-events-none invisible translate-x-full [transition:translate_850ms_cubic-bezier(0.76,0,0.24,1),visibility_0s_linear_850ms]",
          "motion-reduce:[transition:none]",
        ].join(" ")}
      >
        {/* Fine drafting grid, as on the loading sheet */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(216,180,121,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(216,180,121,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 90% 70% at 70% 30%, #000 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 70% 30%, #000 20%, transparent 75%)",
          }}
        />

        <nav aria-label="Mobile" className="relative flex min-h-full flex-col px-6 pb-7 pt-[6.25rem] sm:px-10 sm:pt-[7.5rem]">
          <ul className="flex flex-col">
            {NAV.map((item, i) => {
              const on = isActive(item, pathname);
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
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="group flex items-baseline gap-4 border-b border-white/[0.07] py-[clamp(0.55rem,1.55vh,0.95rem)]"
                  >
                    <span className="w-6 text-[0.6rem] tabular-nums tracking-[0.2em] text-[#D8B479]/70">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-serif text-[clamp(1.45rem,5.8vw,2rem)] font-light leading-none transition-colors ${on ? "italic text-[#D8B479]" : "text-[#f4f2ee] group-hover:text-[#D8B479]"}`}>
                      {item.label}
                    </span>
                    {on && <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 self-center rounded-full bg-[#D8B479]" />}
                  </Link>
                  {item.children && (
                    <ul className="flex gap-6 pb-2 pl-10 pt-1.5">
                      {item.children
                        .filter((c) => c.href !== item.href)
                        .map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setMenuOpen(false)}
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

          {/* Direct contact + enquiry, pinned to the bottom of the panel */}
          <div
            className={`mt-auto pt-8 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: menuOpen ? `${260 + NAV.length * 55}ms` : "0ms" }}
          >
            {/* Very short screens (e.g. iPhone SE) keep just the enquiry button. */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-[0.82rem] [@media(max-height:620px)]:hidden">
              <a href={CONTACT.phoneHref} className="block">
                <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-white/40">Call</span>
                <span className="mt-1 block text-white/85">{CONTACT.phone}</span>
              </a>
              <a href={CONTACT.whatsappHref} className="block">
                <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-white/40">WhatsApp</span>
                <span className="mt-1 block text-white/85">{CONTACT.whatsapp}</span>
              </a>
              <a href={`mailto:${CONTACT.email}`} className="col-span-2 block">
                <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-white/40">Email</span>
                <span className="mt-1 block text-white/85">{CONTACT.email}</span>
              </a>
            </div>
            {/* Enquiry + social share one row, so the panel fits short phones */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex flex-1 items-center justify-between rounded-full bg-[#D8B479] px-6 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#11141b]"
              >
                Start an enquiry
                <span aria-hidden="true">→</span>
              </Link>
              {SOCIAL.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`JC Landmarks on ${s.label}`}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/80 transition-colors hover:bg-[#D8B479] hover:text-[#11141b]"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
