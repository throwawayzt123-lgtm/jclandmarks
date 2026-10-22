import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import DrawingPlate from "@/components/ui/DrawingPlate";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { CATEGORIES, PROJECTS, enquiryHref, findProject, projectHref, projectsIn } from "@/lib/portfolio";

import Link from "next/link";
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const p = findProject(category, slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.location}`,
    description: p.summary,
    alternates: { canonical: projectHref(p) },
    openGraph: p.cover ? { images: [{ url: p.cover.src, alt: p.cover.alt }] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[category]/[slug]">) {
  const { category, slug } = await params;
  const p = findProject(category, slug);
  if (!p) notFound();

  const cat = CATEGORIES[p.category];
  const siblings = projectsIn(p.category);
  const next = siblings[(siblings.indexOf(p) + 1) % siblings.length];
  const hasPhotos = Boolean(p.cover) || p.gallery.length > 0;

  return (
    <>
      <ScrollProgress />
      <main id="top">
        <PageHero
          eyebrow={`${cat.label} Project`}
          title={p.title}
          lede={p.summary}
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: cat.label, href: `/projects/${p.category}` },
            { label: p.title },
          ]}
          still={p.cover}
          drawing={p.cover ? undefined : p.drawing}
          facts={[{ label: "Location", value: p.location }, ...p.facts].slice(0, 4)}
        />

        {/* Story + scope */}
        <RevealScope as="section" className="bg-[#ffffff] py-[clamp(6rem,14vh,10rem)] text-[#11141b]">
          <div className="u-shell grid gap-y-14 lg:grid-cols-12 lg:gap-x-20">
            <div className="col-span-full lg:col-span-4">
              <span data-r="up" className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
                The Project
              </span>
              <h2 data-r="words" className="mt-8 font-serif text-[clamp(1.8rem,3.2vw,2.7rem)] font-light leading-[1.18] tracking-[-0.01em]">
                {p.location}
              </h2>
              {p.credit && (
                <p data-r="up" className="mt-6 text-[0.64rem] uppercase tracking-[0.22em] text-[#8a8f9a]">
                  {p.credit}
                </p>
              )}
            </div>

            <div className="col-span-full lg:col-span-7 lg:col-start-6">
              <div data-r="stagger" className="space-y-6">
                {p.story.map((para) => (
                  <p key={para.slice(0, 24)} className="text-[1.04rem] leading-[1.85] text-[#374151]">
                    {para}
                  </p>
                ))}
              </div>

              <div className="mt-14">
                <span data-r="rule" aria-hidden="true" className="block h-px origin-left bg-[rgba(20,33,61,0.12)]" />
                <div className="grid gap-y-8 pt-8 sm:grid-cols-[10rem_1fr]">
                  <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#8a8f9a]">Our scope</span>
                  <ul data-r="stagger" className="flex flex-wrap gap-x-7 gap-y-3">
                    {p.scope.map((s) => (
                      <li key={s} className="flex items-center gap-2.5 font-serif text-[1.08rem] font-light">
                        <span aria-hidden="true" className="block h-[5px] w-[5px] rotate-45 bg-[#b58c49]" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </RevealScope>

        {/* Gallery */}
        <RevealScope as="section" className="bg-[#ffffff] pb-[clamp(6rem,14vh,10rem)] text-[#11141b]">
          <div className="u-shell">
            {p.cover && (
              <figure data-r="plate" className="relative h-[clamp(22rem,78vh,44rem)] overflow-hidden bg-[#0b0d12]">
                <div data-r-img className="absolute inset-0">
                  <div data-r="drift" className="absolute inset-x-0 -inset-y-[7%]">
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      style={{ objectPosition: p.cover.position ?? "center" }}
                    />
                  </div>
                </div>
              </figure>
            )}

            {p.gallery.length > 0 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {p.gallery.map((g, i) => {
                  const wide = i % 3 === 2;
                  return (
                    <figure
                      key={g.src + i}
                      data-r="plate"
                      className={`relative overflow-hidden bg-[#0b0d12] ${wide ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/5]"}`}
                    >
                      <div data-r-img className="absolute inset-0">
                        <Image
                          src={g.src}
                          alt={g.alt}
                          fill
                          sizes={wide ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                          loading="lazy"
                          className="object-cover"
                          style={{ objectPosition: g.position ?? "center" }}
                        />
                      </div>
                    </figure>
                  );
                })}
              </div>
            )}

            {!hasPhotos && (
              <figure>
                <div data-r="plate">
                  <DrawingPlate kind={p.drawing} label={`Elevation drawing of ${p.title}`} className="aspect-[16/9]" />
                </div>
                <figcaption data-r="up" className="mt-5 text-[0.64rem] uppercase tracking-[0.22em] text-[#8a8f9a]">
                  Front elevation · project photography is being prepared
                </figcaption>
              </figure>
            )}
          </div>
        </RevealScope>

        {/* Next project */}
        {next && next.slug !== p.slug && (
          <RevealScope as="section" className="bg-[#f5f6f8] text-[#11141b]">
            <Link href={projectHref(next)} className="group block outline-none">
              <div className="u-shell grid items-center gap-y-10 py-[clamp(4.5rem,11vh,7rem)] lg:grid-cols-12 lg:gap-x-16">
                <div className="col-span-full lg:col-span-6">
                  <span data-r="up" className="block text-[0.62rem] uppercase tracking-[0.26em] text-[#8a8f9a]">
                    Next {cat.label.toLowerCase()} project
                  </span>
                  <span data-r="words" className="mt-5 block font-serif text-[clamp(2rem,4.4vw,3.8rem)] font-light leading-[1.1] transition-colors duration-500 group-hover:text-[#b58c49]">
                    {next.title}
                  </span>
                  <span data-r="up" className="mt-6 inline-flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.24em]">
                    {next.location}
                    <span aria-hidden="true" className="text-[#b58c49] transition-transform duration-500 group-hover:translate-x-2">→</span>
                  </span>
                </div>
                <div data-r="plate" className="relative col-span-full aspect-[16/10] overflow-hidden bg-[#0b0d12] lg:col-span-5 lg:col-start-8">
                  <div data-r-img className="absolute inset-0">
                    {next.cover ? (
                      <Image
                        src={next.cover.src}
                        alt={next.cover.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                        style={{ objectPosition: next.cover.position ?? "center" }}
                      />
                    ) : (
                      <DrawingPlate kind={next.drawing} className="absolute inset-0" />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </RevealScope>
        )}

        <CtaBand
          title="Planning something similar?"
          body="Tell us about your site and brief — we will walk you through how we would approach it."
          action={{ label: "Discuss your project", href: enquiryHref(p.category, p.title) }}
          secondary={{ label: `All ${cat.label.toLowerCase()} projects`, href: `/projects/${p.category}` }}
        />
      </main>
      <Footer />
    </>
  );
}
