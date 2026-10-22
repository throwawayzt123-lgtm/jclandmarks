import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import ProjectCard from "@/components/ui/ProjectCard";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { CATEGORIES, enquiryHref, projectsIn, type Category } from "@/lib/portfolio";

import Link from "next/link";
/** Only the two real categories exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(CATEGORIES) as Category[]).map((category) => ({ category }));
}

const isCategory = (c: string): c is Category => c in CATEGORIES;

export async function generateMetadata({ params }: PageProps<"/projects/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const c = CATEGORIES[category];
  return {
    title: `${c.label} Projects`,
    description: c.lede,
    alternates: { canonical: `/projects/${category}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/projects/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const c = CATEGORIES[category];
  const list = projectsIn(category);
  const [lead, ...rest] = list;
  const heroSource = list.find((p) => p.cover);

  return (
    <>
      <ScrollProgress />
      <main id="top">
        <PageHero
          eyebrow={`Projects · ${c.label}`}
          title={c.title}
          lede={c.lede}
          crumbs={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: c.label }]}
          still={heroSource?.cover}
          drawing={heroSource ? undefined : lead?.drawing}
        />

        <RevealScope as="section" className="bg-[#ffffff] pb-[clamp(6rem,14vh,10rem)] text-[#11141b]">
          {/* Category switch — two plain links, the current one underlined in gold */}
          <div className="u-shell">
            <nav aria-label="Project categories" className="flex items-center gap-10 pt-12 sm:gap-14">
              {(Object.keys(CATEGORIES) as Category[]).map((k) => {
                const on = k === category;
                return (
                  <Link
                    key={k}
                    href={`/projects/${k}`}
                    aria-current={on ? "page" : undefined}
                    className={[
                      "relative pb-4 text-[0.7rem] uppercase tracking-[0.26em] transition-colors duration-500",
                      on ? "text-[#11141b]" : "text-[#8a8f9a] hover:text-[#11141b]",
                    ].join(" ")}
                  >
                    {CATEGORIES[k].label}
                    <span className="ml-2 text-[#b58c49]">{String(projectsIn(k).length).padStart(2, "0")}</span>
                    {on && <span aria-hidden="true" className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#b58c49]" />}
                  </Link>
                );
              })}
            </nav>
            <span aria-hidden="true" className="block h-px bg-[rgba(20,33,61,0.1)]" />

            {lead && (
              <div className="mt-[clamp(3.5rem,8vh,5.5rem)]">
                <ProjectCard project={lead} feature sizes="(max-width: 1024px) 100vw, 55vw" />
              </div>
            )}

            {rest.length > 0 && (
              <div className="mt-[clamp(4.5rem,10vh,7rem)] grid gap-y-16 sm:grid-cols-2 sm:gap-x-12 lg:gap-x-20">
                {rest.map((p, i) => (
                  <div key={p.slug} className={i % 2 === 1 ? "lg:mt-28" : undefined}>
                    <ProjectCard project={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealScope>

        <CtaBand
          title={category === "residential" ? "Ready to build your home?" : "Planning a commercial building?"}
          body="Share your site, plot size and timeline, and we will come back with a clear next step."
          action={{ label: "Discuss your project", href: enquiryHref(category) }}
          secondary={{ label: "See ongoing work", href: "/ongoing" }}
        />
      </main>
      <Footer />
    </>
  );
}
