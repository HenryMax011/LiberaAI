import { Link } from "react-router-dom";
import { Brand, WaIcon, WaLink, Wrap } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate pt-[72px] text-on-slate-muted">
      <Wrap className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Brand to="/" light />
          <p className="mt-4 max-w-[32ch]">Alvará, sanitário e bombeiros. Regularização completa na capital de São Paulo.</p>
          <WaLink text="Olá, quero falar com a LiberaAI." className="btn btn-on-dark mt-5">
            Falar com especialista →
          </WaLink>
        </div>
        <div>
          <h3 className="mono mb-4 text-on-slate">Navegação</h3>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            <li><Link className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" to="/">Home</Link></li>
            <li><a className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" href="/#servicos">Serviços</a></li>
            <li><Link className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" to="/alvara-de-funcionamento">Alvará de funcionamento</Link></li>
            <li><Link className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" to="/vigilancia-sanitaria">Vigilância sanitária</Link></li>
            <li><a className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" href="/#solucoes">Como funciona</a></li>
            <li><a className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" href="/#quem-somos">Quem somos</a></li>
            <li><a className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" href="/#faq">Perguntas</a></li>
            <li><Link className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" to="/whatsapp/?source=LP_HOME">Contato</Link></li>
            <li><Link className="cursor-pointer text-on-slate-muted no-underline hover:text-accent-mid" to="/privacidade">Política de privacidade</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mono mb-4 text-on-slate">Contato</h3>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            <li>contato@liberaai.com.br</li>
            <li>(11) 99999-9999</li>
          </ul>
        </div>
      </Wrap>
      <Wrap className="mt-12">
        <h3 className="mono mb-4 text-on-slate">Endereço</h3>
        <p className="m-0 flex items-start gap-2.5 text-on-slate">
          <svg className="mt-0.5 shrink-0 text-accent-mid" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.2" />
          </svg>
          Rua Perucaba, 97 — São Paulo - SP
        </p>
        <div className="footer-map mt-5">
          <a
            className="footer-map-open"
            href="https://www.google.com/maps/search/?api=1&query=Rua+Perucaba+97+S%C3%A3o+Paulo+SP"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir no Maps
          </a>
          <iframe
            title="Mapa — Rua Perucaba, 97, São Paulo"
            src="https://www.google.com/maps?q=Rua+Perucaba,+97,+S%C3%A3o+Paulo+-+SP&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Wrap>
      <Wrap className="mt-12 border-t border-edge-dark py-[18px] text-center text-xs">
        <p className="mono">© {year} LiberaAI / São Paulo / todos os direitos reservados</p>
      </Wrap>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
      <WaLink text="Olá, quero regularizar minha empresa com a LiberaAI." className="wa-fab" aria-label="Falar no WhatsApp">
        <WaIcon size={20} />
        WhatsApp
      </WaLink>
  );
}
