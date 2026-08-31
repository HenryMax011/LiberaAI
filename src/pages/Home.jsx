import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMotion } from "../hooks/useMotion";
import { Ambient } from "../components/Ambient";
import { ConvertBar } from "../components/ConvertBar";
import { Nav } from "../components/Nav";
import { Footer, WhatsAppFab } from "../components/Footer";
import { Box, BoxNum, Eyebrow, MarkOk, MarkX, PhotoStage, SectionHead, WaIcon, WaLink, Wrap } from "../components/ui";

const CLIENTS = [
  ["Burger King", "/img/clients/burger_king_branca.png"],
  ["Viena", "/img/clients/viena_branca.png"],
  ["Shell", "/img/clients/shell_branca.png"],
  ["Casa do Pão de Queijo", "/img/clients/casa_do_pao_de_queijo_branca.png"],
  ["Extra", "/img/clients/mercado_extra_branca.png"],
  ["Fototica", "/img/clients/fototica_branca.png"],
  ["Itaú", "/img/clients/itau_white_source.png"],
  ["Kopenhagen", "/img/clients/kopenhagen_branca.png"],
  ["Lopes", "/img/clients/lopes_branca.png"],
  ["Bom Prato", "/img/clients/logo_bom_prato_branca.png"],
];

const LANDINGS = {
  home: {
    title: "LiberaAI · alvará e licenças em São Paulo",
    eyebrow: "Licenciamento · São Paulo · Diagnóstico",
    headline: (
      <>
        Regularize sua empresa com quem <em className="beat">entende</em> do assunto.
      </>
    ),
    lede: "Unimos agilidade, tecnologia e inteligência para simplificar processos e regularizar sua empresa com segurança.",
    waText: "Olá, quero um orçamento da LiberaAI.",
    waPath: "/whatsapp/?source=LP_HOME",
    formPath: "/formulario",
  },
  alvara: {
    title: "Alvará de funcionamento · LiberaAI",
    eyebrow: "Especialistas em alvará de funcionamento",
    headline: (
      <>
        Regularize seu Alvará de Funcionamento <em className="beat">agora</em>.
      </>
    ),
    lede: "Cuidamos da análise, documentação e acompanhamento para sua empresa funcionar dentro da lei.",
    waText: "Olá, quero regularizar o alvará de funcionamento com a LiberaAI.",
    waPath: "/whatsapp/?source=LP_ALVARA_FUNCIONAMENTO",
    formPath: "/formulario/alvara-de-funcionamento",
  },
  vigilancia: {
    title: "Vigilância sanitária · LiberaAI",
    eyebrow: "Especialistas em licenciamento sanitário",
    headline: (
      <>
        Licenciamento sanitário com <em className="beat">agilidade</em>.
      </>
    ),
    lede: "Regularizamos seu estabelecimento para operar com tranquilidade e ficar dentro da lei.",
    waText: "Olá, quero o licenciamento sanitário com a LiberaAI.",
    waPath: "/whatsapp/?source=LP_VIGILANCIA_SANITARIA",
    formPath: "/formulario/vigilancia-sanitaria",
  },
};

const SERVICES = [
  ["01", "Alvará de funcionamento", "Obtenção e regularização do alvará em São Paulo, lendo CNAE e imóvel com precisão.", ["MEI, ME e EPP", "Regularização", "Adequação e pré-vistoria"], "/alvara-de-funcionamento"],
  ["02", "Licenciamento sanitário", "Regularização sanitária com acompanhamento técnico na capital.", ["ANVISA", "Secretaria de Saúde", "PGRSS"], "/vigilancia-sanitaria"],
  ["03", "AVCB / CLCB", "AVCB, CLCB e APPCI junto ao Corpo de Bombeiros, com o trâmite organizado.", ["AVCB", "CLCB", "APPCI"]],
  ["04", "CETESB e licenças ambientais", "Licenças de instalação e operação para indústrias em São Paulo.", ["Licença de instalação", "Licença de operação", "SVMA"]],
  ["05", "POP, boas práticas e DCFF", "Documentos para conformidade sanitária do estabelecimento.", ["POP", "Manual de boas práticas", "DCFF"]],
  ["06", "Regularização e pré-vistoria", "Diagnóstico técnico, adequação do ponto e pré-vistoria antes do fiscal.", ["Regularização", "Adequação", "Pré-vistoria"]],
];

const STEPS = [
  ["01", "Você envia os dados", "Envia seu CNPJ ou CPF."],
  ["02", "Consultas públicas", "Levamos suas informações aos órgãos públicos e realizamos uma consulta de viabilidade."],
  ["03", "Acompanhamento", "Acompanhamos até deferimento."],
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

const FAQS = [
  ["01", "Quanto tempo leva para obter as licenças?", "O prazo muda com o tipo de licença e o órgão. Em casos elegíveis, o alvará pode sair em até 24 horas. Nos demais, seguimos o calendário da prefeitura, da vigilância ou dos bombeiros, com acompanhamento nosso em cada etapa."],
  ["02", "Quais documentos são necessários?", "Em geral: contrato social ou MEI, comprovante do imóvel (IPTU ou locação), planta ou memorial quando exigido, e documentos dos responsáveis. O diagnóstico inicial lista exatamente o que o seu caso pede."],
  ["03", "Vocês atendem em quais regiões?", "Capital de São Paulo e Grande SP. Confirmamos endereço e tipo de licenciamento no primeiro contato."],
  ["04", "Posso operar sem licenças?", "Operar sem as licenças exigidas pode colocar sua empresa em risco de multas, interdição e outras penalidades. Regularizar é garantir segurança para o seu negócio operar dentro da lei e crescer com tranquilidade."],
  ["05", "O diagnóstico tem custo?", "Não. A leitura inicial do seu caso é sem custo e sem compromisso. O valor do processo só entra depois que o caminho estiver claro."],
  ["06", "Como começa o atendimento?", "Você deixa nome e WhatsApp. No mesmo dia um especialista lê o caso e aponta o que falta para operar dentro da lei."],
];

const ABOUT_PHOTOS = [
  ["/img/quem-somos-02.jpg", "Fachada da sede da LiberaAI Engenharia"],
  ["/img/quem-somos-00.jpg", "Escritório da LiberaAI Engenharia"],
  ["/img/quem-somos-01.jpg", "Equipe da LiberaAI no escritório"],
  ["/img/quem-somos-03.jpg", "Recepção da LiberaAI Engenharia"],
];

function AboutCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % ABOUT_PHOTOS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused, index]);

  return (
    <figure
      className="about-structure reveal"
      aria-label="Fotos da sede e da equipe da LiberaAI Engenharia"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {ABOUT_PHOTOS.map(([src, alt], i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          className={`about-slide${i === index ? " is-on" : ""}`}
          decoding="async"
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <span className="photo-hud photo-hud-tl" />
      <span className="photo-hud photo-hud-tr" />
      <span className="photo-hud photo-hud-bl" />
      <span className="photo-hud photo-hud-br" />
      <button
        type="button"
        className="about-arrow about-arrow-prev"
        aria-label="Foto anterior"
        onClick={() => setIndex((current) => (current - 1 + ABOUT_PHOTOS.length) % ABOUT_PHOTOS.length)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </button>
      <button
        type="button"
        className="about-arrow about-arrow-next"
        aria-label="Próxima foto"
        onClick={() => setIndex((current) => (current + 1) % ABOUT_PHOTOS.length)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
      <div className="about-dots" role="tablist" aria-label="Fotos">
        {ABOUT_PHOTOS.map(([, alt], i) => (
          <button
            key={alt}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={alt}
            className={i === index ? "is-on" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </figure>
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function Hero({ landing }) {
  const copy = LANDINGS[landing] || LANDINGS.home;
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = muted;
      video.volume = muted ? 0 : volume;
      video.play();
      setPlaying(true);
      return;
    }
    video.pause();
    setPlaying(false);
  };

  const onSeek = (event) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const next = Number(event.target.value);
    video.currentTime = next * video.duration;
    setProgress(next);
  };

  const onVolume = (event) => {
    const video = videoRef.current;
    const next = Number(event.target.value);
    setVolume(next);
    setMuted(next === 0);
    if (!video) return;
    video.volume = next;
    video.muted = next === 0;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (muted || video.volume === 0) {
      const next = volume > 0 ? volume : 0.85;
      video.muted = false;
      video.volume = next;
      setMuted(false);
      setVolume(next);
      return;
    }
    video.muted = true;
    setMuted(true);
  };

  return (
    <section className="hero relative overflow-hidden pt-[6.5rem] pb-[clamp(28px,5vw,56px)] lg:pt-[7.25rem]">
      <Wrap className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:gap-10">
        <div className="hero-copy">
          <p className="hero-kicker hero-in reveal">{copy.eyebrow}</p>
          <h1 className="display hero-in reveal mt-4 text-[clamp(2.15rem,6.4vw,4.35rem)]">
            {copy.headline}
          </h1>
          <p className="lede hero-in reveal mt-5 max-w-[34rem] text-[16.5px] font-medium leading-[1.65]">
            {copy.lede}
          </p>
          <div className="hero-in reveal mt-8 flex flex-wrap gap-3.5">
            <WaLink to={copy.waPath} text={copy.waText} className="btn btn-primary">
              <WaIcon />
              Falar no WhatsApp
            </WaLink>
            <Link to={copy.formPath} className="btn btn-ghost">
              Faça seu orçamento
            </Link>
          </div>
        </div>

        <aside className="hero-media" aria-label="Vídeo LiberaAI">
          <img src="/img/hero-poster.jpg?v=9" alt="" className="hero-media-fallback" />
          <video
            ref={videoRef}
            className="hero-media-video"
            playsInline
            preload="metadata"
            poster="/img/hero-poster.jpg?v=9"
            onClick={togglePlay}
            onTimeUpdate={(event) => {
              const video = event.currentTarget;
              if (!video.duration) return;
              setProgress(video.currentTime / video.duration);
            }}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
            onEnded={() => setPlaying(false)}
          >
            <source src="/video/hero.mp4?v=9" type="video/mp4" />
          </video>
          <div className="hero-media-controls">
            <button type="button" className="hero-ctrl-btn" aria-label={playing ? "Pausar" : "Reproduzir"} onClick={togglePlay}>
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <input
              className="hero-seek"
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              aria-label="Posição do vídeo"
              onChange={onSeek}
            />
            <span className="hero-time">
              {formatTime(progress * duration)} / {formatTime(duration)}
            </span>
            <button type="button" className="hero-ctrl-btn" aria-label={muted || volume === 0 ? "Ativar som" : "Silenciar"} onClick={toggleMute}>
              {muted || volume === 0 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M11 5 6 9H3v6h3l5 4V5z" />
                  <path d="m16 9 5 6M21 9l-5 6" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M11 5 6 9H3v6h3l5 4V5z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" />
                </svg>
              )}
            </button>
            <input
              className="hero-volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={onVolume}
            />
          </div>
        </aside>
      </Wrap>
    </section>
  );
}

export function Home({ landing = "home" }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const copy = LANDINGS[landing] || LANDINGS.home;
  useMotion();

  useEffect(() => {
    document.title = copy.title;
    const { hash } = window.location;
    if (!hash) return undefined;
    const id = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [copy.title]);

  return (
    <>
      <Ambient />
      <Nav />
      <main id="topo" className="relative z-1">
        <Hero landing={landing} />

        <div className="fx-proof relative z-5 mt-2">
          <Wrap className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Atendimento imediato",
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 3 5.8 13.2h5.4L11 21l7.4-11.4h-5.6z" />
                </svg>,
              ],
              [
                "Parcelamos no boleto e cartão",
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <path d="M3 10h18" />
                  <path d="M7 15h3" />
                </svg>,
              ],
              [
                "Há mais de 20 anos na área",
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6z" />
                  <path d="M8.5 12.2l2.2 2.2 4.8-5" />
                </svg>,
              ],
              [
                "+5.000 empresas atendidas",
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="2.6" />
                  <path d="M4.6 17.2c.5-2.4 2.2-3.7 4.4-3.7s3.9 1.3 4.4 3.7" />
                  <circle cx="16.2" cy="8.6" r="2.2" />
                  <path d="M14.4 17.2c.4-1.8 1.6-2.8 3.3-2.8 1.5 0 2.7.8 3.2 2.2" />
                </svg>,
              ],
            ].map(([label, icon]) => (
              <Box key={label} className="reveal flex min-w-0 items-center gap-3">
                <span className="area-icon shrink-0" aria-hidden="true">{icon}</span>
                <strong className="proof-label">{label}</strong>
              </Box>
            ))}
          </Wrap>
        </div>

        <div className="band-wrap relative z-5 mt-10">
          <p className="band-head">Empresas que confiam na Libera AI</p>
          <div className="band">
            <div className="band-track">
            {[...CLIENTS, ...CLIENTS].map(([name, src], i) => (
              <span key={`${name}-${i}`} className="band-logo">
                <img src={src} alt={name} />
              </span>
            ))}
            </div>
          </div>
          <p className="band-more">imagens ilustrativas</p>
        </div>

        <section id="quem-somos" className="fx-about relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap className="grid items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <Eyebrow className="reveal">Quem somos</Eyebrow>
              <h2 className="display reveal mt-3.5 text-[clamp(2.5rem,1.7rem+3.2vw,4.1rem)]">
                Regularização empresarial simples e <em className="beat">inteligente</em>.
              </h2>
              <p className="reveal mt-[18px] max-w-[36.25rem] text-[17px] leading-[1.6] text-white">A LiberaAI Engenharia é especializada em regularização empresarial, alvarás de funcionamento e licenciamentos. Unimos conhecimento técnico, tecnologia e inteligência artificial para tornar processos burocráticos mais simples, rápidos e seguros.</p>
              <p className="reveal mt-[18px] max-w-[36.25rem] text-[17px] leading-[1.6] text-white">Nosso trabalho é conduzir cada etapa com clareza e eficiência, oferecendo soluções personalizadas para que empresas possam operar de forma regular, evitar imprevistos e seguir em frente com tranquilidade.</p>
              <p className="reveal mt-[18px] max-w-[36.25rem] text-[17px] leading-[1.6] text-white">Mais do que cuidar de documentos, ajudamos negócios a destravar projetos, ganhar tempo e transformar burocracia em progresso.</p>
              <p className="reveal mt-[18px] max-w-[36.25rem] text-[17px] font-semibold leading-[1.6] text-white">LiberaAI Engenharia. Tecnologia para simplificar. Segurança para avançar.</p>
            </div>
            <AboutCarousel />
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
              {SERVICES.map(([n, title, text, items, href]) => (
                <Box key={n} className="reveal box-compact flex flex-col">
                  <BoxNum>{n}</BoxNum>
                  <h3 className="display m-0 text-[1.02rem] leading-snug">{title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{text}</p>
                  <ul className="mt-2.5 grid list-none gap-1 border-t border-accent/14 pt-2">
                    {items.map((item) => (
                      <li key={item} className="text-[11.5px] text-accent before:mr-1.5 before:inline-block before:size-[4px] before:translate-y-[-1px] before:rounded-full before:bg-accent-mid before:content-['']">{item}</li>
                    ))}
                  </ul>
                  {href ? (
                    <Link to={href} className="mt-auto pt-2.5 text-[12px] font-semibold text-accent no-underline">
                      Ver esta página →
                    </Link>
                  ) : (
                    <WaLink text={`Olá, quero o serviço de ${title} com a LiberaAI.`} className="mt-auto pt-2.5 text-[12px] font-semibold text-accent no-underline">
                      Pedir este serviço →
                    </WaLink>
                  )}
                </Box>
              ))}
            </div>
          </Wrap>
        </section>

        <section id="solucoes" className="fx-steps relative overflow-hidden py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <SectionHead
              eyebrow="Como funciona"
              title={<>Três passos. Sem <em className="beat">teatro</em>.</>}
              lede="Você descreve o caso. Nós lemos a documentação, protocolamos e devolvemos a empresa regularizada."
            />
            <div className="steps-rail relative mt-12 grid gap-3.5 lg:grid-cols-3">
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
            <Link to="/formulario" className="btn btn-primary reveal mt-8">Pedir diagnóstico grátis</Link>
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
              {["Adequação", "Regularização", "Pré-vistoria"].map((item, i) => (
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

        <section id="contato" className="fx-cta relative py-[clamp(64px,8vw,104px)]">
          <Wrap>
            <div className="cta-depth relative isolate overflow-hidden rounded-[20px] border border-accent-mid/18 px-[clamp(20px,5vw,56px)] py-[clamp(28px,5vw,56px)] text-center text-on-slate shadow-canvas">
              <PhotoStage src="/img/ai-17.jpg" tone="dark" />
              <div className="reveal relative z-1">
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
                  <WaLink text="Olá, quero regularizar minha empresa com a LiberaAI." className="btn btn-on-dark">Falar no WhatsApp</WaLink>
                </div>
                <p className="mono mt-4 text-[#9aa7b8]">(RESPOSTA IMEDIATA)</p>
              </div>
            </div>
          </Wrap>
        </section>

        <section id="faq" className="fx-faq relative pt-0 pb-[clamp(64px,8vw,104px)]">
          <Wrap className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHead eyebrow="Perguntas" title="O que costumam perguntar" lede="Prazos, documentos e abrangência em São Paulo." />
              <p className="reveal mt-8 max-w-[32ch] text-[16px] leading-[1.6] text-white">Dúvida específica do seu caso?</p>
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
      <ConvertBar waPath={copy.waPath} waText={copy.waText} />
    </>
  );
}
