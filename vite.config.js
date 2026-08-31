import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = dirname(fileURLToPath(import.meta.url));

function loadPublicEnv() {
  const file = join(root, "public", ".env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadPublicEnv();

function leadPagePath(pageUrl) {
  try {
    return new URL(String(pageUrl || "")).pathname || String(pageUrl || "");
  } catch {
    return String(pageUrl || "");
  }
}

function forwardLeadToApi(payload) {
  const url = process.env.LEADS_API_URL;
  const token = process.env.LEADS_API_TOKEN;
  if (!url || !token) return;
  const services = Array.isArray(payload.services) ? payload.services.filter(Boolean) : [];
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nome: String(payload.name || ""),
      email: String(payload.email || ""),
      telefone: String(payload.phone || "").replace(/\D/g, ""),
      mensagem: services.join(", "),
      origem: "site-institucional",
      empresa: "LIBERA_AI",
      pagina: String(payload.pageUrl || leadPagePath(payload.pageUrl)),
      website: "",
    }),
  }).catch(() => {
    /* ouvinte adicional — não bloqueia o envio atual */
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=UTF-8");
  res.end(JSON.stringify(data));
}

function leadsDevPlugin() {
  return {
    name: "leads-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] || "";
        if (req.method !== "POST" || (url !== "/api/leads" && url !== "/api/leads.php")) {
          next();
          return;
        }

        try {
          const payload = JSON.parse((await readBody(req)) || "{}");
          const name = String(payload.name || "").trim();
          const phone = String(payload.phone || "").replace(/\D/g, "");
          if (name.length < 3) {
            json(res, 400, { success: false, message: "Nome é obrigatório e deve ter no mínimo 3 caracteres." });
            return;
          }
          if (phone.length < 10) {
            json(res, 400, { success: false, message: "Telefone é obrigatório e deve ter no mínimo 10 dígitos." });
            return;
          }

          const dir = join(root, "public", "content", "leads");
          mkdirSync(dir, { recursive: true });
          const file = join(dir, `${Date.now()}-${phone.slice(-4)}.json`);
          writeFileSync(
            file,
            JSON.stringify({ lead: payload, meta: { receivedAt: new Date().toISOString(), env: "vite-dev" } }, null, 2)
          );
          json(res, 200, { success: true, message: "Lead recebido com sucesso." });
          forwardLeadToApi(payload);
        } catch {
          json(res, 400, { success: false, message: "Não foi possível enviar sua solicitação." });
        }
      });
    },
  };
}

function copyEnvPlugin() {
  return {
    name: "copy-env",
    closeBundle() {
      const from = join(root, "public", ".env");
      const to = join(root, "dist", ".env");
      if (!existsSync(from)) return;
      mkdirSync(join(root, "dist"), { recursive: true });
      copyFileSync(from, to);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), leadsDevPlugin(), copyEnvPlugin()],
});
