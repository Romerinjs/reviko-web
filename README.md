# reviko-landing

Landing editorial de reviko. Astro + TypeScript + GSAP + CSS moderno.
Carpeta independiente: no depende del monorepo `reviko`.

## Comandos

```powershell
npm install
npm run dev     # http://localhost:4321
npm run build
npm run check
```

## Fotos

Tú las aportas. Ver `public/images/README.md` para slots y proporciones.
Los placeholders actuales mantienen proporción y se sustituyen 1:1.

## Estructura

- `src/layouts/BaseLayout.astro` — home: head, SEO, fuentes Manrope, carga motion
- `src/layouts/LegalLayout.astro` — sistema legal (variantes `long`/`compact`/`action`)
- `src/components/legal/` — LegalHeader, LegalToc, LegalFooter
- `src/scripts/legal.ts` — TOC auto desde H2, scrollspy (IntersectionObserver), numeración editorial, wrap de tablas. Sin GSAP.
- `src/styles/legal.css` — tipografía editorial, tablas, contact rows, print styles
- `src/data/content.ts` — industrias, pasos, nav (data-driven)
- `src/components/` — Header, Eyebrow, ArrowButton, CircleCta, RewardProgress
- `src/sections/` — Hero, Problem, HowItWorks, ProductShowcase, Industries, RewardWays, FinalCta
- `src/scripts/motion.ts` — GSAP + ScrollTrigger del home, respeta prefers-reduced-motion
- `src/styles/` — tokens, base, utilities

## Rutas legales

ES (default, raíz): `/terms` · `/privacy` · `/merchant-terms` · `/loyalty-terms` ·
`/billing` · `/support` · `/privacy-request` · `/delete-account`

EN: mismas rutas bajo `/en/`.

Slugs españoles antiguos (`/terminos`, `/privacidad`, …) redirigen a las
rutas actuales. Contenido transcrito íntegro de `docs/` (no modificar
wording jurídico); español = traducción fiel.

## i18n

Español raíz, inglés en `/en/`, sin redirección automática. `src/i18n/`:
`config.ts` (rutas, registry, IDs de sección estables), `ui.ts` (diccionario
home + chrome). Switcher ES|EN preserva ruta + hash + query y persiste
`reviko-locale`. SEO: `hreflang` es/en/x-default, canonical y `og:locale`
por página.
