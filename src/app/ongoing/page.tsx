import StatsScatter, { type Stat } from "@/components/ui/StatsScatter";
import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import SiteLedger from "@/components/ui/SiteLedger";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { SITES, enquiryHref } from "@/lib/portfolio";
import { FACADES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Ongoing Projects",
  description: "Homes and commercial buildings JC Landmarks is building now across Lahore — DHA, Valencia Town, Fazaia Housing Society and more.",
  alternates: { canonical: "/ongoing" },
};

/** Plot sizes in marla, for the "under construction" total. 1 kanal = 20 marla. */
const toMarla = (size: string) => {
  const n = parseFloat(size);
  return /kanal/i.test(size) ? n * 20 : n;
};

export default function OngoingPage() {
  const ongoing = SITES.filter((s) => s.status === "ongoing");
  const residential = ongoing.filter((s) => s.type === "residential").length;
  const commercial = ongoing.length - residential;
  const kanal = ongoing.reduce((sum, s) => sum + toMarla(s.size), 0) / 20;
  const areas = new Set(ongoing.map((s) => s.area)).size;
  const featured = ongoing.filter((s) => s.photo).slice(0, 4);

  const stats: Stat[] = [
    { value: String(ongoing.length), unit: "sites", caption: "projects being built by our teams right now." },
    { value: String(residential), unit: "homes", caption: "residential builds, grey structure to turnkey." },
    { value: String(Math.round(kanal)), unit: "kanal", caption: "of land under construction today." },
    { value: String(commercial), unit: "commercial", caption: "offices, showrooms and plazas on site." },
    { value: String(areas), unit: "areas", caption: "across Lahore, from DHA to Valencia Town." },
  ];

  return (
    <>
      <ScrollProgress />
      <main id="top">
        <PageHero
          eyebrow="Ongoing Projects"
          title="On site,"
          accent="right now."
          lede="The homes and commercial buildings our teams are building today — across DHA, Valencia Town, Fazaia and beyond."
          crumbs={[{ label: "Home", href: "/" }, { label: "Ongoing" }]}
          still={FACADES.phase7Villa}
        />

        {/* At a glance — every figure is counted from the project list itself */}
        <StatsScatter stats={stats} eyebrow="At a glance" title="Every figure counted from our live project list." />

        {/* On site now — only the projects with photographs, kept to one row */}
        {featured.length > 0 && (
          <RevealScope as="section" className="bg-white pb-[clamp(4rem,10vh,6rem)] text-[#11141b]">
            <div className="u-shell">
              <span data-r="up" className="block text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
                On site now
              </span>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((s) => (
                  <figure key={s.plot} className="group">
                    <div data-r="plate" className="relative aspect-video overflow-hidden bg-[#000000]">
                      <div data-r-img className="absolute inset-0">
                        <Image
                          src={s.photo!.src}
                          alt={s.photo!.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          loading="lazy"
                          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                          style={{ objectPosition: s.photo!.position ?? "center" }}
                        />
                      </div>
                    </div>
                    <figcaption data-r="up" className="pt-4">
                      <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-[#b58c49]">
                        {s.size} · {s.area}
                      </span>
                      <span className="mt-1.5 block font-serif text-[1.2rem] font-light">{s.plot}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </RevealScope>
        )}

        {/* The full list */}
        <RevealScope as="section" className="bg-white pb-[clamp(5rem,12vh,8rem)] text-[#11141b]">
          <div className="u-shell">
            <div className="grid items-end gap-y-6 pb-10 lg:grid-cols-12 lg:gap-x-16">
              <div className="col-span-full lg:col-span-7">
                <span data-r="up" className="block text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
                  Project register
                </span>
                <h2 data-r="words" className="mt-6 font-serif text-[clamp(1.8rem,3.4vw,2.8rem)] font-light leading-[1.16]">
                  Every project we are building.
                </h2>
              </div>
              <p data-r="up" className="col-span-full max-w-md text-[0.95rem] leading-[1.8] text-[#4b5563] lg:col-span-4 lg:col-start-9">
                From 5 marla homes to 4 kanal estates and commercial plazas — filter by type, or see what we have recently handed over.
              </p>
            </div>
            <SiteLedger sites={SITES} />
          </div>
        </RevealScope>

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
