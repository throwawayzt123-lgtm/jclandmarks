import { FACADES, type Still } from "@/lib/media";

/**
 * PORTFOLIO DATA — completed projects, ongoing sites and homes for sale.
 *
 * Every projects, ongoing and for-sale page renders from this file: add an
 * entry and its card, gallery page and detail page appear automatically.
 *
 * PROJECTS holds the completed-work showcase (currently project 342-U, with
 * its own photo set). Homes for sale below are still placeholder entries —
 * their plot sizes and property details are illustrative until the client
 * supplies the real record.
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

/** A project photograph with the caption shown in the full-screen viewer. */
export interface Shot extends Still {
  title: string;
  note: string;
}

export interface Project {
  slug: string;
  category: Category;
  title: string;
  location: string;
  summary: string;
  /** Search-result title (≈60 characters with the brand). Defaults to "title — location". */
  seoTitle?: string;
  /** Search-result description (≈150 characters). Defaults to the summary. */
  seoDescription?: string;
  story: string[];
  facts: Fact[];
  scope: string[];
  cover?: Still;
  drawing?: DrawingKind;
  gallery: Shot[];
  credit?: string;
}

/** Photographs of project 342-U, in /public/images/projects/residential/project1-342U. */
const P342 = "/images/projects/residential/project1-342U";
/** Every 342-U photo's alt text ends with where it is, for image search. */
const P342_PLACE = "Aura’26, DHA Phase 7, Lahore";
const still = (file: string, alt: string, position?: string): Still => ({
  src: `${P342}/${file}.webp`,
  alt: `${alt} — ${P342_PLACE}`,
  ...(position ? { position } : {}),
});
const shot = (file: string, title: string, note: string, alt: string, position?: string): Shot => ({ ...still(file, alt, position), title, note });

export const PROJECTS: Project[] = [
  /* ------------------------------ Residential ------------------------------ */
  {
    slug: "aura-26-dha-phase-7",
    category: "residential",
    title: "Aura’26",
    location: "DHA Phase 7, Lahore",
    summary: "A 1 Kanal family home in cream stone and timber, with a double-height lounge, a floating marble staircase and fully furnished interiors.",
    seoTitle: "Aura’26 — 1 Kanal House, DHA Phase 7 Lahore",
    seoDescription:
      "Aura’26 (342-U, DHA Phase 7): a 1 Kanal home in cream stone with a double-height lounge and floating marble staircase — 24 photos, built by Jay-Cee Landmarks.",
    story: [
      "Plot 342-U is a 1 Kanal family home in DHA Phase 7. From the street it is calm and clean-lined: cream stone, tall black-framed windows and vertical fins that give the front its rhythm, lit warmly at night.",
      "Inside, the house opens around a floating marble staircase and a double-height lounge, with a drawing room, dining room, study and a fitted kitchen with an island. Upstairs are the bedroom suites, each with its own washroom, finished in textured walls, panelling and soft lighting.",
    ],
    facts: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Plot no.", value: "342-U" },
      { label: "Type", value: "Private residence" },
    ],
    scope: ["Construction", "Finishing & joinery", "Kitchen & washrooms"],
    cover: still("frontnight-342U", "Cream stone residence at night with vertical fins, black-framed windows and a lit forecourt", "center 55%"),
    gallery: [
      shot("frontnight-342U", "Front elevation at night", "Lighting picks out the vertical fins and the cream stonework after dark, with lit landscaping along the boundary wall.", "Cream stone residence at night with vertical fins, black-framed windows and a lit forecourt", "center 55%"),
      shot("frontfasade", "Front elevation by day", "The front in daylight: cream stone, vertical fins and tall black-framed glazing, with a landscaped forecourt and a low boundary wall.", "Daytime view of the cream stone residence with vertical fins and a landscaped front"),
      shot("entrancestairs", "Entrance and staircase", "A floating marble staircase with a glass balustrade rises beside a wood-panelled wall, opening onto the ground-floor lounge.", "Entrance hall with a floating marble staircase, glass balustrade and wood-panelled wall"),
      shot("tvlounge-doubleheight", "Double-height lounge", "Sectional seating sits under a double-height void, with pendant lights and full-height curtains.", "Double-height lounge with sectional sofas, pendant lights and full-height curtains"),
      shot("loungeupview", "The lounge from above", "The same void seen from the upper floor, with a cascade of pendant lights hanging in front of full-height curtains.", "Double-height lounge seen from the floor above, lit by a cascade of pendant lights"),
      shot("upperlounge", "Upper-floor lounge", "A family lounge on the upper floor with a false ceiling and cove lighting, and a corridor leading beyond.", "Upper-floor family lounge with a false ceiling, cove lighting and a corridor beyond"),
      shot("upperlounge2", "Drawing room", "Cream sofas, round centre tables and layered curtains in a bright seating room.", "Drawing room with cream sofas, round centre tables and full-height curtains"),
      shot("diningangle1", "Dining and living", "A ring chandelier hangs over a wooden dining table, with curved sofas in the living area beside it.", "Open dining and living area with a ring chandelier, wooden dining table and curved sofas"),
      shot("diningangle2", "Dining table", "A dining table set for eight beside a wood-textured feature wall and gold curtains.", "Dining table set for eight beside a wood-textured feature wall and gold curtains"),
      shot("kitchenmainimg", "Kitchen", "A fitted kitchen with an island, wood-finish wall cabinets and under-cabinet lighting.", "Fitted kitchen with an island, wood-finish wall cabinets and under-cabinet lighting"),
      shot("kitchenimg1", "Kitchen cabinetry", "Glazed timber-door wall cabinets above the sink, with a window letting in daylight.", "Kitchen wall cabinets with glazed timber doors and a window over the sink"),
      shot("kitchenimg2", "Kitchen wall", "A tall cabinet wall with a built-in hob and extractor, and open shelving at the end.", "Kitchen with a tall cabinet wall, built-in hob and extractor"),
      shot("studyroom", "Study", "A black writing desk and white armchairs, with a large framed artwork on the wall.", "Home study with a black desk, white armchairs and a large framed artwork"),
      shot("studyroom2", "Study seating", "Two white armchairs face a black desk, beside tall sheer curtains.", "Study seating area with two white armchairs and a black writing desk"),
      shot("bed2", "Master bedroom", "An upholstered, panelled bed wall with textured wallpaper and warm cove lighting.", "Master bedroom with an upholstered panelled bed wall, textured wallpaper and warm lighting"),
      shot("bed2angle2sitting", "Bedroom sitting area", "A green sofa and patterned armchairs around a round coffee table.", "Bedroom sitting area with a green sofa, patterned armchairs and a round coffee table"),
      shot("bed1", "Bedroom", "A navy bedspread against a panelled feature wall, with full-height curtains.", "Bedroom with a navy bedspread, panelled feature wall and full-height curtains"),
      shot("bed3", "Bedroom with stone feature wall", "A textured white stone feature wall behind the bed, with sheer curtains.", "Bedroom with a textured white stone feature wall and sheer curtains"),
      shot("bed3angle2", "Bedroom, second view", "Pink bedding and a round upholstered seat set against the stone feature wall.", "Bedroom with a textured white stone feature wall, pink bedding and sheer curtains"),
      shot("bed4", "Bedroom lounge", "A chaise, a sofa and a round marble coffee table in a bedroom seating area.", "Bedroom lounge with a chaise, sofa and round marble coffee table"),
      shot("bed5", "Guest bedroom", "A wall art installation above the bed, with bedside lamps and an accent armchair.", "Guest bedroom with a wall art installation, bedside lamps and an accent armchair"),
      shot("bed5angle2", "Guest bedroom, second view", "A patterned accent armchair at the foot of the bed.", "Guest bedroom with a patterned accent armchair beside the bed"),
      shot("washroom1", "Washroom", "A glass shower enclosure with stone-effect wall tiles.", "Washroom with a glass shower enclosure and stone-effect wall tiles"),
      shot("washroom3", "Washroom vanity", "A round mirror above a stone vanity, with a glass shower enclosure beside it.", "Washroom with a glass shower enclosure, a round mirror and a stone vanity"),
    ],
    credit: "Design: Mohsin Ali · Tiles: Architects World",
  },
];

/** Categories that actually have a project, in display order. */
export const activeCategories = (): Category[] =>
  (Object.keys(CATEGORIES) as Category[]).filter((c) => PROJECTS.some((p) => p.category === c));

/* ------------------------------ Elevations ------------------------------ */
/**
 * Front elevations from the client's project list, shown on the Residential
 * page. They carry only what their file names and the project list say — plot,
 * size, area and design credit — so there is no story or gallery behind them.
 */
const OTHERS = "/images/projects/residential/others";

export interface Elevation {
  /** Plot number or working name, shown large. */
  plot: string;
  size: string;
  area: string;
  /** A plain description of the architecture. */
  style: string;
  credit?: string;
  image: Shot;
}

const elevation = (e: Omit<Elevation, "image"> & { file: string; alt: string; position?: string }): Elevation => {
  const { file, alt, position, ...rest } = e;
  return {
    ...rest,
    image: {
      src: `${OTHERS}/${file}`,
      // Where it is, for image search: "… — 1 Kanal residence, 12-V, DHA Phase 7".
      alt: `${alt} — ${e.size} residence, ${e.plot === e.area || /design/i.test(e.plot) ? e.area : `${e.plot}, ${e.area}`}`,
      ...(position ? { position } : {}),
      title: `${e.plot} · ${e.area}`,
      note: [`${e.size} residence`, `${e.style} front elevation`, e.credit].filter(Boolean).join(" · "),
    },
  };
};

export const ELEVATIONS: Elevation[] = [
  elevation({
    plot: "12-V",
    size: "1 Kanal",
    area: "DHA Phase 7",
    style: "Contemporary",
    file: "12-v-1-kanal-house-dha-phase-7-lahore.jpeg",
    alt: "Contemporary front elevation with a glazed double-height bay, a dark stone side wing, vertical louvres and a roof terrace",
  }),
  elevation({
    plot: "Spanish Design",
    size: "2 Kanal",
    area: "Sheikhupura",
    style: "Classical Spanish",
    credit: "Design: Asad Afzal",
    file: "2-kanal-spanish-design-house-sheikhupura.png",
    alt: "Classical front elevation with arched windows, iron-railed balconies, a columned car porch and an arched entrance, lit at dusk",
  }),
  elevation({
    plot: "464-D",
    size: "5 Marla",
    area: "9 Town",
    style: "Modern",
    file: "464-d-5-marla-modern-house-9-town-lahore.jpeg",
    alt: "Modern front elevation in dark stone with a white stone fin, a glass balcony and an angled roof canopy",
  }),
  elevation({
    plot: "483-Y",
    size: "1 Kanal",
    area: "DHA Phase 7",
    style: "Contemporary",
    file: "483-y-1-kanal-house-dha-phase-7-lahore.png",
    alt: "Contemporary front elevation in cream stone with a double-height glazed bay, timber-clad entrance and a covered car porch",
  }),
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
  { plot: "342-U", area: "DHA Phase 7", size: "1 Kanal", type: "residential", status: "ongoing", note: "Aura’26", credits: ["Design: Mohsin Ali", "Tiles: Architects World"], photo: PROJECTS[0].cover },
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
  /** The project page for this home, when we built it ourselves. */
  project?: string;
}

export const LISTINGS: Listing[] = [
  {
    slug: "aura-26-342-u",
    title: "Aura’26",
    location: "342-U, DHA Phase 7, Lahore",
    status: "Available",
    price: "Price on request",
    specs: [
      { label: "Plot", value: "1 Kanal" },
      { label: "Bedrooms", value: "5" },
      { label: "Bathrooms", value: "6" },
      { label: "Built", value: "2026" },
    ],
    features: ["Double-height lounge", "Floating marble staircase", "Fitted kitchen with island"],
    cover: PROJECTS[0].cover!,
    project: projectHref(PROJECTS[0]),
  },
];


/** The contact page reads these to pre-fill the enquiry form. */
export const enquiryHref = (topic: string, about?: string) => {
  const q = new URLSearchParams({ topic });
  if (about) q.set("about", about);
  return `/contact?${q.toString()}`;
};
