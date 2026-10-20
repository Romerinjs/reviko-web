import gsap from "gsap";

export function initPricingAnimations(): void {
  const groups = document.querySelectorAll<HTMLElement>("[data-pricing-cards]");

  groups.forEach((group) => {
    const cards = Array.from(group.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: group, start: "top 86%", once: true },
      },
    );
  });

  document
    .querySelectorAll<HTMLElement>("[data-pricing-cards] .plan")
    .forEach((card) => {
      const paths = Array.from(
        card.querySelectorAll<SVGPathElement>("[data-check] path"),
      );
      if (!paths.length) return;

      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });

      gsap.fromTo(
        paths,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        },
      );
    });
}
