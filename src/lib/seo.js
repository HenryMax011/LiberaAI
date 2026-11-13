export const SITE_URL = "https://liberaai.eng.br";
export const SITE_TITLE = "LiberaAI · Alvará e licenças em São Paulo";
export const SITE_DESCRIPTION =
  "LiberaAI regulariza empresas em São Paulo: alvará de funcionamento, vigilância sanitária, AVCB e licenças especiais, com diagnóstico e acompanhamento.";
export const OG_IMAGE = `${SITE_URL}/img/hero-poster.jpg`;

export const FAQS = [
  [
    "Quanto tempo leva para obter as licenças?",
    "O prazo muda com o tipo de licença e o órgão. Em casos elegíveis, o alvará pode sair em até 24 horas. Nos demais, seguimos o calendário da prefeitura, da vigilância ou dos bombeiros, com acompanhamento nosso em cada etapa.",
  ],
  [
    "Quais documentos são necessários?",
    "Em geral: contrato social ou MEI, comprovante do imóvel (IPTU ou locação), planta ou memorial quando exigido, e documentos dos responsáveis. O diagnóstico inicial lista exatamente o que o seu caso pede.",
  ],
  [
    "Vocês atendem em quais regiões?",
    "Capital de São Paulo e Grande SP. Confirmamos endereço e tipo de licenciamento no primeiro contato.",
  ],
  [
    "Posso operar sem licenças?",
    "Operar sem as licenças exigidas pode colocar sua empresa em risco de multas, interdição e outras penalidades. Regularizar é garantir segurança para o seu negócio operar dentro da lei e crescer com tranquilidade.",
  ],
  [
    "O diagnóstico tem custo?",
    "Não. A leitura inicial do seu caso é sem custo e sem compromisso. O valor do processo só entra depois que o caminho estiver claro.",
  ],
  [
    "Como começa o atendimento?",
    "Você deixa nome e WhatsApp. No mesmo dia um especialista lê o caso e aponta o que falta para operar dentro da lei.",
  ],
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: "LiberaAI Engenharia",
  legalName: "LIBERAAI ENGENHARIA LTDA",
  taxID: "68.648.512/0001-00",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.png`,
  image: OG_IMAGE,
  email: "liberaaiengenharia@gmail.com",
  telephone: "+55-11-93385-3226",
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Perucaba, 97",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: [
    { "@type": "City", name: "São Paulo" },
    { "@type": "AdministrativeArea", name: "Grande São Paulo" },
  ],
  sameAs: ["https://wa.me/5511933853226"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+55-11-93385-3226",
    email: "liberaaiengenharia@gmail.com",
    availableLanguage: ["Portuguese"],
  },
};

export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function graphSchema(extra = []) {
  const withoutContext = (item) => {
    const { ["@context"]: _ctx, ...rest } = item;
    return rest;
  };
  return {
    "@context": "https://schema.org",
    "@graph": [withoutContext(organizationSchema), ...extra.map(withoutContext)],
  };
}
