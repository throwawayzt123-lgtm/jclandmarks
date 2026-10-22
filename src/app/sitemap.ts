import type { MetadataRoute } from "next";
import { CATEGORIES, PROJECTS, projectHref } from "@/lib/portfolio";

const SITE = "https://jclandmarks.com";

/** Every page in the site map, plus one entry per project — kept in step with lib/portfolio. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about", "/services", "/projects", "/ongoing", "/for-sale", "/contact"];
  const categories = Object.keys(CATEGORIES).map((c) => `/projects/${c}`);
  const projects = PROJECTS.map(projectHref);
  return [...pages, ...categories, ...projects].map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: path.startsWith("/ongoing") || path === "/for-sale" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.split("/").length > 3 ? 0.6 : 0.8,
  }));
}
