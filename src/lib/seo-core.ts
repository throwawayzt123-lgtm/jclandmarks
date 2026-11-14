/**
 * The site's address and the small JSON-LD helpers, kept free of page data so
 * client components (the page hero's breadcrumbs) can use them without
 * pulling the portfolio into the browser bundle.
 */

/** The live domain. Change it here if the site is served from another address. */
export const SITE_URL = "https://jclandmarks.com";
export const SITE_NAME = "Jay-Cee Landmarks";
export const LOCALE = "en_PK";

/** Absolute URL for a site path. */
export const abs = (path: string) => new URL(path, SITE_URL).toString();

/**
 * A breadcrumb trail. The last crumb is the current page and may omit its
 * path — Google accepts the final item without a URL.
 */
export const breadcrumbLd = (crumbs: Array<{ name: string; path?: string }>) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    ...(c.path ? { item: abs(c.path) } : {}),
  })),
});

/** Wraps one or more schema objects into a single JSON-LD document. */
export const ldGraph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
