import { useEffect, useState } from "react";
import { Brand, WaIcon, WaLink } from "./ui";

const links = [
  ["#solucoes", "Soluções"],
  ["#servicos", "Serviços"],
  ["#quem-somos", "Quem somos"],
  ["#faq", "Dúvidas"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = ["solucoes", "servicos", "quem-somos", "faq"];
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);

      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < 120) current = `#${id}`;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <div className="site-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <header className="fixed top-3 right-0 left-0 z-50">
        <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
          <Brand className="shrink-0" />
          <div className="site-nav-cluster">
            <div className="site-nav-links">
              {links.map(([href, label]) => (
                <a key={href} href={href} className={active === href ? "is-on" : ""}>
                  {label}
                </a>
              ))}
            </div>
            <div className="site-nav-actions">
              <a href="#diagnostico" className="site-nav-ghost">
                Falar agora
              </a>
              <WaLink text="Olá, quero falar com um especialista da LiberaAI." className="btn btn-primary site-nav-wa">
                <WaIcon />
                WhatsApp
              </WaLink>
              <button
                type="button"
                className="site-nav-menu"
                aria-expanded={open}
                aria-controls="mobile"
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {open ? <path d="M3 3l10 10M13 3 3 13" /> : <path d="M2 5h12M2 8.5h12M2 12h12" />}
                </svg>
              </button>
            </div>
          </div>
        </nav>
        {open ? (
          <div id="mobile" className="site-nav-drawer">
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={close}>
                {label}
              </a>
            ))}
            <a href="#diagnostico" onClick={close}>
              Falar agora
            </a>
            <WaLink text="Olá, quero falar com um especialista da LiberaAI." className="btn btn-primary" onClick={close}>
              <WaIcon />
              Falar no WhatsApp
            </WaLink>
          </div>
        ) : null}
      </header>
    </>
  );
}
