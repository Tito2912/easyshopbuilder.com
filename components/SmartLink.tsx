import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { primaryAffiliateUrl } from '@/lib/site';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  children?: ReactNode;
};

function mergeRel(existing: string | undefined, required: string[]): string | undefined {
  const tokens = new Set(String(existing ?? '').split(/\s+/).filter(Boolean));
  for (const token of required) tokens.add(token);
  return tokens.size ? Array.from(tokens).join(' ') : undefined;
}

function isShopifyDomain(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === 'shopify.com' || h.endsWith('.shopify.com');
}

function buildShopifyAffiliateDeepLink(destination: string): string {
  const base = new URL(primaryAffiliateUrl());
  base.searchParams.set('u', destination);
  return base.toString();
}

export function SmartLink({ href, rel, ...props }: Props) {
  if (!href) return <a rel={rel} {...props} />;

  // Keep internal / hash links unchanged.
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return <a href={href} rel={rel} {...props} />;
  }

  if (!href.startsWith('http://') && !href.startsWith('https://')) {
    return <a href={href} rel={rel} {...props} />;
  }

  try {
    const url = new URL(href);
    const isAffiliate = url.hostname.toLowerCase() === 'shopify.pxf.io';
    const shouldAffiliate = !isAffiliate && isShopifyDomain(url.hostname);
    const finalHref = shouldAffiliate ? buildShopifyAffiliateDeepLink(href) : href;

    if (isAffiliate || shouldAffiliate) {
      const finalRel = mergeRel(rel, ['nofollow', 'sponsored', 'noopener', 'noreferrer']);
      return <a href={finalHref} rel={finalRel} {...props} />;
    }

    // Non-affiliate external link: keep safe rel defaults.
    const finalRel = mergeRel(rel, ['noopener', 'noreferrer']);
    return <a href={finalHref} rel={finalRel} {...props} />;
  } catch {
    return <a href={href} rel={rel} {...props} />;
  }
}

