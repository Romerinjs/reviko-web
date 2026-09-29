import gsap from "gsap";

export function initScrollReveals(): void {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    if (element.closest(".hero, [data-how-flow], [data-final-sequence]"))
      return;

    const kind = element.dataset.reveal ?? "up";
    const image = kind === "image";
    const target = image ? (element.querySelector("img") ?? element) : element;
    const from = image
      ? { clipPath: "inset(0 100% 0 0)", scale: 1.04 }
      : kind === "scale"
        ? { opacity: 0, scale: 0.96 }
        : kind === "fade"
          ? { opacity: 0 }
          : { opacity: 0, y: kind === "legal-section" ? 18 : 32 };
    const to = image
      ? { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.1 }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: kind === "legal-section" ? 0.58 : 0.7,
        };

    gsap.fromTo(target, from, {
      ...to,
      ease: "power3.out",
      overwrite: "auto",
      scrollTrigger: { trigger: element, start: "top 86%", once: true },
    });
  });

  document.querySelectorAll<HTMLElement>("[data-media]").forEach((wrapper) => {
    const image = wrapper.querySelector<HTMLElement>("img");
    const target = image ?? wrapper;
    gsap.fromTo(
      target,
      { clipPath: "inset(0 100% 0 0)", scale: 1.04 },
      {
        clipPath: "inset(0 0% 0 0)",
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapper, start: "top 84%", once: true },
      },
    );
  });

  document
    .querySelectorAll<HTMLElement>("[data-stagger], [data-reveal-group]")
    .forEach((group) => {
      const children = Array.from(group.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      );
      if (!children.length) return;
      gsap.fromTo(
        children,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 86%", once: true },
        },
      );
    });

  document.querySelectorAll<HTMLElement>("[data-lines]").forEach((block) => {
    if (block.closest(".hero, [data-final-sequence]")) return;
    const lines = block.querySelectorAll<HTMLElement>(".line > span");
    if (!lines.length) return;
    gsap.fromTo(
      lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: block, start: "top 86%", once: true },
      },
    );
  });

  document
    .querySelectorAll<HTMLElement>(
      ".legal-doc .table-scroll:not([data-reveal])",
    )
    .forEach((table) => {
      gsap.fromTo(
        table,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: table, start: "top 88%", once: true },
        },
      );
    });
}
