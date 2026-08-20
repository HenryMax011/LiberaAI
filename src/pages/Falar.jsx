import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Ambient } from "../components/Ambient";
import { Brand, Eyebrow, MarkOk, Wrap } from "../components/ui";
import { digitsOnly, maskPhone } from "../lib/phone";
import { composeLeadMessage, saveLeadMessage } from "../lib/whatsapp";
import { sendLead } from "../lib/leads";
import { goToThanks, trackGenerateLead } from "../lib/tracking";

const NOTES = [
  "Leitura inicial sem custo",
  "Resposta imediata",
  "São Paulo - SP",
];

const KINDS = {
  LP_HOME: {
    source: "LP_HOME",
    services: ["Falar no WhatsApp"],
    titleDoc: "WhatsApp · LiberaAI",
    eyebrow: "WhatsApp / diagnóstico / São Paulo",
    intent: "quero regularizar minha empresa com a LiberaAI.",
    thanksPath: "/obrigado/whatsapp",
  },
  LP_ALVARA_FUNCIONAMENTO: {
    source: "LP_ALVARA_FUNCIONAMENTO",
    services: ["Alvará de funcionamento"],
    titleDoc: "WhatsApp · alvará de funcionamento · LiberaAI",
    eyebrow: "WhatsApp / alvará de funcionamento",
    intent: "quero regularizar o alvará de funcionamento com a LiberaAI.",
    thanksPath: "/alvara-de-funcionamento/obrigado/whatsapp",
  },
  LP_VIGILANCIA_SANITARIA: {
    source: "LP_VIGILANCIA_SANITARIA",
    services: ["Vigilância sanitária"],
    titleDoc: "WhatsApp · vigilância sanitária · LiberaAI",
    eyebrow: "WhatsApp / vigilância sanitária",
    intent: "quero o licenciamento sanitário com a LiberaAI.",
    thanksPath: "/vigilancia-sanitaria/obrigado/whatsapp",
  },
};

export function Falar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sourceKey = params.get("source") || "LP_HOME";
  const copy = KINDS[sourceKey] || KINDS.LP_HOME;
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!params.get("source") || !KINDS[sourceKey]) {
      navigate("/whatsapp/?source=LP_HOME", { replace: true });
    }
  }, [params, sourceKey, navigate]);

  useEffect(() => {
    document.title = copy.titleDoc;
    window.scrollTo(0, 0);
    return () => {
      document.title = "LiberaAI · alvará e licenças em São Paulo";
    };
  }, [copy.titleDoc]);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const name = String(data.get("nome") || "").trim();
    const digits = digitsOnly(phone);
    if (!name || digits.length < 10) return;
    setError("");
    setSending(true);
    try {
      await sendLead({
        name,
        phone,
        source: copy.source,
        services: copy.services,
      });
      saveLeadMessage(composeLeadMessage(name, phone, copy.intent));
      trackGenerateLead({ source: copy.source, channel: "whatsapp" });
      goToThanks(copy.thanksPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar. Tente de novo.");
      setSending(false);
    }
  };

  return (
    <>
      <Ambient />
      <header className="site-header">
        <nav className="site-nav">
          <Brand to="/" />
        </nav>
      </header>

      <div className="relative z-1 flex min-h-dvh flex-col">
        <main className="flex-1 pt-[7.25rem] pb-24 lg:pt-[8.75rem]">
        <Wrap className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Eyebrow className="text-accent-strong">{copy.eyebrow}</Eyebrow>
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
              <button type="submit" className="btn btn-primary mt-1 w-full" disabled={sending}>
                {sending ? "Enviando…" : "Enviar"}
              </button>
              {error ? <p className="m-0 text-center text-xs leading-relaxed text-coral">{error}</p> : null}
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
