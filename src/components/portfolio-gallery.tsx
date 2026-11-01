import { useEffect, useState } from 'react';
import { listPortfolio, type PortfolioItem } from '@/lib/portfolio.functions';
import { mediaTypeLabels } from '@/lib/portfolio-curations';
import { MediaViewer, type ViewerMedia } from '@/components/media-viewer';

export type { PortfolioItem };

export function PortfolioGallery({ onDelete, refreshKey = 0 }: { onDelete?: (item: PortfolioItem) => void; refreshKey?: number }) {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const [filter, setFilter] = useState('All');
  const [viewer, setViewer] = useState<ViewerMedia | null>(null);
  useEffect(() => { listPortfolio().then(setItems).catch(() => setItems([])); }, [refreshKey]);
  if (!items) return <p className="micro text-muted-foreground">Loading recent work…</p>;
  if (!items.length) return onDelete ? <p className="text-muted-foreground">No photos added yet.</p> : null;
  const label = (m: string) => mediaTypeLabels[m] ?? m;
  const types = ['All', ...new Set(items.map(i => i.media_type))];
  const shown = filter === 'All' ? items : items.filter(i => i.media_type === filter);
  return <div>
    {types.length > 1 && <div className="filter-chips" role="group" aria-label="Filter uploads by folder">
      {types.map(t => <button key={t} type="button" className={`filter-chip${filter === t ? ' active' : ''}`} aria-pressed={filter === t} onClick={() => setFilter(t)}>{t === 'All' ? 'All' : label(t)}</button>)}
    </div>}
    <div className="work-grid">{shown.map(w => <article className="work-item" key={w.id}>
      <button type="button" className="media-button" onClick={() => setViewer({ kind: w.media_type === 'videos' ? 'video' : 'photo', src: w.url, title: w.title, category: w.category })} aria-label={`View ${w.title} enlarged`}><img src={w.url} alt={w.title} loading="lazy" /></button>
      <div className="work-meta micro"><span>{w.category}</span><span>{label(w.media_type)}</span></div>
      <h3>{w.title}</h3>
      {w.description && <p className="text-muted-foreground mt-2">{w.description}</p>}
      {onDelete && <button className="micro text-primary mt-3 underline" onClick={() => onDelete(w)}>Remove this photo</button>}
    </article>)}</div>
    <MediaViewer item={viewer} onClose={() => setViewer(null)} />
  </div>;
}
