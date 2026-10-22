/**
 * Split an element's text into per-word spans so each word can be animated
 * independently, without pulling in a paid GSAP plugin.
 *
 * Each word is wrapped twice: an outer span with `overflow: hidden` acts as a
 * mask, and an inner span is what actually moves. That gives a true "rising
 * from behind a line" reveal rather than a plain fade.
 *
 * Returns the inner spans in document order, ready to hand to gsap.
 * Safe to call once per element — it marks the node so a re-run is a no-op.
 */
export function splitWords(el: HTMLElement | null): HTMLElement[] {
  if (!el) return [];
  if (el.dataset.split === "done") {
    return Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
  }

  const source = el.textContent ?? "";
  const words = source.split(/(\s+)/); // keep the whitespace tokens
  el.textContent = "";

  const inners: HTMLElement[] = [];

  for (const token of words) {
    if (token.trim() === "") {
      // Preserve spacing exactly as authored.
      el.appendChild(document.createTextNode(token));
      continue;
    }
    const mask = document.createElement("span");
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    // A little vertical slack so descenders are not clipped by the mask.
    mask.style.paddingBottom = "0.12em";
    mask.style.marginBottom = "-0.12em";

    const inner = document.createElement("span");
    inner.dataset.word = "";
    inner.style.display = "inline-block";
    inner.textContent = token;

    mask.appendChild(inner);
    el.appendChild(mask);
    inners.push(inner);
  }

  el.dataset.split = "done";
  return inners;
}
