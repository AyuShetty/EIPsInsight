import { useEffect, useState } from "react";

export function useTableOfContents() {
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("section[id]"));
    const newToc = headings.map((heading) => ({
      id: heading.id,
      text: heading.querySelector("h1, h2, h3, h4, h5, h6")?.textContent || heading.id,
    }));
    setToc(newToc);
  }, []);

  return toc;
}
