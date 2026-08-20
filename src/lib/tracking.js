export function trackGenerateLead({ source, channel = "formulario" } = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "generate_lead",
    lead_source: source || "",
    lead_channel: channel,
    page_path: window.location.pathname + window.location.search,
    page_url: window.location.href,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      lead_source: source || "",
      lead_channel: channel,
    });
  }
}

/**
 * Recarrega a página de obrigado (full load).
 * Assim o GTM dispara Page View como no F5 — o navigate do React não dispara.
 */
export function goToThanks(path, delayMs = 400) {
  window.setTimeout(() => {
    window.location.assign(path);
  }, delayMs);
}
