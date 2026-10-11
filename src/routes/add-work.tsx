import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Upload, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { PortfolioGallery, type PortfolioItem } from '@/components/portfolio-gallery';
import { pageHead } from '@/lib/page-head';
import { WORK_EMAIL } from '@/lib/8pix';

export const Route = createFileRoute('/add-work')({ staticData: { sitemap: false }, head: () => ({ ...pageHead('Add photos', 'Private studio page for 8pix Creative to add finished work to the portfolio.', '/add-work'), meta: [...pageHead('Add photos', 'Private studio page for 8pix Creative to add finished work to the portfolio.', '/add-work').meta, { name: 'robots', content: 'noindex' }] }), component: AddWork });

function AddWork() {
  const [email, setEmail] = useState<string | null>(null);
  const [owner, setOwner] = useState<boolean | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      setEmail(user?.email ?? null);
      if (!user) { setOwner(null); return; }
      const { data: ok } = await supabase.rpc('claim_studio_owner');
      setOwner(!!ok);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { setTimeout(check, 0); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn() { const r = await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/add-work` }); if (r.error) setMsg(r.error.message); }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg('');
    const form = e.currentTarget; const fd = new FormData(form);
    const files = (fd.getAll('photos') as File[]).filter(f => f.size);
    const title = String(fd.get('title') || '').trim(); const category = String(fd.get('category'));
    const description = String(fd.get('description') || '').trim().slice(0, 500);
    if (!files.length) return setMsg('Choose at least one photo.');
    if (title.length < 2) return setMsg('Add a short title.');
    if (files.some(f => f.size > 10 * 1024 * 1024 || !/\.(jpe?g|png|webp)$/i.test(f.name))) return setMsg('Use JPG, PNG or WebP photos up to 10 MB each.');
    setBusy(true);
    const { data: u } = await supabase.auth.getUser(); const uid = u.user!.id;
    try {
      for (const [i, f] of files.entries()) {
        const path = `${uid}/${crypto.randomUUID()}.${f.name.split('.').pop()!.toLowerCase()}`;
        const up = await supabase.storage.from('portfolio-work').upload(path, f, { contentType: f.type });
        if (up.error) throw up.error;
        const ins = await supabase.from('portfolio_work').insert({ title: files.length > 1 ? `${title} ${i + 1}` : title, category, description, image_path: path, owner_id: uid });
        if (ins.error) throw ins.error;
      }
      form.reset(); setMsg(`${files.length} photo${files.length > 1 ? 's' : ''} added — now live on the Our work page.`); setRefresh(r => r + 1);
    } catch (err) { setMsg(err instanceof Error ? err.message : 'Upload failed. Please try again.'); } finally { setBusy(false); }
  }

  async function remove(item: PortfolioItem) {
    if (!confirm(`Remove "${item.title}" from the website?`)) return;
    await supabase.from('portfolio_work').delete().eq('id', item.id);
    await supabase.storage.from('portfolio-work').remove([item.image_path]);
    setRefresh(r => r + 1);
  }

  return <section className="section"><div className="site-width">
    <div className="section-kicker micro"><span>Studio</span><span>Add photos</span></div>
    <h1 className="display-title">Add finished<br /><em>work.</em></h1>
    {!email && <><p className="section-intro">Only {WORK_EMAIL} can add photos. Sign in with that Google account to continue.</p><Button variant="studio" className="mt-6" onClick={signIn}>Sign in with Google</Button></>}
    {email && owner === false && <><p className="section-intro">You are signed in as {email}. Only {WORK_EMAIL} can add photos.</p><Button variant="studioOutline" className="mt-6" onClick={() => supabase.auth.signOut()}>Sign out <LogOut /></Button></>}
    {email && owner && <>
      <p className="section-intro">Signed in as {email}. Photos you add appear straight away on the Our work page.</p>
      <form onSubmit={onSubmit} className="mt-8"><div className="form-grid">
        <div className="form-field"><label htmlFor="title">Title</label><input id="title" name="title" required maxLength={100} placeholder="e.g. Lakeside living room" /></div>
        <div className="form-field"><label htmlFor="category">Type of edit</label><select id="category" name="category">{['Interior', 'Exterior', 'Day-to-dusk', 'Virtual staging', 'Object removal', 'HDR'].map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="form-field full"><label htmlFor="description">Short note (optional)</label><textarea id="description" name="description" maxLength={500} /></div>
        <div className="form-field full"><span className="upload-label">Photos</span><label className="file-zone"><Upload /><span>Choose one or more photos</span><small>JPG, PNG or WebP · 10 MB each</small><input aria-label="Photos" type="file" name="photos" multiple accept=".jpg,.jpeg,.png,.webp" /></label></div>
      </div>{msg && <p className="form-error" role="status">{msg}</p>}
      <div className="form-bottom"><Button variant="studio" type="submit" disabled={busy}>{busy ? <><Loader2 className="animate-spin" />Uploading…</> : <>Add to website <Upload /></>}</Button><Button type="button" variant="studioGhost" onClick={() => supabase.auth.signOut()}>Sign out <LogOut /></Button></div></form>
      <h2 className="display-title mt-16" style={{ fontSize: 40 }}>On the website now</h2>
      <PortfolioGallery onDelete={remove} refreshKey={refresh} />
    </>}
    {!owner && msg && <p className="form-error">{msg}</p>}
  </div></section>;
}
