/* Sistema legal reviko: numeración editorial, TOC automático y scrollspy real.
   Solo transformaciones visuales — el contenido semántico se preserva
   mediante aria-label. Sin GSAP: IntersectionObserver + CSS.
   Causa del bug anterior (documentada): el active se resolvía con el último
   entry isIntersecting del callback, cuyo orden NO es orden DOM, y solo se
   observaban los tops de los H2 sin noción de sección. Ahora se observan
   las <section> y, ante cualquier evento, se recalcula de forma
   determinista qué sección ocupa la línea de lectura. */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sectionIdsFor(doc: HTMLElement, count: number): string[] {
  try {
    const raw = doc.dataset.sectionIds ?? "";
    const ids = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (ids.length === count) return ids;
  } catch {
    /* fallback a slug por título */
  }
  return [];
}

let observer: IntersectionObserver | null = null;
let listeners: AbortController | null = null;

export function destroyLegal(): void {
  observer?.disconnect();
  observer = null;
  listeners?.abort();
  listeners = null;
  document.documentElement.removeAttribute("data-legal-init");
}

export function initLegal(): void {
  if (document.documentElement.hasAttribute("data-legal-init")) return;
  document.documentElement.setAttribute("data-legal-init", "");

  const doc = document.querySelector<HTMLElement>("[data-legal-doc]");
  if (!doc) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const controller = new AbortController();
  listeners = controller;
  const headings = Array.from(doc.querySelectorAll<HTMLHeadingElement>("h2"));
  const tocSidebar =
    document.querySelector<HTMLOListElement>("[data-toc-list]");
  const tocMobile = document.querySelector<HTMLOListElement>(
    "[data-toc-list-mobile]",
  );

  /* ---- 1. Agrupar cada H2 con su contenido en <section> + numerar ---- */
  const stableIds = sectionIdsFor(doc, headings.length);
  const sections: HTMLElement[] = [];

  headings.forEach((h, i) => {
    const headingCopy = h.cloneNode(true) as HTMLHeadingElement;
    headingCopy.querySelector(":scope > .sec-num")?.remove();
    const original = (headingCopy.textContent ?? "").trim();
    const match = original.match(/^(\d+)\.\s+(.+)$/);
    const num = String(i + 1).padStart(2, "0");
    const title = match?.[2]?.trim() ?? original;
    const id = stableIds[i] ?? slugify(title) ?? `seccion-${num}`;

    let section: HTMLElement;
    if (h.parentElement?.classList.contains("legal-section")) {
      section = h.parentElement;
    } else {
      section = document.createElement("section");
      const following: Element[] = [];
      let next = h.nextElementSibling;
      while (next && next.tagName !== "H2") {
        following.push(next);
        next = next.nextElementSibling;
      }
      h.replaceWith(section);
      section.append(h, ...following);
    }
    section.classList.add("legal-section");
    section.setAttribute("aria-label", original);
    section.dataset.reveal = "legal-section";

    h.classList.add("legal-h2");
    h.id = id;
    (h as HTMLElement).dataset.sectionTitle = title;

    sections.push(section);
  });

  /* ---- 2. Tablas: scroll horizontal seguro sin romper semántica ---- */
  doc.querySelectorAll("table").forEach((table) => {
    if (table.parentElement?.classList.contains("table-scroll")) return;
    const wrap = document.createElement("div");
    wrap.className = "table-scroll";
    if (!table.closest(".legal-section")) wrap.dataset.reveal = "fade";
    table.replaceWith(wrap);
    wrap.append(table);
  });

  doc
    .querySelectorAll<HTMLElement>(".legal-doc > p:not(.legal-mail-cta)")
    .forEach((p) => {
      if (!p.closest(".legal-section")) p.dataset.reveal = "fade";
    });
  doc.querySelectorAll<HTMLElement>(".contact-rows").forEach((rows) => {
    rows.dataset.revealGroup = "";
  });
  doc.querySelectorAll<HTMLElement>(".legal-mail-cta").forEach((cta) => {
    cta.dataset.reveal = "up";
  });

  /* ---- 3. TOC (desktop + mobile) ---- */
  const buildList = (list: HTMLOListElement | null): void => {
    if (!list) return;
    list.replaceChildren();
    headings.forEach((h, i) => {
      const num = String(i + 1).padStart(2, "0");
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      const n = document.createElement("span");
      n.className = "toc-n";
      n.setAttribute("aria-hidden", "true");
      n.textContent = num;
      a.append(
        n,
        document.createTextNode((h as HTMLElement).dataset.sectionTitle ?? ""),
      );
      li.append(a);
      list.append(li);
    });
  };
  buildList(tocSidebar);
  buildList(tocMobile);

  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-toc-list] a"),
  );
  const mobileLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-toc-list-mobile] a"),
  );
  const scroller = document.querySelector<HTMLElement>(".legal-toc-inner");

  const setActive = (id: string, smooth: boolean): void => {
    for (const a of [...links, ...mobileLinks]) {
      const on = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    }
    // Auto-scroll del sidebar: solo el contenedor, nunca la página.
    const active = scroller?.querySelector<HTMLElement>(
      `a[href="#${CSS.escape(id)}"]`,
    );
    if (scroller && active) {
      const target = Math.min(
        Math.max(
          active.offsetTop -
            scroller.clientHeight / 2 +
            active.clientHeight / 2,
          0,
        ),
        Math.max(scroller.scrollHeight - scroller.clientHeight, 0),
      );
      scroller.scrollTo({
        top: target,
        behavior: smooth && !reduceMotion ? "smooth" : "auto",
      });
    }
  };

  /* ---- 4. Scrollspy determinista ----
     Línea de lectura bajo el header sticky. Ante cualquier cruce se
     recalcula: activa = última sección cuyo top está sobre la línea. */
  const activationLine = (): number => {
    const header = document.querySelector<HTMLElement>(".legal-top");
    const offset = (header?.offsetHeight ?? 64) + 24;
    return Math.min(
      offset + window.innerHeight * 0.22,
      window.innerHeight * 0.45,
    );
  };

  const resolveActive = (): string => {
    const line = activationLine();
    let current = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= line) current = s;
      else break;
    }
    const activeH = current?.querySelector("h2");
    return activeH?.id ?? "";
  };

  const onIntersect = (): void => {
    const id = resolveActive();
    if (id) setActive(id, true);
  };

  if (typeof IntersectionObserver === "undefined") {
    const id = window.location.hash.slice(1) || headings[0]?.id || "";
    if (id) setActive(id, false);
  } else {
    observer = new IntersectionObserver(onIntersect, { threshold: 0 });
    sections.forEach((s) => observer?.observe(s));
    window.addEventListener(
      "hashchange",
      () => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (id && document.getElementById(id)) setActive(id, true);
      },
      { signal: controller.signal },
    );
  }

  /* ---- 5. Init con hash (entrada directa o refresh) ---- */
  const initFromHash = (): void => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && document.getElementById(id)) {
      setActive(id, false);
    } else if (headings[0]) {
      setActive(headings[0].id, false);
    }
  };
  initFromHash();

  /* Cerrar el <details> mobile al navegar */
  doc.addEventListener(
    "click",
    (e) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!a) return;
      document.querySelector("details[open]")?.removeAttribute("open");
    },
    { signal: controller.signal },
  );
}
