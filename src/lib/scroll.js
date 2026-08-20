let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function scrollToTop({ immediate = false } = {}) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const instant = immediate || reduced;
  if (lenis) {
    lenis.scrollTo(0, { duration: instant ? 0 : 1.15, immediate: instant });
    return;
  }
  window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
}
