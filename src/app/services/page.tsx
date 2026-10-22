import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceCommercial from "@/components/services/ServiceCommercial";
import ServiceResidential from "@/components/services/ServiceResidential";
import ServiceRealEstate from "@/components/services/ServiceRealEstate";
import ServicesClose from "@/components/services/ServicesClose";
import ServicesRail from "@/components/services/ServicesRail";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

const TITLE = "Services";
const DESCRIPTION =
  "Commercial construction, residential construction and real estate from JC Landmarks — design, engineering and building under one contract, and homes for sale and purchase.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    title: `${TITLE} — JC Landmarks`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — JC Landmarks`,
    description: DESCRIPTION,
  },
};

export default function ServicesPage() {
  return (
    <>
      <ScrollProgress />
      <ServicesRail />
      <main id="top">
        <ServicesHero />
        <ServiceCommercial />   {/* 01 · Drawing sheet: elevation draws on scroll */}
        <ServiceResidential />  {/* 02 · Aperture plate, spec table, process line */}
        <ServiceRealEstate />   {/* 03 · Buy / sell tabs, drifting listing columns */}
        <ServicesClose />       {/* Three routes into the enquiry form */}
      </main>
      <Footer />
    </>
  );
}
