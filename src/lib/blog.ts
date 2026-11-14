import { FACADES, INTERIORS, type Still } from "@/lib/media";

/**
 * BLOG / JOURNAL
 *
 * Articles are plain data: add an entry here and its card and page appear.
 * `body` is a small set of blocks rather than raw HTML, so an article can
 * never break the page's typography.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "image"; still: Still; caption?: string };

export interface Post {
  slug: string;
  title: string;
  /** One sentence, used on the card and for search results. */
  summary: string;
  /** ISO date; shown as a long date. */
  date: string;
  /** ISO date of the last real edit, if any (sitemap and article schema). */
  updated?: string;
  /** Search-result title, when the headline is too long for one (≈60 characters). */
  seoTitle?: string;
  /** e.g. "Building in Lahore" — a plain, factual label. */
  topic: string;
  /** Rough reading time in minutes. */
  minutes: number;
  cover: Still;
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: "cost-of-building-a-house-in-lahore",
    seoTitle: "House Construction Cost in Lahore: What It Really Costs",
    title: "What it really costs to build a house in Lahore",
    summary:
      "Grey structure, finishing and the costs owners forget — a plain guide to how a build is priced, and why two quotes for the same plot can differ so much.",
    date: "2026-11-10",
    topic: "Building in Lahore",
    minutes: 6,
    cover: FACADES.phase7Villa,
    body: [
      {
        kind: "p",
        text: "The first question almost every owner asks us is the hardest one to answer in a sentence: what will it cost to build my house? The honest answer is that a house is not one price. It is two very different pieces of work — the structure, and everything that goes into it afterwards — and the second one is where budgets are won or lost.",
      },
      { kind: "h", text: "Grey structure: the part that is fairly predictable" },
      {
        kind: "p",
        text: "Grey structure is the building itself: excavation, foundations, the concrete frame, brickwork, roof slabs, plaster, and the pipes and conduits buried in the walls for plumbing and wiring. It is the least glamorous stage and the most important one, because nothing above it can be better than the structure underneath.",
      },
      {
        kind: "p",
        text: "This stage is relatively predictable to price, because it is mostly steel, cement, bricks, sand and labour — quantities that can be calculated from the drawings before anyone starts work. What moves the number is the design itself: longer spans, more cantilevers, a basement or a double-height space all need more steel and more care, and the cost follows.",
      },
      { kind: "h", text: "Finishing: where the range opens up" },
      {
        kind: "p",
        text: "Finishing covers flooring, woodwork, kitchens, washrooms, paint, false ceilings, lighting, doors, windows, railings and the façade. Here the same house can cost twice as much as the house next to it, because every item has a floor and a ceiling. A washroom can be finished honestly for a modest figure, or it can hold imported stone and fittings that cost more than the room it sits in.",
      },
      {
        kind: "p",
        text: "This is why a single rate per square foot tells an owner very little on its own. It only means something when it is attached to a written specification: which tile, which sanitary brand, how many light points, what the kitchen is made of. Without that, two quotes are not comparable, and the cheaper one usually turns out to assume less.",
      },
      {
        kind: "image",
        still: INTERIORS.kitchen,
        caption: "Finishing is where the budget really moves: joinery, stone and fittings, chosen before work begins rather than mid-build.",
      },
      { kind: "h", text: "The costs owners forget" },
      {
        kind: "list",
        items: [
          "Approvals and society fees, and the drawings needed to obtain them.",
          "Boundary wall, gate, car porch and the paving in front of the house.",
          "Landscaping and the external lighting that makes a façade work at night.",
          "An electrical backup arrangement, and water storage and pumping.",
          "A contingency — a sensible one is around 10% of the total.",
        ],
      },
      { kind: "h", text: "Why two quotes for the same plot differ" },
      {
        kind: "p",
        text: "When owners show us two quotes with a wide gap between them, the difference is nearly always one of four things: a different specification, a different scope (one has quietly left out the boundary wall or the approvals), a different assumption about who supplies materials, or an optimistic timeline that does not allow for the real sequence of trades.",
      },
      {
        kind: "quote",
        text: "A quote without a specification is not a price. It is a guess that someone else will have to pay for later.",
      },
      { kind: "h", text: "How to compare fairly" },
      {
        kind: "list",
        items: [
          "Ask for an itemised estimate, not a single figure.",
          "Fix the finishing specification in writing before signing anything.",
          "Check what is excluded as carefully as what is included.",
          "Agree how changes will be priced during the build, before they happen.",
          "Ask to see a house the contractor built two or three years ago, not just a new one.",
        ],
      },
      {
        kind: "p",
        text: "We price our own work this way because it is the only version that survives contact with a real site. An itemised estimate before we start, a written specification for the finishing, and any change agreed with the owner in writing before it is carried out. It makes the first conversation longer and every conversation after it shorter.",
      },
    ],
  },
  {
    slug: "grey-structure-vs-turnkey",
    seoTitle: "Grey Structure vs Turnkey Construction in Lahore",
    title: "Grey structure or turnkey: which contract suits you?",
    summary:
      "The two ways most homes in Lahore are built, what each one includes, and the kind of owner each one actually suits.",
    date: "2026-11-05",
    topic: "Building in Lahore",
    minutes: 5,
    cover: FACADES.prismMonolith,
    body: [
      {
        kind: "p",
        text: "Almost every owner we meet is choosing between the same two arrangements: pay a contractor to raise the structure and manage the finishing yourself, or hand the whole house to one party and collect the keys. Neither is the right answer on its own. They suit different people, different budgets and, above all, different amounts of free time.",
      },
      { kind: "h", text: "What grey structure actually covers" },
      {
        kind: "p",
        text: "Grey structure is the building without its finishes: excavation, foundations, the concrete frame, brickwork, roof slabs, plaster, and the conduits and pipes buried in the walls for wiring and plumbing. At the end of it you own a sound, weather-tight shell with services roughed in \u2014 and nothing you can live in yet.",
      },
      {
        kind: "p",
        text: "Owners choose it because the pricing is relatively easy to check, and because finishing is where personal taste matters most. If you intend to source your own stone, joinery and fittings, and you have the time to run that, grey structure keeps the decisions in your hands.",
      },
      { kind: "h", text: "What turnkey adds" },
      {
        kind: "p",
        text: "Turnkey carries the same structure through flooring, woodwork, kitchens, washrooms, electrical and plumbing fit-out, paint, ceilings and the fa\u00e7ade, up to a house that is ready to move into. One contract, one schedule, one party answerable for the result.",
      },
      {
        kind: "p",
        text: "The advantage is not only convenience. When the same team builds the structure and the finishes, the two are planned together: service runs are set out before slabs are poured, and ceiling heights account for the ducting that will eventually sit inside them. Problems that are expensive to fix later are avoided at drawing stage.",
      },
      {
        kind: "image",
        still: INTERIORS.staircaseCantilever,
        caption: "Stone, joinery and lighting detailed together \u2014 the case for one team carrying a house from structure through finishing.",
      },
      { kind: "h", text: "Which suits you" },
      {
        kind: "list",
        items: [
          "Choose grey structure if you have time to manage trades, enjoy sourcing materials, and are comfortable coordinating the sequence yourself.",
          "Choose turnkey if you want one schedule, one point of contact and a fixed, itemised cost for the whole house.",
          "Choose turnkey if you live abroad or travel often \u2014 finishing needs decisions every week, not every month.",
          "Either way, fix the specification in writing first. It is the only thing that makes two quotes comparable.",
        ],
      },
      {
        kind: "quote",
        text: "The question is not which contract is cheaper. It is which one matches the hours you can honestly give the site.",
      },
      {
        kind: "p",
        text: "We build both ways, and we say plainly which we think fits a brief when an owner asks. A grey-structure client who cannot visit the site for months usually ends up paying more in delays than the turnkey premium would have cost.",
      },
    ],
  },
  {
    slug: "how-long-does-it-take-to-build-a-house-in-lahore",
    seoTitle: "How Long Does It Take to Build a House in Lahore?",
    title: "How long does it take to build a house in Lahore?",
    summary:
      "A realistic timeline for a 1 kanal home \u2014 approvals, grey structure, finishing and handover \u2014 and the three things that cause most delays.",
    date: "2026-10-28",
    topic: "Process",
    minutes: 5,
    cover: FACADES.phase7Curtain,
    body: [
      {
        kind: "p",
        text: "For a 1 kanal house built properly, from the first site visit to the day you move in, a realistic range is twelve to eighteen months. Anyone promising eight is either leaving something out or planning to work in a way you will not enjoy living with afterwards.",
      },
      { kind: "h", text: "The stages, and roughly what each takes" },
      {
        kind: "list",
        items: [
          "Survey, brief and design: 6 to 10 weeks, including the revisions that always follow the first set of drawings.",
          "Structural design and approvals: 4 to 8 weeks, depending on the society and how complete the submission is.",
          "Grey structure: 5 to 7 months for a 1 kanal house, governed by curing times that cannot be rushed.",
          "Finishing: 5 to 7 months, overlapping the tail of the structure where the sequence allows.",
          "Snagging and handover: 3 to 5 weeks of closing a list, testing services and clearing the site.",
        ],
      },
      { kind: "h", text: "Why concrete sets the pace" },
      {
        kind: "p",
        text: "Concrete needs time to gain strength, and no amount of pressure changes that. Each slab has to cure before the floor above it is loaded. A contractor who shortens curing to beat a deadline is borrowing from the building\u2019s life to pay for your calendar, and the interest falls due as cracks years later.",
      },
      {
        kind: "image",
        still: FACADES.phase7Villa,
        caption: "A finished front conceals months of sequence: foundations, frame, slabs, then everything that hangs off them.",
      },
      { kind: "h", text: "The three usual causes of delay" },
      {
        kind: "p",
        text: "First, late decisions. Finishing moves at the speed of the owner\u2019s choices; a tile selection that waits three weeks costs three weeks. Second, mid-build changes. Moving a wall after the frame is cast is not a small edit. Third, under-resourced sites, where one team is spread across several projects and yours gets the leftover days.",
      },
      {
        kind: "quote",
        text: "Nearly every schedule we have seen slip went the same way: not one large disaster, but twenty small decisions that arrived late.",
      },
      {
        kind: "p",
        text: "What helps is unglamorous. Approve the drawings before work starts. Choose the finishing specification early, even for rooms you will not see for a year. Agree changes in writing with their cost and their time implication attached. A schedule survives on decisions made ahead of the trade that needs them.",
      },
    ],
  },
  {
    slug: "questions-to-ask-a-construction-company",
    seoTitle: "10 Questions to Ask a Construction Company in Lahore",
    title: "Ten questions to ask before you hire a construction company",
    summary:
      "What to ask a builder in Lahore before signing \u2014 about contracts, site supervision, materials and what happens after handover.",
    date: "2026-10-20",
    topic: "Choosing a builder",
    minutes: 4,
    cover: INTERIORS.foyerGallery,
    body: [
      {
        kind: "p",
        text: "Choosing who builds your house is a bigger decision than choosing the design. A plan can be changed on paper; poor construction has to be lived with, or opened up and redone. These are the questions we would ask if we were the ones hiring.",
      },
      { kind: "h", text: "About the contract" },
      {
        kind: "list",
        items: [
          "Will I receive an itemised estimate, or a single lump-sum figure?",
          "What exactly is excluded \u2014 boundary wall, approvals, landscaping, electrical backup?",
          "How will changes be priced once work has started, and who signs them off?",
          "What is the payment schedule, and is it tied to stages completed rather than dates?",
        ],
      },
      { kind: "h", text: "About the site" },
      {
        kind: "list",
        items: [
          "Who supervises day to day, and how many other sites is that person running?",
          "Are the engineers and site teams your own, or subcontracted to whoever is free?",
          "Can I visit unannounced, and will someone walk me through what is happening?",
        ],
      },
      { kind: "h", text: "About materials and what follows" },
      {
        kind: "list",
        items: [
          "Which brands of steel, cement and fittings are assumed in the quote?",
          "Is concrete tested, and will I see the results?",
          "What happens if something fails six months after handover?",
        ],
      },
      {
        kind: "image",
        still: INTERIORS.bedMaster,
        caption: "Ask to see a house finished two or three years ago. New work hides most things; time does not.",
      },
      {
        kind: "quote",
        text: "Ask to see a house the contractor built three years ago, not three months ago. Any builder can hand over something that looks right on day one.",
      },
      {
        kind: "p",
        text: "The answers matter less than the manner of answering. A builder who is comfortable being asked these things in detail, and who writes the answers down, is usually the one who will still be comfortable when something goes wrong on site \u2014 which, on every project, eventually it does.",
      },
    ],
  },
];

export const findPost = (slug: string) => POSTS.find((p) => p.slug === slug);

/** Newest first. */
export const postsByDate = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

export const postHref = (p: Pick<Post, "slug">) => `/journal/${p.slug}`;

/** "10 November 2026" */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
