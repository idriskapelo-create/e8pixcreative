import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export type ViewerMedia = { kind: 'photo' | 'video'; src: string; poster?: string; title: string; category?: string };

// Accessible enlarged viewer: Escape closes, focus starts on the close button
// and returns to the opener when the viewer closes.
export function MediaViewer({ item, onClose }: { item: ViewerMedia | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;
    const opener = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab' && !closeRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [item, onClose]);

  if (!item) return null;
  return (
    <div className="media-viewer" role="dialog" aria-modal="true" aria-label={`${item.title}${item.category ? ` — ${item.category}` : ''}`} onClick={onClose}>
      <div className="media-viewer-inner" onClick={(e) => e.stopPropagation()}>
        {item.kind === 'photo'
          ? <img src={item.src} alt={item.title} />
          : <video src={item.src} poster={item.poster} controls autoPlay playsInline />}
        <div className="media-viewer-meta micro"><span>{item.category}</span><span>{item.title}</span></div>
      </div>
      <button ref={closeRef} className="media-viewer-close" type="button" onClick={onClose} aria-label="Close viewer"><X /></button>
    </div>
  );
}
