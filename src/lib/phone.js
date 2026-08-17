const MAX_NATIONAL = 11;

export function digitsOnly(value) {
  const raw = String(value || "");
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("55") && d.length >= 12) d = d.slice(2);
  return d.slice(0, MAX_NATIONAL);
}

export function maskPhone(value) {
  const d = digitsOnly(value);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatPhoneIntl(value) {
  const d = digitsOnly(value);
  return d ? `+55 ${maskPhone(d)}`.trim() : "";
}
