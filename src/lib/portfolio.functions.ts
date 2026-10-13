import { createServerFn } from '@tanstack/react-start';

export type PortfolioItem = { id: string; title: string; category: string; description: string; image_path: string; url: string };

// Public read: only photos listed as published work get a short-lived link.
export const listPortfolio = createServerFn({ method: 'GET' }).handler(async (): Promise<PortfolioItem[]> => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data, error } = await supabaseAdmin.from('portfolio_work').select('id,title,category,description,image_path').order('created_at', { ascending: false }).limit(200);
  if (error || !data?.length) return [];
  const { data: signed } = await supabaseAdmin.storage.from('portfolio-work').createSignedUrls(data.map(d => d.image_path), 60 * 60 * 6);
  return data.map((d, i) => ({ ...d, url: signed?.[i]?.signedUrl ?? '' })).filter(d => d.url);
});
