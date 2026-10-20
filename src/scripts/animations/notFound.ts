import gsap from "gsap";

export function initNotFoundAnimations(): void {
  const section = document.querySelector<HTMLElement>(".nf");
  if (!section) return;

  const digits = section.querySelectorAll<HTMLElement>("[data-digit]");
  if (digits.length) {
    gsap.fromTo(
      digits,
      { opacity: 0, yPercent: 60, rotateX: -45 },
      {
        opacity: 1,
        yPercent: 0,
        rotateX: 0,
        duration: 0.75,
        stagger: 0.11,
        ease: "power3.out",
        transformOrigin: "bottom center",
      },
    );
  }

  const visual = section.querySelector<HTMLElement>('[data-nf="visual"]');
  if (visual) {
    gsap.fromTo(
      visual,
      { opacity: 0, y: 34, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        delay: 0.18,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
  }

  const chips = section.querySelectorAll<HTMLElement>('[data-nf="chip"]');
  if (chips.length) {
    gsap.fromTo(
      chips,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.5,
        stagger: 0.12,
        ease: "back.out(1.8)",
      },
    );
  }

  const bar = section.querySelector<HTMLElement>(".pass-bar i");
  if (bar) {
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1,
        delay: 0.6,
        ease: "power2.out",
        transformOrigin: "left center",
      },
    );
  }
}
