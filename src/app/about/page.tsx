import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutPractice from "@/components/about/AboutPractice";
import AboutTimeline from "@/components/about/AboutTimeline";
import AboutPrinciples from "@/components/about/AboutPrinciples";
import AboutClose from "@/components/about/AboutClose";
import AboutUs from "@/components/sections/AboutUs";
import ArchitecturalTicker from "@/components/ui/ArchitecturalTicker";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

const TITLE = "About Us";
const DESCRIPTION =
  "JC Landmarks is an architecture, engineering and construction practice. We draw a residence, calculate it, and build it with our own site teams — one responsibility from first survey to handover.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: `${TITLE} — JC Landmarks`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — JC Landmarks`,
    description: DESCRIPTION,
  },
};

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <main id="top">
        <AboutHero />
        <AboutPractice />      {/* Four disciplines, one accountable team */}
        <ArchitecturalTicker />
        <AboutTimeline />      {/* Dark band: scrubbed trajectory spine */}
        <AboutUs />            {/* Shared atelier block: metrics + core tenets */}
        <AboutPrinciples />    {/* Three rules, offset drifting plates */}
        <AboutClose />         {/* Scrubbed closing statement + CTA */}
      </main>
      <Footer />
    </>
  );
}
