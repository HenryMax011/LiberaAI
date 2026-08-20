import { useEffect, useState } from "react";
import { WaIcon, WaLink } from "./ui";

export function ConvertBar({
  waPath = "/whatsapp/?source=LP_HOME",
  waText = "Olá, quero um diagnóstico da LiberaAI para regularizar minha empresa.",
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`convert-bar ${on ? "is-on" : ""}`} role="region" aria-label="Contato rápido">
      <p>
        <strong>Regularize sua empresa</strong>
        <span>Resposta imediata</span>
      </p>
      <WaLink to={waPath} text={waText} className="btn btn-wa">
        <WaIcon />
        Falar no WhatsApp
      </WaLink>
    </div>
  );
}
