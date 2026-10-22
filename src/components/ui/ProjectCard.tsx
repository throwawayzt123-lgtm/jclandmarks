import Image from "next/image";
import DrawingPlate from "@/components/ui/DrawingPlate";
import { CATEGORIES, projectHref, type Project } from "@/lib/portfolio";

import Link from "next/link";
/**
 * A portfolio card: plate (photo, or a drawing when none exists), then the
 * project's location, title and summary set as plain type below. No labels
 * sit on the image.
 */
interface ProjectCardProps {
  project: Project;
  /** Taller plate for the lead card in a gallery. */
  feature?: boolean;
  showCategory?: boolean;
  sizes?: string;
}

export default function ProjectCard({ project: p, feature = false, showCategory = false, sizes = "(max-width: 1024px) 100vw, 45vw" }: ProjectCardProps) {
  // The lead card sits image-left / text-right on desktop, so it gains
  // presence without the plate growing to a full-bleed, screen-tall block.
  const aspect = feature ? "aspect-[4/3]" : "aspect-[5/4]";
  return (
    <article className="group">
      <Link href={projectHref(p)} className={feature ? "grid items-center gap-y-0 outline-none lg:grid-cols-12 lg:gap-x-20" : "block outline-none"}>
        <div data-r="plate" className={`relative ${aspect} overflow-hidden bg-[#0b0d12] ${feature ? "lg:col-span-7" : ""}`}>
          <div data-r-img className="absolute inset-0">
            {p.cover ? (
              <Image
                src={p.cover.src}
                alt={p.cover.alt}
                fill
                sizes={sizes}
                loading="lazy"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                style={{ objectPosition: p.cover.position ?? "center" }}
              />
            ) : (
              <DrawingPlate
                kind={p.drawing}
                label={`Elevation drawing of ${p.title}`}
                className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
              />
            )}
          </div>
        </div>

        <div className={feature ? "pt-7 lg:col-span-5 lg:pt-0" : "pt-7"}>
          <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#b58c49]">
            {showCategory ? `${CATEGORIES[p.category].label} · ` : ""}
            {p.location}
          </span>
          <h3 className={`mt-3 font-serif font-light leading-[1.2] text-[#11141b] ${feature ? "text-[clamp(1.7rem,2.8vw,2.5rem)]" : "text-[clamp(1.4rem,2.1vw,1.85rem)]"}`}>
            {p.title}
          </h3>
          <span
            aria-hidden="true"
            className="mt-4 block h-px w-10 origin-left bg-[#b58c49] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-[3]"
          />
          <p className="mt-4 max-w-md text-[0.92rem] leading-[1.75] text-[#6b7280]">{p.summary}</p>
          <span className="mt-5 inline-flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.24em] text-[#11141b] group-focus-visible:text-[#b58c49]">
            View project
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
