import type { Metadata, Viewport } from"next";
import { Cormorant_Garamond, Inter } from"next/font/google";
import"./globals.css";
import Navbar from"@/components/navigation/Navbar";
import SmoothScrollProvider from"@/components/SmoothScrollProvider";

/** Editorial serif for display type. */
const display = Cormorant_Garamond({
 variable:"--font-display",
 subsets: ["latin"],
 weight: ["300","400","500"],
 style: ["normal","italic"],
 display:"swap",
});

/** Neutral grotesque for UI and body copy. */
const body = Inter({
 variable:"--font-body",
 subsets: ["latin"],
 display:"swap",
});

const SITE_URL ="https://jclandmarks.com";
const SITE_NAME ="JC Landmarks";
const TITLE ="JC Landmarks — Architecture Beyond Expectation";
const DESCRIPTION =
"A contemporary private residence of triple-height volume, refined materials and full-height light. Explore the architecture, interiors and private amenities.";

export const metadata: Metadata = {
 metadataBase: new URL(SITE_URL),
 title: {
 default: TITLE,
 template: `%s — ${SITE_NAME}`,
  },
 description: DESCRIPTION,
 applicationName: SITE_NAME,
 keywords: [
"luxury real estate",
"private residence",
"architectural villa",
"contemporary architecture",
"prime property",
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
 alt:"The JAY-CEE residence seen from above, with its pool terrace and mountain backdrop",
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
 logo: `${SITE_URL}/logo-gold.png`,
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
        <script
 type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
