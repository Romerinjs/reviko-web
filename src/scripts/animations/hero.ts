import gsap from "gsap";

export function initHeroAnimations(): void {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;

  const headerItems = gsap.utils.toArray<HTMLElement>(
    ".site-header .brand, .site-header .nav > a, .site-header .actions > *",
  );
  const eyebrow = hero.querySelector<HTMLElement>('[data-hero="eyebrow"]');
  const titleLines = hero.querySelectorAll<HTMLElement>("h1 .line > span");
  const copy = hero.querySelectorAll<HTMLElement>(
    '[data-hero="lede"], [data-hero="sub"]',
  );
  const ctas = hero.querySelector<HTMLElement>('[data-hero="ctas"]');
  const image = hero.querySelector<HTMLElement>("[data-hero-image]");
  const phone = hero.querySelector<HTMLElement>("[data-hero-phone]");
  const micro = hero.querySelector<HTMLElement>('[data-hero="micro"]');
  const chips = hero.querySelectorAll<HTMLElement>("[data-hero=chip]");
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (headerItems.length) {
    tl.fromTo(
      headerItems,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.24, stagger: 0.035 },
      0,
    );
  }
  if (eyebrow) {
    tl.fromTo(
      eyebrow,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3 },
      0.1,
    );
  }
  if (titleLines.length) {
    tl.fromTo(
      titleLines,
      { opacity: 0, y: 40, yPercent: 110 },
      { opacity: 1, y: 0, yPercent: 0, duration: 0.72, stagger: 0.1 },
      0.18,
    );
  }
  if (copy.length) {
    tl.fromTo(
      copy,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.42, stagger: 0.08 },
      0.38,
    );
  }
  if (ctas?.children.length) {
    tl.fromTo(
      ctas.children,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.36, stagger: 0.1 },
      0.52,
    );
  }
  if (image) {
    tl.fromTo(
      image,
      { clipPath: "inset(0 100% 0 0)", scale: 1.04 },
      {
        clipPath: "inset(0 0% 0 0)",
        scale: 1,
        duration: 1.05,
      },
      0.25,
    );
  }
  if (phone) {
    tl.fromTo(
      phone,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.48 },
      0.68,
    );
  }
  if (micro) {
    tl.fromTo(
      micro,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3 },
      0.86,
    );
  }
  if (chips.length) {
    tl.fromTo(
      chips,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.34, stagger: 0.08 },
      0.74,
    );
  }
}
