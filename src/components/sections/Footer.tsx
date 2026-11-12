"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TextReveal from "@/components/ui/TextReveal";
import { smoothScrollTo } from "@/components/SmoothScrollProvider";
import { CONTACT, OFFICES, PARENT, SOCIAL, directionsUrl } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";
import ParentCompany from "@/components/sections/ParentCompany";

/**
 * FOOTER — black.
 *
 * A deeper black than the dark bands that close most pages (#000000 against
 * #000000), separated from them by a single faint hairline, so the two read
 * as distinct without a hard edge. Gold carries the accents; type is warm
 * off-white at stepped opacities.
 */
const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const PROJECT_LINKS = [
  { label: "Our Projects", href: "/projects" },
  { label: "Ongoing", href: "/ongoing" },
  { label: "Homes for Sale", href: "/for-sale" },
];

const linkCls = "text-[0.74rem] uppercase tracking-[0.16em] text-[rgba(244,242,238,0.62)] transition-colors duration-300 hover:text-[#D8B479]";
const headCls = "mb-5 font-sans text-[0.64rem] font-medium uppercase tracking-[0.28em] text-[#D8B479]";

export default function Footer() {
  const onHome = usePathname() === "/";
  /** "#section" anchors only exist on the homepage; elsewhere, route home first. */
  const resolveHref = (href: string) => (href.startsWith("#") && !onHome ? `/${href}` : href);
  const office = OFFICES[0];


  return (
    <>
    <ParentCompany />
    <footer role="contentinfo" className="relative overflow-hidden bg-[#000000] text-[#f4f2ee]">
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
                  Ordinary is not <span className="font-serif italic text-[#D8B479]">our address.</span>
                </span>,
              ]}
            />
          </div>

          <button
            type="button"
            onClick={() => smoothScrollTo(0)}
            className="u-btn u-btn--light u-btn--sm u-btn--up self-start md:self-auto"
          >
            <span>Back to top</span>
            <span aria-hidden="true" className="u-btn__arrow" />
          </button>
        </div>

        <span aria-hidden="true" className="block h-px bg-white/[0.07]" />

        {/* Directory */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-12 sm:gap-x-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label="Jay-Cee Landmarks — home"
              className="grid h-36 w-36 place-items-center rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(216,180,121,0.45),0_0_40px_-6px_rgba(216,180,121,0.35)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-luxe)] hover:scale-[1.04] hover:shadow-[inset_0_0_0_1px_rgba(216,180,121,0.8),0_0_50px_-4px_rgba(216,180,121,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8B479] sm:h-40 sm:w-40"
            >
              <span className="relative h-[70%] w-[70%]">
                <Image src="/images/jc-logo-gold.png" alt="" fill sizes="110px" className="object-contain" />
              </span>
            </Link>
            <p className="mt-8 max-w-sm text-[0.9rem] leading-[1.8] text-[rgba(244,242,238,0.55)]">
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
                    className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.04] text-[rgba(244,242,238,0.75)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-colors duration-300 hover:bg-[#D8B479] hover:text-[#11141b]"
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
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
              className="u-btn u-btn--gold u-btn--sm mt-7"
            >
              <span>Start an enquiry</span>
              <span aria-hidden="true" className="u-btn__arrow" />
            </Link>
          </div>
        </div>

        {/* Signature wordmark — outlined letters spread edge to edge. Each one
            lifts a little and fills with gold as the pointer passes over it. */}
        <p
          aria-label="Jay-Cee Landmarks"
          className="u-display mt-[clamp(4rem,9vh,6rem)] flex w-full select-none items-baseline justify-between whitespace-nowrap text-[clamp(1.5rem,8.1vw,9.5rem)] font-light uppercase leading-[1.1]"
        >
          {"JAY-CEE LANDMARKS".split("").map((ch, i) =>
            ch === " " ? (
              <span key={i} aria-hidden="true" className="w-[0.28em]" />
            ) : (
              <span
                key={i}
                aria-hidden="true"
                data-ch={ch}
                className="inline-block cursor-default text-transparent before:content-[attr(data-ch)] [-webkit-text-stroke:1px_rgba(216,180,121,0.42)] transition-[color,transform,-webkit-text-stroke-color] duration-500 ease-[var(--ease-luxe)] hover:-translate-y-[0.08em] hover:scale-[1.07] hover:text-[#D8B479] hover:[-webkit-text-stroke-color:#D8B479] hover:duration-200"
              />
            )
          )}
        </p>

        {/* Legal bar */}
        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-col justify-between gap-3 pt-6 text-[0.62rem] uppercase tracking-[0.18em] text-[rgba(244,242,238,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} JC Landmarks · A product of{" "}
            {PARENT.url ? (
              <a href={PARENT.url} target="_blank" rel="noopener noreferrer" className="text-[#D8B479] transition-colors hover:text-white">
                {PARENT.name}
              </a>
            ) : (
              <span className="text-[#D8B479]">{PARENT.name}</span>
            )}
            . All rights reserved.
          </p>
          <p>Lahore · Pakistan</p>
        </div>
      </div>
    </footer>
    </>
  );
}
