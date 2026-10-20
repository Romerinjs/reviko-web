/* Sistema i18n reviko: español = raíz (default), inglés = /en/.
   Sin redirección automática, sin detección forzada. */

export type Locale = "es" | "en";

export const DEFAULT_LOCALE: Locale = "es";
export const SITE_URL = "https://reviko.io";
export const LOCALE_KEY = "reviko-locale";

/** Rutas base (español). El inglés reutiliza el mismo slug bajo /en/. */
export const HOME_PATH = "/";

/** Aplicación web de reviko (app.reviko.io). */
export const APP_URL = "https://app.reviko.io";

/** Alta de nuevos negocios / registro en la app. */
export const APP_SIGNUP_URL = `${APP_URL}/registro`;

export function localizedPath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? "/en/" : `/en${path}`;
}

/** Localized link to a stable, language-independent section on the home page. */
export function localizedHomeAnchor(anchor: string, locale: Locale): string {
  const id = anchor.replace(/^#/, "");
  return `${localizedPath(HOME_PATH, locale)}#${encodeURIComponent(id)}`;
}

export type LegalVariant = "long" | "compact" | "action";

export interface LegalDocMeta {
  slug: string;
  /** eyebrow, title, description, effectiveDate por idioma */
  eyebrow: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  effectiveDate: Record<Locale, string> | null;
  version: string | null;
  variant: LegalVariant;
  /** IDs de sección estables e independientes del idioma (mismo orden ES/EN) */
  sectionIds: string[];
}

export const LEGAL_DOCS = {
  terms: {
    slug: "terms",
    eyebrow: { es: "Legal / Términos", en: "Legal / Terms" },
    title: {
      es: "Términos del servicio de Reviko",
      en: "Reviko Terms of Service",
    },
    description: {
      es: "Términos del servicio de Reviko, plataforma de fidelización operada por 77 Studio LLC.",
      en: "Terms of Service for Reviko, the loyalty platform operated by 77 Studio LLC.",
    },
    effectiveDate: { es: "7 de septiembre de 2026", en: "September 7, 2026" },
    version: "2.0",
    variant: "long",
    sectionIds: [
      "eligibility",
      "about-reviko",
      "accounts",
      "merchant-loyalty-programs",
      "points-visits-and-rewards",
      "merchant-responsibility",
      "apple-wallet-and-google-wallet",
      "subscription-plans",
      "free-trial",
      "automatic-renewal",
      "cancellation",
      "refunds-and-proration",
      "payment-processing",
      "messaging-and-fair-use",
      "pass-updates",
      "communications",
      "acceptable-use",
      "fraud-prevention",
      "intellectual-property",
      "service-availability",
      "suspension-and-termination",
      "disclaimer-of-warranties",
      "limitation-of-liability",
      "indemnification",
      "privacy",
      "governing-law-and-venue",
      "changes-to-these-terms",
      "contact",
    ],
  },
  privacy: {
    slug: "privacy",
    eyebrow: { es: "Legal / Privacidad", en: "Legal / Privacy" },
    title: {
      es: "Política de privacidad de Reviko",
      en: "Reviko Privacy Policy",
    },
    description: {
      es: "Política de privacidad de Reviko, plataforma de fidelización operada por 77 Studio LLC.",
      en: "Privacy Policy for Reviko, the loyalty platform operated by 77 Studio LLC.",
    },
    effectiveDate: { es: "7 de septiembre de 2026", en: "September 7, 2026" },
    version: "2.0",
    variant: "long",
    sectionIds: [
      "eligibility-and-scope",
      "our-role",
      "information-we-collect",
      "how-we-use-information",
      "service-providers-and-technology-partners",
      "apple-wallet-and-google-wallet",
      "merchants",
      "messaging",
      "analytics",
      "how-we-disclose-information",
      "sale-of-personal-information",
      "data-retention",
      "security",
      "privacy-rights",
      "california-privacy-rights",
      "account-and-data-deletion",
      "international-processing",
      "cookies-and-similar-technologies",
      "changes-to-this-policy",
      "contact",
    ],
  },
  "merchant-terms": {
    slug: "merchant-terms",
    eyebrow: { es: "Legal / Negocios", en: "Legal / Merchants" },
    title: {
      es: "Términos para negocios de Reviko",
      en: "Reviko Merchant Terms",
    },
    description: {
      es: "Términos para negocios que usan Reviko, servicio operado por 77 Studio LLC.",
      en: "Terms for businesses using Reviko, a service operated by 77 Studio LLC.",
    },
    effectiveDate: { es: "7 de septiembre de 2026", en: "September 7, 2026" },
    version: "2.0",
    variant: "long",
    sectionIds: [
      "merchant-authority",
      "license-to-use-merchant-branding",
      "plans-and-pricing",
      "trial",
      "renewal-and-cancellation",
      "no-prorated-refunds",
      "no-additional-usage-charges-without-agreement",
      "fair-use-for-messaging",
      "merchant-loyalty-program-rules",
      "customer-obligations",
      "consumer-protection-and-marketing-compliance",
      "customer-data",
      "messaging-consent",
      "prohibited-programs",
      "fraud",
      "platform-compliance",
      "subscription-end",
      "intellectual-property-claims",
      "indemnification",
      "suspension",
      "governing-law-and-venue",
      "contact",
    ],
  },
  "loyalty-terms": {
    slug: "loyalty-terms",
    eyebrow: { es: "Legal / Programa", en: "Legal / Program" },
    title: {
      es: "Términos estándar del programa de fidelización de Reviko",
      en: "Reviko Standard Loyalty Program Terms",
    },
    description: {
      es: "Términos estándar del programa de fidelización de Reviko para clientes.",
      en: "Standard loyalty program terms for customers of programs powered by Reviko.",
    },
    effectiveDate: { es: "7 de septiembre de 2026", en: "September 7, 2026" },
    version: "2.0",
    variant: "long",
    sectionIds: [
      "age-requirement",
      "voluntary-participation",
      "earning",
      "no-cash-value",
      "rewards",
      "fraud-and-abuse",
      "program-changes",
      "program-termination",
      "revikos-role",
      "apple-wallet-and-google-wallet",
      "privacy",
      "contact",
    ],
  },
  billing: {
    slug: "billing",
    eyebrow: { es: "Legal / Facturación", en: "Legal / Billing" },
    title: {
      es: "Política de facturación, prueba, cancelación y reembolso de Reviko",
      en: "Reviko Billing, Trial, Cancellation and Refund Policy",
    },
    description: {
      es: "Política de facturación, prueba gratuita, cancelación y reembolsos de Reviko.",
      en: "Reviko billing, free trial, cancellation and refund policy.",
    },
    effectiveDate: { es: "7 de septiembre de 2026", en: "September 7, 2026" },
    version: "2.0",
    variant: "compact",
    sectionIds: [
      "monthly-plans",
      "seven-day-free-trial",
      "automatic-renewal",
      "cancellation",
      "refunds",
      "payment-processor",
      "failed-payments",
      "price-changes",
      "messaging-fair-use",
      "contact",
    ],
  },
  support: {
    slug: "support",
    eyebrow: { es: "Soporte", en: "Support" },
    title: { es: "Soporte de Reviko", en: "Reviko Support" },
    description: {
      es: "Canales de soporte, privacidad y contacto legal de Reviko.",
      en: "Reviko support, privacy and legal contact channels.",
    },
    effectiveDate: null,
    version: null,
    variant: "action",
    sectionIds: [],
  },
  "privacy-request": {
    slug: "privacy-request",
    eyebrow: { es: "Privacidad / Solicitud", en: "Privacy / Request" },
    title: {
      es: "Solicitud de privacidad de Reviko",
      en: "Reviko Privacy Request",
    },
    description: {
      es: "Cómo ejercer tus derechos de privacidad ante Reviko.",
      en: "How to exercise your privacy rights with Reviko.",
    },
    effectiveDate: null,
    version: null,
    variant: "action",
    sectionIds: [
      "submit-a-request",
      "available-request-types",
      "response",
      "contact",
    ],
  },
  "delete-account": {
    slug: "delete-account",
    eyebrow: { es: "Privacidad / Cuenta", en: "Privacy / Account" },
    title: {
      es: "Eliminar tu cuenta de Reviko",
      en: "Delete Your Reviko Account",
    },
    description: {
      es: "Cómo solicitar la eliminación de tu cuenta de Reviko y tus datos asociados.",
      en: "How to request deletion of your Reviko account and associated data.",
    },
    effectiveDate: { es: "7 de septiembre de 2026", en: "September 7, 2026" },
    version: null,
    variant: "action",
    sectionIds: [
      "how-to-request-deletion",
      "what-happens-next",
      "merchant-accounts",
      "contact",
    ],
  },
} satisfies Record<string, LegalDocMeta>;

export type LegalDocSlug = keyof typeof LEGAL_DOCS;

export const LEGAL_ORDER = [
  "terms",
  "merchant-terms",
  "loyalty-terms",
  "privacy",
  "billing",
  "support",
  "privacy-request",
  "delete-account",
] as const;

/** Rutas antiguas (slugs españoles) → nuevas, para compatibilidad. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/terminos": "/terms",
  "/privacidad": "/privacy",
  "/terminos-negocios": "/merchant-terms",
  "/terminos-programa": "/loyalty-terms",
  "/facturacion": "/billing",
  "/soporte": "/support",
  "/eliminar-cuenta": "/delete-account",
  "/solicitud-privacidad": "/privacy-request",
};
