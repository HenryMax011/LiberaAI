import { useEffect, useState } from "react";
import { WaIcon, WaLink } from "./ui";

export function ConvertBar() {
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
        <strong>Diagnóstico sem custo</strong>
        <span>Resposta no mesmo dia</span>
      </p>
      <WaLink text="Olá, quero um diagnóstico da LiberaAI para regularizar minha empresa." className="btn btn-primary">
        <WaIcon />
        Falar no WhatsApp
      </WaLink>
    </div>
  );
}
