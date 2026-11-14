import type { Metadata } from "next";
import { pageMeta, abs, ldGraph, ORG_ID } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { formatDate, postHref, postsByDate } from "@/lib/blog";

export const metadata: Metadata = pageMeta({
  title: "Journal: Building a House in Lahore",
  description:
    "Plain guidance on building in Lahore from Jay-Cee Landmarks — what a house really costs, how a build is sequenced, and what to check before you sign.",
  path: "/journal",
});

export default function JournalPage() {
  const posts = postsByDate();
  const [lead, ...rest] = posts;

  return (
    <>
      <ScrollProgress />
      <JsonLd
        data={ldGraph({
          "@type": "Blog",
          "@id": `${abs("/journal")}#blog`,
          name: "Jay-Cee Landmarks Journal",
          description: "Guidance on building a house in Lahore: costs, contracts, timelines and choosing a builder.",
          url: abs("/journal"),
          inLanguage: "en-PK",
          publisher: { "@id": ORG_ID },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.seoTitle ?? p.title,
            url: abs(postHref(p)),
            datePublished: p.date,
            image: abs(p.cover.src),
          })),
        })}
      />
      <main id="top">
        <PageHero
          eyebrow="Journal"
          title="What we have"
          accent="learned on site."
          lede="Notes on building in Lahore — costs, sequence and the questions worth asking before work begins."
          crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
          still={lead?.cover}
        />

        <RevealScope as="section" className="bg-[#ffffff] py-[clamp(5rem,12vh,8rem)] text-[#11141b]">
          <div className="u-shell">
            {lead && (
              <article className="group">
                <Link href={postHref(lead)} className="grid items-center gap-y-8 outline-none lg:grid-cols-12 lg:gap-x-20">
                  <div data-r="plate" className="relative aspect-[4/3] overflow-hidden bg-[#000000] lg:col-span-7">
                    <div data-r-img className="absolute inset-0">
                      <Image
                        src={lead.cover.src}
                        alt={lead.cover.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        priority
                        className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                        style={{ objectPosition: lead.cover.position ?? "center" }}
                      />
                    </div>
                  </div>
                  <div data-r="stagger" className="lg:col-span-5">
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.62rem] uppercase tracking-[0.26em]">
                      <span className="font-semibold text-[#b58c49]">{lead.topic}</span>
                      <span className="text-[#8a8f9a]">
                        {formatDate(lead.date)} · {lead.minutes} min read
                      </span>
                    </span>
                    <h2 className="mt-5 font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] font-light leading-[1.14] tracking-[-0.01em]">
                      {lead.title}
                    </h2>
                    <span
                      aria-hidden="true"
                      className="mt-6 block h-px w-12 origin-left bg-[#b58c49] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-[3]"
                    />
                    <p className="mt-6 max-w-md text-[0.98rem] leading-[1.8] text-[#4b5563]">{lead.summary}</p>
                    <span className="mt-7 inline-flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.24em] text-[#11141b] group-focus-visible:text-[#b58c49]">
                      Read the article
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                    </span>
                  </div>
                </Link>
              </article>
            )}

            {rest.length > 0 && (
              <div className="mt-[clamp(4.5rem,10vh,7rem)] grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <article key={p.slug} className="group">
                    <Link href={postHref(p)} className="block outline-none">
                      <div data-r="plate" className="relative aspect-[3/2] overflow-hidden bg-[#000000]">
                        <div data-r-img className="absolute inset-0">
                          <Image
                            src={p.cover.src}
                            alt={p.cover.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            loading="lazy"
                            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                            style={{ objectPosition: p.cover.position ?? "center" }}
                          />
                        </div>
                      </div>
                      <div data-r="stagger" className="pt-6">
                        <span className="block text-[0.6rem] uppercase tracking-[0.24em] text-[#b58c49]">{p.topic}</span>
                        <h3 className="mt-3 font-serif text-[clamp(1.3rem,2vw,1.65rem)] font-light leading-[1.2]">{p.title}</h3>
                        <p className="mt-3 text-[0.92rem] leading-[1.75] text-[#6b7280]">{p.summary}</p>
                        <span className="mt-4 block text-[0.58rem] uppercase tracking-[0.22em] text-[#8a8f9a]">
                          {formatDate(p.date)} · {p.minutes} min read
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </RevealScope>

        <CtaBand
          title="Have a question about your own plot?"
          body="Tell us the plot size, the area and what you want to build, and we will come back with a clear next step."
          action={{ label: "Start a conversation", href: "/contact" }}
          secondary={{ label: "Our services", href: "/services" }}
        />
      </main>
      <Footer />
    </>
  );
}
