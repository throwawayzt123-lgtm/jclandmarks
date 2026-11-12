/**
 * Site-wide facts and the page map — the single place to change a phone
 * number, an address or a menu entry.
 *
 * The office address, map pin and social profiles are the client's own.
 * The phone / WhatsApp number is the client's own. PLACEHOLDER still: the
 * email below — replace it when the client supplies the real address. Everything that shows contact
 * information reads from here, so one edit updates the whole site.
 */

/** The company tagline — the homepage headline, page title and footer statement. */
export const TAGLINE = "Ordinary is not our address.";

export const CONTACT = {
  phone: "+92 310 4811111",
  phoneHref: "tel:+923104811111",
  whatsapp: "+92 310 4811111",
  whatsappHref: "https://wa.me/923104811111",
  email: "info@jclandmarks.com",
  hours: "Monday – Saturday · 10:00 – 18:00",
} as const;

/** The parent company — its name, website and logo appear in the footer band. */
export const PARENT = {
  name: "JUST & CONST",
  url: "https://justandconst.com/",
  instagram: "https://www.instagram.com/just_and_const",
  instagramHandle: "@just_and_const",
  logo: "/images/just-const-logo.png",
} as const;

export interface Office {
  name: string;
  /** Postal address, one line per row. */
  lines: string[];
  /** Exact pin, used for the embedded map and for directions. */
  lat: number;
  lng: number;
}

export const OFFICES: Office[] = [
  {
    name: "Head Office",
    lines: ["Plaza 112, 4th Floor", "CCA-1, Phase 6, DHA", "Lahore, Pakistan"],
    lat: 31.4677162,
    lng: 74.4519043,
  },
];

/** Embeddable map centred on the office pin. */
export const mapEmbedUrl = (o: Office) => `https://www.google.com/maps?q=${o.lat},${o.lng}&z=17&output=embed`;
/** Opens Google Maps with directions to the office. */
export const directionsUrl = (o: Office) => `https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`;

export interface Social {
  label: string;
  href: string;
  icon: "facebook" | "instagram";
}

export const SOCIAL: Social[] = [
  { label: "Facebook", href: "https://www.facebook.com/share/1FySY6fQVA/", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/jay.cee_landmarks/", icon: "instagram" },
];

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/** The page map, in the order of the client's site architecture. */
export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Journal", href: "/journal" },
  { label: "Ongoing", href: "/ongoing" },
  { label: "For Sale", href: "/for-sale" },
  { label: "Contact", href: "/contact" },
];

/** True when `pathname` belongs to the nav item (exact for Home). */
export function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
