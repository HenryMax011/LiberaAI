export const WHATSAPP_NUMBER = "5511999999999";
export const WA_INTENT_KEY = "libera-wa-intent";
export const WA_MESSAGE_KEY = "libera-wa-message";

export function waUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    text || "Olá, quero regularizar minha empresa com a LiberaAI."
  )}`;
}

export function readIntent() {
  try {
    return sessionStorage.getItem(WA_INTENT_KEY) || "";
  } catch {
    return "";
  }
}

export function composeLeadMessage(name, phone, fallbackAsk) {
  const ask =
    readIntent().replace(/^Olá,?\s*/i, "") ||
    fallbackAsk ||
    "quero regularizar minha empresa com a LiberaAI.";
  return `Olá, sou ${name}. Meu WhatsApp é +55 ${phone}. ${ask.charAt(0).toUpperCase()}${ask.slice(1)}`;
}

export function saveLeadMessage(text) {
  try {
    sessionStorage.setItem(WA_MESSAGE_KEY, text);
  } catch {
    /* ignore */
  }
}

export function readLeadMessage() {
  try {
    return sessionStorage.getItem(WA_MESSAGE_KEY) || "";
  } catch {
    return "";
  }
}
