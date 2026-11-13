import { useEffect } from "react";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/seo";

function upsertMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function Seo({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  path = "/",
  noIndex = false,
  jsonLd,
}) {
  useEffect(() => {
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;
    document.title = title;
    upsertMeta("name", "description", description);
    upsertLink("canonical", url);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", "pt_BR");
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    if (!jsonLd) return undefined;
    let script = document.getElementById("liberaai-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "liberaai-jsonld";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
    return undefined;
  }, [title, description, path, noIndex, jsonLd]);

  return null;
}
