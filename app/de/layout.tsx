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
    'EasyShopBuilder Shopify-Guide: schnelle Themes, Shop Pay, POS-Setup, Apps, SEO und kostenloser Test, um einen performanten Store zu starten.',
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
    description: 'EasyShopBuilder Shopify-Guide: POS, Shop Pay, Apps, SEO und Launch-Checkliste.',
    url: SITE.baseUrl,
    siteName: SITE.brandName,
    images: [{ url: '/images/capture-ecran-dashboard.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.brandName,
    description: 'EasyShopBuilder Shopify-Guide: POS, Shop Pay, Apps, SEO und Launch-Checkliste.',
    images: ['/images/capture-ecran-dashboard.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta
          name="impact-site-verification"
          content={IMPACT_SITE_VERIFICATION}
          {...({ value: IMPACT_SITE_VERIFICATION } as any)}
        />
      </head>
      <body>
        <SiteJsonLd lang="de" />
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

