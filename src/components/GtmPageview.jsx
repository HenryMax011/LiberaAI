import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function GtmPageview() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const id = window.setTimeout(() => {
      const path = `${pathname}${search}`;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      });
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: path,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }, 80);
    return () => window.clearTimeout(id);
  }, [pathname, search]);

  return null;
}
