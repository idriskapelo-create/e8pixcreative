import { packages } from './8pix';

export const SITE_URL = 'https://e8pixcreative.lovable.app';

type JsonLd = Record<string, unknown>;

export function pageHead(title: string, description: string, path = '/', jsonLd: JsonLd[] = []) {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`;
  const fullTitle = `${title} — 8pix Creative`;
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: jsonLd.map((data) => ({ type: 'application/ld+json', children: JSON.stringify(data) })),
  };
}

const provider = { '@type': 'Organization', name: '8pix Creative', url: SITE_URL };

export const servicesJsonLd: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Real estate photo editing',
  provider,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Property photo editing services',
    itemListElement: ['Interior editing', 'Exterior enhancement', 'Day-to-dusk editing'].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
    })),
  },
};

// Verified public portfolio photos on the published site (content-hashed, stable while the photo is unchanged).
const PUBLISHED_ASSETS = 'https://e8pixcreative.lovable.app/assets';
export const packageImages: Record<string, string> = {
  starter: `${PUBLISHED_ASSETS}/canva-03-DMPHm46U.jpg`,
  professional: `${PUBLISHED_ASSETS}/canva-06-C2ClXb_t.jpg`,
  premium: `${PUBLISHED_ASSETS}/canva-27-B8TVnN8z.jpg`,
};
export const CANONICAL_PACKAGES_URL = 'https://8pixcreatives.org/packages';

export const packagesJsonLd: JsonLd[] = packages.map((p) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${p.name} real estate photo editing package`,
  description: `Up to ${p.photos} edited photos, ${p.removal} object removals, ${p.dusk} day-to-dusk edits, ${p.revisions} revision round(s), ${p.turnaround} turnaround. Best for ${p.best.toLowerCase()}.`,
  image: packageImages[p.id],
  brand: { '@type': 'Brand', name: '8pix Creative' },
  offers: { '@type': 'Offer', price: p.price, priceCurrency: 'USD', url: CANONICAL_PACKAGES_URL, availability: 'https://schema.org/InStock' },
}));
