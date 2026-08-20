import { useEffect, useRef } from "react";

export function Ambient() {
  const bgRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    if (reduced || !fine) return undefined;

    const card = document.querySelector(".cta-depth");
    const cardShift = card?.querySelector(".photo-stage-shift");
    const layers = wide && bg
      ? [bg, ...[...document.querySelectorAll(".photo-stage-shift")].filter((el) => el !== cardShift)]
      : [];
    const amount = new Map([[bg, 28]]);
    layers.slice(1).forEach((el) => amount.set(el, 18));

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let cmx = 0;
    let cmy = 0;
    let ccx = 0;
    let ccy = 0;
    let raf = 0;

    const onMove = (ev) => {
      mx = (ev.clientX / window.innerWidth) * 2 - 1;
      my = (ev.clientY / window.innerHeight) * 2 - 1;
    };

    const onCardMove = (ev) => {
      const r = card.getBoundingClientRect();
      cmx = ((ev.clientX - r.left) / r.width) * 2 - 1;
      cmy = ((ev.clientY - r.top) / r.height) * 2 - 1;
    };

    const onCardLeave = () => {
      cmx = 0;
      cmy = 0;
    };

    const tick = () => {
      cx += (mx - cx) * 0.05;
      cy += (my - cy) * 0.05;
      ccx += (cmx - ccx) * 0.1;
      ccy += (cmy - ccy) * 0.1;

      layers.forEach((el) => {
        const n = amount.get(el) || 16;
        const scale = el === bg ? 1.1 : 1.12;
        el.style.transform = `translate3d(${(cx * n).toFixed(2)}px, ${(cy * n).toFixed(2)}px, 0) scale(${scale})`;
      });

      if (card) {
        card.style.transform = `perspective(1100px) rotateX(${(-ccy * 8).toFixed(2)}deg) rotateY(${(ccx * 10).toFixed(2)}deg)`;
      }
      if (cardShift) {
        cardShift.style.transform = `translate3d(${(ccx * 24).toFixed(2)}px, ${(ccy * 20).toFixed(2)}px, 20px) scale(1.16)`;
      }

      raf = requestAnimationFrame(tick);
    };

    if (wide) window.addEventListener("mousemove", onMove, { passive: true });
    if (card) {
      card.addEventListener("mousemove", onCardMove);
      card.addEventListener("mouseleave", onCardLeave);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      if (card) {
        card.removeEventListener("mousemove", onCardMove);
        card.removeEventListener("mouseleave", onCardLeave);
        card.style.transform = "";
      }
      if (cardShift) cardShift.style.transform = "";
      layers.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, []);

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-bg" ref={bgRef} />
      <div className="ambient-veil" />
    </div>
  );
}
