import type { Metadata } from "next";
import { pageMeta, abs, ldGraph, breadcrumbLd, ORG_ID } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceCommercial from "@/components/services/ServiceCommercial";
import ServiceResidential from "@/components/services/ServiceResidential";
import ServicesClose from "@/components/services/ServicesClose";
import ServicesRail from "@/components/services/ServicesRail";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const metadata: Metadata = pageMeta({
  title: "House Construction Services in Lahore",
  description:
    "Residential and commercial construction in Lahore: design and build, grey structure, turnkey finishing, façade, electrical and plumbing — one team, one contract.",
  path: "/services",
});

/** What the company offers, as schema.org Services (mirrors the page's chapters). */
const SERVICES_LD = [
  ["Residential construction", "Custom homes in Lahore designed, engineered and built by one team, from grey structure to turnkey handover.", "#residential"],
  ["Commercial construction", "Offices, showrooms and plazas delivered under one design-and-build contract.", "#commercial"],
  ["Grey structure construction", "Excavation, foundations, RCC frame, brickwork, roof slabs, plaster and concealed services.", "#residential"],
  ["Turnkey house construction", "Structure through flooring, woodwork, kitchens, washrooms, electrical, plumbing and façade — ready to move into.", "#residential"],
  ["Architectural design and 3D visualisation", "Plans, elevations and 3D views drawn by our own architects before work starts.", "#commercial"],
] as const;

export default function ServicesPage() {
  return (
    <>
      <ScrollProgress />
      <ServicesRail />
      <JsonLd
        data={ldGraph(
          ...SERVICES_LD.map(([name, description, anchor]) => ({
            "@type": "Service",
            name,
            serviceType: name,
            description,
            url: abs(`/services${anchor}`),
            provider: { "@id": ORG_ID },
            areaServed: { "@type": "City", name: "Lahore" },
          })),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services" }])
        )}
      />
      <main id="top">
        <ServicesHero />
        <ServiceCommercial />   {/* 01 · Drawing sheet: elevation draws on scroll */}
        <ServiceResidential />  {/* 02 · Aperture plate, spec table, process line */}
        <ServicesClose />       {/* Two routes into the enquiry form */}
      </main>
      <Footer />
    </>
  );
}
