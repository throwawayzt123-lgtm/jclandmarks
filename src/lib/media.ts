/**
 * Art-direction manifest for JC Landmarks.
 *
 * All section photography is sourced directly from client-provided architectural
 * photography under `/images/touse/`:
 *   - `frontfasades/` (Phase 7 Cantilever Villa, 2 Kanal Spanish Estate, 464-D Prism Monolith, 483-Y Phase 7 Glass Curtain)
 *   - `interiors/` (Double-Height Atriums, Master Suites, Salons, Fireside Libraries, Arrival Foyers)
 *
 * No legacy frame stills are used in any section.
 */

export interface Still {
  src: string;
  alt: string;
  /** CSS object-position — protects the subject when the crop is tight. */
  position?: string;
}

export const FACADES = {
  phase7Villa: {
    src: "/images/touse/frontfasades/1%20kanal%20residential%2012%20v%20phase%207.jpeg",
    alt: "1 Kanal contemporary residential villa in Phase 7 with cascading reflection pool and illuminated cantilever",
    position: "center 50%",
  },
  spanishEstate: {
    src: "/images/touse/frontfasades/2%20Kanal%20Spanish%20design%20by%20Asad%20Afzal%20at%20Sheikhupura.png",
    alt: "2 Kanal Spanish classical estate by Asad Afzal at Sheikhupura featuring grand arches and sweeping driveway",
    position: "center 48%",
  },
  prismMonolith: {
    src: "/images/touse/frontfasades/464-D-9-prism.jpeg",
    alt: "464-D 9 Prism monolithic residence with charcoal stone cladding and bronze architectural louvers",
    position: "center 50%",
  },
  phase7Curtain: {
    src: "/images/touse/frontfasades/483Y%20phase%207.png",
    alt: "483-Y Phase 7 luxury villa facade showcasing double-height glass curtain wall and illuminated travertine terraces",
    position: "center 45%",
  },
} as const satisfies Record<string, Still>;

export const INTERIORS = {
  bedMaster: {
    src: "/images/touse/interiors/bed1.jpg",
    alt: "Executive master bedroom suite with bespoke fluted panelling, floating platform bed, and warm accent pendants",
    position: "center 50%",
  },
  bedGuest: {
    src: "/images/touse/interiors/bed2.jpg",
    alt: "Luxury guest suite sanctuary with textured feature wall and concealed warm illumination",
    position: "center 50%",
  },
  bedMinimal: {
    src: "/images/touse/interiors/bed3.jpg",
    alt: "Contemporary minimalist bedroom with full-height drapery and ambient architectural lighting",
    position: "center 50%",
  },
  salonCurved: {
    src: "/images/touse/interiors/l3.jpg",
    alt: "Monumental double-height drawing room with 30-foot drapery, vertical pendant chandelier, and modular bespoke seating",
    position: "center 50%",
  },
  libraryFireside: {
    src: "/images/touse/interiors/l4.jpg",
    alt: "Open-concept living and formal dining salon with curved boucle seating and bespoke wood feature wall",
    position: "center 50%",
  },
  atriumApex: {
    src: "/images/touse/interiors/l5.jpg",
    alt: "Monumental triple-height atrium lightwell with spiraling amber glass chandelier and mezzanine gallery",
    position: "center 45%",
  },
  staircaseCantilever: {
    src: "/images/touse/interiors/l6.jpg",
    alt: "Cantilevered marble staircase with walnut wall panelling and artisanal stone console",
    position: "center 45%",
  },
  foyerGallery: {
    src: "/images/touse/interiors/l7.jpg",
    alt: "Grand arrival foyer with cantilevered marble staircase, glass balustrade, bookmatched marble feature wall",
    position: "center 48%",
  },
  studyEquestrian: {
    src: "/images/touse/interiors/l8.jpg",
    alt: "Executive study featuring equestrian oil canvas, warm brass desk lamp, and fluted joinery",
    position: "center 42%",
  },
  mediaAcoustic: {
    src: "/images/touse/interiors/l9.jpg",
    alt: "Private bedroom suite with architectural curved timber headboard and bespoke art glass",
    position: "center 50%",
  },
  diningGrand: {
    src: "/images/touse/interiors/l4.jpg",
    alt: "Open-concept living and formal dining salon with curved boucle seating and bespoke wood feature wall",
    position: "center 50%",
  },
  loungeDoubleHeight: {
    src: "/images/touse/interiors/l3.jpg",
    alt: "Monumental double-height drawing room with 30-foot drapery, vertical pendant chandelier, and modular bespoke seating",
    position: "center 50%",
  },
} as const satisfies Record<string, Still>;

/**
 * Universal STILLS map mapping legacy section slots to new high-definition client photography.
 */
export const STILLS = {
  elevation: FACADES.phase7Curtain,
  approach: FACADES.spanishEstate,
  entrance: FACADES.phase7Villa,
  portal: FACADES.prismMonolith,
  threshold: INTERIORS.diningGrand,
  arrival: INTERIORS.foyerGallery,
  atrium: INTERIORS.atriumApex,
  atriumWide: INTERIORS.atriumApex,
  staircase: INTERIORS.staircaseCantilever,
  glazing: FACADES.phase7Curtain,
  lounge: INTERIORS.salonCurved,
  marble: INTERIORS.atriumApex,
  brass: FACADES.prismMonolith,
  timber: INTERIORS.mediaAcoustic,
  stonewall: INTERIORS.salonCurved,
  terrace: FACADES.phase7Villa,
  volume: INTERIORS.atriumApex,
} as const satisfies Record<string, Still>;

export type StillKey = keyof typeof STILLS;
