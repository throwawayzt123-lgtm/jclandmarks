import type { Metadata } from "next";
import { pageMeta, abs, ldGraph, breadcrumbLd, ORG_ID } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import AboutHero from "@/components/about/AboutHero";
import AboutPractice from "@/components/about/AboutPractice";
import AboutTimeline from "@/components/about/AboutTimeline";
import AboutPrinciples from "@/components/about/AboutPrinciples";
import AboutPanorama from "@/components/about/AboutPanorama";
import AboutClose from "@/components/about/AboutClose";
import AboutUs from "@/components/sections/AboutUs";
import ArchitecturalTicker from "@/components/ui/ArchitecturalTicker";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const metadata: Metadata = pageMeta({
  title: "About Us — Architects & Builders in Lahore",
  description:
    "Jay-Cee Landmarks is a Lahore design-and-build company: our own architects, engineers and site teams take each home from first survey to handover.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <JsonLd
        data={ldGraph(
          { "@type": "AboutPage", url: abs("/about"), name: "About Jay-Cee Landmarks", about: { "@id": ORG_ID }, mainEntity: { "@id": ORG_ID } },
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "About" }])
        )}
      />
      <main id="top">
        <AboutHero />
        <AboutPractice />      {/* Four disciplines, one accountable team */}
        <ArchitecturalTicker />
        <AboutTimeline />      {/* Dark band: scrubbed trajectory spine */}
        <AboutUs />            {/* Shared atelier block: metrics + core tenets */}
        <AboutPrinciples />    {/* Three rules, offset drifting plates */}
        <AboutPanorama />      {/* Wide plate that opens the panorama viewer */}
        <AboutClose />         {/* Scrubbed closing statement + CTA */}
      </main>
      <Footer />
    </>
  );
}
