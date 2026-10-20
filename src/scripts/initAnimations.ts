import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
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
import { initNotFoundAnimations } from "./animations/notFound";
import { initPricingAnimations } from "./animations/pricing";
import { initProductAnimations } from "./animations/product";
import { initScrollReveals } from "./animations/reveals";
import { initRewardAnimations } from "./animations/rewards";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let active = false;
let pageContext: gsap.Context | undefined;
let responsiveMedia: gsap.MatchMedia | undefined;
let motionMedia: gsap.MatchMedia | undefined;
let listeners: AbortController | undefined;
let removeHeaderListener: (() => void) | undefined;

function initDrawer(): void {
  const drawer = document.querySelector<HTMLElement>("#mobile-drawer");
  const overlay = document.querySelector<HTMLElement>("#drawer-overlay");
  const button = document.querySelector<HTMLButtonElement>(
    '.menu-btn[aria-controls="mobile-drawer"]',
  );
  if (!drawer || !button || !listeners) return;

  let isOpen = false;
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    button.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    drawer.classList.remove("is-open");
    drawer.setAttribute("inert", "");
    overlay?.classList.remove("is-open");
    document.body.style.overflow = "";
    button.focus();
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    button.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    drawer.removeAttribute("inert");
    drawer.classList.add("is-open");
    overlay?.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const closeBtn = drawer.querySelector<HTMLButtonElement>(".drawer-close");
    closeBtn?.focus();
  };

  button.addEventListener(
    "click",
    () => {
      if (isOpen) close();
      else open();
    },
    { signal: listeners.signal },
  );

  overlay?.addEventListener("click", close, { signal: listeners.signal });

  drawer.addEventListener(
    "click",
    (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".drawer-close, .drawer-nav a")
      ) {
        close();
      }
    },
    { signal: listeners.signal },
  );

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && isOpen) close();
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

  pageContext = gsap.context(() => {
    initHeroAnimations();
    initScrollReveals();
    initProblemAnimation();
    initProductAnimations();
    initPricingAnimations();
    initNotFoundAnimations();
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

  function smoothScrollTo(targetY: number, duration = 800): void {
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetY - startY;
    if (Math.abs(distance) < 5) return;
    const startTime = performance.now();

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        ScrollTrigger.refresh();
      }
    }

    requestAnimationFrame(step);
  }

  const handleSmoothAnchorClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const path = href.slice(0, hashIndex);
    const id = decodeURIComponent(href.slice(hashIndex + 1));
    if (!id) return;

    const currentPath = window.location.pathname;
    if (path && path !== currentPath && path !== "" && path !== "/") return;

    const targetElement = document.getElementById(id);
    if (targetElement) {
      event.preventDefault();
      const header = document.querySelector<HTMLElement>(".site-header, .legal-top");
      const headerOffset = header ? header.offsetHeight + 18 : 70;
      const elementTop = targetElement.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
      const destination = Math.max(0, elementTop - headerOffset);

      smoothScrollTo(destination, 750);
      history.pushState(null, "", `#${id}`);
    }
  };

  document.addEventListener("click", handleSmoothAnchorClick, {
    signal: listeners.signal,
  });

  const hash = window.location.hash;
  if (hash) {
    const id = decodeURIComponent(hash.slice(1));
    const targetElement = document.getElementById(id);
    if (targetElement) {
      setTimeout(() => {
        const header = document.querySelector<HTMLElement>(".site-header, .legal-top");
        const headerOffset = header ? header.offsetHeight + 18 : 70;
        const elementTop = targetElement.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
        const destination = Math.max(0, elementTop - headerOffset);
        smoothScrollTo(destination, 750);
      }, 100);
    }
  }
}

export function destroyAnimations(): void {
  if (!active) return;
  active = false;
  document.querySelector<HTMLElement>("#mobile-drawer")?.classList.remove("is-open");
  document.querySelector<HTMLElement>("#drawer-overlay")?.classList.remove("is-open");
  document.body.style.overflow = "";
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
