import gsap from "gsap";

function formatCounter(element: HTMLElement, value: number): string {
  const decimals = Number(element.dataset.decimals ?? 0);
  const suffix = element.dataset.suffix ?? "";
  const formatted = decimals
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("es-MX");
  return `${formatted}${suffix}`;
}

export function setCounterFinalValues(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-counter]").forEach((element) => {
    element.textContent = formatCounter(
      element,
      Number(element.dataset.counter),
    );
  });
}

export function initProductAnimations(): void {
  document
    .querySelectorAll<HTMLElement>("[data-counter]")
    .forEach((element) => {
      const target = Number(element.dataset.counter);
      const value = { current: 0 };
      element.textContent = formatCounter(element, 0);
      gsap.fromTo(
        value,
        { current: 0 },
        {
          current: target,
          duration: 1.35,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = formatCounter(element, value.current);
          },
          scrollTrigger: {
            trigger: element.closest(".product") ?? element,
            start: "top 84%",
            once: true,
          },
        },
      );
    });

  document.querySelectorAll<HTMLElement>("[data-bars]").forEach((bars) => {
    gsap.fromTo(
      bars.querySelectorAll<HTMLElement>("i"),
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        transformOrigin: "bottom",
        scrollTrigger: {
          trigger: bars.closest(".card") ?? bars,
          start: "top 84%",
          once: true,
        },
      },
    );
  });

  document.querySelectorAll<HTMLElement>("[data-progress]").forEach((bar) => {
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.75,
        ease: "power3.out",
        transformOrigin: "left center",
        scrollTrigger: {
          trigger: bar.closest("[data-stagger]") ?? bar,
          start: "top 86%",
          once: true,
        },
      },
    );
  });
}
