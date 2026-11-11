import type { Metadata, Viewport } from"next";
import localFont from"next/font/local";
import"./globals.css";
import Navbar from"@/components/navigation/Navbar";
import SmoothScrollProvider from"@/components/SmoothScrollProvider";
import WhatsAppButton from"@/components/ui/WhatsAppButton";
import SandTrail from "@/components/ui/SandTrail";

/**
 * Both families are the client's own files in ./fonts (variable fonts, so one
 * file covers every weight), served from the site itself — no request to
 * Google, and next/font preloads them with a size-matched fallback so text
 * does not jump when they arrive.
 */

/** Cormorant Garamond — the editorial serif for headings and display type. */
const display = localFont({
 variable:"--font-display",
 src: [
    { path:"./fonts/CormorantGaramond-Variable.woff2", weight:"300 700", style:"normal" },
    { path:"./fonts/CormorantGaramond-Italic-Variable.woff2", weight:"300 700", style:"italic" },
  ],
 display:"swap",
 fallback: ["Times New Roman","Times","serif"],
});

/** DM Sans — clean sans for body copy, labels and buttons. */
const body = localFont({
 variable:"--font-body",
 src:"./fonts/DMSans-Variable.woff2",
 weight:"100 1000",
 style:"normal",
 display:"swap",
 fallback: ["ui-sans-serif","system-ui","sans-serif"],
});

const SITE_URL ="https://jclandmarks.com";
const SITE_NAME ="JC Landmarks";
const TITLE ="JC Landmarks — Design & Build Construction in Lahore";
const DESCRIPTION =
"JC Landmarks is a Lahore construction company. We design and build private homes and commercial buildings — architecture, engineering, approvals, construction and finishing under one contract.";

export const metadata: Metadata = {
 metadataBase: new URL(SITE_URL),
 title: {
 default: TITLE,
 template: `%s — ${SITE_NAME}`,
  },
 description: DESCRIPTION,
 applicationName: SITE_NAME,
 keywords: [
"construction company Lahore",
"house construction",
"design and build",
"commercial construction",
"real estate Lahore",
"JC Landmarks",
  ],
 authors: [{ name: SITE_NAME }],
 creator: SITE_NAME,
 alternates: { canonical:"/" },
 openGraph: {
 type:"website",
 url: SITE_URL,
 siteName: SITE_NAME,
 title: TITLE,
 description: DESCRIPTION,
 locale:"en_US",
 images: [
      {
 url:"/images/frames5/ezgif-frame-001.jpg",
 width: 1280,
 height: 720,
 alt:"A JC Landmarks residence seen from above, with its pool terrace",
      },
    ],
  },
 twitter: {
 card:"summary_large_image",
 title: TITLE,
 description: DESCRIPTION,
 images: ["/images/frames5/ezgif-frame-001.jpg"],
  },
 robots: {
 index: true,
 follow: true,
 googleBot: { index: true, follow: true,"max-image-preview":"large" },
  },
 category:"real estate",
};

export const viewport: Viewport = {
 themeColor:"#0b0b0a",
 colorScheme:"dark",
 width:"device-width",
 initialScale: 1,
};


/** Structured data so the listing is machine-readable for search. */
const jsonLd = {
"@context":"https://schema.org",
"@type":"GeneralContractor",
 name: SITE_NAME,
 alternateName:"Jay-Cee Landmarks",
 description: DESCRIPTION,
 url: SITE_URL,
 image: `${SITE_URL}/images/frames5/ezgif-frame-001.jpg`,
 logo: `${SITE_URL}/images/jc-logo-gold.png`,
 address: {
"@type":"PostalAddress",
 streetAddress:"Plaza 112, 4th Floor, CCA-1, Phase 6, DHA",
 addressLocality:"Lahore",
 addressRegion:"Punjab",
 addressCountry:"PK",
  },
 geo: {"@type":"GeoCoordinates", latitude: 31.4677162, longitude: 74.4519043 },
 sameAs: ["https://www.facebook.com/share/1FySY6fQVA/","https://www.instagram.com/jay.cee_landmarks/"],
 areaServed:"Lahore",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
 return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#residence" className="u-sr-only">
          Skip to content
        </a>
        <SmoothScrollProvider />
        <Navbar />
        {children}
        <WhatsAppButton />
        <SandTrail />
        <script
 type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
