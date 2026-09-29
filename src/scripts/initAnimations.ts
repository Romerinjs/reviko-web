import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destroyLegal, initLegal } from "./legal";
import { initFinalCtaAnimation } from "./animations/finalCta";
import { initHeaderMotion } from "./animations/header";
import { initHeroAnimations } from "./animations/hero";
import {
  initHeroParallax,
  initIndustryParallax,
} from "./animations/industries";
import { initHowItWorksAnimation } from "./animations/howItWorks";
import { initProblemAnimation } from "./animations/problem";
import {
  initProductAnimations,
  setCounterFinalValues,
} from "./animations/product";
import { initScrollReveals } from "./animations/reveals";
import { initRewardAnimations } from "./animations/rewards";

gsap.registerPlugin(ScrollTrigger);

let active = false;
let pageContext: gsap.Context | undefined;
let responsiveMedia: gsap.MatchMedia | undefined;
let motionMedia: gsap.MatchMedia | undefined;
let listeners: AbortController | undefined;
let removeHeaderListener: (() => void) | undefined;

function initDrawer(): void {
  const drawer = document.querySelector<HTMLDialogElement>("#mobile-drawer");
  const button = document.querySelector<HTMLButtonElement>(
    '.menu-btn[aria-controls="mobile-drawer"]',
  );
  if (!drawer || !button || !listeners) return;

  const close = () => {
    button.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    if (drawer.open) drawer.close();
  };
  button.addEventListener(
    "click",
    () => {
      if (drawer.open) close();
      else {
        drawer.showModal();
        button.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        requestAnimationFrame(() => drawer.classList.add("is-open"));
      }
    },
    { signal: listeners.signal },
  );
  drawer.addEventListener(
    "click",
    (event) => {
      if (
        event.target === drawer ||
        (event.target instanceof Element &&
          event.target.closest(".drawer-close, .drawer-nav a"))
      )
        close();
    },
    { signal: listeners.signal },
  );
  drawer.addEventListener(
    "close",
    () => {
      drawer.classList.remove("is-open");
      button.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    },
    { signal: listeners.signal },
  );
}

function refreshScrollTriggers(): void {
  requestAnimationFrame(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh(), {
    once: true,
    signal: listeners?.signal,
  });
}

export function initAnimations(): void {
  if (active) return;
  active = true;
  listeners = new AbortController();
  document.documentElement.classList.remove("no-js");
  initLegal();
  initDrawer();
  removeHeaderListener = initHeaderMotion();

  motionMedia = gsap.matchMedia();
  motionMedia.add("(prefers-reduced-motion: reduce)", () => {
    setCounterFinalValues();
  });
  motionMedia.add("(prefers-reduced-motion: no-preference)", () => {
    pageContext = gsap.context(() => {
      initHeroAnimations();
      initScrollReveals();
      initProblemAnimation();
      initProductAnimations();
      initRewardAnimations();
      initFinalCtaAnimation();
    }, document.body);

    responsiveMedia = gsap.matchMedia();
    responsiveMedia.add("(min-width: 861px)", () => {
      const context = gsap.context(() => {
        initHowItWorksAnimation(false);
        initHeroParallax();
        initIndustryParallax();
      }, document.body);
      return () => context.revert();
    });
    responsiveMedia.add("(max-width: 860px)", () => {
      const context = gsap.context(
        () => initHowItWorksAnimation(true),
        document.body,
      );
      return () => context.revert();
    });

    refreshScrollTriggers();
    return () => {
      responsiveMedia?.revert();
      responsiveMedia = undefined;
      pageContext?.revert();
      pageContext = undefined;
    };
  });

  const hash = window.location.hash;
  if (hash)
    requestAnimationFrame(() => {
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView({ block: "start" });
      ScrollTrigger.refresh();
    });
}

export function destroyAnimations(): void {
  if (!active) return;
  active = false;
  document.querySelector<HTMLDialogElement>("#mobile-drawer")?.close();
  responsiveMedia?.revert();
  responsiveMedia = undefined;
  pageContext?.revert();
  pageContext = undefined;
  motionMedia?.revert();
  motionMedia = undefined;
  listeners?.abort();
  listeners = undefined;
  removeHeaderListener?.();
  removeHeaderListener = undefined;
  destroyLegal();
}

document.addEventListener("astro:before-swap", destroyAnimations);
document.addEventListener("astro:page-load", initAnimations);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAnimations, { once: true });
} else {
  initAnimations();
}
