import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Upload, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { PortfolioGallery, type PortfolioItem } from '@/components/portfolio-gallery';
import { pageHead } from '@/lib/page-head';
import { WORK_EMAIL } from '@/lib/8pix';
import { mediaTypeLabels } from '@/lib/portfolio-curations';

export const Route = createFileRoute('/add-work')({ staticData: { sitemap: false }, head: () => ({ ...pageHead('Add photos', 'Private studio page for 8pix Creative to add finished work to the portfolio.', '/add-work'), meta: [...pageHead('Add photos', 'Private studio page for 8pix Creative to add finished work to the portfolio.', '/add-work').meta, { name: 'robots', content: 'noindex' }] }), component: AddWork });

const FOLDERS = ['photos', 'videos', 'floor-plans', 'panorama'] as const;
type Folder = (typeof FOLDERS)[number];
const acceptByFolder: Record<Folder, string> = {
  photos: '.jpg,.jpeg,.png,.webp',
  videos: '.mp4,.webm,.mov',
  'floor-plans': '.jpg,.jpeg,.png,.webp',
  panorama: '.jpg,.jpeg,.png,.webp',
};
const hintByFolder: Record<Folder, string> = {
  photos: 'JPG, PNG or WebP · 10 MB each',
  videos: 'MP4, WebM or MOV · 200 MB each',
  'floor-plans': 'JPG, PNG or WebP · 10 MB each',
  panorama: 'JPG, PNG or WebP · 10 MB each',
};
const labelByFolder: Record<Folder, string> = { photos: 'Photos', videos: 'Videos', 'floor-plans': 'Floor plans', panorama: 'Panorama' };

function validateFile(file: File, folder: Folder) {
  const isVideo = folder === 'videos';
  const max = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > max) throw new Error(isVideo ? 'Videos must be 200 MB or smaller.' : 'Each file must be 10 MB or smaller.');
  if (isVideo) {
    if (!/\.(mp4|webm|mov)$/i.test(file.name)) throw new Error('Use MP4, WebM or MOV videos.');
  } else if (!/\.(jpe?g|png|webp)$/i.test(file.name)) throw new Error('Use JPG, PNG or WebP images.');
}

function AddWork() {
  const [email, setEmail] = useState<string | null>(null);
  const [owner, setOwner] = useState<boolean | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [folder, setFolder] = useState<Folder>('photos');

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
    const files = (fd.getAll('media') as File[]).filter(f => f.size);
    const title = String(fd.get('title') || '').trim(); const category = String(fd.get('category'));
    const description = String(fd.get('description') || '').trim().slice(0, 500);
    if (!files.length) return setMsg('Choose at least one file.');
    if (title.length < 2) return setMsg('Add a short title.');
    try { for (const f of files) validateFile(f, folder); } catch (err) { return setMsg(err instanceof Error ? err.message : 'File check failed.'); }
    setBusy(true);
    const { data: u } = await supabase.auth.getUser(); const uid = u.user!.id;
    try {
      for (const [i, f] of files.entries()) {
        const path = `${uid}/${crypto.randomUUID()}.${f.name.split('.').pop()!.toLowerCase()}`;
        const up = await supabase.storage.from('portfolio-work').upload(path, f, { contentType: f.type });
        if (up.error) throw up.error;
        const ins = await supabase.from('portfolio_work').insert({ title: files.length > 1 ? `${title} ${i + 1}` : title, category, description, image_path: path, owner_id: uid, media_type: folder });
        if (ins.error) throw ins.error;
      }
      form.reset(); setFolder('photos'); setMsg(`${files.length} file${files.length > 1 ? 's' : ''} added — now live on the Our work page.`); setRefresh(r => r + 1);
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
        <div className="form-field"><label htmlFor="folder">Folder</label><select id="folder" name="folder" value={folder} onChange={e => setFolder(e.target.value as Folder)}>{FOLDERS.map(f => <option key={f} value={f}>{labelByFolder[f]}</option>)}</select></div>
        <div className="form-field full"><label htmlFor="description">Short note (optional)</label><textarea id="description" name="description" maxLength={500} /></div>
        <div className="form-field full"><span className="upload-label">{labelByFolder[folder]}</span><label className="file-zone"><Upload /><span>Choose one or more files</span><small>{hintByFolder[folder]}</small><input aria-label={labelByFolder[folder]} type="file" name="media" multiple accept={acceptByFolder[folder]} /></label></div>
      </div>{msg && <p className="form-error" role="status">{msg}</p>}
      <div className="form-bottom"><Button variant="studio" type="submit" disabled={busy}>{busy ? <><Loader2 className="animate-spin" />Uploading…</> : <>Add to website <Upload /></>}</Button><Button type="button" variant="studioGhost" onClick={() => supabase.auth.signOut()}>Sign out <LogOut /></Button></div></form>
      <h2 className="display-title mt-16" style={{ fontSize: 40 }}>On the website now</h2>
      <PortfolioGallery onDelete={remove} refreshKey={refresh} />
    </>}
    {!owner && msg && <p className="form-error">{msg}</p>}
  </div></section>;
}
