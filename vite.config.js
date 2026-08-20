import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = dirname(fileURLToPath(import.meta.url));

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
        } catch {
          json(res, 400, { success: false, message: "Não foi possível enviar sua solicitação." });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), leadsDevPlugin()],
});
