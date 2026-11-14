import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Every page is public, and nothing is blocked: the /_next/ folder holds the
 * CSS, scripts and optimised images Google needs to render the pages, so
 * disallowing it would hurt rather than help.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
