import type { Metadata } from "next";
import { pageMeta, abs, ldGraph, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import CtaBand from "@/components/ui/CtaBand";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { POSTS, findPost, formatDate, postHref, postsByDate, type Block } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) return {};
  return pageMeta({
    title: p.seoTitle ?? p.title,
    // Long headlines would be cut off in results with the brand appended.
    absoluteTitle: (p.seoTitle ?? p.title).length > 42,
    description: p.summary,
    path: postHref(p),
    image: { src: p.cover.src, alt: p.cover.alt },
    type: "article",
    publishedTime: p.date,
    modifiedTime: p.updated,
    section: p.topic,
  });
}

/** One article block. Typography lives here, so an article can never break it. */
function Prose({ block }: { block: Block }) {
  switch (block.kind) {
    case "h":
      return (
        <h2 data-r="up" className="mt-14 font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] font-light leading-[1.2] text-[#11141b] first:mt-0">
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul data-r="stagger" className="mt-7 space-y-3.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-[1.02rem] leading-[1.8] text-[#374151]">
              <span aria-hidden="true" className="mt-[0.7em] block h-[5px] w-[5px] shrink-0 rotate-45 bg-[#b58c49]" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote data-r="up" className="my-12 pl-7 shadow-[inset_3px_0_0_0_#b58c49]">
          <p className="font-serif text-[clamp(1.3rem,2.3vw,1.75rem)] font-light italic leading-[1.4] text-[#11141b]">{block.text}</p>
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-12">
          <div data-r="plate" className="relative aspect-[16/9] overflow-hidden bg-[#000000]">
            <div data-r-img className="absolute inset-0">
              <Image
                src={block.still.src}
                alt={block.still.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                loading="lazy"
                className="object-cover"
                style={{ objectPosition: block.still.position ?? "center" }}
              />
            </div>
          </div>
          {block.caption && (
            <figcaption data-r="up" className="mt-4 text-[0.84rem] leading-[1.7] text-[#8a8f9a]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return (
        <p data-r="up" className="mt-7 text-[1.04rem] leading-[1.9] text-[#374151]">
          {block.text}
        </p>
      );
  }
}

export default async function PostPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const others = postsByDate().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <ScrollProgress />
      <JsonLd
        data={ldGraph({
          "@type": "BlogPosting",
          "@id": `${abs(postHref(post))}#article`,
          headline: post.seoTitle ?? post.title,
          name: post.title,
          description: post.summary,
          image: [abs(post.cover.src)],
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          articleSection: post.topic,
          inLanguage: "en-PK",
          wordCount: post.body.reduce(
            (n, b) => n + ("text" in b ? b.text : "items" in b ? b.items.join(" ") : b.caption ?? "").split(/\s+/).length,
            0
          ),
          timeRequired: `PT${post.minutes}M`,
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          isPartOf: { "@id": WEBSITE_ID },
          mainEntityOfPage: abs(postHref(post)),
        })}
      />
      <main id="top">
        <PageHero
          eyebrow={post.topic}
          title={post.title}
          lede={post.summary}
          crumbs={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: post.title }]}
          still={post.cover}
          facts={[
            { label: "Published", value: formatDate(post.date) },
            { label: "Reading time", value: `${post.minutes} minutes` },
          ]}
        />

        <RevealScope as="article" className="bg-[#ffffff] py-[clamp(5rem,12vh,8rem)] text-[#11141b]">
          <div className="u-shell">
            <div className="mx-auto max-w-[46rem]">
              {post.body.map((block, i) => (
                <Prose key={i} block={block} />
              ))}

              <div className="mt-16 flex flex-wrap items-center justify-between gap-6 pt-8 shadow-[inset_0_1px_0_rgba(20,33,61,0.12)]">
                <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#8a8f9a]">
                  Jay-Cee Landmarks · {formatDate(post.date)}
                </span>
                <Link href="/journal" className="group inline-flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.24em] transition-colors hover:text-[#b58c49]">
                  <span aria-hidden="true" className="text-[#b58c49] transition-transform duration-500 group-hover:-translate-x-1.5">←</span>
                  All articles
                </Link>
              </div>
            </div>
          </div>
        </RevealScope>

        {others.length > 0 && (
          <RevealScope as="section" className="bg-[#f5f6f8] py-[clamp(5rem,12vh,8rem)] text-[#11141b]">
            <div className="u-shell">
              <span data-r="up" className="block text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
                Keep reading
              </span>
              <div className="mt-10 grid gap-x-12 gap-y-14 sm:grid-cols-2">
                {others.map((p) => (
                  <article key={p.slug} className="group">
                    <Link href={postHref(p)} className="block outline-none">
                      <div data-r="plate" className="relative aspect-[3/2] overflow-hidden bg-[#000000]">
                        <div data-r-img className="absolute inset-0">
                          <Image
                            src={p.cover.src}
                            alt={p.cover.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, 45vw"
                            loading="lazy"
                            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                            style={{ objectPosition: p.cover.position ?? "center" }}
                          />
                        </div>
                      </div>
                      <div data-r="stagger" className="pt-6">
                        <span className="block text-[0.6rem] uppercase tracking-[0.24em] text-[#b58c49]">{p.topic}</span>
                        <h3 className="mt-3 font-serif text-[clamp(1.3rem,2vw,1.65rem)] font-light leading-[1.2]">{p.title}</h3>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </RevealScope>
        )}

        <CtaBand
          title="Planning a build of your own?"
          body="Tell us about the plot and what you want to build. We reply within one working day."
          action={{ label: "Start a conversation", href: "/contact" }}
          secondary={{ label: "See our work", href: "/projects" }}
        />
      </main>
      <Footer />
    </>
  );
}
