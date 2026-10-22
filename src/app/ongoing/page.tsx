import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import DrawingPlate from "@/components/ui/DrawingPlate";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { CATEGORIES, ONGOING, STAGES, enquiryHref } from "@/lib/portfolio";
import { INTERIORS } from "@/lib/media";

import Link from "next/link";
export const metadata: Metadata = {
  title: "Ongoing Projects",
  description: "Active JC Landmarks construction sites — current stage, progress and key specifications for each project under way.",
  alternates: { canonical: "/ongoing" },
};

export default function OngoingPage() {
  const residential = ONGOING.filter((s) => s.category === "residential").length;
  const commercial = ONGOING.length - residential;

  return (
    <>
      <ScrollProgress />
      <main id="top">
        <PageHero
          eyebrow="Ongoing Projects"
          title="On site,"
          accent="right now."
          lede="The projects our teams are building today — where each one stands, how far along it is, and what comes next."
          crumbs={[{ label: "Home", href: "/" }, { label: "Ongoing" }]}
          still={INTERIORS.staircaseCantilever}
        />

        {/* Summary counts — derived from the data, so they never drift */}
        <RevealScope as="section" className="bg-[#ffffff] text-[#11141b]">
          <div className="u-shell grid grid-cols-3 gap-6 py-[clamp(3.5rem,8vh,5rem)]">
            {[
              { n: ONGOING.length, label: "Active sites" },
              { n: residential, label: "Residential" },
              { n: commercial, label: "Commercial" },
            ].map((c) => (
              <div key={c.label} className="relative pt-7">
                <span data-r="rule" aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-[rgba(20,33,61,0.12)]" />
                <span data-r="count" data-value={c.n} className="block font-serif text-[clamp(2.2rem,4vw,3.2rem)] font-light leading-none">
                  {c.n}
                </span>
                <span className="mt-3 block text-[0.62rem] uppercase tracking-[0.22em] text-[#8a8f9a]">{c.label}</span>
              </div>
            ))}
          </div>
        </RevealScope>

        {/* Sites */}
        <section className="bg-[#ffffff] pb-[clamp(6rem,14vh,10rem)] text-[#11141b]">
          <div className="u-shell flex flex-col gap-[clamp(5rem,12vh,8rem)]">
            {ONGOING.map((s, i) => {
              const flipped = i % 2 === 1;
              return (
                <RevealScope key={s.slug} as="article" className="grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-20">
                  {/* Visual preview */}
                  <figure
                    className={[
                      "col-span-full lg:col-span-6 lg:row-start-1",
                      flipped ? "lg:col-start-7" : "lg:col-start-1",
                    ].join(" ")}
                  >
                    <div data-r="plate" className="relative aspect-[4/3] overflow-hidden bg-[#0b0d12]">
                      <div data-r-img className="absolute inset-0">
                        {s.preview ? (
                          <Image
                            src={s.preview.src}
                            alt={s.preview.alt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 48vw"
                            loading="lazy"
                            className="object-cover"
                            style={{ objectPosition: s.preview.position ?? "center" }}
                          />
                        ) : (
                          <DrawingPlate kind={s.drawing} label={`Elevation drawing of ${s.title}`} className="absolute inset-0" />
                        )}
                      </div>
                    </div>
                    <figcaption className="mt-4 text-[0.6rem] uppercase tracking-[0.22em] text-[#8a8f9a]">
                      {s.preview ? "Architectural render" : "Front elevation"} · {s.title}
                    </figcaption>
                  </figure>

                  {/* Details */}
                  <div
                    className={[
                      "col-span-full lg:col-span-5 lg:row-start-1",
                      flipped ? "lg:col-start-1" : "lg:col-start-8",
                    ].join(" ")}
                  >
                    <span data-r="up" className="block text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#b58c49]">
                      {CATEGORIES[s.category].label} · {s.location}
                    </span>
                    <h2 data-r="words" className="mt-4 font-serif text-[clamp(1.7rem,2.8vw,2.4rem)] font-light leading-[1.18]">
                      {s.title}
                    </h2>
                    <p data-r="up" className="mt-5 text-[0.96rem] leading-[1.8] text-[#4b5563]">
                      {s.summary}
                    </p>

                    {/* Progress */}
                    <div data-r="up" className="mt-10">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[0.62rem] uppercase tracking-[0.22em] text-[#8a8f9a]">
                          Current stage · <span className="text-[#11141b]">{STAGES[s.stage]}</span>
                        </span>
                        <span className="font-serif text-[1.6rem] font-light leading-none">
                          <span data-r="count" data-value={s.progress}>
                            {s.progress}
                          </span>
                          <span className="text-[1rem] text-[#b58c49]">%</span>
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`${s.title} construction progress`}
                        aria-valuenow={s.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="relative mt-4 h-[3px] bg-[rgba(20,33,61,0.1)]"
                      >
                        <span
                          data-r="bar"
                          data-value={s.progress}
                          aria-hidden="true"
                          className="absolute inset-0 origin-left bg-[#b58c49]"
                          style={{ transform: `scaleX(${s.progress / 100})` }}
                        />
                      </div>
                    </div>

                    {/* Stage tracker */}
                    <ol data-r="stagger" className="mt-8 grid grid-cols-5 gap-2">
                      {STAGES.map((stage, k) => {
                        const done = k < s.stage;
                        const current = k === s.stage;
                        return (
                          <li key={stage} className="flex flex-col gap-2.5">
                            <span
                              aria-hidden="true"
                              className={[
                                "block h-[7px] w-[7px] rotate-45",
                                done ? "bg-[#b58c49]" : current ? "bg-[#ffffff] shadow-[0_0_0_1.5px_#b58c49]" : "bg-[rgba(20,33,61,0.15)]",
                              ].join(" ")}
                            />
                            <span
                              className={[
                                "text-[0.56rem] uppercase leading-[1.4] tracking-[0.12em]",
                                current ? "text-[#11141b]" : done ? "text-[#6b7280]" : "text-[#a3a8b2]",
                              ].join(" ")}
                            >
                              {stage}
                            </span>
                          </li>
                        );
                      })}
                    </ol>

                    {/* Quick specs */}
                    <dl data-r="stagger" className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 pt-8 shadow-[inset_0_1px_0_rgba(20,33,61,0.1)]">
                      {s.specs.map((f) => (
                        <div key={f.label}>
                          <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-[#8a8f9a]">{f.label}</dt>
                          <dd className="mt-1.5 font-serif text-[1.15rem] font-light">{f.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <Link
                      data-r="up"
                      href={enquiryHref("site-visit", s.title)}
                      className="group mt-10 inline-flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.24em] text-[#11141b] transition-colors hover:text-[#b58c49]"
                    >
                      Request a site visit
                      <span aria-hidden="true" className="text-[#b58c49] transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                    </Link>
                  </div>
                </RevealScope>
              );
            })}
          </div>
        </section>

        <CtaBand
          title="Want to see how we build?"
          body="Clients and prospective clients are welcome on our sites by appointment, with a project engineer."
          action={{ label: "Book a site visit", href: enquiryHref("site-visit") }}
          secondary={{ label: "Completed projects", href: "/projects" }}
        />
      </main>
      <Footer />
    </>
  );
}
