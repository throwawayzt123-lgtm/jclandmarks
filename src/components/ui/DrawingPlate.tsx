import type { DrawingKind } from "@/lib/portfolio";

/**
 * An architectural elevation drawn in fine gold and paper lines on the dark
 * ground — shown wherever a project has no photography yet, so a card or a
 * hero never shows an empty box or an unrelated photo.
 *
 * Purely static SVG; safe to render on the server.
 */
interface DrawingPlateProps {
  kind?: DrawingKind;
  className?: string;
  label?: string;
}

const LINE = "rgba(244,242,238,0.78)";
const FAINT = "rgba(244,242,238,0.3)";
const GOLD = "#D8B479";

function Tower() {
  return (
    <>
      <path d="M60 300 V250 H340 V300" stroke={LINE} />
      <path d="M110 250 V70 H290 V250" stroke={LINE} />
      <path d="M140 70 V52 H260 V70" stroke={LINE} />
      {[220, 190, 160, 130, 100].map((y) => (
        <path key={y} d={`M110 ${y} H290`} stroke={FAINT} />
      ))}
      {[146, 182, 218, 254].map((x) => (
        <path key={x} d={`M${x} 250 V70`} stroke={FAINT} />
      ))}
      <path d="M170 278 H230 M182 300 V278 M218 278 V300" stroke={GOLD} />
    </>
  );
}

function Pavilion() {
  return (
    <>
      <path d="M40 300 V150 H360 V300" stroke={LINE} />
      <path d="M30 150 H370 M30 138 H370" stroke={LINE} />
      {[90, 145, 200, 255, 310].map((x) => (
        <path key={x} d={`M${x} 150 V300`} stroke={FAINT} />
      ))}
      <path d="M40 225 H360" stroke={FAINT} />
      <path d="M180 300 V250 H220 V300" stroke={GOLD} />
    </>
  );
}

function Podium() {
  return (
    <>
      <path d="M40 300 V230 H360 V300" stroke={LINE} />
      <path d="M80 230 V110 H200 V230" stroke={LINE} />
      <path d="M220 230 V90 H320 V230" stroke={LINE} />
      {[200, 170, 140].map((y) => (
        <path key={y} d={`M80 ${y} H200`} stroke={FAINT} />
      ))}
      {[200, 170, 140, 110].map((y) => (
        <path key={y} d={`M220 ${y} H320`} stroke={FAINT} />
      ))}
      <path d="M40 265 H360" stroke={FAINT} />
      {[90, 140, 260, 310].map((x) => (
        <path key={x} d={`M${x} 300 V272 H${x + 30} V300`} stroke={GOLD} />
      ))}
    </>
  );
}

function House() {
  return (
    <>
      <path d="M50 300 V200 H230 V300" stroke={LINE} />
      <path d="M150 200 V120 H350 V300 H230" stroke={LINE} />
      <path d="M130 120 H370" stroke={LINE} />
      <path d="M150 160 H350" stroke={FAINT} />
      {[200, 250, 300].map((x) => (
        <path key={x} d={`M${x} 120 V200`} stroke={FAINT} />
      ))}
      <path d="M90 300 V250 H130 V300" stroke={GOLD} />
    </>
  );
}

const DRAW: Record<DrawingKind, () => React.JSX.Element> = { tower: Tower, pavilion: Pavilion, podium: Podium, house: House };

export default function DrawingPlate({ kind = "tower", className = "", label = "Architectural elevation drawing" }: DrawingPlateProps) {
  const Draw = DRAW[kind];
  // Callers that fill a frame pass `absolute inset-0`; adding `relative` as
  // well would win the cascade and collapse the plate to zero height.
  const position = /\b(absolute|fixed)\b/.test(className) ? "" : "relative";
  return (
    <div className={`${position} overflow-hidden bg-[#0b0d12] ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(216,180,121,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(216,180,121,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 55%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 55%, #000 30%, transparent 80%)",
        }}
      />
      <svg
        viewBox="0 0 400 340"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={label}
        className="absolute inset-[8%] h-[84%] w-[84%]"
        fill="none"
        strokeWidth="1.1"
        strokeLinecap="square"
      >
        <path d="M14 300 H386" stroke={LINE} strokeWidth="1.4" />
        <Draw />
      </svg>
    </div>
  );
}
