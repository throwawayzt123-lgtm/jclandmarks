import { FACADES, INTERIORS, type Still } from "@/lib/media";

/**
 * PORTFOLIO DATA — completed projects, ongoing sites and homes for sale.
 *
 * Every projects, ongoing and for-sale page renders from this file: add an
 * entry and its card, gallery page and detail page appear automatically.
 *
 * PLACEHOLDER CONTENT: the entries below are built from the photography
 * already in /public/images/touse. Names, plot sizes, stages, progress and
 * property details are illustrative until the client supplies the real
 * record. The commercial entries in particular have no photography yet —
 * they render an architectural drawing plate in its place (see `drawing`).
 */

export type Category = "residential" | "commercial";

export const CATEGORIES: Record<
  Category,
  { label: string; title: string; lede: string }
> = {
  residential: {
    label: "Residential",
    title: "Homes we have built",
    lede: "Private residences from single plots to full estates — designed, engineered and built by our own teams, and handed over complete.",
  },
  commercial: {
    label: "Commercial",
    title: "Buildings for business",
    lede: "Offices, showrooms and mixed-use plazas, delivered under one contract with programme and cost owned by a single team.",
  },
};

/** Drawing used in place of a photograph until project photography exists. */
export type DrawingKind = "tower" | "pavilion" | "podium" | "house";

export interface Fact {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  category: Category;
  title: string;
  location: string;
  summary: string;
  story: string[];
  facts: Fact[];
  scope: string[];
  cover?: Still;
  drawing?: DrawingKind;
  gallery: Still[];
  credit?: string;
}

export const PROJECTS: Project[] = [
  /* ------------------------------ Residential ------------------------------ */
  {
    slug: "contemporary-residence-phase-7",
    category: "residential",
    title: "Contemporary Residence",
    location: "Phase 7, Lahore",
    summary: "A 1 Kanal home of cantilevered planes, stone cladding and a reflection pool along its frontage.",
    story: [
      "The brief asked for a family home that would feel calm from the street and generous inside. The answer was a composition of horizontal planes — a deep cantilevered canopy over the entrance, and an upper volume clad in stone that shades the glazing beneath it.",
      "Inside, a double-height arrival hall connects the two floors and pulls daylight into the centre of the plan. Joinery, stone and lighting were detailed together so that every surface finishes cleanly against the next.",
    ],
    facts: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Type", value: "Private residence" },
      { label: "Scope", value: "Design & build" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Architecture", "Structural design", "Grey structure", "Finishing & joinery", "Landscape"],
    cover: FACADES.phase7Villa,
    gallery: [INTERIORS.foyerGallery, INTERIORS.salonCurved, INTERIORS.bedMaster],
  },
  {
    slug: "spanish-estate-sheikhupura",
    category: "residential",
    title: "Spanish Estate",
    location: "Sheikhupura",
    summary: "A 2 Kanal classical estate with arched portals, a sweeping forecourt and hand-carved detailing.",
    story: [
      "A classical language is unforgiving: proportions have to be right, and every moulding has to meet the next one exactly. The arches, cornices and balustrades of this estate were set out on site from full-size templates before any stone was fixed.",
      "Behind the formal façade the plan is relaxed and family-scaled, organised around a grand salon and a dining room that opens onto the garden.",
    ],
    facts: [
      { label: "Plot", value: "2 Kanal" },
      { label: "Type", value: "Private estate" },
      { label: "Scope", value: "Construction & finishing" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Grey structure", "Stone façade", "Finishing & joinery", "MEP"],
    cover: FACADES.spanishEstate,
    gallery: [INTERIORS.libraryFireside, INTERIORS.studyEquestrian, INTERIORS.bedGuest],
    credit: "Design: Asad Afzal",
  },
  {
    slug: "monolith-residence-phase-9-prism",
    category: "residential",
    title: "Monolith Residence",
    location: "Phase 9 Prism, Lahore",
    summary: "Charcoal stone, bronze louvres and a sculpted triple-height atrium at the heart of the plan.",
    story: [
      "The street elevation is deliberately quiet — a single stone mass broken by a vertical screen of bronze louvres that filters light into the stair behind.",
      "The drama is kept for the inside: a triple-height atrium rises through the house, lit from above, with every floor opening onto it.",
    ],
    facts: [
      { label: "Type", value: "Private residence" },
      { label: "Scope", value: "Design & build" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Architecture", "Structural design", "Façade systems", "Finishing & joinery"],
    cover: FACADES.prismMonolith,
    gallery: [INTERIORS.atriumApex, INTERIORS.mediaAcoustic, INTERIORS.bedMinimal],
  },
  {
    slug: "glass-pavilion-residence-phase-7",
    category: "residential",
    title: "Glass Pavilion Residence",
    location: "Phase 7, Lahore",
    summary: "Double-height glazing and travertine terraces that open the living spaces fully to the garden.",
    story: [
      "Full-height glass is easy to draw and hard to build well. The curtain wall here was engineered with the structure, so its frames align with the slab edges and the travertine terraces run straight through from inside to out.",
      "The result is a living space that reads as one volume with the garden whenever the doors are open.",
    ],
    facts: [
      { label: "Type", value: "Private residence" },
      { label: "Scope", value: "Design & build" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Architecture", "Curtain wall", "Stone terraces", "Finishing & joinery"],
    cover: FACADES.phase7Curtain,
    gallery: [INTERIORS.staircaseCantilever, INTERIORS.diningGrand],
  },

  /* ------------------------------ Commercial ------------------------------- */
  {
    slug: "corporate-headquarters-lahore",
    category: "commercial",
    title: "Corporate Headquarters",
    location: "Lahore",
    summary: "A mid-rise office building with a two-level podium, column-free floor plates and a curtain-wall tower.",
    story: [
      "Open, flexible floors were the priority, so the frame uses long post-tensioned spans that leave each office level free of internal columns.",
      "The podium holds the reception, meeting suites and a café, with the curtain-wall tower above set back to give the entrance a generous canopy.",
    ],
    facts: [
      { label: "Type", value: "Office building" },
      { label: "Scope", value: "Design & build" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Architecture", "Structural frame", "Curtain wall", "MEP coordination", "Fit-out"],
    drawing: "tower",
    gallery: [],
  },
  {
    slug: "showroom-pavilion-lahore",
    category: "commercial",
    title: "Showroom Pavilion",
    location: "Lahore",
    summary: "A double-height display hall behind a fully glazed street front, built for retail on a busy boulevard.",
    story: [
      "A showroom sells through its glass. The street front is a single double-height glazed plane carried on a slender steel frame, so the display floor is visible end to end from the road.",
      "Services run in a concealed spine along the rear wall, leaving the ceiling clean and the floor free to rearrange.",
    ],
    facts: [
      { label: "Type", value: "Retail showroom" },
      { label: "Scope", value: "General contracting" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Steel frame", "Glazing", "MEP", "Fit-out"],
    drawing: "pavilion",
    gallery: [],
  },
  {
    slug: "mixed-use-plaza-lahore",
    category: "commercial",
    title: "Mixed-Use Plaza",
    location: "Lahore",
    summary: "A retail podium with offices above, arranged around a shared courtyard and a single circulation core.",
    story: [
      "Retail at street level and offices above have very different needs. The plaza separates them vertically — shops open directly onto the street, while the offices are reached through a quiet courtyard lobby.",
      "A single structural grid runs through both, keeping the frame economical and the floors adaptable as tenants change.",
    ],
    facts: [
      { label: "Type", value: "Mixed-use plaza" },
      { label: "Scope", value: "Design & build" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Architecture", "Structural frame", "Façade", "MEP coordination"],
    drawing: "podium",
    gallery: [],
  },
];

export const projectsIn = (category: Category) => PROJECTS.filter((p) => p.category === category);

export const findProject = (category: string, slug: string) =>
  PROJECTS.find((p) => p.category === category && p.slug === slug);

export const projectHref = (p: Pick<Project, "category" | "slug">) => `/projects/${p.category}/${p.slug}`;

/* ---------------------------------- Ongoing ---------------------------------- */

export const STAGES = ["Design & Approvals", "Foundations", "Grey Structure", "Finishing", "Handover"] as const;

export interface OngoingSite {
  slug: string;
  category: Category;
  title: string;
  location: string;
  /** Index into STAGES. */
  stage: number;
  /** 0–100. */
  progress: number;
  summary: string;
  specs: Fact[];
  preview?: Still;
  drawing?: DrawingKind;
}

export const ONGOING: OngoingSite[] = [
  {
    slug: "courtyard-residence",
    category: "residential",
    title: "Courtyard Residence",
    location: "Lahore",
    stage: 2,
    progress: 48,
    summary: "A family home arranged around a planted inner courtyard. The frame is up to the first-floor slab.",
    specs: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Storeys", value: "Ground + 1" },
      { label: "Scope", value: "Turnkey" },
      { label: "Handover", value: "Est. 2027" },
    ],
    preview: FACADES.phase7Curtain,
  },
  {
    slug: "boulevard-commercial-plaza",
    category: "commercial",
    title: "Boulevard Commercial Plaza",
    location: "Lahore",
    stage: 1,
    progress: 22,
    summary: "A retail podium with offices above. Excavation is complete and the raft foundation is being poured.",
    specs: [
      { label: "Type", value: "Mixed-use" },
      { label: "Storeys", value: "Basement + G + 5" },
      { label: "Scope", value: "Design & build" },
      { label: "Handover", value: "Est. 2028" },
    ],
    drawing: "podium",
  },
  {
    slug: "garden-villa",
    category: "residential",
    title: "Garden Villa",
    location: "Sheikhupura",
    stage: 3,
    progress: 81,
    summary: "Stone setting and joinery are under way; the landscape works begin next month.",
    specs: [
      { label: "Plot", value: "2 Kanal" },
      { label: "Storeys", value: "Ground + 1" },
      { label: "Scope", value: "Finishing" },
      { label: "Handover", value: "Est. 2026" },
    ],
    preview: FACADES.spanishEstate,
  },
];

/* --------------------------------- For sale --------------------------------- */

export interface Listing {
  slug: string;
  title: string;
  location: string;
  status: "Available" | "Reserved";
  price: string;
  specs: Fact[];
  features: string[];
  cover: Still;
}

export const LISTINGS: Listing[] = [
  {
    slug: "glass-pavilion-home",
    title: "Glass Pavilion Home",
    location: "Phase 7, Lahore",
    status: "Available",
    price: "Price on request",
    specs: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Bedrooms", value: "5" },
      { label: "Bathrooms", value: "6" },
      { label: "Built", value: "2025" },
    ],
    features: ["Double-height living room", "Travertine terraces", "Basement"],
    cover: FACADES.phase7Curtain,
  },
  {
    slug: "monolith-home",
    title: "Monolith Home",
    location: "Phase 9 Prism, Lahore",
    status: "Available",
    price: "Price on request",
    specs: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Bedrooms", value: "5" },
      { label: "Bathrooms", value: "6" },
      { label: "Built", value: "2025" },
    ],
    features: ["Triple-height atrium", "Home cinema", "Rooftop terrace"],
    cover: FACADES.prismMonolith,
  },
  {
    slug: "reflection-pool-home",
    title: "Reflection Pool Home",
    location: "Phase 7, Lahore",
    status: "Reserved",
    price: "Price on request",
    specs: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Bedrooms", value: "6" },
      { label: "Bathrooms", value: "7" },
      { label: "Built", value: "2024" },
    ],
    features: ["Reflection pool", "Cantilevered terrace", "Staff quarters"],
    cover: FACADES.phase7Villa,
  },
];

/** The contact page reads these to pre-fill the enquiry form. */
export const enquiryHref = (topic: string, about?: string) => {
  const q = new URLSearchParams({ topic });
  if (about) q.set("about", about);
  return `/contact?${q.toString()}`;
};
