import ImageSequenceHero from"@/components/hero/ImageSequenceHero";
import IdentityStatement from"@/components/sections/IdentityStatement";
import AboutUs from"@/components/sections/AboutUs";
import ArchitecturalTicker from"@/components/ui/ArchitecturalTicker";
import HomeServices from"@/components/sections/HomeServices";
import Handpicked from"@/components/sections/Handpicked";
import Capabilities from"@/components/sections/Capabilities";
import Story from"@/components/sections/Story";
import Experience from"@/components/sections/Experience";
import Atrium from"@/components/sections/Atrium";
import Amenities from"@/components/sections/Amenities";
import Materials from"@/components/sections/Materials";
import Lifestyle from"@/components/sections/Lifestyle";
import Specifications from"@/components/sections/Specifications";
import Location from"@/components/sections/Location";
import Inquiry from"@/components/sections/Inquiry";
import Footer from"@/components/sections/Footer";
import ScrollProgress from"@/components/ui/ScrollProgress";

export default function Home() {
 return (
    <>
      <ScrollProgress />
      <main id="top">
        <ImageSequenceHero />
        <IdentityStatement /> {/* Chevron architectural identity statement */}
        <AboutUs />        {/* About Us · The Atelier */}
        <ArchitecturalTicker /> {/* Scrub-driven luxury typography ribbon */}
        <HomeServices />   {/* Section 3: Our Services — expanding panels */}
        <Handpicked />     {/* Section 4: Curved scroll-driven residence ribbon */}
        <Capabilities />   {/* Section 5: Pinned card-relay of build capabilities */}
        <Story />          {/* Section 4: Architectural Narrative */}
        <Experience />     {/* Section 5: Interiors & Experience */}
        <Atrium />         {/* Section 6: The Grand Atrium */}
        <Amenities />      {/* Section 7: Private Amenities */}
        <Materials />      {/* Section 8: Materiality & Craft */}
        <Lifestyle />      {/* Section 9: Living & Horizon */}
        {/* <Specifications /> Section 10: Architectural Specifications */}
        <Location />       {/* Section 11: Geography & Seclusion */}
        <Inquiry />        {/* Section 12: Private Viewing Reservation */}
      </main>
      <Footer />
    </>
  );
}
