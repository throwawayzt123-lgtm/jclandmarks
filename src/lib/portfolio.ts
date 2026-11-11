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
    summary: "A 1 Kanal family home in cream stone, with a double-height glazed stairwell, a timber-clad entrance and a covered car porch.",
    story: [
      "The brief was a family home that looks calm from the street and feels generous inside. The front is kept simple: cream stone, timber-finish panels around the entrance, and a deep car porch with a terrace above.",
      "A double-height glazed stairwell brings daylight into the middle of the house and links both floors. Stone, joinery and lighting were planned together, so every finish meets the next one cleanly.",
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
    slug: "classical-residence-sheikhupura",
    category: "residential",
    title: "Classical Residence",
    location: "Sheikhupura",
    summary: "A 2 Kanal classical home with arched windows, iron-railed balconies, a columned car porch and an arched entrance.",
    story: [
      "Classical design leaves no room for error: the proportions have to be right, and every moulding has to line up with the next. The arches, cornices and columns were set out carefully on site before any finish was applied.",
      "Behind the formal front, the house is planned around family life — a drawing room, a dining room that opens to the lawn, and bedrooms upstairs behind the balconies.",
    ],
    facts: [
      { label: "Plot", value: "2 Kanal" },
      { label: "Type", value: "Private estate" },
      { label: "Scope", value: "Construction & finishing" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Grey structure", "Classical façade", "Finishing & joinery", "Electrical & plumbing"],
    cover: FACADES.spanishEstate,
    gallery: [INTERIORS.libraryFireside, INTERIORS.studyEquestrian, INTERIORS.bedGuest],
    credit: "Design: Asad Afzal",
  },
  {
    slug: "monolith-residence-phase-9-prism",
    category: "residential",
    title: "Monolith Residence",
    location: "Phase 9 Prism, Lahore",
    summary: "A compact modern home in dark stone, with a white stone fin, a glass balcony and an angled roof canopy.",
    story: [
      "On a smaller plot, every metre counts. The front is a single dark stone block, cut by a white stone fin and a tall glass bay that brings light into the stair and living room.",
      "An angled canopy crowns the roof, and slim lines of light trace the edges at night — simple details that make a compact house look distinctive.",
    ],
    facts: [
      { label: "Type", value: "Private residence" },
      { label: "Scope", value: "Design & build" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Architecture", "Structural design", "Stone cladding", "Finishing & joinery"],
    cover: FACADES.prismMonolith,
    gallery: [INTERIORS.atriumApex, INTERIORS.mediaAcoustic, INTERIORS.bedMinimal],
  },
  {
    slug: "glass-pavilion-residence-phase-7",
    category: "residential",
    title: "Glass Pavilion Residence",
    location: "Phase 7, Lahore",
    summary: "A modern home with a double-height glass front, a grey stone frame traced in light, vertical fins and a roof terrace.",
    story: [
      "Full-height glass is easy to draw and hard to build well. Here the glazing was planned with the structure, so its frames line up with the slab edges and the double-height living room stays bright all day.",
      "A grey stone frame wraps the upper floor, with vertical fins for shade and a glass-railed terrace on the roof. At night, lines of light pick out the frame.",
    ],
    facts: [
      { label: "Type", value: "Private residence" },
      { label: "Scope", value: "Design & build" },
      { label: "Status", value: "Completed" },
    ],
    scope: ["Architecture", "Glazing", "Stone cladding", "Finishing & joinery"],
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
      "Open, flexible floors were the priority, so the frame uses long spans that keep each office level as free of columns as possible.",
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

/* ---------------------------------- Sites ---------------------------------- */
/**
 * The client's own project list (supplied 2026-10). One entry per plot;
 * "status" is as the client gave it — entries supplied without a status are
 * listed as ongoing. Credits are reproduced exactly as supplied.
 */
export type SiteStatus = "ongoing" | "completed";

export interface Site {
  /** Plot / address as it is known locally, e.g. "12-V". */
  plot: string;
  /** Area or society, e.g. "DHA Phase 7". */
  area: string;
  size: string;
  type: Category;
  status: SiteStatus;
  /** Free-form note (e.g. a project name, or what the plot comprises). */
  note?: string;
  credits?: string[];
  photo?: Still;
}

export const SITES: Site[] = [
  { plot: "12-V", area: "DHA Phase 7", size: "1 Kanal", type: "residential", status: "ongoing", photo: FACADES.phase7Villa },
  { plot: "483-Y", area: "DHA Phase 7", size: "1 Kanal", type: "residential", status: "ongoing", photo: FACADES.phase7Curtain },
  { plot: "464-D", area: "9 Town", size: "5 Marla", type: "residential", status: "ongoing", photo: FACADES.prismMonolith },
  { plot: "Muridke", area: "Muridke", size: "2 Kanal", type: "residential", status: "ongoing", photo: FACADES.spanishEstate },
  { plot: "2166-Y", area: "DHA Phase 7", size: "10 Marla", type: "residential", status: "ongoing" },
  { plot: "3-G", area: "Valencia Town", size: "4 Kanal", type: "residential", status: "ongoing", note: "2 Kanal house + 2 Kanal lawn" },
  { plot: "21 Commercial", area: "Fazaia Housing Society", size: "8 Marla", type: "commercial", status: "ongoing", note: "Commercial plaza", credits: ["Design: Just&Const"] },
  { plot: "342-U", area: "DHA Phase 7", size: "1 Kanal", type: "residential", status: "ongoing", note: "Aura’26", credits: ["Design: Mohsin Ali", "Tiles: Architects World"] },
  { plot: "784-R", area: "DHA Phase 7", size: "1 Kanal", type: "residential", status: "ongoing", credits: ["Design: Mansoor Nabi", "Construction: Just&Const"] },
  { plot: "1314-T", area: "DHA Phase 7", size: "1 Kanal", type: "residential", status: "ongoing", credits: ["Construction: Just&Const"] },
  { plot: "32/44-D", area: "DHA Phase 6", size: "1 Kanal", type: "residential", status: "ongoing", credits: ["Design: Just&Const"] },
  { plot: "328-B", area: "DHA Phase 5", size: "1 Kanal", type: "residential", status: "ongoing", credits: ["Design: Just&Const"] },
  { plot: "108-D Commercial", area: "DHA Phase 8", size: "8 Marla", type: "commercial", status: "ongoing", credits: ["Construction: Just&Const"] },
  { plot: "203-G", area: "Valencia Town", size: "2 Kanal", type: "residential", status: "ongoing", credits: ["Design: Mansoor Nabi"] },
  { plot: "174-F", area: "Fazaia Housing Society", size: "1 Kanal", type: "residential", status: "ongoing", credits: ["Design: Adnan Asmi", "Tiles: Architects World & HVERSE"] },
  { plot: "269-A", area: "EME Society", size: "1 Kanal", type: "residential", status: "ongoing", note: "EME House", credits: ["Design: Just&Const"] },
  { plot: "154-G", area: "DHA Phase 5", size: "1 Kanal", type: "residential", status: "completed" },
  { plot: "28/32 M3", area: "DHA Rahbar", size: "5 Marla", type: "residential", status: "completed" },
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
    features: ["Double-height glass living room", "Roof terrace", "Covered car porch"],
    cover: FACADES.phase7Curtain,
  },
  {
    slug: "monolith-home",
    title: "Monolith Home",
    location: "Phase 9 Prism, Lahore",
    status: "Available",
    price: "Price on request",
    specs: [
      { label: "Plot", value: "5 Marla" },
      { label: "Bedrooms", value: "3" },
      { label: "Bathrooms", value: "4" },
      { label: "Built", value: "2025" },
    ],
    features: ["Dark stone façade", "Glass balcony", "Roof canopy"],
    cover: FACADES.prismMonolith,
  },
  {
    slug: "contemporary-stone-home",
    title: "Contemporary Stone Home",
    location: "Phase 7, Lahore",
    status: "Reserved",
    price: "Price on request",
    specs: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Bedrooms", value: "6" },
      { label: "Bathrooms", value: "7" },
      { label: "Built", value: "2024" },
    ],
    features: ["Double-height glazed stairwell", "Covered car porch", "Staff quarters"],
    cover: FACADES.phase7Villa,
  },
];

/** The contact page reads these to pre-fill the enquiry form. */
export const enquiryHref = (topic: string, about?: string) => {
  const q = new URLSearchParams({ topic });
  if (about) q.set("about", about);
  return `/contact?${q.toString()}`;
};
