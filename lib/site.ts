export const SITE = {
  baseUrl: 'https://easyshopbuilder.com',
  domain: 'easyshopbuilder.com',
  brandName: 'EasyShopBuilder',
  productName: 'EasyShopBuilder',
  ga4Id: 'G-9SRRTG6649',
  affiliateUrl: 'https://shopify.pxf.io/6yLX0r',
  companyName: 'E-Com Shop',
  companyAddress: '60 rue François 1er, 75008 PARIS',
  companyId: 'SIREN 934934308',
  managerName: 'Tony CARON',
  hostName: 'Netlify',
  contactEmail: 'contact.ecomshopfrance@gmail.com',
  supportedLangs: ['fr', 'en', 'es', 'de'] as const,
};

export type Lang = (typeof SITE.supportedLangs)[number];

export const UI_TRANSLATIONS: Record<
  Lang,
  {
    blog: string;
    tutorial: string;
    legal: string;
    privacy: string;
    manageCookies: string;
    cookie: string;
    accept: string;
    refuse: string;
    language: string;
    menu: string;
    tryFree: string;
  }
> = {
  fr: {
    blog: 'Blog',
    tutorial: 'Guide Shopify 2025',
    legal: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    manageCookies: 'Gérer les cookies',
    cookie: 'Nous utilisons des cookies analytiques (Google Analytics 4) pour améliorer le site.',
    accept: 'Accepter',
    refuse: 'Refuser',
    language: 'Langue',
    menu: 'Menu',
    tryFree: 'Essayer Shopify gratuitement',
  },
  en: {
    blog: 'Blog',
    tutorial: 'Shopify guide 2025',
    legal: 'Legal notice',
    privacy: 'Privacy policy',
    manageCookies: 'Manage cookies',
    cookie: 'We use analytics cookies (Google Analytics 4) to improve the site.',
    accept: 'Accept',
    refuse: 'Refuse',
    language: 'Language',
    menu: 'Menu',
    tryFree: 'Try Shopify for free',
  },
  es: {
    blog: 'Blog',
    tutorial: 'Guía Shopify 2025',
    legal: 'Aviso legal',
    privacy: 'Política de privacidad',
    manageCookies: 'Gestionar cookies',
    cookie: 'Usamos cookies analíticas (Google Analytics 4) para mejorar el sitio.',
    accept: 'Aceptar',
    refuse: 'Rechazar',
    language: 'Idioma',
    menu: 'Menú',
    tryFree: 'Probar Shopify gratis',
  },
  de: {
    blog: 'Blog',
    tutorial: 'Shopify Guide 2025',
    legal: 'Impressum',
    privacy: 'Datenschutz',
    manageCookies: 'Cookies verwalten',
    cookie: 'Wir verwenden Analyse-Cookies (Google Analytics 4), um die Website zu verbessern.',
    accept: 'Akzeptieren',
    refuse: 'Ablehnen',
    language: 'Sprache',
    menu: 'Menü',
    tryFree: 'Shopify kostenlos testen',
  },
};

export function normalizeLang(lang: unknown): Lang {
  const normalized = String(lang ?? '').toLowerCase();
  return (SITE.supportedLangs as readonly string[]).includes(normalized) ? (normalized as Lang) : 'fr';
}

function normalizePathname(pathname: string): string {
  let path = pathname || '/';
  if (path !== '/') path = path.replace(/\/+$/, '');
  return path.replace(/\.html$/, '');
}

export function getLangFromPathname(pathname: string): Lang {
  const path = normalizePathname(pathname);
  if (path === '/en' || path.startsWith('/en/')) return 'en';
  if (path === '/es' || path.startsWith('/es/')) return 'es';
  if (path === '/de' || path.startsWith('/de/')) return 'de';
  return 'fr';
}

export function prefixPath(lang: Lang): string {
  return lang === 'fr' ? '' : `/${lang}`;
}

type TranslationKey = 'home' | 'blog_index' | 'tutorial_2025' | 'legal_notice' | 'privacy_policy';

const ROUTE_BY_KEY: Record<TranslationKey, Record<Lang, string>> = {
  home: {
    fr: '/',
    en: '/en/',
    es: '/es/',
    de: '/de/',
  },
  blog_index: {
    fr: '/blog',
    en: '/en/blog',
    es: '/es/blog',
    de: '/de/blog',
  },
  tutorial_2025: {
    fr: '/blog-shopify',
    en: '/en/blog-shopify',
    es: '/es/blog-shopify',
    de: '/de/blog-shopify',
  },
  legal_notice: {
    fr: '/mentions-legales',
    en: '/en/legal-notice',
    es: '/es/legal-notice',
    de: '/de/legal-notice',
  },
  privacy_policy: {
    fr: '/politique-de-confidentialite',
    en: '/en/privacy-policy',
    es: '/es/privacy-policy',
    de: '/de/privacy-policy',
  },
};

function translationKeyFromPath(pathname: string): TranslationKey | null {
  const p = normalizePathname(pathname);
  if (p === '/' || p === '') return 'home';
  if (p === '/blog') return 'blog_index';
  if (p === '/blog-shopify') return 'tutorial_2025';
  if (p === '/mentions-legales' || p === '/legal-notice') return 'legal_notice';
  if (p === '/politique-de-confidentialite' || p === '/privacy-policy') return 'privacy_policy';
  return null;
}

export function homePath(lang: Lang): string {
  return ROUTE_BY_KEY.home[lang];
}

export function blogIndexPath(lang: Lang): string {
  return ROUTE_BY_KEY.blog_index[lang];
}

export function tutorialPath(lang: Lang): string {
  return ROUTE_BY_KEY.tutorial_2025[lang];
}

export function primaryAffiliateUrl(): string {
  return SITE.affiliateUrl;
}

export function legalNoticePath(lang: Lang): string {
  return ROUTE_BY_KEY.legal_notice[lang];
}

export function privacyPath(lang: Lang): string {
  return ROUTE_BY_KEY.privacy_policy[lang];
}

export function localizedUrl(pathname: string, lang: Lang): string {
  const target = normalizeLang(lang);
  const path = normalizePathname(pathname);

  // Strip any existing lang prefix (en/es/de). FR has no prefix.
  const withoutPrefix =
    path === '/en' || path.startsWith('/en/')
      ? path.replace(/^\/en\b/, '') || '/'
      : path === '/es' || path.startsWith('/es/')
        ? path.replace(/^\/es\b/, '') || '/'
        : path === '/de' || path.startsWith('/de/')
          ? path.replace(/^\/de\b/, '') || '/'
          : path;

  const key = translationKeyFromPath(withoutPrefix);
  if (key) return ROUTE_BY_KEY[key][target];

  // Fallback: keep same path after stripping prefix, just add new prefix.
  if (withoutPrefix === '/' || withoutPrefix === '') return homePath(target);
  const cleaned = withoutPrefix.startsWith('/') ? withoutPrefix : `/${withoutPrefix}`;
  return `${prefixPath(target)}${cleaned}`;
}
