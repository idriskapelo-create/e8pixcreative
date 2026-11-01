import { useState } from 'react';
import { Play } from 'lucide-react';
import { curatedPhotoCategories, curatedPhotos, curatedVideos } from '@/lib/portfolio-curations';
import { MediaViewer, type ViewerMedia } from '@/components/media-viewer';

export function CuratedPhotos() {
  const [filter, setFilter] = useState('All');
  const [viewer, setViewer] = useState<ViewerMedia | null>(null);
  const shown = filter === 'All' ? curatedPhotos : curatedPhotos.filter((p) => p.category === filter);
  return (
    <div>
      <div className="filter-chips" role="group" aria-label="Filter photos by editing type">
        {['All', ...curatedPhotoCategories].map((c) => (
          <button key={c} type="button" className={`filter-chip${filter === c ? ' active' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="work-grid">
        {shown.map((p) => (
          <article className="work-item" key={p.title}>
            <button type="button" className="media-button" onClick={() => setViewer({ kind: 'photo', src: p.url, title: p.title, category: p.category })} aria-label={`View ${p.title} enlarged`}>
              <img src={p.url} alt={p.alt} loading="lazy" />
            </button>
            <div className="work-meta micro"><span>{p.category}</span><span>Edited photo</span></div>
            <h3>{p.title}</h3>
          </article>
        ))}
      </div>
      <MediaViewer item={viewer} onClose={() => setViewer(null)} />
    </div>
  );
}

export function VideoShowcase() {
  const [viewer, setViewer] = useState<ViewerMedia | null>(null);
  return (
    <div>
      <div className="video-grid">
        {curatedVideos.map((v) => (
          <article className={`video-item ${v.orientation}`} key={v.title}>
            <div className="video-frame">
              <button type="button" className="media-button" onClick={() => setViewer({ kind: 'video', src: v.url, poster: v.poster, title: v.title, category: v.category })} aria-label={`Play ${v.title}`}>
                <img src={v.poster} alt={v.alt} loading="lazy" />
                <span className="video-play" aria-hidden="true"><Play /></span>
                <span className="video-duration micro">{v.duration}</span>
              </button>
            </div>
            <div className="work-meta micro"><span>{v.category}</span><span>Finished edit</span></div>
            <h3>{v.title}</h3>
          </article>
        ))}
      </div>
      <p className="video-note micro">Videos play with full sound and playback controls.</p>
      <MediaViewer item={viewer} onClose={() => setViewer(null)} />
    </div>
  );
}
