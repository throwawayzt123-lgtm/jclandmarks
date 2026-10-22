import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import ProjectCard from "@/components/ui/ProjectCard";
import DrawingPlate from "@/components/ui/DrawingPlate";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { CATEGORIES, PROJECTS, projectsIn, type Category } from "@/lib/portfolio";
import { FACADES } from "@/lib/media";

import Link from "next/link";
export const metadata: Metadata = {
  title: "Projects",
  description: "Completed residential and commercial projects by JC Landmarks — designed, engineered and built by our own teams.",
  alternates: { canonical: "/projects" },
};

const ORDER: Category[] = ["residential", "commercial"];

export default function ProjectsPage() {
  const columnA = PROJECTS.filter((_, i) => i % 2 === 0);
  const columnB = PROJECTS.filter((_, i) => i % 2 === 1);

  return (
    <>
      <ScrollProgress />
      <main id="top">
        <PageHero
          eyebrow="Our Projects"
          title="Work that stands"
          accent="behind its drawings."
          lede="A complete portfolio of the homes and commercial buildings we have designed, engineered and built — every one delivered by our own teams."
          crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
          still={FACADES.spanishEstate}
        />

        {/* Categories */}
        <RevealScope as="section" className="bg-[#ffffff] py-[clamp(6rem,14vh,10rem)] text-[#11141b]">
          <div className="u-shell">
            <span data-r="up" className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
              Browse by type
            </span>
            <h2 data-r="words" className="mt-8 max-w-2xl font-serif text-[clamp(1.9rem,3.8vw,3.2rem)] font-light leading-[1.16] tracking-[-0.01em]">
              Two disciplines, one standard of finish.
            </h2>

            <div className="mt-[clamp(3.5rem,8vh,5.5rem)] grid gap-14 lg:grid-cols-2 lg:gap-12">
              {ORDER.map((cat) => {
                const list = projectsIn(cat);
                const lead = list.find((p) => p.cover) ?? list[0];
                return (
                  <Link key={cat} href={`/projects/${cat}`} className="group block outline-none">
                    <div data-r="plate" className="relative aspect-[4/3] overflow-hidden bg-[#0b0d12]">
                      <div data-r-img className="absolute inset-0">
                        {lead?.cover ? (
                          <Image
                            src={lead.cover.src}
                            alt={lead.cover.alt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 48vw"
                            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                            style={{ objectPosition: lead.cover.position ?? "center" }}
                          />
                        ) : (
                          <DrawingPlate
                            kind={lead?.drawing}
                            className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-6 pt-8">
                      <div>
                        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#b58c49]">
                          {String(list.length).padStart(2, "0")} projects
                        </span>
                        <h3 className="mt-3 font-serif text-[clamp(1.7rem,2.8vw,2.4rem)] font-light leading-[1.15]">
                          {CATEGORIES[cat].label}
                        </h3>
                        <p className="mt-4 max-w-md text-[0.94rem] leading-[1.75] text-[#6b7280]">{CATEGORIES[cat].lede}</p>
                      </div>
                      <span aria-hidden="true" className="pb-2 text-[1.2rem] text-[#b58c49] transition-transform duration-500 group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </RevealScope>

        {/* All work */}
        <RevealScope as="section" className="bg-[#f5f6f8] py-[clamp(6rem,14vh,10rem)] text-[#11141b]">
          <div className="u-shell">
            <div className="grid items-end gap-y-6 lg:grid-cols-12 lg:gap-x-16">
              <div className="col-span-full lg:col-span-7">
                <span data-r="up" className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
                  Complete portfolio
                </span>
                <h2 data-r="words" className="mt-8 font-serif text-[clamp(1.9rem,3.8vw,3.2rem)] font-light leading-[1.16] tracking-[-0.01em]">
                  Every project, in one place.
                </h2>
              </div>
              <p data-r="up" className="col-span-full max-w-md text-[0.96rem] leading-[1.8] text-[#4b5563] lg:col-span-4 lg:col-start-9">
                Select any project for its full story, specification and gallery.
              </p>
            </div>

            <div className="mt-[clamp(3.5rem,8vh,5.5rem)] grid gap-y-16 lg:grid-cols-2 lg:gap-x-20">
              <div className="flex flex-col gap-16 lg:gap-24">
                {columnA.map((p) => (
                  <ProjectCard key={p.slug} project={p} showCategory />
                ))}
              </div>
              <div className="flex flex-col gap-16 lg:mt-32 lg:gap-24">
                {columnB.map((p) => (
                  <ProjectCard key={p.slug} project={p} showCategory />
                ))}
              </div>
            </div>
          </div>
        </RevealScope>

        <CtaBand
          title="Planning a project of your own?"
          body="Tell us about the site and what you want to build. We reply within one working day."
          action={{ label: "Start a conversation", href: "/contact" }}
          secondary={{ label: "Our services", href: "/services" }}
        />
      </main>
      <Footer />
    </>
  );
}
