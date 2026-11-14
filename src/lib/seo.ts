import type { Metadata } from "next";
import { CONTACT, OFFICES, PARENT, SOCIAL, TAGLINE } from "@/lib/site";
import { SITES } from "@/lib/portfolio";

/**
 * SEO — one place for the site's address, name and the metadata every page
 * shares, plus the schema.org (JSON-LD) objects search engines read.
 *
 * Every page builds its metadata through `pageMeta()`, so the title,
 * description, canonical URL, Open Graph and Twitter tags always agree with
 * each other. (In Next.js a page's `openGraph` object replaces the layout's
 * outright, so building it piecemeal per page is how share links ended up
 * pointing at the homepage.)
 */

export { SITE_URL, SITE_NAME, LOCALE, abs, breadcrumbLd, ldGraph } from "@/lib/seo-core";
import { SITE_URL, SITE_NAME, LOCALE, abs } from "@/lib/seo-core";

/** Default share image (1200×630), generated at app/opengraph-image.jpg. */
const DEFAULT_OG = { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: `${SITE_NAME} — ${TAGLINE}` };

interface PageMetaInput {
  /** The page's own title. The layout template appends " | Jay-Cee Landmarks". */
  title: string;
  /** 120–160 characters: what the page offers, in the words people search with. */
  description: string;
  /** Site path, e.g. "/about". Used for the canonical and og:url. */
  path: string;
  /** A page-specific share image; falls back to the site's default card. */
  image?: { src: string; alt: string };
  type?: "website" | "article";
  /** Set when the title already carries the brand or is long enough on its own. */
  absoluteTitle?: boolean;
  /** Article-only Open Graph fields. */
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
}

/** The complete metadata for one page. */
export function pageMeta(i: PageMetaInput): Metadata {
  const fullTitle = i.absoluteTitle ? i.title : `${i.title} | ${SITE_NAME}`;
  const images = i.image ? [{ url: i.image.src, alt: i.image.alt }] : [DEFAULT_OG];
  return {
    title: i.absoluteTitle ? { absolute: i.title } : i.title,
    description: i.description,
    alternates: { canonical: i.path },
    openGraph: {
      type: i.type ?? "website",
      url: i.path,
      siteName: SITE_NAME,
      locale: LOCALE,
      title: fullTitle,
      description: i.description,
      images,
      ...(i.type === "article"
        ? {
            publishedTime: i.publishedTime,
            modifiedTime: i.modifiedTime ?? i.publishedTime,
            section: i.section,
            authors: [SITE_URL],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: i.description,
      images: images.map((im) => im.url),
    },
  };
}

/* --------------------------------- JSON-LD --------------------------------- */

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const office = OFFICES[0];

/** Every area the company has built in, from the client's project list. */
const AREAS = [...new Set(SITES.map((s) => s.area))];

/** The business itself: a general contractor with an office in DHA, Lahore. */
export const organizationLd = {
  "@type": ["GeneralContractor", "Organization"],
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: ["Jay Cee Landmarks", "JC Landmarks", "JayCee Landmarks"],
  slogan: TAGLINE,
  description:
    "Design-and-build construction company in Lahore. Architecture, structural engineering, approvals, grey structure and turnkey finishing for private homes and commercial buildings, delivered under one contract.",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: abs("/images/jc-logo-gold.png") },
  image: abs("/opengraph-image.jpg"),
  telephone: CONTACT.phone.replace(/\s/g, ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plaza 112, 4th Floor, CCA-1, Phase 6, DHA",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  geo: { "@type": "GeoCoordinates", latitude: office.lat, longitude: office.lng },
  hasMap: `https://www.google.com/maps?q=${office.lat},${office.lng}`,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "18:00",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.phone.replace(/\s/g, ""),
    contactType: "customer service",
    areaServed: "PK",
    availableLanguage: ["English", "Urdu"],
  },
  areaServed: [
    { "@type": "City", name: "Lahore" },
    ...AREAS.filter((a) => a !== "Lahore").map((name) => ({ "@type": "Place", name })),
  ],
  knowsAbout: [
    "House construction",
    "Grey structure construction",
    "Turnkey construction",
    "Design and build",
    "Architectural design",
    "Structural engineering",
    "Interior finishing",
    "Commercial construction",
  ],
  parentOrganization: { "@type": "Organization", name: PARENT.name, url: PARENT.url, sameAs: [PARENT.instagram] },
  sameAs: SOCIAL.map((s) => s.href),
};

export const websiteLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: "JC Landmarks",
  inLanguage: "en-PK",
  publisher: { "@id": ORG_ID },
};
