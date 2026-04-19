import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { SITE } from '@/lib/site';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { CookieBanner } from '@/components/CookieBanner';
import { FaqEnhancer } from '@/components/FaqEnhancer';
import { BlogSearchEnhancer } from '@/components/BlogSearchEnhancer';
import { SiteJsonLd } from '@/components/SiteJsonLd';

const IMPACT_SITE_VERIFICATION = 'be35d292-d9c2-41c8-aaae-3d4414df6085';

export const viewport: Viewport = {
  themeColor: '#008060',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: SITE.brandName,
    template: '%s',
  },
  description:
    'Guía Shopify de EasyShopBuilder: temas rápidos, Shop Pay, configuración POS, apps, SEO y prueba gratis para lanzar una tienda que convierte.',
  verification: {
    google: 'Utjj0xseLRA7JSDzkEOOFMeyaGAzuhU7lrCFw6Dxew8',
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon.png', type: 'image/png', sizes: '96x96' }],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    title: SITE.brandName,
    description: 'Guía Shopify de EasyShopBuilder: POS, Shop Pay, apps, SEO y checklist de lanzamiento.',
    url: SITE.baseUrl,
    siteName: SITE.brandName,
    images: [{ url: '/images/capture-ecran-dashboard.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.brandName,
    description: 'Guía Shopify de EasyShopBuilder: POS, Shop Pay, apps, SEO y checklist de lanzamiento.',
    images: ['/images/capture-ecran-dashboard.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta
          name="impact-site-verification"
          content={IMPACT_SITE_VERIFICATION}
          {...({ value: IMPACT_SITE_VERIFICATION } as any)}
        />
      </head>
      <body>
        <SiteJsonLd lang="es" />
        <FaqEnhancer />
        <BlogSearchEnhancer />
        <SiteHeader />
        <main className="container">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}

