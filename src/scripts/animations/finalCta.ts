import gsap from "gsap";

export function initFinalCtaAnimation(): void {
  const final = document.querySelector<HTMLElement>("[data-final-sequence]");
  if (!final) return;

  const eyebrow = final.querySelector("[data-final-eyebrow]");
  const titleLines = final.querySelectorAll("h2 .line > span");
  const description = final.querySelector("[data-final-description]");
  const reward = final.querySelector("[data-final-reward]");
  const button = final.querySelector("[data-final-button]");
  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: { trigger: final, start: "top 78%", once: true },
  });

  if (eyebrow)
    timeline.fromTo(
      eyebrow,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.32 },
    );
  if (titleLines.length)
    timeline.fromTo(
      titleLines,
      { opacity: 0, y: 36, yPercent: 110 },
      { opacity: 1, y: 0, yPercent: 0, duration: 0.58, stagger: 0.07 },
      "-=0.1",
    );
  if (description)
    timeline.fromTo(
      description,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4 },
      "-=0.22",
    );
  if (reward)
    timeline.fromTo(
      reward,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.38 },
      "-=0.18",
    );
  if (button)
    timeline.fromTo(
      button,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.34 },
      "-=0.15",
    );
}
