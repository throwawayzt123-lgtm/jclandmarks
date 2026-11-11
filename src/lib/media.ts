/**
 * Art-direction manifest for JC Landmarks.
 *
 * All section photography is sourced directly from client-provided architectural
 * photography under `/images/touse/`:
 *   - `frontsquaresized/` (square webp; front views of four homes — contemporary stone, classical, dark-stone monolith, glass front)
 *   - `landscapeimgs/` (landscape webp; Double-Height Atriums, Master Suites, Salons, Fireside Libraries, Arrival Foyers)
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
    src: "/images/touse/frontsquaresized/front3.webp",
    alt: "Contemporary two-storey residence at dusk with a stone and glass front and a covered car porch",
    position: "center 50%",
  },
  spanishEstate: {
    src: "/images/touse/frontsquaresized/front1.webp",
    alt: "Classical-style residence with arched windows, balconies and a lit entrance at dusk",
    position: "center 48%",
  },
  prismMonolith: {
    src: "/images/touse/frontsquaresized/front4.webp",
    alt: "Modern residence with dark stone cladding, a white accent fin and glass balconies",
    position: "center 50%",
  },
  phase7Curtain: {
    src: "/images/touse/frontsquaresized/front2.webp",
    alt: "Contemporary residence with a double-height glazed entrance and lit stonework at night",
    position: "center 45%",
  },
} as const satisfies Record<string, Still>;

export const INTERIORS = {
  bedMaster: {
    src: "/images/touse/landscapeimgs/bed2.webp",
    alt: "Master bedroom with an upholstered panelled bed wall, textured wallpaper and warm lighting",
    position: "center 50%",
  },
  bedGuest: {
    src: "/images/touse/landscapeimgs/bed1.webp",
    alt: "Bedroom with a navy bedspread, panelled feature wall and full-height curtains",
    position: "center 50%",
  },
  bedMinimal: {
    src: "/images/touse/landscapeimgs/bed3angle2.webp",
    alt: "Bedroom with a textured white stone feature wall, pink bedding and sheer curtains",
    position: "center 50%",
  },
  salonCurved: {
    src: "/images/touse/landscapeimgs/upperlounge2.webp",
    alt: "Drawing room with cream sofas, round centre tables and full-height curtains",
    position: "center 50%",
  },
  libraryFireside: {
    src: "/images/touse/landscapeimgs/diningangle1.webp",
    alt: "Open dining and living area with a ring chandelier, wooden dining table and curved sofas",
    position: "center 50%",
  },
  atriumApex: {
    src: "/images/touse/landscapeimgs/loungeupview.webp",
    alt: "Double-height lounge seen from the floor above, lit by a cascade of pendant lights",
    position: "center 50%",
  },
  staircaseCantilever: {
    src: "/images/touse/landscapeimgs/entrancestairs.webp",
    alt: "Entrance staircase with floating marble steps, a glass balustrade and wood-panelled wall",
    position: "center 50%",
  },
  foyerGallery: {
    src: "/images/touse/landscapeimgs/upperlounge.webp",
    alt: "Upper-floor family lounge with a false ceiling, cove lighting and a corridor beyond",
    position: "center 50%",
  },
  studyEquestrian: {
    src: "/images/touse/landscapeimgs/studyroom2.webp",
    alt: "Home study with a black desk, white armchairs and a large framed artwork",
    position: "center 50%",
  },
  mediaAcoustic: {
    src: "/images/touse/landscapeimgs/bed5angle2.webp",
    alt: "Guest bedroom with a wall art installation, bedside lamps and an accent armchair",
    position: "center 50%",
  },
  diningGrand: {
    src: "/images/touse/landscapeimgs/diningangle2.webp",
    alt: "Dining table set for eight beside a wood-textured feature wall and gold curtains",
    position: "center 50%",
  },
  loungeDoubleHeight: {
    src: "/images/touse/landscapeimgs/tvlounge-doubleheight.webp",
    alt: "Double-height lounge with sectional sofas, pendant lights and full-height curtains",
    position: "center 50%",
  },
  kitchen: {
    src: "/images/touse/landscapeimgs/kitchenmainimg.webp",
    alt: "Fitted kitchen with an island, wood-finish wall cabinets and under-cabinet lighting",
    position: "center 50%",
  },
  bathroom: {
    src: "/images/touse/landscapeimgs/washroom3.webp",
    alt: "Bathroom with a glass shower enclosure, wall-hung WC and a stone vanity",
    position: "center 50%",
  },
} as const satisfies Record<string, Still>;

/**
 * Panoramas for the walk-around viewer, as equirectangular JPGs no wider than
 * 4096px (the largest texture many phones accept). `hfov`/`vfov` are the
 * degrees each photo covers: a full 360° photo is 360 × 180 and wraps all the
 * way round; a partial one stops cleanly at its edges.
 */
export interface Panorama extends Still {
  title: string;
  hfov: number;
  vfov: number;
}

export const PANORAMAS = {
  livingRoom: {
    src: "/images/panorama/living-room.jpg",
    alt: "Open-plan living and dining room with a teal feature wall, twin sofas and floor-to-ceiling glazing",
    title: "Living & dining",
    hfov: 180,
    vfov: 78.7,
  },
  workspace: {
    src: "/images/panorama/panoimg2.jpeg",
    alt: "A full 360-degree view across a open-plan workspace with desks, monitors and tall windows",
    title: "The workspace",
    hfov: 360,
    vfov: 41.2,
  },
} as const satisfies Record<string, Panorama>;

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
