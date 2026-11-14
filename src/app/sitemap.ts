import type { MetadataRoute } from "next";
import { PROJECTS, ELEVATIONS, LISTINGS, activeCategories, projectHref } from "@/lib/portfolio";
import { POSTS, postHref } from "@/lib/blog";
import { abs } from "@/lib/seo";

/**
 * The sitemap lists every public page and is generated from the same data the
 * pages render from, so a new project or article appears here automatically.
 *
 * Image entries let Google Images find the project photographs. `lastModified`
 * is a real content date wherever one exists (an article's publish date);
 * elsewhere it is the date of this SEO revision, so search engines are not
 * told a page changed on every build when it did not.
 */
const REVISED = "2026-11-14";

const img = (src: string) => abs(src);

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? REVISED;
  const lead = PROJECTS[0];

  const pages: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: REVISED, changeFrequency: "weekly", priority: 1, images: lead?.cover ? [img(lead.cover.src)] : undefined },
    { url: abs("/services"), lastModified: REVISED, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/projects"), lastModified: REVISED, changeFrequency: "monthly", priority: 0.9, images: ELEVATIONS.map((e) => img(e.image.src)) },
    { url: abs("/about"), lastModified: REVISED, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/ongoing"), lastModified: REVISED, changeFrequency: "weekly", priority: 0.7 },
    {
      url: abs("/for-sale"),
      lastModified: REVISED,
      changeFrequency: "weekly",
      priority: 0.7,
      images: LISTINGS.map((l) => img(l.cover.src)),
    },
    { url: abs("/journal"), lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    { url: abs("/contact"), lastModified: REVISED, changeFrequency: "yearly", priority: 0.6 },
  ];

  const categories: MetadataRoute.Sitemap = activeCategories().map((c) => ({
    url: abs(`/projects/${c}`),
    lastModified: REVISED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projects: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: abs(projectHref(p)),
    lastModified: REVISED,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [...new Set(p.gallery.map((s) => s.src))].map(img),
  }));

  const posts: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: abs(postHref(p)),
    lastModified: p.updated ?? p.date,
    changeFrequency: "yearly",
    priority: 0.6,
    images: [img(p.cover.src)],
  }));

  return [...pages, ...categories, ...projects, ...posts];
}
