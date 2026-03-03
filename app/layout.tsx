import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE } from '@/lib/site';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { CookieBanner } from '@/components/CookieBanner';
import { LangHtmlUpdater } from '@/components/LangHtmlUpdater';
import { FaqEnhancer } from '@/components/FaqEnhancer';
import { BlogSearchEnhancer } from '@/components/BlogSearchEnhancer';

export const viewport: Viewport = {
  themeColor: '#008060',
};

export const metadata: Metadata = {
  title: {
    default: SITE.brandName,
    template: `%s | ${SITE.brandName}`,
  },
  description:
    'Guide Shopify par EasyShopBuilder : thèmes rapides, Shop Pay, POS, apps, SEO et essai gratuit pour lancer une boutique performante.',
  metadataBase: new URL(SITE.baseUrl),
  alternates: { canonical: '/' },
  verification: {
    google: 'Utjj0xseLRA7JSDzkEOOFMeyaGAzuhU7lrCFw6Dxew8',
  },
  icons: {
    icon: [{ url: '/images/favicon-shopify.png', type: 'image/png' }],
    apple: [{ url: '/images/favicon-shopify-180.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    title: SITE.brandName,
    description:
      'Guide Shopify par EasyShopBuilder : POS, Shop Pay, apps, SEO et checklist de lancement.',
    url: SITE.baseUrl,
    images: [{ url: '/images/capture-ecran-dashboard.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.brandName,
    description:
      'Guide Shopify par EasyShopBuilder : POS, Shop Pay, apps, SEO et checklist de lancement.',
    images: ['/images/capture-ecran-dashboard.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <LangHtmlUpdater />
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
