import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brand, WaIcon, WaLink } from "./ui";
import { scrollToTop } from "../lib/scroll";

const SERVICE_PAGES = [
  ["/alvara-de-funcionamento", "Alvará de funcionamento"],
  ["/vigilancia-sanitaria", "Vigilância sanitária"],
];

const links = [
  ["#topo", "Home", "/"],
  ["#servicos", "Serviços"],
  ["#solucoes", "Soluções"],
  ["#quem-somos", "Quem somos"],
  ["#faq", "Dúvidas"],
];

export function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const onLanding = SERVICE_PAGES.some(([href]) => pathname === href);

  useEffect(() => {
    const ids = ["topo", "servicos", "solucoes", "quem-somos", "faq"];
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
  }, [pathname]);

  useEffect(() => {
    setServicesOpen(false);
    setOpen(false);
  }, [pathname]);

  const close = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  const goHome = (ev) => {
    ev.preventDefault();
    close();
    if (pathname === "/") {
      scrollToTop();
      return;
    }
    navigate("/");
  };

  const sectionHref = (hash) => (pathname === "/" ? hash : `/${hash}`);

  return (
    <>
      <div className="site-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <header className="site-header">
        <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
          <Brand className="shrink-0" to="/" onClick={goHome} />
          <div className="site-nav-cluster">
            <div className="site-nav-links">
              {links.map(([href, label, to]) => {
                if (href === "#servicos") {
                  return (
                    <div
                      key={href}
                      className="site-nav-drop"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <button
                        type="button"
                        className={onLanding || active === href ? "is-on" : ""}
                        aria-expanded={servicesOpen}
                        aria-haspopup="true"
                        onClick={() => setServicesOpen((v) => !v)}
                      >
                        {label}
                        <svg className={`site-nav-chevron${servicesOpen ? " is-open" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {servicesOpen ? (
                        <div className="site-nav-menu-pop" role="menu">
                          {SERVICE_PAGES.map(([path, item]) => (
                            <Link key={path} to={path} role="menuitem" className={pathname === path ? "is-on" : ""}>
                              {item}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                }

                if (to || href === "#topo") {
                  return (
                    <Link key={href} to="/" onClick={goHome} className={pathname === "/" && active === "#topo" ? "is-on" : ""}>
                      {label}
                    </Link>
                  );
                }

                return (
                  <a key={href} href={sectionHref(href)} className={active === href ? "is-on" : ""}>
                    {label}
                  </a>
                );
              })}
            </div>
            <div className="site-nav-actions">
              <Link to="/formulario" className="site-nav-ghost">
                Falar agora
              </Link>
              <WaLink text="Olá, quero falar com um especialista da LiberaAI." className="btn btn-wa site-nav-wa">
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
            <Link to="/" onClick={goHome}>
              Home
            </Link>
            <a href={sectionHref("#servicos")} onClick={close}>
              Serviços
            </a>
            {SERVICE_PAGES.map(([path, item]) => (
              <Link key={path} to={path} className="site-nav-drawer-sub" onClick={close}>
                {item}
              </Link>
            ))}
            {links.slice(2).map(([href, label]) => (
              <a key={href} href={sectionHref(href)} onClick={close}>
                {label}
              </a>
            ))}
            <Link to="/formulario" onClick={close}>
              Falar agora
            </Link>
            <WaLink text="Olá, quero falar com um especialista da LiberaAI." className="btn btn-wa" onClick={close}>
              <WaIcon />
              Falar no WhatsApp
            </WaLink>
          </div>
        ) : null}
      </header>
    </>
  );
}
