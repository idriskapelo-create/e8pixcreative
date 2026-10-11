import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type PortfolioItem = { id: string; title: string; category: string; description: string; image_path: string; url: string };

export async function loadPortfolio(): Promise<PortfolioItem[]> {
  const { data, error } = await supabase.from('portfolio_work').select('id,title,category,description,image_path').order('created_at', { ascending: false });
  if (error || !data?.length) return [];
  const { data: signed } = await supabase.storage.from('portfolio-work').createSignedUrls(data.map(d => d.image_path), 60 * 60 * 24);
  return data.map((d, i) => ({ ...d, url: signed?.[i]?.signedUrl ?? '' })).filter(d => d.url);
}

export function PortfolioGallery({ onDelete, refreshKey = 0 }: { onDelete?: (item: PortfolioItem) => void; refreshKey?: number }) {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  useEffect(() => { loadPortfolio().then(setItems); }, [refreshKey]);
  if (!items) return <p className="micro text-muted-foreground">Loading recent work…</p>;
  if (!items.length) return onDelete ? <p className="text-muted-foreground">No photos added yet.</p> : null;
  return <div className="work-grid mt-10">{items.map(w => <article className="work-item" key={w.id}><img src={w.url} alt={w.title} loading="lazy" /><div className="work-meta micro"><span>{w.category}</span><span>Recent work</span></div><h3>{w.title}</h3>{w.description && <p className="text-muted-foreground mt-2">{w.description}</p>}{onDelete && <button className="micro text-primary mt-3 underline" onClick={() => onDelete(w)}>Remove this photo</button>}</article>)}</div>;
}
