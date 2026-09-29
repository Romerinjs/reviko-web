import gsap from "gsap";

export function initProblemAnimation(): void {
  const group = document.querySelector<HTMLElement>("[data-people]");
  if (!group) return;
  const people = group.querySelectorAll<HTMLElement>(".person");
  if (!people.length) return;

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: { trigger: group, start: "top 85%", once: true },
  });
  timeline.fromTo(
    people,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.38, stagger: 0.08 },
  );
  const rootStyles = getComputedStyle(document.documentElement);
  const lime = rootStyles.getPropertyValue("--reviko-lime").trim();
  const highlight = people[0];
  if (highlight)
    timeline.to(
      highlight,
      {
        y: -4,
        color: lime,
        duration: 0.32,
      },
      "-=0.1",
    );
}
