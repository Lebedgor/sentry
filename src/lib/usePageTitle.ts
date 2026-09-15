import { useEffect } from "react";

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (description) {
      if (meta) meta.setAttribute("content", description);
    } else if (meta) {
      meta.removeAttribute("content");
    }
    return () => {
      document.title = "SENTRY — Security infrastructure for modern teams";
    };
  }, [title, description]);
}
