"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TextReveal from "@/components/ui/TextReveal";
import { smoothScrollTo } from "@/components/SmoothScrollProvider";
import { CONTACT, OFFICES, SOCIAL, directionsUrl } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";

/**
 * FOOTER — black.
 *
 * A deeper black than the dark bands that close most pages (#07090e against
 * #0b0d12), separated from them by a single faint hairline, so the two read
 * as distinct without a hard edge. Gold carries the accents; type is warm
 * off-white at stepped opacities.
 */
const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const PROJECT_LINKS = [
  { label: "Residential Projects", href: "/projects/residential" },
  { label: "Commercial Projects", href: "/projects/commercial" },
  { label: "Ongoing Projects", href: "/ongoing" },
  { label: "Homes for Sale", href: "/for-sale" },
];

const linkCls = "text-[0.74rem] uppercase tracking-[0.16em] text-[rgba(244,242,238,0.62)] transition-colors duration-300 hover:text-[#D8B479]";
const headCls = "mb-5 text-[0.64rem] font-medium uppercase tracking-[0.28em] text-[#D8B479]";

export default function Footer() {
  const [localTime, setLocalTime] = useState("");
  const onHome = usePathname() === "/";
  /** "#section" anchors only exist on the homepage; elsewhere, route home first. */
  const resolveHref = (href: string) => (href.startsWith("#") && !onHome ? `/${href}` : href);
  const office = OFFICES[0];

  useEffect(() => {
    const updateTime = () =>
      // The office clock shows Lahore time, not the visitor's own time zone.
      setLocalTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" }) + " PKT");
    updateTime();
    const interval = setInterval(updateTime, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer role="contentinfo" className="relative overflow-hidden bg-[#07090e] text-[#f4f2ee]">
      {/* One faint hairline instead of a border, so a dark band above still separates. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,121,0.28),transparent)]" />

      <div className="u-shell relative pb-10 pt-[clamp(4.5rem,10vh,6.5rem)]">
        {/* Statement + back to top */}
        <div className="flex flex-col justify-between gap-8 pb-12 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-[0.66rem] font-medium uppercase tracking-[0.32em] text-[#D8B479]">
              JC Landmarks · Design, Build &amp; Real Estate
            </span>
            <TextReveal
              as="h2"
              className="u-display text-2xl font-light tracking-tight text-[#f4f2ee] sm:text-3xl lg:text-[2.6rem]"
              lines={[
                <span key="l">
                  Architecture Beyond <span className="font-serif italic text-[#D8B479]">Expectation.</span>
                </span>,
              ]}
            />
          </div>

          <button
            type="button"
            onClick={() => smoothScrollTo(0)}
            className="group inline-flex items-center gap-3 self-start bg-white/[0.04] px-6 py-3.5 text-[0.64rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.8)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-colors duration-300 hover:bg-[#D8B479] hover:text-[#11141b] md:self-auto"
          >
            Back to top
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>

        <span aria-hidden="true" className="block h-px bg-white/[0.07]" />

        {/* Directory */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-12 sm:gap-x-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0">
                <Image src="/logo-gold.png" alt="Jay-Cee Landmarks" fill sizes="56px" className="object-contain drop-shadow-[0_0_12px_rgba(216,180,121,0.3)]" />
              </div>
              <div>
                <p className="text-[0.78rem] font-medium uppercase leading-tight tracking-[0.3em] text-[#f4f2ee]">Jay-Cee Landmarks</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-[#D8B479]">Construction · Real Estate</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-[0.9rem] leading-[1.8] text-[rgba(244,242,238,0.55)]">
              Homes and commercial buildings designed, engineered and built by one team — from the first drawing to the final key.
            </p>
            {/* Social */}
            <ul className="mt-7 flex gap-3">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`JC Landmarks on ${s.label}`}
                    className="grid h-11 w-11 place-items-center bg-white/[0.04] text-[rgba(244,242,238,0.75)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-colors duration-300 hover:bg-[#D8B479] hover:text-[#11141b]"
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
            {localTime && (
              <div className="mt-6 flex items-center gap-2.5 text-[0.62rem] uppercase tracking-[0.2em] text-[rgba(244,242,238,0.42)]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#D8B479] animate-pulse" />
                <span>Lahore office · {localTime}</span>
              </div>
            )}
          </div>

          {/* Company */}
          <nav aria-label="Company" className="lg:col-span-2 lg:col-start-6">
            <h3 className={headCls}>Company</h3>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={resolveHref(n.href)} className={linkCls}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Projects */}
          <nav aria-label="Projects" className="lg:col-span-2">
            <h3 className={headCls}>Projects</h3>
            <ul className="space-y-3">
              {PROJECT_LINKS.map((p) => (
                <li key={p.href}>
                  <Link href={resolveHref(p.href)} className={linkCls}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-3 lg:col-start-10">
            <h3 className={headCls}>Contact</h3>
            <dl className="space-y-4 text-[0.88rem]">
              <div>
                <dt className="text-[0.56rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.38)]">Call</dt>
                <dd className="mt-1">
                  <a href={CONTACT.phoneHref} className="text-[#f4f2ee] transition-colors hover:text-[#D8B479]">{CONTACT.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.56rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.38)]">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={CONTACT.whatsappHref} className="text-[#f4f2ee] transition-colors hover:text-[#D8B479]">{CONTACT.whatsapp}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.56rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.38)]">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${CONTACT.email}`} className="text-[#f4f2ee] transition-colors hover:text-[#D8B479]">{CONTACT.email}</a>
                </dd>
              </div>
              {office && (
                <div>
                  <dt className="text-[0.56rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.38)]">{office.name}</dt>
                  <dd className="mt-1 leading-[1.6]">
                    <a href={directionsUrl(office)} target="_blank" rel="noopener noreferrer" className="text-[rgba(244,242,238,0.62)] transition-colors hover:text-[#D8B479]">
                      {office.lines.map((l) => (
                        <span key={l} className="block">{l}</span>
                      ))}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-3 bg-[#D8B479] px-6 py-3.5 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#11141b] transition-colors duration-300 hover:bg-white"
            >
              Start an enquiry
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Signature wordmark — SVG text stretched to the column's exact width,
            so it spans edge to edge on every screen without ever being cut. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 96"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none mt-[clamp(4rem,9vh,6rem)] block h-auto w-full select-none overflow-visible"
        >
          <text
            x="500"
            y="80"
            textAnchor="middle"
            textLength="984"
            lengthAdjust="spacingAndGlyphs"
            fill="none"
            stroke="rgba(216,180,121,0.26)"
            strokeWidth="0.7"
            className="font-serif"
            style={{ fontSize: "92px", fontWeight: 300, fontFamily: "var(--font-display), serif" }}
          >
            JAY-CEE LANDMARKS
          </text>
        </svg>

        {/* Legal bar */}
        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-col justify-between gap-3 pt-6 text-[0.62rem] uppercase tracking-[0.18em] text-[rgba(244,242,238,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} JC Landmarks. All rights reserved.</p>
          <p>Lahore · Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
