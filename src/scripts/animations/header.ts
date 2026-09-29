export function initHeaderMotion(): () => void {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return () => {};

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 60);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
}
