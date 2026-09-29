import gsap from "gsap";

function cssColor(property: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
}

export function initRewardAnimations(): void {
  const cream = cssColor("--reviko-cream");
  const lime = cssColor("--reviko-lime");

  document.querySelectorAll<HTMLElement>(".rewards-anim").forEach((row) => {
    const stamps = gsap.utils.toArray<HTMLElement>(":scope > .stamp", row);
    if (!stamps.length) return;
    const gift = row.querySelector<HTMLElement>(":scope > .stamp-gift");
    const ordinary = stamps.filter((stamp) => stamp !== gift);
    const filled = ordinary.filter((stamp) =>
      stamp.classList.contains("is-filled"),
    );
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: row, start: "top 88%", once: true },
    });

    if (ordinary.length)
      timeline.fromTo(
        ordinary,
        { opacity: 0, scale: 0.75 },
        { opacity: 1, scale: 1, duration: 0.34, stagger: 0.065 },
      );
    if (filled.length)
      timeline.fromTo(
        filled,
        { backgroundColor: cream, borderColor: cream },
        {
          backgroundColor: lime,
          borderColor: lime,
          duration: 0.28,
          stagger: 0.065,
        },
        "<",
      );
    if (gift) {
      const giftIsFilled = gift.classList.contains("is-filled");
      timeline
        .fromTo(
          gift,
          {
            opacity: 0,
            scale: 0.9,
            ...(giftIsFilled && { backgroundColor: cream, borderColor: cream }),
          },
          {
            opacity: 1,
            scale: 1.05,
            duration: 0.24,
            ...(giftIsFilled && { backgroundColor: lime, borderColor: lime }),
          },
          "-=0.04",
        )
        .to(gift, { scale: 1, duration: 0.22 });
    }
  });
}
