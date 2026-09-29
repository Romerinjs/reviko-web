import gsap from "gsap";

function revealPart(
  timeline: gsap.core.Timeline,
  element: Element | null,
  position: gsap.Position,
): void {
  if (!element) return;
  timeline.fromTo(
    element,
    { opacity: 0, y: 14, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.32 },
    position,
  );
}

export function initHowItWorksAnimation(mobile: boolean): void {
  const flow = document.querySelector<HTMLElement>("[data-how-flow]");
  if (!flow) return;
  const steps = gsap.utils.toArray<HTMLElement>("[data-hstep]", flow);

  if (mobile) {
    steps.forEach((step) => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: step, start: "top 85%", once: true },
      });
      const heads = step.querySelectorAll("[data-hhead]");
      if (heads.length)
        timeline.fromTo(
          heads,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.05 },
        );
      revealPart(timeline, step.querySelector("[data-part]"), "-=0.15");
      const card = step.querySelector("[data-card]");
      revealPart(timeline, card, "-=0.15");
      const description = step.querySelector("[data-desc]");
      if (description)
        timeline.fromTo(
          description,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.32 },
          "-=0.15",
        );
      const gift = step.querySelector("[data-gift]");
      if (gift)
        timeline
          .fromTo(gift, { scale: 0.8 }, { scale: 1.18, duration: 0.22, ease: "back.out(2)" })
          .to(gift, { scale: 1, duration: 0.18 });
    });
    return;
  }

  const connectors = gsap.utils.toArray<SVGSVGElement>("[data-arrow]", flow);
  connectors.forEach((connector) => {
    connector.querySelectorAll<SVGPathElement>("path").forEach((path) => {
      path.setAttribute("pathLength", "1");
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
    });
  });

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: { trigger: flow, start: "top 80%", once: true },
  });

  steps.forEach((step, index) => {
    const heads = step.querySelectorAll("[data-hhead]");
    if (heads.length)
      timeline.fromTo(
        heads,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.08 },
        index === 0 ? 0 : "+=0.08",
      );

    revealPart(timeline, step.querySelector("[data-part]"), "-=0.18");
    revealPart(timeline, step.querySelector("[data-card]"), "-=0.22");

    const description = step.querySelector("[data-desc]");
    if (description)
      timeline.fromTo(
        description,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.36 },
        "-=0.18",
      );

    const connector = connectors[index];
    if (connector) {
      const [shaft, head] = connector.querySelectorAll<SVGPathElement>("path");
      if (shaft)
        timeline.to(shaft, { strokeDashoffset: 0, duration: 0.38, ease: "power2.inOut" }, "-=0.05");
      if (head)
        timeline.to(head, { strokeDashoffset: 0, duration: 0.22, ease: "power2.out" }, "-=0.08");
    }

    const gift = step.querySelector("[data-gift]");
    if (gift)
      timeline
        .fromTo(gift, { scale: 0.75 }, { scale: 1.2, duration: 0.28, ease: "back.out(2.2)" }, "-=0.1")
        .to(gift, { scale: 1, duration: 0.2, ease: "power2.out" });
  });
}
