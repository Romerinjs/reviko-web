import gsap from "gsap";

export function initIndustryParallax(): void {
  gsap.utils
    .toArray<HTMLElement>(".panel-media[data-parallax]")
    .forEach((media) => {
      const amount = Number(media.dataset.parallax ?? 5);
      const image = media.querySelector<HTMLElement>("img") ?? media;
      gsap.to(image, {
        yPercent: amount,
        ease: "none",
        scrollTrigger: {
          trigger: media,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
}

export function initHeroParallax(): void {
  gsap.utils.toArray<HTMLElement>(".hero [data-parallax]").forEach((media) => {
    const image = media.querySelector<HTMLElement>("img") ?? media;
    gsap.to(image, {
      yPercent: Number(media.dataset.parallax ?? -5),
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
