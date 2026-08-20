import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "../lib/scroll";

export function useMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = document.querySelectorAll(".reveal");

    if (reduced) {
      reveals.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      document.querySelectorAll("[data-count]").forEach((el) => {
        const n = Number(el.getAttribute("data-count")) || 0;
        el.textContent = n.toLocaleString("pt-BR");
      });
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const hash = window.location.hash;
    if (!hash || hash === "#topo") {
      lenis.scrollTo(0, { immediate: true });
    } else {
      const start = document.querySelector(hash);
      if (start) lenis.scrollTo(start, { offset: -112, immediate: true });
    }

    const onHashClick = (ev) => {
      const a = ev.currentTarget;
      const href = a.getAttribute("href") || "";
      if (!href.includes("#") || /^https?:/i.test(href)) return;
      const hashIdx = href.indexOf("#");
      const path = href.slice(0, hashIdx);
      const id = href.slice(hashIdx);
      if (path && path !== window.location.pathname) return;
      if (!id || id === "#") return;
      if (id === "#topo") {
        ev.preventDefault();
        lenis.scrollTo(0, { duration: 1.25 });
        return;
      }
      const el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      lenis.scrollTo(el, { offset: -112, duration: 1.25 });
    };

    const hashLinks = [...document.querySelectorAll("a[href]")].filter((a) => {
      const href = a.getAttribute("href") || "";
      return href.includes("#") && !/^https?:/i.test(href);
    });
    hashLinks.forEach((a) => a.addEventListener("click", onHashClick));

    const heroItems = document.querySelectorAll(".hero-in");
    const heroTween = gsap.to(heroItems, {
      opacity: 1,
      y: 0,
      duration: 1.15,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.08,
    });

    const deviceTween = gsap.fromTo(
      ".device",
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.18 }
    );

    const rest = [...document.querySelectorAll(".reveal")].filter((el) => !el.classList.contains("hero-in"));
    const used = new Set();

    const play = (selector, from, extra = {}) => {
      const items = [...document.querySelectorAll(selector)];
      if (!items.length) return [];
      items.forEach((el) => used.add(el));
      const trigger = extra.trigger || items[0].closest("section, .fx-proof") || items[0];
      return [
        gsap.fromTo(
          items,
          { opacity: 0, ...from },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: extra.duration || 1.05,
            stagger: extra.stagger ?? 0.08,
            ease: "power3.out",
            overwrite: true,
            scrollTrigger: { trigger, start: "top 86%", once: true },
          }
        ),
      ];
    };

    const fxTweens = [
      ...play(".fx-proof .reveal", { y: 18 }, { stagger: 0.12, trigger: document.querySelector(".fx-proof") }),
      ...play(".fx-steps .steps-rail .reveal", { y: 24, x: -18 }, { stagger: 0.14, trigger: document.querySelector(".fx-steps") }),
      ...play(".fx-services .reveal", { y: 16, scale: 0.97 }, { stagger: 0.07, trigger: document.querySelector(".fx-services") }),
      ...play(".fx-urgent .reveal", { y: 20 }, { duration: 1.15, stagger: 0, trigger: document.querySelector(".fx-urgent") }),
      ...play(".fx-compare .box-off", { x: -40, y: 0 }, { stagger: 0, trigger: document.querySelector(".fx-compare") }),
      ...play(".fx-compare .box:not(.box-off)", { x: 40, y: 0 }, { stagger: 0, trigger: document.querySelector(".fx-compare") }),
      ...play(".fx-types .reveal", { y: 22 }, { stagger: 0.12, trigger: document.querySelector(".fx-types") }),
      ...play(".fx-about .reveal", { y: 18 }, { stagger: 0.1, trigger: document.querySelector(".fx-about") }),
      ...play(".fx-cta .reveal", { y: 18, scale: 0.98 }, { stagger: 0, trigger: document.querySelector(".fx-cta") }),
      ...play(".fx-faq .reveal", { y: 10 }, { stagger: 0.06, trigger: document.querySelector(".fx-faq") }),
    ];

    const leftover = rest.filter((el) => !used.has(el));
    const batches = leftover.length
      ? ScrollTrigger.batch(leftover, {
          start: "top 88%",
          once: true,
          onEnter: (group) => {
            gsap.to(group, {
              opacity: 1,
              y: 0,
              duration: 1.05,
              stagger: 0.06,
              ease: "power3.out",
              overwrite: true,
            });
          },
        })
      : [];

    const parallax = gsap.utils.toArray(".photo-stage-dark img").filter((img) => !img.closest(".cta-depth")).map((img) => {
      const trigger = img.closest("section, footer") || img.parentElement;
      gsap.set(img, { scale: 1.06, transformOrigin: "50% 50%" });
      return gsap.fromTo(
        img,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 0.7 },
        }
      );
    });

    const rail = document.querySelector(".steps-rail");
    let railTrigger;
    if (rail) {
      railTrigger = ScrollTrigger.create({
        trigger: rail,
        start: "top 80%",
        once: true,
        onEnter: () => rail.classList.add("is-in"),
      });
    }

    const counters = [...document.querySelectorAll("[data-count]")].map((el) => {
      const end = Number(el.getAttribute("data-count")) || 0;
      const obj = { n: 0 };
      return gsap.to(obj, {
        n: end,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(obj.n).toLocaleString("pt-BR");
        },
      });
    });

    return () => {
      hashLinks.forEach((a) => a.removeEventListener("click", onHashClick));
      heroTween.kill();
      deviceTween.kill();
      parallax.forEach((t) => t.kill());
      counters.forEach((t) => t.kill());
      railTrigger?.kill();
      fxTweens.forEach((t) => t.kill());
      batches.forEach((t) => t.kill?.());
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);
}
