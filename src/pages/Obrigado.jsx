import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Ambient } from "../components/Ambient";
import { Brand, WaIcon, WaLink, Wrap } from "../components/ui";
import { readLeadMessage } from "../lib/whatsapp";

export function Obrigado() {
  const year = new Date().getFullYear();
  const message = readLeadMessage();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const fromWhatsApp = pathname.includes("/obrigado/whatsapp");

  useEffect(() => {
    document.title = "Muito obrigado · LiberaAI";
    window.scrollTo(0, 0);
    if (pathname.startsWith("/home/obrigado")) {
      navigate(pathname.replace(/^\/home/, "") || "/obrigado/formulario", { replace: true });
    }
    return () => {
      document.title = "LiberaAI · alvará e licenças em São Paulo";
    };
  }, [fromWhatsApp, pathname, navigate]);

  return (
    <>
      <Ambient />
      <header className="site-header">
        <nav className="site-nav">
          <Brand to="/" />
        </nav>
      </header>

      <div className="relative z-1 flex min-h-dvh flex-col">
        <main className="flex flex-1 flex-col justify-center pt-[7.25rem] pb-24 lg:pt-[8.75rem]">
          <Wrap className="flex justify-center">
            <aside className="talk-card w-full max-w-[32rem]" aria-label="Confirmação de envio">
              <p className="mono text-accent-strong">Enviado</p>
              <h1 className="display mt-2 text-[clamp(1.7rem,1.4rem+1.2vw,2.2rem)] text-ink">Muito obrigado</h1>
              <p className="mt-3 text-[15px] leading-snug text-ink-2">
                Recebemos seus dados. Clique abaixo para falar no WhatsApp com um especialista.
              </p>
              <WaLink direct text={message} className="btn btn-primary mt-6 w-full">
                <WaIcon />
                Falar no WhatsApp
              </WaLink>
              <Link to="/" className="btn btn-ghost mt-3 w-full">
                Voltar ao site
              </Link>
            </aside>
          </Wrap>
        </main>

        <footer className="fixed right-0 bottom-0 left-0 z-10 w-full bg-slate text-on-slate-muted">
          <Wrap className="py-[18px] text-center text-xs">
            <p className="mono">© {year} LiberaAI / todos os direitos reservados</p>
          </Wrap>
        </footer>
      </div>
    </>
  );
}
