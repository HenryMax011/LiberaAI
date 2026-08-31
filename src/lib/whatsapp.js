export const WHATSAPP_NUMBER = "5511933853226";
export const WA_INTENT_KEY = "libera-wa-intent";
export const WA_MESSAGE_KEY = "libera-wa-message";

export const WA_FORM = {
  home: "/whatsapp/?source=LP_HOME",
  alvara: "/whatsapp/?source=LP_ALVARA_FUNCIONAMENTO",
  vigilancia: "/whatsapp/?source=LP_VIGILANCIA_SANITARIA",
};

export function waUrl(text) {
  const clean = stripPhoneFromMessage(text) || "Olá, quero regularizar minha empresa com a LiberaAI.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(clean)}`;
}

export function readIntent() {
  try {
    return sessionStorage.getItem(WA_INTENT_KEY) || "";
  } catch {
    return "";
  }
}

export function composeLeadMessage(name, service) {
  const who = String(name || "").trim() || "cliente";
  const what = String(service || "").trim() || "minha empresa";
  return stripPhoneFromMessage(`Olá, sou ${who}. Quero regularizar ${what} com a LiberaAI.`);
}

function stripPhoneFromMessage(text) {
  return String(text || "")
    .replace(/\s*Meu WhatsApp é[^.]*\./gi, "")
    .replace(/\s*\+55[\s\d().-]{8,}/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

export function saveLeadMessage(text) {
  try {
    sessionStorage.setItem(WA_MESSAGE_KEY, stripPhoneFromMessage(text));
  } catch {
    /* ignore */
  }
}

export function readLeadMessage() {
  try {
    return stripPhoneFromMessage(sessionStorage.getItem(WA_MESSAGE_KEY) || "");
  } catch {
    return "";
  }
}
