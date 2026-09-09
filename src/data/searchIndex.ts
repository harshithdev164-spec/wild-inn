import { DESTINATIONS, COMING_SOON } from './destinationsData';
import { FAQS } from '../data';

export type SearchEntry = {
  id: string;
  group: 'Experiences' | 'Pages' | 'FAQ';
  title: string;
  subtitle?: string;
  /** Route to navigate to on select. Omitted for FAQ entries (they expand inline). */
  to?: string;
  /** FAQ answer, shown inline. */
  answer?: string;
  keywords: string;
};

const PAGES: SearchEntry[] = [
  { id: 'page-home', group: 'Pages', title: 'Home', to: '/', keywords: 'home wild inn start' },
  { id: 'page-experiences', group: 'Pages', title: 'Experiences', subtitle: 'All safari journeys & packages', to: '/experiences', keywords: 'experiences tours packages safaris journeys prices' },
  { id: 'page-reels', group: 'Pages', title: 'Reels', subtitle: 'Short films from the field', to: '/reels', keywords: 'reels videos clips instagram watch' },
  { id: 'page-gallery', group: 'Pages', title: 'Gallery', subtitle: 'Photographs from our journeys', to: '/gallery', keywords: 'gallery photos photographs images pictures' },
  { id: 'page-about', group: 'Pages', title: 'About', subtitle: 'The story behind Wild Inn', to: '/about', keywords: 'about story founder nagadharshan team philosophy' },
  { id: 'page-contact', group: 'Pages', title: 'Contact', subtitle: 'Plan your trip with us', to: '/contact', keywords: 'contact phone whatsapp email enquiry booking plan adventure' },
];

export function buildSearchIndex(): SearchEntry[] {
  const experiences: SearchEntry[] = [
    ...DESTINATIONS.map((d): SearchEntry => ({
      id: `dest-${d.id}`,
      group: 'Experiences',
      title: d.name,
      subtitle: d.packages.length
        ? `${d.packages.length} package${d.packages.length > 1 ? 's' : ''} · from ${
            [...d.packages].sort((a, b) => priceValue(a.price) - priceValue(b.price))[0].price
          }`
        : d.description,
      to: `/experiences/${d.id}`,
      keywords: [
        d.name,
        d.description,
        ...d.packages.map((p) => `${p.name} ${p.price} ${p.unit} ${p.highlights.join(' ')}`),
      ]
        .join(' ')
        .toLowerCase(),
    })),
    ...COMING_SOON.map((c): SearchEntry => ({
      id: `soon-${c.id}`,
      group: 'Experiences',
      title: c.name,
      subtitle: 'Coming soon',
      to: '/experiences',
      keywords: `${c.name} ${c.description} coming soon`.toLowerCase(),
    })),
  ];

  const faq: SearchEntry[] = FAQS.map((f) => ({
    id: `faq-${f.id}`,
    group: 'FAQ' as const,
    title: f.question,
    answer: f.answer,
    keywords: `${f.question} ${f.answer}`.toLowerCase(),
  }));

  return [...experiences, ...PAGES, ...faq];
}

function priceValue(price: string): number {
  const n = Number(price.replace(/[^\d]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : Number.MAX_SAFE_INTEGER;
}

/** Case-insensitive token match; ranks title/prefix hits above body hits. */
export function searchEntries(entries: SearchEntry[], raw: string): SearchEntry[] {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/);

  return entries
    .map((e) => {
      const title = e.title.toLowerCase();
      const hay = `${title} ${e.subtitle ?? ''} ${e.keywords}`.toLowerCase();
      if (!tokens.every((t) => hay.includes(t))) return null;
      let score = 0;
      if (title.startsWith(q)) score += 100;
      else if (title.includes(q)) score += 50;
      if (tokens.every((t) => title.includes(t))) score += 20;
      if (e.group === 'Experiences') score += 5;
      return { e, score };
    })
    .filter((x): x is { e: SearchEntry; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((x) => x.e);
}
