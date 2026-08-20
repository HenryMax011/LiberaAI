import { digitsOnly } from "./phone";

function utmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
  };
}

export async function sendLead({ name, phone, source, services = [] }) {
  const digits = digitsOnly(phone);
  const response = await fetch("/api/leads.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      phone: `55${digits}`,
      source,
      pageUrl: window.location.href,
      services,
      ...utmParams(),
    }),
  });

  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Não foi possível enviar sua solicitação.");
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Não foi possível enviar sua solicitação.");
  }
  return data;
}
