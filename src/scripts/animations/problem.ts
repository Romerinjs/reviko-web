import gsap from "gsap";

export function initProblemAnimation(): void {
  const group = document.querySelector<HTMLElement>("[data-people]");
  if (!group) return;
  const people = group.querySelectorAll<HTMLElement>(".person");
  if (!people.length) return;

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: { trigger: group, start: "top 82%", once: true },
  });
  timeline.fromTo(
    people,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.48, stagger: 0.12 },
  );
  const rootStyles = getComputedStyle(document.documentElement);
  const lime = rootStyles.getPropertyValue("--reviko-lime").trim();
  const green = rootStyles.getPropertyValue("--reviko-green").trim();
  const highlight = people[0];
  if (highlight)
    timeline.to(highlight, {
      y: -6,
      backgroundColor: lime,
      color: green,
      duration: 0.36,
    });
}
