import type { Metadata, Viewport } from"next";
import { SITE_NAME, SITE_URL, LOCALE, organizationLd, websiteLd, ldGraph } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
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

const TITLE = `${SITE_NAME} | Home Construction Company in Lahore`;
const DESCRIPTION =
  "Design-and-build construction company in Lahore: architecture, structural engineering, grey structure and turnkey homes under one contract.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: LOCALE,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: true, address: false, email: false },
  category: "construction",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
 return (
    <html lang="en-PK" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#top" className="u-sr-only">
          Skip to content
        </a>
        <SmoothScrollProvider />
        <Navbar />
        {children}
        <WhatsAppButton />
        <SandTrail />
        <JsonLd data={ldGraph(organizationLd, websiteLd)} />
      </body>
    </html>
  );
}
