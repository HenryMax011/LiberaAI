import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Brand, Eyebrow, Wrap } from "../components/ui";

const BLOCKS = [
  { type: "lede", text: "Proteção e tratamento de dados pessoais" },
  {
    type: "p",
    text: "A Libera AI valoriza a privacidade e a proteção dos dados pessoais de seus clientes, usuários, visitantes e demais pessoas que interagem com seus canais digitais.",
  },
  {
    type: "p",
    text: "Esta política de privacidade tem como objetivo explicar, de forma clara e transparente, quais dados pessoais podem ser coletados, como são utilizados, com quem podem ser compartilhados, por quanto tempo são armazenados e quais são os direitos dos titulares, nos termos da Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD) e demais normas aplicáveis.",
  },

  { type: "h2", text: "1. Quem somos" },
  {
    type: "p",
    text: "A Libera AI atua na área de regularização e licenciamento empresarial, utilizando tecnologia e inteligência artificial para tornar processos de regularização mais ágeis, organizados e eficientes.",
  },
  {
    type: "p",
    text: "Entre os serviços prestados pela Libera AI estão atividades relacionadas à regularização empresarial, obtenção e acompanhamento de licenças, alvarás, documentos e demais procedimentos necessários ao funcionamento regular de empresas, de acordo com as necessidades de cada cliente.",
  },
  { type: "h3", text: "Controlador dos dados pessoais" },
  {
    type: "dl",
    rows: [
      ["Razão social", "LIBERAAI ENGENHARIA LTDA"],
      ["Nome fantasia", "LIBERA AI ENGENHARIA LTDA"],
      ["CNPJ", "68.648.512/0001-00"],
      ["Endereço", "Rua Perucaba, 97"],
      ["E-mail", "liberaaiengenharia@gmail.com"],
      ["Site", "https://liberaai.eng.br/"],
    ],
  },
  {
    type: "p",
    text: "Para os fins da LGPD, a empresa acima identificada atua como controladora dos dados pessoais tratados nas operações sob sua responsabilidade.",
  },

  { type: "h2", text: "2. Quais dados pessoais podemos coletar" },
  {
    type: "p",
    text: "A Libera AI procura coletar somente os dados pessoais necessários para o cumprimento das finalidades descritas nesta política.",
  },
  { type: "p", text: "Dependendo da forma como você interage conosco, podemos coletar:" },
  { type: "h3", text: "Dados de identificação e contato" },
  {
    type: "ul",
    items: ["Nome completo", "E-mail", "Número de telefone", "Número de WhatsApp", "Nome da empresa", "Cargo ou função, quando informado"],
  },
  { type: "h3", text: "Dados empresariais" },
  { type: "p", text: "Quando necessários para a prestação dos serviços:" },
  {
    type: "ul",
    items: [
      "Razão social",
      "Nome fantasia",
      "CNPJ",
      "Endereço da empresa",
      "Informações relacionadas à atividade empresarial",
      "Dados e documentos necessários à regularização ou licenciamento",
    ],
  },
  { type: "h3", text: "Dados fornecidos durante o atendimento" },
  { type: "p", text: "Podemos tratar informações fornecidas voluntariamente durante:" },
  {
    type: "ul",
    items: [
      "Solicitação de orçamento",
      "Atendimento",
      "Contratação dos serviços",
      "Comunicação por WhatsApp",
      "Comunicação por e-mail",
      "Envio de documentos",
      "Acompanhamento de processos",
    ],
  },
  { type: "h3", text: "Dados de navegação" },
  { type: "p", text: "Quando você acessa nosso site, determinadas informações técnicas poderão ser coletadas, como:" },
  {
    type: "ul",
    items: [
      "Endereço IP",
      "Tipo de dispositivo",
      "Sistema operacional",
      "Tipo e versão do navegador",
      "Data e horário de acesso",
      "Páginas acessadas",
      "Informações sobre navegação",
      "Origem do acesso",
      "Dados relacionados a cookies e tecnologias semelhantes",
    ],
  },
  { type: "h3", text: "Dados de campanhas" },
  {
    type: "p",
    text: "Quando aplicável, poderemos tratar informações relacionadas à origem de campanhas de marketing e publicidade, como parâmetros de rastreamento, identificadores de campanha e informações de conversão.",
  },

  { type: "h2", text: "3. Como coletamos seus dados" },
  { type: "p", text: "Os dados pessoais podem ser obtidos por diferentes meios, incluindo:" },
  {
    type: "ul",
    items: [
      "Formulários disponíveis em nosso site",
      "Formulários de solicitação de orçamento",
      "WhatsApp",
      "E-mail",
      "Atendimento realizado por nossos colaboradores",
      "Contratação dos serviços",
      "Envio voluntário de documentos",
      "Campanhas de publicidade",
      "Cookies e tecnologias semelhantes",
      "Informações fornecidas diretamente pelo titular ou por representante autorizado",
    ],
  },
  {
    type: "p",
    text: "Também poderemos receber informações de terceiros quando isso for necessário para executar um serviço solicitado ou contratado pelo cliente, sempre observando a legislação aplicável.",
  },

  { type: "h2", text: "4. Para que utilizamos seus dados" },
  { type: "p", text: "Os dados pessoais poderão ser tratados para as seguintes finalidades:" },
  {
    type: "ul",
    items: [
      "Responder solicitações e dúvidas",
      "Realizar atendimento",
      "Entrar em contato com interessados",
      "Elaborar e enviar propostas comerciais",
      "Realizar orçamentos",
      "Formalizar e executar contratos",
      "Prestar os serviços contratados",
      "Executar processos de regularização empresarial",
      "Encaminhar documentos e informações aos órgãos competentes",
      "Acompanhar processos administrativos",
      "Informar o cliente sobre o andamento dos serviços",
      "Solicitar documentos necessários à execução dos serviços",
      "Manter histórico de atendimento",
      "Melhorar nossos serviços e processos",
      "Melhorar a experiência de navegação",
      "Analisar o desempenho do site",
      "Mensurar campanhas de publicidade e marketing, quando aplicável",
      "Prevenir fraudes e incidentes de segurança",
      "Cumprir obrigações legais e regulatórias",
      "Exercer direitos em processos administrativos, judiciais ou arbitrais",
      "Atender solicitações de autoridades públicas competentes",
    ],
  },
  {
    type: "p",
    text: "O tratamento dos dados será realizado de acordo com uma das bases legais previstas na LGPD, conforme a finalidade e as circunstâncias de cada tratamento.",
  },

  { type: "h2", text: "5. Bases legais para o tratamento" },
  {
    type: "p",
    text: "Dependendo da finalidade, a Libera AI poderá realizar o tratamento de dados pessoais com fundamento, entre outras hipóteses previstas na LGPD, em:",
  },
  {
    type: "ul",
    items: [
      "Consentimento do titular",
      "Cumprimento de obrigação legal ou regulatória",
      "Execução de contrato ou de procedimentos preliminares relacionados a contrato",
      "Exercício regular de direitos",
      "Proteção do crédito, quando aplicável",
      "Legítimo interesse, quando presentes os requisitos legais",
      "Outras hipóteses previstas na legislação aplicável",
    ],
  },
  {
    type: "p",
    text: "Quando o tratamento depender de consentimento, o titular poderá revogá-lo, observadas as consequências e limitações previstas na legislação.",
  },
  {
    type: "p",
    text: "A revogação do consentimento não prejudica a legalidade dos tratamentos realizados anteriormente com base no consentimento validamente fornecido.",
  },

  { type: "h2", text: "6. Compartilhamento de dados pessoais" },
  { type: "p", text: "A Libera AI não vende dados pessoais." },
  {
    type: "p",
    text: "Os dados poderão ser compartilhados quando necessário para cumprir as finalidades descritas nesta política, para executar serviços contratados ou para atender obrigações legais.",
  },
  { type: "p", text: "Isso poderá incluir o compartilhamento com:" },
  { type: "h3", text: "Órgãos públicos" },
  {
    type: "p",
    text: "Quando necessário à execução dos serviços de regularização empresarial, os dados poderão ser encaminhados a órgãos e entidades competentes, incluindo, conforme o caso:",
  },
  {
    type: "ul",
    items: [
      "Prefeituras",
      "Órgãos municipais",
      "Corpo de Bombeiros",
      "Vigilância sanitária",
      "Órgãos estaduais",
      "Órgãos federais",
      "Demais entidades públicas responsáveis pela análise ou emissão de documentos e licenças",
    ],
  },
  { type: "h3", text: "Prestadores de serviços" },
  { type: "p", text: "Poderemos utilizar fornecedores e parceiros que auxiliem a Libera AI em atividades como:" },
  {
    type: "ul",
    items: [
      "Hospedagem",
      "Armazenamento",
      "Atendimento",
      "Comunicação",
      "CRM",
      "Automação",
      "Tecnologia",
      "Análise de dados",
      "Marketing",
      "Publicidade",
      "Segurança da informação",
    ],
  },
  {
    type: "p",
    text: "Esses fornecedores poderão tratar dados pessoais somente na medida necessária para a prestação dos serviços contratados e de acordo com as instruções e responsabilidades aplicáveis.",
  },
  { type: "h3", text: "Autoridades" },
  { type: "p", text: "Os dados também poderão ser compartilhados quando houver:" },
  {
    type: "ul",
    items: ["Obrigação legal", "Ordem judicial", "Requisição de autoridade competente", "Necessidade de exercício regular de direitos"],
  },

  { type: "h2", text: "7. Uso de inteligência artificial" },
  {
    type: "p",
    text: "A Libera AI utiliza recursos tecnológicos e ferramentas de inteligência artificial para apoiar a automação, organização e otimização de atividades relacionadas aos seus serviços e atendimento.",
  },
  { type: "p", text: "A inteligência artificial poderá ser utilizada, conforme o contexto, para atividades como:" },
  {
    type: "ul",
    items: [
      "Organização de informações",
      "Automação de tarefas",
      "Apoio ao atendimento",
      "Classificação e organização de solicitações",
      "Otimização de processos",
      "Apoio operacional",
      "Geração ou tratamento de informações",
      "Melhoria da eficiência dos processos internos",
    ],
  },
  {
    type: "p",
    text: "A utilização de inteligência artificial não significa que decisões sejam necessariamente tomadas de forma exclusivamente automatizada.",
  },
  {
    type: "p",
    text: "Quando aplicável, a Libera AI poderá realizar análise humana das informações, especialmente em situações que envolvam prestação de serviços, documentação, regularização empresarial ou exercício de direitos.",
  },
  {
    type: "p",
    text: "A Libera AI buscará não utilizar dados pessoais para finalidades incompatíveis com aquelas informadas ao titular.",
  },
  {
    type: "p",
    text: "Quando forem utilizados fornecedores externos de tecnologia ou inteligência artificial, o tratamento de dados estará sujeito às condições aplicáveis a esses fornecedores e às medidas de segurança pertinentes.",
  },

  { type: "h2", text: "8. Armazenamento e segurança" },
  { type: "p", text: "A Libera AI adota medidas técnicas e administrativas destinadas a proteger os dados pessoais contra:" },
  {
    type: "ul",
    items: [
      "Acessos não autorizados",
      "Perda",
      "Destruição",
      "Alteração indevida",
      "Divulgação não autorizada",
      "Uso inadequado",
      "Incidentes de segurança",
    ],
  },
  {
    type: "p",
    text: "Entre as medidas adotadas, conforme aplicável à infraestrutura utilizada pela empresa, podem estar:",
  },
  {
    type: "ul",
    items: [
      "Controle de acesso",
      "Autenticação de usuários",
      "Restrição de acesso a informações",
      "Utilização de sistemas protegidos",
      "Proteção durante a transmissão de informações",
      "Procedimentos internos de segurança",
      "Monitoramento dos sistemas",
      "Gestão de permissões",
    ],
  },
  {
    type: "p",
    text: "O acesso aos dados pessoais será limitado às pessoas que necessitem dessas informações para desempenhar suas funções.",
  },
  {
    type: "p",
    text: "Embora sejam adotadas medidas de segurança, nenhum sistema eletrônico é totalmente imune a riscos. Por isso, a Libera AI busca continuamente aprimorar seus mecanismos de segurança e proteção de dados.",
  },

  { type: "h2", text: "9. Onde os dados são armazenados" },
  {
    type: "p",
    text: "Os dados pessoais poderão ser armazenados em servidores, sistemas e plataformas tecnológicas utilizadas pela Libera AI ou por fornecedores contratados.",
  },
  {
    type: "p",
    text: "Dependendo das ferramentas utilizadas, determinados dados poderão ser armazenados ou processados fora do Brasil.",
  },
  {
    type: "p",
    text: "Quando houver transferência internacional de dados pessoais, a Libera AI buscará observar os requisitos e mecanismos previstos na LGPD e nas regulamentações aplicáveis.",
  },

  { type: "h2", text: "10. Por quanto tempo mantemos os dados" },
  {
    type: "p",
    text: "Os dados pessoais serão mantidos pelo período necessário para cumprir as finalidades para as quais foram coletados.",
  },
  { type: "p", text: "Após o encerramento da relação com o titular, determinados dados poderão ser conservados quando necessário para:" },
  {
    type: "ul",
    items: [
      "Cumprimento de obrigação legal ou regulatória",
      "Exercício regular de direitos",
      "Cumprimento de obrigações contratuais",
      "Prevenção de fraudes",
      "Segurança",
      "Atendimento a autoridades competentes",
    ],
  },
  {
    type: "p",
    text: "Quando não houver mais finalidade ou obrigação legal que justifique a conservação, os dados poderão ser eliminados, anonimizados ou submetidos a outra forma de tratamento permitida pela legislação.",
  },

  { type: "h2", text: "11. Direitos dos titulares" },
  {
    type: "p",
    text: "Nos termos da LGPD, o titular poderá exercer os direitos previstos na legislação aplicável, incluindo:",
  },
  {
    type: "ul",
    items: [
      "Confirmar a existência de tratamento de seus dados pessoais",
      "Solicitar acesso aos dados pessoais tratados",
      "Solicitar a correção de dados incompletos, inexatos ou desatualizados",
      "Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade",
      "Solicitar informações sobre o compartilhamento de seus dados",
      "Solicitar a portabilidade dos dados, observados os requisitos legais",
      "Solicitar a eliminação dos dados tratados com base no consentimento, ressalvadas as hipóteses legais de conservação",
      "Revogar o consentimento, quando essa for a base legal utilizada",
      "Solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado, quando aplicável",
      "Obter informações sobre os critérios utilizados em decisões automatizadas, nos limites da legislação",
      "Exercer outros direitos assegurados pela LGPD",
    ],
  },
  {
    type: "p",
    text: "O exercício desses direitos poderá estar sujeito às condições, limitações e exceções previstas na legislação.",
  },

  { type: "h2", text: "12. Como exercer seus direitos" },
  {
    type: "p",
    text: "Para solicitar acesso, correção, eliminação, confirmação de tratamento ou exercer qualquer outro direito relacionado aos seus dados pessoais, entre em contato através do canal abaixo.",
  },
  { type: "h3", text: "Canal de privacidade / LGPD" },
  {
    type: "p",
    text: "E-mail: liberaaiprivacidade@gmail.com. Assunto sugerido: solicitação LGPD.",
  },
  {
    type: "p",
    text: "Para proteger os dados pessoais e evitar solicitações fraudulentas, poderemos solicitar informações razoáveis para confirmar a identidade do solicitante antes de atender determinadas solicitações.",
  },
  {
    type: "p",
    text: "As solicitações serão analisadas e respondidas dentro dos prazos e condições estabelecidos pela legislação aplicável.",
  },

  { type: "h2", text: "13. Encarregado pelo tratamento de dados pessoais" },
  {
    type: "p",
    text: "A Libera AI disponibiliza um canal para assuntos relacionados à proteção de dados pessoais e ao exercício dos direitos previstos na LGPD.",
  },
  { type: "p", text: "E-mail: liberaaiprivacidade@gmail.com." },
  {
    type: "p",
    text: "Caso a empresa adote outra estrutura legalmente aplicável para o atendimento das solicitações de titulares, as informações de contato correspondentes serão disponibilizadas nesta seção.",
  },

  { type: "h2", text: "14. Cookies e tecnologias semelhantes" },
  {
    type: "p",
    text: "A Libera AI poderá utilizar cookies e tecnologias semelhantes para permitir o funcionamento adequado do site, compreender como os visitantes utilizam nossas páginas e, quando autorizado, mensurar campanhas de publicidade e marketing.",
  },
  { type: "p", text: "Os cookies podem ser classificados, conforme sua finalidade, em:" },
  { type: "h3", text: "Cookies necessários" },
  {
    type: "p",
    text: "São utilizados para permitir o funcionamento básico e seguro do site. Quando estritamente necessários, esses cookies poderão ser utilizados independentemente de consentimento, conforme a base legal aplicável.",
  },
  { type: "h3", text: "Cookies de funcionalidade" },
  {
    type: "p",
    text: "Podem ser utilizados para armazenar preferências e melhorar determinadas funcionalidades do site.",
  },
  { type: "h3", text: "Cookies analíticos ou de desempenho" },
  {
    type: "p",
    text: "Podem ser utilizados para compreender como os visitantes utilizam o site, identificar páginas mais acessadas, analisar desempenho e identificar possíveis erros.",
  },
  { type: "h3", text: "Cookies de publicidade e marketing" },
  {
    type: "p",
    text: "Quando utilizados, podem permitir a mensuração de campanhas, identificação de origem de acessos e outras atividades relacionadas à publicidade.",
  },
  {
    type: "p",
    text: "Cookies não necessários que dependam de consentimento deverão permanecer desativados até que o titular manifeste sua escolha.",
  },
  {
    type: "p",
    text: "A Libera AI disponibilizará mecanismos adequados para que o usuário possa aceitar, recusar ou gerenciar cookies não necessários, quando aplicável.",
  },
  {
    type: "p",
    text: "A utilização de cookies deverá ser apresentada de maneira clara, permitindo ao usuário tomar uma decisão informada.",
  },
  {
    type: "p",
    text: "A ANPD orienta que o titular tenha uma possibilidade efetiva de aceitar ou recusar cookies não necessários, sem ser obrigado a aceitar integralmente seu uso.",
  },
  {
    type: "p",
    text: "Para informações detalhadas sobre os cookies utilizados, suas finalidades, duração, fornecedores e formas de gerenciamento, consulte a seção política de cookies abaixo.",
  },

  { type: "h2", text: "15. Política de cookies" },
  {
    type: "p",
    text: "A política de cookies da Libera AI apresenta, de forma específica e atualizada:",
  },
  {
    type: "ul",
    items: [
      "Nome do cookie",
      "Finalidade",
      "Categoria",
      "Origem",
      "Prazo de armazenamento",
      "Se é próprio ou de terceiro",
      "Base legal aplicável, quando pertinente",
      "Forma de gerenciamento ou recusa",
    ],
  },
  {
    type: "p",
    text: "A política deverá ser atualizada sempre que houver alteração relevante nos cookies ou tecnologias utilizadas no site.",
  },
  {
    type: "p",
    text: "A ANPD recomenda transparência sobre finalidades específicas, período de retenção e eventual compartilhamento com terceiros.",
  },

  { type: "h2", text: "16. Links para sites de terceiros" },
  {
    type: "p",
    text: "Nosso site poderá conter links para sites, plataformas ou serviços de terceiros.",
  },
  {
    type: "p",
    text: "A Libera AI não controla as políticas de privacidade, práticas de segurança ou conteúdo desses terceiros.",
  },
  {
    type: "p",
    text: "Ao acessar serviços externos, recomendamos que o usuário consulte as respectivas políticas de privacidade e termos de uso.",
  },

  { type: "h2", text: "17. Comunicações e marketing" },
  { type: "p", text: "A Libera AI poderá utilizar os dados de contato para realizar comunicações relacionadas a:" },
  {
    type: "ul",
    items: [
      "Solicitações feitas pelo usuário",
      "Orçamentos",
      "Contratos",
      "Serviços contratados",
      "Andamento de processos",
      "Informações operacionais",
    ],
  },
  {
    type: "p",
    text: "Quando houver tratamento para marketing e publicidade, a Libera AI observará a legislação aplicável e disponibilizará mecanismos adequados para que o titular possa se opor ou cancelar comunicações de marketing quando cabível.",
  },
  {
    type: "p",
    text: "O cancelamento de comunicações de marketing não impedirá o envio de comunicações necessárias relacionadas a contratos, serviços ou obrigações existentes.",
  },

  { type: "h2", text: "18. Dados de crianças e adolescentes" },
  {
    type: "p",
    text: "Os serviços da Libera AI são destinados principalmente a empresas, empresários e pessoas responsáveis pela contratação de serviços empresariais.",
  },
  {
    type: "p",
    text: "Não buscamos coletar intencionalmente dados pessoais de crianças por meio de nossos canais de atendimento.",
  },
  {
    type: "p",
    text: "Caso seja identificado tratamento de dados de crianças ou adolescentes, a Libera AI adotará as medidas necessárias de acordo com a legislação aplicável e considerando o melhor interesse desses titulares.",
  },

  { type: "h2", text: "19. Dados pessoais sensíveis" },
  {
    type: "p",
    text: "A Libera AI não solicita, como regra geral, dados pessoais sensíveis para a utilização regular de seus canais digitais.",
  },
  {
    type: "p",
    text: "Caso seja necessário tratar algum dado pessoal sensível para determinada finalidade legítima, o tratamento será realizado de acordo com as hipóteses legais aplicáveis e com medidas de proteção adequadas.",
  },
  {
    type: "p",
    text: "O usuário deve evitar fornecer dados pessoais sensíveis quando eles não forem necessários para a prestação do serviço solicitado.",
  },

  { type: "h2", text: "20. Incidentes de segurança" },
  {
    type: "p",
    text: "Caso ocorra um incidente de segurança envolvendo dados pessoais e seja constatado que o incidente pode acarretar risco ou dano relevante aos titulares, a Libera AI adotará as providências cabíveis de acordo com a legislação e regulamentação aplicáveis.",
  },
  {
    type: "p",
    text: "Isso poderá incluir medidas de contenção, investigação, mitigação e comunicação às autoridades e aos titulares, quando exigido.",
  },

  { type: "h2", text: "21. Alterações desta política" },
  { type: "p", text: "Esta política de privacidade poderá ser atualizada periodicamente para refletir:" },
  {
    type: "ul",
    items: [
      "Alterações nos serviços da Libera AI",
      "Alterações nos sistemas utilizados",
      "Novas tecnologias",
      "Mudanças na legislação",
      "Orientações ou regulamentações da ANPD",
      "Alterações nas práticas de tratamento de dados",
    ],
  },
  { type: "p", text: "A versão mais recente estará sempre disponível em nossos canais oficiais." },
  { type: "p", text: "A data da última atualização será indicada no início desta política." },

  { type: "h2", text: "22. Contato" },
  {
    type: "p",
    text: "Em caso de dúvidas sobre esta política de privacidade, sobre o tratamento de dados pessoais ou sobre o exercício de direitos previstos na LGPD, entre em contato conosco.",
  },
  {
    type: "dl",
    rows: [
      ["Empresa", "Libera AI"],
      ["Site", "https://liberaai.eng.br/"],
      ["E-mail", "liberaaiengenharia@gmail.com"],
      ["WhatsApp", "Disponível no site"],
      ["Endereço", "Rua Perucaba, 97"],
      ["Canal de privacidade / LGPD", "liberaaiprivacidade@gmail.com"],
    ],
  },
  {
    type: "p",
    text: "Esta política de privacidade foi elaborada considerando a Lei nº 13.709/2018 (LGPD), as orientações públicas da Autoridade Nacional de Proteção de Dados (ANPD) e as características das atividades da Libera AI.",
  },
];

function Block({ block }) {
  if (block.type === "lede") {
    return <p className="mt-5 text-[17px] font-medium leading-[1.6] text-ink">{block.text}</p>;
  }
  if (block.type === "h2") {
    return <h2 className="display mb-3 mt-10 text-[clamp(1.25rem,1.15rem+0.5vw,1.45rem)] text-ink">{block.text}</h2>;
  }
  if (block.type === "h3") {
    return <h3 className="mono mb-2 mt-6 text-[12px] tracking-[0.14em] text-accent">{block.text}</h3>;
  }
  if (block.type === "ul") {
    return (
      <ul className="m-0 grid list-disc gap-1.5 pl-5">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "dl") {
    return (
      <dl className="m-0 grid gap-2">
        {block.rows.map(([k, v]) => (
          <div key={k} className="grid gap-0.5 sm:grid-cols-[10.5rem_1fr] sm:gap-3">
            <dt className="mono text-[11px] tracking-[0.12em] text-accent">{k}</dt>
            <dd className="m-0 text-ink-2">{v}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return <p className="m-0">{block.text}</p>;
}

export function Privacy() {
  const year = new Date().getFullYear();

  useEffect(() => {
    document.title = "Política de privacidade · LiberaAI";
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="site-nav">
          <Brand to="/" />
          <Link to="/" className="site-nav-back">
            Voltar ao site
          </Link>
        </nav>
      </header>
      <main className="relative z-1 pt-[7.25rem] pb-[clamp(64px,8vw,104px)] lg:pt-[8.75rem]">
        <Wrap as="article" className="max-w-[42rem]">
          <Eyebrow>Documento</Eyebrow>
          <h1 className="display mt-3 text-[clamp(2.5rem,1.7rem+3.2vw,4.1rem)]">Política de privacidade</h1>
          <p className="mono mt-3 text-muted">Última atualização: 19 de agosto de 2026</p>
          <div className="mt-6 grid max-w-none gap-4 text-[16px] leading-[1.65] text-muted">
            {BLOCKS.map((block, i) => (
              <Block key={`${block.type}-${i}`} block={block} />
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
