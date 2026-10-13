import { useEffect, useState } from 'react';
import { listPortfolio, type PortfolioItem } from '@/lib/portfolio.functions';

export type { PortfolioItem };

export function PortfolioGallery({ onDelete, refreshKey = 0 }: { onDelete?: (item: PortfolioItem) => void; refreshKey?: number }) {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  useEffect(() => { listPortfolio().then(setItems).catch(() => setItems([])); }, [refreshKey]);
  if (!items) return <p className="micro text-muted-foreground">Loading recent work…</p>;
  if (!items.length) return onDelete ? <p className="text-muted-foreground">No photos added yet.</p> : null;
  return <div className="work-grid mt-10">{items.map(w => <article className="work-item" key={w.id}><img src={w.url} alt={w.title} loading="lazy" /><div className="work-meta micro"><span>{w.category}</span><span>Recent work</span></div><h3>{w.title}</h3>{w.description && <p className="text-muted-foreground mt-2">{w.description}</p>}{onDelete && <button className="micro text-primary mt-3 underline" onClick={() => onDelete(w)}>Remove this photo</button>}</article>)}</div>;
}
