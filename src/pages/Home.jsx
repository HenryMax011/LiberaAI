import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMotion } from "../hooks/useMotion";
import { composeLeadMessage, saveLeadMessage } from "../lib/whatsapp";
import { digitsOnly, maskPhone } from "../lib/phone";
import { Ambient } from "../components/Ambient";
import { ConvertBar } from "../components/ConvertBar";
import { Nav } from "../components/Nav";
import { Footer, WhatsAppFab } from "../components/Footer";
import { Box, BoxNum, Eyebrow, MarkOk, MarkX, PhotoStage, SectionHead, WaIcon, WaLink, Wrap } from "../components/ui";

const CLIENTS = [
  ["Casa do Pão de Queijo", "/img/clients/casa-do-pao.png"],
  ["Extra", "/img/clients/extra.png"],
  ["Flash Power", "/img/clients/flash-power.png"],
  ["Fototica", "/img/clients/fototica.png"],
  ["Fran's Café", "/img/clients/frans-cafe.png"],
  ["Itaú", "/img/clients/itau.png"],
  ["Kopenhagen", "/img/clients/kopenhagen.png"],
  ["Lopes", "/img/clients/lopes.png"],
  ["Lombroso Fashion Mall", "/img/clients/lombroso.png"],
  ["Bomprato", "/img/clients/bomprato.png"],
  ["Burger King", "/img/clients/burger-king.png"],
  ["Viena", "/img/clients/viena.png"],
  ["Shell Select", "/img/clients/shell-select.png"],
];

const SERVICES = [
  ["01", "Alvará de funcionamento", "Obtenção e regularização do alvará em São Paulo, lendo CNAE e imóvel com precisão.", ["MEI, ME e EPP", "Regularização", "Adequação e pré-vistoria"]],
  ["02", "Licenciamento sanitário", "Regularização sanitária com acompanhamento técnico na capital.", ["ANVISA", "Secretaria de Saúde", "PGRSS"]],
  ["03", "AVCB / CLCB", "AVCB, CLCB e APPCI junto ao Corpo de Bombeiros, com o trâmite organizado.", ["AVCB", "CLCB", "APPCI"]],
  ["04", "CETESB e licenças ambientais", "Licenças de instalação e operação para indústrias em São Paulo.", ["Licença de instalação", "Licença de operação", "SVMA"]],
  ["05", "POP, boas práticas e DCFF", "Documentos para conformidade sanitária do estabelecimento.", ["POP", "Manual de boas práticas", "DCFF"]],
  ["06", "Regularização e pré-vistoria", "Diagnóstico técnico, adequação do ponto e pré-vistoria antes do fiscal.", ["Regularização", "Adequação", "Pré-vistoria"]],
];

const STEPS = [
  ["01", "Você envia os dados", "Formulário curto com o que precisa regularizar."],
  ["02", "Lemos a papelada", "Pendências à vista e o caminho mais curto para o seu CNAE."],
  ["03", "Cuidamos do protocolo", "Prefeitura, vigilância e bombeiros — nós acompanhamos."],
  ["04", "Licença na mão", "Você opera. A gente entrega o que o órgão exigiu."],
];

const AREAS = [
  ["01", "Alvará de funcionamento", "O documento-base para o ponto operar. Lemos CNAE e imóvel e definimos a via mais curta."],
  ["02", "Licenciamento sanitário", "ANVISA, secretaria e PGRSS no mesmo acompanhamento."],
  ["03", "AVCB / CLCB", "Bombeiros com o trâmite organizado, do projeto ao carimbo."],
];

const AREA_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 16.5h4" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6z" />
    <path d="M12 8.5v6M9 11.5h6" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c1 3-2 4-2 7a2 2 0 1 0 4 0c0-1-.5-1.8-.5-1.8 1.9 1 3 3 3 5.3a4.5 4.5 0 1 1-9 0C9.5 9.7 12 8 12 3z" />
  </svg>,
];

const TYPES = [
  ["01", "Auto de licença de funcionamento (ALF)", "Imóveis não residenciais com atividade comercial, industrial ou de serviços."],
  ["02", "ALF condicionado (ALF-C)", "Licença com condicionantes a cumprir no prazo que o órgão fixar."],
  ["03", "Eventos públicos e temporários", "Autorização para ocupação temporária e fluxo de público."],
];

const TYPE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 21V10l8-6 8 6v11" />
    <path d="M10 21v-6h4v6" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M8.5 14.5l2 2 5-5" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
  </svg>,
];

const DIFFS = [
  ["01", "Quem já viu o seu tipo de ponto", "Técnicos que leem CNAE, imóvel e órgão — sem recomeçar do zero. O diagnóstico já nasce com o caminho certo."],
  ["02", "Personalizado, sem script", "Cada caso tem rota própria. Você fala com quem protocola, não com um robô."],
  ["03", "Projeto e papel no prazo", "Documentação alinhada antes de entrar no órgão — menos devolução, mais avanço."],
  ["04", "Conformidade de ponta a ponta", "Prefeitura, vigilância e bombeiros no mesmo mapa — nada fica solto."],
  ["05", "Do protocolo à vistoria", "Acompanhamos exigência, prazo e resposta. Você não precisa caçar status."],
  ["06", "Preço combinado, prazo cumprido", "Condição clara no início. Sem taxa escondida no meio do processo."],
];

const FAQS = [
  ["01", "Quanto tempo leva para obter as licenças?", "O prazo muda com o tipo de licença e o órgão. Em casos elegíveis, o alvará pode sair em até 24 horas. Nos demais, seguimos o calendário da prefeitura, da vigilância ou dos bombeiros, com acompanhamento nosso em cada etapa."],
  ["02", "Quais documentos são necessários?", "Em geral: contrato social ou MEI, comprovante do imóvel (IPTU ou locação), planta ou memorial quando exigido, e documentos dos responsáveis. O diagnóstico inicial lista exatamente o que o seu caso pede."],
  ["03", "Vocês atendem em quais regiões?", "Capital de São Paulo e Grande SP. Confirmamos endereço e tipo de licenciamento no primeiro contato."],
  ["04", "Posso operar sem licenças?", "Não. Operar sem o que a lei pede expõe o negócio a multa, interdição e responsabilização. Regularizar é o que deixa você operar em paz."],
  ["05", "O diagnóstico tem custo?", "Não. A leitura inicial do seu caso é sem custo e sem compromisso. O valor do processo só entra depois que o caminho estiver claro."],
  ["06", "Como começa o atendimento?", "Você deixa nome e WhatsApp. No mesmo dia um especialista lê o caso e aponta o que falta para operar dentro da lei."],
];

function Hero() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const onSubmit = (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const name = String(data.get("nome") || "").trim();
    const digits = digitsOnly(phone);
    if (!name || digits.length < 10) return;
    saveLeadMessage(
      composeLeadMessage(name, phone, "quero um diagnóstico da LiberaAI para regularizar minha empresa.")
    );
    navigate("/obrigado/formulario");
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-[clamp(56px,7vw,88px)]">
      <Wrap className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div className="hero-copy">
          <Eyebrow className="hero-in reveal text-accent-strong">Licenciamento / São Paulo / diagnóstico</Eyebrow>
          <h1 className="display hero-in reveal mt-[18px] text-[clamp(2.75rem,1.8rem+4vw,4.6rem)]">
            Seu negócio legalizado. Seu crescimento sem <em className="beat">limites</em>.
          </h1>
          <p className="lede hero-in reveal mt-[22px] max-w-[36.25rem] text-[17.5px] font-medium leading-[1.65]">
            Regularize sua empresa com quem entende do assunto e tenha mais segurança para operar, crescer e aproveitar novas oportunidades.
          </p>
          <div className="hero-in reveal mt-8 flex flex-wrap gap-4">
            <WaLink text="Olá, quero um orçamento da LiberaAI." className="btn btn-primary">
              <WaIcon />
              Falar no WhatsApp
            </WaLink>
          </div>
        </div>

        <aside id="diagnostico" className="device" aria-label="Diagnóstico e contato">
          <form className="relative z-1 grid gap-3.5" onSubmit={onSubmit}>
            <div className="device-field">
              <label htmlFor="nome">Nome</label>
              <input id="nome" name="nome" type="text" required autoComplete="name" placeholder="Seu nome" />
            </div>
            <div className="device-field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <div className="device-phone">
                <span className="device-phone-cc" aria-hidden="true">+55</span>
                <input
                  id="whatsapp"
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
    </section>
  );
}

export function Home() {
  const [faqOpen, setFaqOpen] = useState(null);
  useMotion();

  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return undefined;
    const id = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <Ambient />
      <Nav />
      <main id="topo" className="relative z-1">
        <Hero />

        <div className="fx-proof relative z-5 -mt-5">
          <Wrap className="grid gap-3 sm:grid-cols-4">
            {[
              [
                "Atendimento",
                "Imediato",
                false,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 3 5.8 13.2h5.4L11 21l7.4-11.4h-5.6z" />
                </svg>,
              ],
              [
                "Parcelamos no",
                "Boleto e cartão",
                false,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <path d="M3 10h18" />
                  <path d="M7 15h3" />
                </svg>,
              ],
              [
                "Há mais de",
                "20 anos na área",
                false,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6z" />
                  <path d="M8.5 12.2l2.2 2.2 4.8-5" />
                </svg>,
              ],
              [
                "Empresas atendidas",
                null,
                true,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="2.6" />
                  <path d="M4.6 17.2c.5-2.4 2.2-3.7 4.4-3.7s3.9 1.3 4.4 3.7" />
                  <circle cx="16.2" cy="8.6" r="2.2" />
                  <path d="M14.4 17.2c.4-1.8 1.6-2.8 3.3-2.8 1.5 0 2.7.8 3.2 2.2" />
                </svg>,
              ],
            ].map(([kicker, title, metric, icon]) => (
              <Box key={kicker} className="reveal flex min-w-0 items-center gap-3 py-5">
                <span className="area-icon shrink-0" aria-hidden="true">{icon}</span>
                {metric ? (
                  <div>
                    <strong className="display m-0 text-[1.55rem] leading-none text-accent">
                      +<span data-count="5000">0</span>
                    </strong>
                    <span className="mono mt-1.5 block text-[11px] tracking-[0.16em] text-ink-2">{kicker}</span>
                  </div>
                ) : (
                  <div>
                    <span className="mono block text-[11px] tracking-[0.16em] text-muted">{kicker}</span>
                    <strong className="display mt-1 m-0 block text-[1.2rem] leading-none">{title}</strong>
                  </div>
                )}
              </Box>
            ))}
          </Wrap>
        </div>

        <div className="band">
          <div className="band-track">
            {[...CLIENTS, ...CLIENTS].map(([name, src], i) => (
              <span key={`${name}-${i}`} className="band-logo">
                <img src={src} alt={name} />
              </span>
            ))}
          </div>
        </div>

        <section id="solucoes" className="fx-steps relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <SectionHead
              eyebrow="Como funciona"
              title={<>Quatro passos. Sem <em className="beat">teatro</em>.</>}
              lede="Você descreve o caso. Nós lemos a documentação, protocolamos e devolvemos a empresa regularizada."
            />
            <div className="steps-rail relative mt-12 grid gap-3.5 lg:grid-cols-4">
              <div className="rail-lights" aria-hidden="true">
                <span className="rail-light" />
                <span className="rail-light" />
                <span className="rail-light" />
              </div>
              {STEPS.map(([n, title, text]) => (
                <Box key={n} className="reveal">
                  <BoxNum>{n}</BoxNum>
                  <h3 className="display m-0 text-[1.15rem] text-ink">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-normal text-muted">{text}</p>
                </Box>
              ))}
            </div>
            <a href="#diagnostico" className="btn btn-primary reveal mt-8">Pedir diagnóstico grátis</a>
          </Wrap>
        </section>

        <section id="servicos" className="fx-services relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <SectionHead
              eyebrow="Serviços"
              title={<>O que colocamos em <em className="beat">funcionamento</em></>}
              lede="Regularização, adequação e pré-vistoria com orientação para o seu ramo de atividade."
            />
            <div className="mt-8 grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map(([n, title, text, items]) => (
                <Box key={n} className="reveal box-compact flex flex-col">
                  <BoxNum>{n}</BoxNum>
                  <h3 className="display m-0 text-[1.02rem] leading-snug">{title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{text}</p>
                  <ul className="mt-2.5 grid list-none gap-1 border-t border-accent/14 pt-2">
                    {items.map((item) => (
                      <li key={item} className="text-[11.5px] text-accent before:mr-1.5 before:inline-block before:size-[4px] before:translate-y-[-1px] before:rounded-full before:bg-accent-mid before:content-['']">{item}</li>
                    ))}
                  </ul>
                  <WaLink text={`Olá, quero o serviço de ${title} com a LiberaAI.`} className="mt-auto pt-2.5 text-[12px] font-semibold text-accent no-underline">
                    Pedir este serviço →
                  </WaLink>
                </Box>
              ))}
            </div>
          </Wrap>
        </section>

        <section className="fx-urgent relative py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <Box as="aside" className="reveal px-8 py-10 sm:px-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <Eyebrow>Urgente</Eyebrow>
                  <h2 className="display mt-4 text-[clamp(2.5rem,1.7rem+3.2vw,4.1rem)] text-ink">
                    Sua empresa recebeu <em className="beat">fiscalização</em>?
                  </h2>
                  <ul className="mt-7 grid list-none gap-3 sm:grid-cols-2 sm:gap-x-8">
                    {["Auto de infração", "Notificação da vigilância", "Exigência da prefeitura", "Renovação vencida", "AVCB vencido"].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[15px] text-ink-2 before:size-1.5 before:shrink-0 before:rounded-full before:bg-[#5eead4] before:content-['']">{item}</li>
                    ))}
                  </ul>
                </div>
                <WaLink text="Olá, recebi fiscalização e preciso de atendimento urgente da LiberaAI." className="btn btn-primary">Falar agora →</WaLink>
              </div>
            </Box>
          </Wrap>
        </section>

        <section className="fx-areas relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <SectionHead
              eyebrow="Áreas"
              title={<>Cada etapa do licenciamento, no mesmo <em className="beat">lugar</em></>}
              lede="Adequamos o estabelecimento às normas de São Paulo: sanitário, bombeiros e alvará de funcionamento."
            />
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {AREAS.map(([n, title, text], i) => (
                <Box as="a" key={n} href="#servicos" className="reveal flex min-h-[220px] cursor-pointer flex-col text-inherit no-underline">
                  <div className="flex items-center justify-between">
                    <span className="area-icon" aria-hidden="true">{AREA_ICONS[i]}</span>
                    <BoxNum sm>{n}</BoxNum>
                  </div>
                  <h3 className="display mt-5 m-0 text-[1.15rem]">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-normal text-muted">{text}</p>
                  <span className="mt-auto pt-[18px] text-[13px] font-semibold text-accent">Saiba mais →</span>
                </Box>
              ))}
            </div>
          </Wrap>
        </section>

        <section className="fx-compare relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <SectionHead
              eyebrow="Por que agora"
              title={<>Regularizar é proteger o <em className="beat">negócio</em>.</>}
              lede="Multa e interdição custam mais que o alvará. Licença em dia abre crédito, contrato e parceria."
            />
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              <Box className="reveal box-off" off>
                <BoxNum>01</BoxNum>
                <h3 className="display m-0 text-[1.2rem] text-ink-2">Multa, interdição, reputação no chão</h3>
                <ul className="mt-3.5 grid list-none gap-2 border-t border-accent/12 pt-3">
                  {["Multas e interdição", "Imagem prejudicada", "Oportunidades perdidas"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-muted"><MarkX />{item}</li>
                  ))}
                </ul>
              </Box>
              <Box className="reveal">
                <BoxNum>02</BoxNum>
                <h3 className="display m-0 text-[1.2rem]">Crédito, parceria e contrato mais fáceis</h3>
                <ul className="mt-3.5 grid list-none gap-2 border-t border-accent/12 pt-3">
                  {["Conformidade legal", "Segurança operacional", "Crédito facilitado"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm"><MarkOk />{item}</li>
                  ))}
                </ul>
              </Box>
            </div>
            <ol className="steps-flow reveal mt-9 flex list-none flex-wrap items-center gap-0 p-0">
              {["Regularização", "Adequação", "Pré-vistoria"].map((item, i) => (
                <li key={item} className="flex items-center gap-2.5 py-2.5 pr-1 text-sm font-medium text-ink-2 not-last:after:mx-3.5 not-last:after:h-px not-last:after:w-9 not-last:after:bg-linear-to-r not-last:after:from-accent-mid not-last:after:to-transparent not-last:after:shadow-[0_0_8px_rgba(45,212,191,0.5)] not-last:after:content-['']">
                  <span className="mono text-accent">0{i + 1}</span> {item}
                </li>
              ))}
            </ol>
          </Wrap>
        </section>

        <section className="fx-types relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <SectionHead
              eyebrow="Alvarás"
              title={<>Qual tipo se aplica ao seu <em className="beat">ponto</em></>}
              lede="Três modalidades comuns. Se não souber a sua, o diagnóstico aponta — sem custo."
            />
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {TYPES.map(([n, title, text], i) => (
                <Box key={n} className="reveal flex min-h-[200px] flex-col">
                  <div className="flex items-center justify-between">
                    <span className="area-icon" aria-hidden="true">{TYPE_ICONS[i]}</span>
                    <BoxNum sm>{n}</BoxNum>
                  </div>
                  <h3 className="display mt-5 m-0 text-[1.15rem]">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-normal text-muted">{text}</p>
                </Box>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <WaLink text="Olá, quero saber qual alvará minha empresa precisa." className="btn btn-primary reveal">Pedir orientação →</WaLink>
              <p className="mono reveal text-muted">Diagnóstico inicial sem custo</p>
            </div>
          </Wrap>
        </section>

        <section id="quem-somos" className="fx-about relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <Eyebrow className="reveal">Quem somos</Eyebrow>
              <h2 className="display reveal mt-3.5 text-[clamp(2.5rem,1.7rem+3.2vw,4.1rem)]">
                Foque no negócio. Nós cuidamos da <em className="beat">papelada</em>.
              </h2>
              <p className="reveal mt-[18px] max-w-[36.25rem] text-[17px] leading-[1.6] text-ink-2">A LiberaAI junta gente de licenciamento com um fluxo de diagnóstico claro. Atendemos qualquer ramo na capital de São Paulo.</p>
              <p className="reveal mt-[18px] max-w-[36.25rem] text-[17px] leading-[1.6] text-ink-2">A missão é simples: o empresário opera. Licença e alvará ficam conosco.</p>
              <p className="mono reveal mt-7 text-accent">São Paulo / diagnóstico / acompanhamento</p>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
              <Box className="reveal flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="area-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6z" />
                      <path d="M8.5 12.2l2.2 2.2 4.8-5" />
                    </svg>
                  </span>
                  <BoxNum sm>01</BoxNum>
                </div>
                <h3 className="display mt-5 m-0 text-[1.15rem]">Com a licença em dia</h3>
                <ul className="mt-3.5 grid list-none gap-2 border-t border-accent/12 pt-3">
                  {["Regularização e conformidade legal", "Segurança para o empreendimento", "Crédito, parceria e contrato mais fáceis", "Acesso a benefícios e incentivos"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-ink-2"><MarkOk />{item}</li>
                  ))}
                </ul>
              </Box>
              <Box className="reveal flex flex-col" off>
                <div className="flex items-center justify-between">
                  <span className="area-icon area-icon-off" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 9v4.2" />
                      <path d="M12 16.6h.01" />
                      <path d="M10.3 4.9 2.8 18.2A2 2 0 0 0 4.5 21h15a2 2 0 0 0 1.7-2.8L13.7 4.9a2 2 0 0 0-3.4 0z" />
                    </svg>
                  </span>
                  <BoxNum sm>02</BoxNum>
                </div>
                <h3 className="display mt-5 m-0 text-[1.15rem]">Operar sem licença</h3>
                <ul className="mt-3.5 grid list-none gap-2 border-t border-coral/18 pt-3">
                  {["Risco de multa e interdição", "Dano à reputação", "Crédito e financiamento mais duros", "Negócio que não fecha"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-ink-2"><MarkX />{item}</li>
                  ))}
                </ul>
              </Box>
            </div>
          </Wrap>
        </section>

        <section id="diferenciais" className="fx-diffs relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <SectionHead
              eyebrow="Diferenciais"
              title={<>Do primeiro protocolo ao <em className="beat">carimbo</em></>}
              lede="Acompanhamento técnico até a licença sair — sem ruído, sem fila invisível."
            />
            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {DIFFS.map(([n, title, text]) => (
                <Box key={n} className="reveal flex flex-col">
                  <BoxNum>{n}</BoxNum>
                  <h3 className="display m-0 text-[1.15rem]">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-normal text-muted">{text}</p>
                </Box>
              ))}
            </div>
          </Wrap>
        </section>

        <section id="contato" className="fx-cta relative py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <div className="reveal relative isolate overflow-hidden rounded-[20px] border border-accent-mid/18 px-[clamp(36px,5vw,56px)] py-[clamp(36px,5vw,56px)] text-center text-on-slate shadow-canvas">
              <PhotoStage src="/img/ai-17.jpg" tone="dark" />
              <div className="relative z-1">
                <Eyebrow className="justify-center text-[#99f6e4] before:bg-[#99f6e4]/70">
                  <span className="live inline-block" /> Especialistas online
                </Eyebrow>
                <h2 className="display mt-4 text-[clamp(2.5rem,1.7rem+3.2vw,4.1rem)] text-[#f4fffb]">Vamos regularizar sua empresa?</h2>
                <p className="mx-auto mt-[18px] max-w-[36.25rem] text-[17px] leading-[1.6] text-on-slate-muted">Um plano claro do que falta para operar dentro da lei. Orçamento sem compromisso.</p>
                <div className="mt-[22px] flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-on-slate-muted">
                  <span>Orçamento gratuito</span>
                  <span>Resposta no mesmo dia</span>
                  <span>Sem compromisso</span>
                </div>
                <div className="mt-7 flex justify-center">
                  <WaLink text="Olá, quero regularizar minha empresa com a LiberaAI." className="btn btn-on-dark">Falar com especialista →</WaLink>
                </div>
                <p className="mono mt-4 text-[#9aa7b8]">WhatsApp · menos de um minuto</p>
              </div>
            </div>
          </Wrap>
        </section>

        <section id="faq" className="fx-faq relative pt-0 pb-[clamp(64px,8vw,104px)]">
          <Wrap className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHead eyebrow="Perguntas" title="O que costumam perguntar" lede="Prazos, documentos e abrangência em São Paulo." />
              <p className="reveal mt-8 max-w-[32ch] text-[16px] leading-[1.6] text-ink-2">Dúvida específica do seu caso?</p>
              <WaLink text="Olá, tenho uma dúvida específica sobre o licenciamento da minha empresa." className="btn btn-primary mt-4">
                <WaIcon />
                Falar com um especialista
              </WaLink>
            </div>
            <div className="faq-list box reveal p-1.5">
              {FAQS.map(([n, q, a], i) => {
                const open = faqOpen === i;
                return (
                  <div key={n} className={`faq-item${open ? " is-open" : ""}`}>
                    <button
                      type="button"
                      aria-expanded={open}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 py-[18px] text-left text-ink"
                      onClick={() => setFaqOpen(open ? null : i)}
                    >
                      <span className="flex items-start gap-3.5 font-display text-[1.08rem] leading-snug font-extrabold">
                        <BoxNum sm>{n}</BoxNum>
                        {q}
                      </span>
                      <span className={`faq-toggle${open ? " is-open" : ""}`} aria-hidden="true" />
                    </button>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-[360px]" : "max-h-0"}`}>
                      <p className="m-0 px-4 pb-5 pl-[3.4rem] text-[15px] leading-[1.65] text-ink-2">{a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
      <ConvertBar />
    </>
  );
}
