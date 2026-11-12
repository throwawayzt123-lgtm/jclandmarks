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
];

export const findPost = (slug: string) => POSTS.find((p) => p.slug === slug);

/** Newest first. */
export const postsByDate = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

export const postHref = (p: Pick<Post, "slug">) => `/journal/${p.slug}`;

/** "10 November 2026" */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
