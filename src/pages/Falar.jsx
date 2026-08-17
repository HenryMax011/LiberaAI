import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ambient } from "../components/Ambient";
import { Brand, Eyebrow, MarkOk, Wrap } from "../components/ui";
import { digitsOnly, maskPhone } from "../lib/phone";
import { composeLeadMessage, saveLeadMessage } from "../lib/whatsapp";

const NOTES = [
  "Leitura inicial sem custo",
  "Resposta imediata",
  "São Paulo - SP",
];

export function Falar() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    document.title = "Falar no WhatsApp · LiberaAI";
    window.scrollTo(0, 0);
    return () => {
      document.title = "LiberaAI · alvará e licenças em São Paulo";
    };
  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const name = String(data.get("nome") || "").trim();
    const digits = digitsOnly(phone);
    if (!name || digits.length < 10) return;
    saveLeadMessage(composeLeadMessage(name, phone, "quero regularizar minha empresa com a LiberaAI."));
    navigate("/obrigado/whatsapp/");
  };

  return (
    <>
      <Ambient />
      <header className="fixed top-3 right-0 left-0 z-50">
        <nav className="site-nav">
          <Brand to="/" />
        </nav>
      </header>

      <div className="relative z-1 flex min-h-dvh flex-col">
      <main className="flex-1 pt-32 pb-24">
        <Wrap className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Eyebrow className="text-accent-strong">WhatsApp / diagnóstico / São Paulo</Eyebrow>
            <h1 className="display mt-[18px] text-[clamp(2.5rem,1.7rem+3.2vw,4.1rem)]">
              Conte o caso. A gente responde no <em className="beat">WhatsApp</em>.
            </h1>
            <p className="mt-[22px] max-w-[36.25rem] text-[17.5px] font-medium leading-[1.65] text-ink-2">
              Formulário para o especialista. A leitura inicial não tem custo. Você decide se segue.
            </p>
            <ul className="mt-8 m-0 grid list-none gap-3 p-0">
              {NOTES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-ink">
                  <MarkOk />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="talk-card" aria-label="Formulário de contato">
            <form className="grid gap-3.5" onSubmit={onSubmit}>
              <div className="device-field">
                <label htmlFor="falar-nome">Nome</label>
                <input id="falar-nome" name="nome" type="text" required autoComplete="name" placeholder="Seu nome" />
              </div>
              <div className="device-field">
                <label htmlFor="falar-whatsapp">WhatsApp</label>
                <div className="device-phone">
                  <span className="device-phone-cc" aria-hidden="true">+55</span>
                  <input
                    id="falar-whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    autoComplete="tel-national"
                    inputMode="numeric"
                    placeholder="(11) 90000-0000"
                    value={phone}
                    onChange={(ev) => setPhone(maskPhone(ev.target.value))}
                    maxLength={15}
                    minLength={14}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-1 w-full">
                Enviar
              </button>
              <p className="m-0 text-center text-xs leading-relaxed text-muted">
                Ao enviar, você concorda com a <Link to="/privacidade" className="text-accent">política de privacidade</Link>.
              </p>
            </form>
          </aside>
        </Wrap>
      </main>

      <footer className="fixed right-0 bottom-0 left-0 z-10 mt-auto w-full bg-slate text-on-slate-muted">
        <Wrap className="py-[18px] text-center text-xs">
          <p className="mono">© {year} LiberaAI / todos os direitos reservados</p>
        </Wrap>
      </footer>
      </div>
    </>
  );
}
