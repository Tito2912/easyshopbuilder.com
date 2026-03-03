'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  blogIndexPath,
  getLangFromPathname,
  legalNoticePath,
  privacyPath,
  tutorialPath,
  SITE,
  UI_TRANSLATIONS,
} from '@/lib/site';

const CONSENT_KEY = 'easyshopbuilder_cookies_v1';

function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
  try {
    const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_KEY}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  } catch {
    // ignore
  }
}

export function SiteFooter() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = UI_TRANSLATIONS[lang];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-meta">
          <div>
            <strong>{SITE.brandName}</strong>
          </div>
          <nav aria-label="Utility links" className="footer-nav">
            <Link href={tutorialPath(lang)}>{t.tutorial}</Link>
            <span aria-hidden="true" className="nav-sep" />
            <Link href={legalNoticePath(lang)}>{t.legal}</Link>
            <Link href={privacyPath(lang)}>{t.privacy}</Link>
            <button
              className="footer-cookie"
              onClick={() => {
                clearConsent();
                window.location.reload();
              }}
              type="button"
            >
              {t.manageCookies}
            </button>
            <Link href={blogIndexPath(lang)}>{t.blog}</Link>
          </nav>
        </div>
        <div className="footer-sub">© {new Date().getFullYear()} — {SITE.brandName}</div>
      </div>
    </footer>
  );
}
