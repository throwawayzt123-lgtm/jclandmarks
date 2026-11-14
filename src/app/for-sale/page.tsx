import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { LISTINGS, enquiryHref } from "@/lib/portfolio";
import { CONTACT } from "@/lib/site";
import { INTERIORS } from "@/lib/media";

import Link from "next/link";
export const metadata: Metadata = pageMeta({
  title: "House for Sale in DHA Phase 7, Lahore",
  description:
    "Aura’26, a newly built 1 Kanal house for sale in DHA Phase 7, Lahore, by Jay-Cee Landmarks — double-height lounge, marble staircase. Price on request.",
  path: "/for-sale",
  image: { src: LISTINGS[0].cover.src, alt: LISTINGS[0].cover.alt },
});

export default function ForSalePage() {
  const available = LISTINGS.filter((l) => l.status === "Available").length;

  return (
    <>
      <ScrollProgress />
      <main id="top">
        <PageHero
          eyebrow="For Sale"
          title="Homes ready"
          accent="to move into."
          lede="Homes built by our own teams and ready now. We can show you how each one was built, so you know exactly what you are buying."
          crumbs={[{ label: "Home", href: "/" }, { label: "For Sale" }]}
          still={INTERIORS.salonCurved}
        />

        <RevealScope as="section" className="bg-[#ffffff] py-[clamp(5rem,12vh,8rem)] text-[#11141b]">
          <div className="u-shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 data-r="words" className="font-serif text-[clamp(1.8rem,3.4vw,2.8rem)] font-light leading-[1.16]">
                Available <em className="italic text-[#b58c49]">residences</em>
              </h2>
              <p data-r="up" className="text-[0.64rem] uppercase tracking-[0.24em] text-[#8a8f9a]">
                {LISTINGS.length} homes · {available} available now
              </p>
            </div>
            <span data-r="rule" aria-hidden="true" className="mt-8 block h-px origin-left bg-[rgba(20,33,61,0.12)]" />

            <div className="mt-[clamp(3rem,7vh,4.5rem)] grid gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
              {LISTINGS.map((l) => {
                const reserved = l.status === "Reserved";
                return (
                  <article key={l.slug} className="group flex flex-col">
                    <div data-r="plate" className="relative aspect-[4/3] overflow-hidden bg-[#000000]">
                      <div data-r-img className="absolute inset-0">
                        <Image
                          src={l.cover.src}
                          alt={l.cover.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          loading="lazy"
                          className={[
                            "object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]",
                            reserved ? "grayscale-[35%]" : "",
                          ].join(" ")}
                          style={{ objectPosition: l.cover.position ?? "center" }}
                        />
                      </div>
                    </div>

                    <div data-r="stagger" className="flex flex-1 flex-col pt-7">
                      <span className="flex items-baseline justify-between gap-4 text-[0.6rem] uppercase tracking-[0.24em]">
                        <span className="font-semibold text-[#b58c49]">{l.location}</span>
                        <span className={reserved ? "text-[#8a8f9a]" : "text-[#11141b]"}>
                          <span aria-hidden="true" className={`mr-2 inline-block h-[5px] w-[5px] rotate-45 align-middle ${reserved ? "bg-[#a3a8b2]" : "bg-[#b58c49]"}`} />
                          {l.status}
                        </span>
                      </span>

                      <h3 className="mt-3 font-serif text-[clamp(1.4rem,2vw,1.75rem)] font-light leading-[1.2]">{l.title}</h3>

                      {/* Property details */}
                      <dl className="mt-6 grid grid-cols-4 gap-3 py-5 shadow-[inset_0_1px_0_rgba(20,33,61,0.1),inset_0_-1px_0_rgba(20,33,61,0.1)]">
                        {l.specs.map((f) => (
                          <div key={f.label}>
                            <dt className="text-[0.54rem] uppercase tracking-[0.18em] text-[#8a8f9a]">{f.label}</dt>
                            <dd className="mt-1.5 font-serif text-[1.05rem] font-light">{f.value}</dd>
                          </div>
                        ))}
                      </dl>

                      <ul className="mt-5 space-y-2">
                        {l.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-[0.88rem] text-[#4b5563]">
                            <span aria-hidden="true" className="block h-[4px] w-[4px] rotate-45 bg-[#b58c49]" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-6 font-serif text-[1.15rem] font-light italic text-[#11141b]">{l.price}</p>

                      {/* Calls to action */}
                      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-4 pt-7">
                        <Link href={enquiryHref("buy", l.title)} className="u-btn u-btn--dark u-btn--sm">
                          <span>{reserved ? "Join the waiting list" : "Get a quote"}</span>
                          <span aria-hidden="true" className="u-btn__arrow" />
                        </Link>
                        {l.project && (
                          <Link href={l.project} className="u-btn u-btn--line u-btn--sm">
                            <span>Visit project</span>
                            <span aria-hidden="true" className="u-btn__arrow" />
                          </Link>
                        )}
                        <a href={CONTACT.phoneHref} className="text-[0.62rem] uppercase tracking-[0.24em] text-[#11141b] underline decoration-[#b58c49] decoration-1 underline-offset-[6px] transition-colors hover:text-[#b58c49]">
                          Call us
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </RevealScope>

        <CtaBand
          title="Looking for something specific?"
          body="Some homes are sold privately before they are ever listed. Tell us what you need and we will tell you first."
          action={{ label: "Tell us what you need", href: enquiryHref("buy") }}
        />
      </main>
      <Footer />
    </>
  );
}
