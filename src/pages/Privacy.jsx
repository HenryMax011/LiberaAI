import { Link } from "react-router-dom";
import { Brand, Eyebrow, Wrap } from "../components/ui";

const SECTIONS = [
  ["1. Quem somos", "A LiberaAI oferece regularização empresarial: alvará de funcionamento, licenciamento sanitário, AVCB/CLCB e licenças correlatas na cidade de São Paulo e Grande SP."],
  ["2. Dados que coletamos", "Nome, telefone/WhatsApp e, quando enviados, dados da empresa e documentos do licenciamento. Também podemos registrar páginas visitadas e tipo de dispositivo."],
  ["3. Finalidade", "Atendimento comercial, diagnóstico do caso, protocolo junto a órgãos públicos, comunicação via WhatsApp e melhoria do site. Não vendemos seus dados."],
  ["4. Base legal", "Consentimento (formulários), execução de contrato ou procedimentos preliminares e obrigação legal, conforme a LGPD (Lei 13.709/2018)."],
  ["5. Compartilhamento", "Somente o necessário com órgãos públicos e prestadores da operação, com confidencialidade."],
  ["6. Seus direitos", "Acesso, correção, portabilidade, anonimização ou exclusão, e revogação do consentimento: contato@liberaai.com.br."],
];

export function Privacy() {
  const year = new Date().getFullYear();

  return (
    <>
      <header className="fixed top-3 right-0 left-0 z-50">
        <nav className="site-nav">
          <Brand to="/" />
          <Link to="/" className="site-nav-back">
            Voltar ao site
          </Link>
        </nav>
      </header>
      <main className="relative z-1 pt-[120px] pb-[clamp(64px,8vw,104px)]">
        <Wrap as="article" className="max-w-[40rem]">
          <Eyebrow>Documento</Eyebrow>
          <h1 className="display mt-3 text-[clamp(2.5rem,1.7rem+3.2vw,4.1rem)]">Política de privacidade</h1>
          <p className="mono mt-3 text-muted">Atualizado em 14 de agosto de 2026</p>
          <div className="mt-10 grid max-w-none gap-7 text-[17px] leading-[1.6] text-muted">
            {SECTIONS.map(([title, body]) => (
              <section key={title}>
                <h2 className="display mb-2 text-[clamp(1.25rem,1.15rem+0.5vw,1.45rem)] text-ink">{title}</h2>
                <p className="m-0">{body}</p>
              </section>
            ))}
          </div>
        </Wrap>
      </main>
      <footer className="relative bg-slate py-0 text-on-slate-muted">
        <Wrap className="border-t border-edge-dark py-[18px] text-center text-xs">
          <p className="mono">© {year} LiberaAI / todos os direitos reservados</p>
        </Wrap>
      </footer>
    </>
  );
}
