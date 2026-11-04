// Curated portfolio media supplied directly by the studio. Every entry is real,
// finished 8pix Creative work — no stock imagery, no invented comparisons.
// Media ships as regular files inside the project so it loads on every domain
// (CDN pointer URLs were not reachable from the custom domain).
import dayRowhouse from '@/assets/portfolio/portfolio-exterior-day.jpg';
import duskRowhouse from '@/assets/portfolio/portfolio-exterior-dusk.jpg';
import porchDusk from '@/assets/portfolio/portfolio-porch-dusk.jpg';
import townhouse from '@/assets/portfolio/portfolio-townhouse.jpg';
import walkthroughVideo from '@/assets/portfolio/portfolio-video-walkthrough.mp4';
import reelVideo from '@/assets/portfolio/portfolio-video-reel.mp4';
import walkthroughPoster from '@/assets/portfolio/poster-video-walkthrough.jpg';
import reelPoster from '@/assets/portfolio/poster-video-reel.jpg';

export type CuratedPhoto = { kind: 'photo'; url: string; category: string; title: string; alt: string };
export type CuratedVideo = { kind: 'video'; url: string; poster: string; category: string; title: string; alt: string; orientation: 'square' | 'portrait'; duration: string };

export const curatedPhotos: CuratedPhoto[] = [
  { kind: 'photo', url: duskRowhouse, category: 'Day-to-dusk', title: 'Rowhouse at dusk', alt: 'Two-storey rowhouse exterior edited into a believable twilight with a warm sky' },
  { kind: 'photo', url: dayRowhouse, category: 'Exterior editing', title: 'Rowhouse in daylight', alt: 'The same rowhouse exterior finished with a clean daylight sky and balanced exposure' },
  { kind: 'photo', url: porchDusk, category: 'Day-to-dusk', title: 'Porch house at blue hour', alt: 'Grey single-family home with a covered porch edited into blue-hour light' },
  { kind: 'photo', url: townhouse, category: 'Exterior editing', title: 'Townhouse curb appeal', alt: 'Townhouse exterior finished with a bright sky, tidy landscaping and balanced colour' },
];

export const curatedVideos: CuratedVideo[] = [
  { kind: 'video', url: walkthroughVideo, poster: walkthroughPoster, category: 'Real estate videos', title: 'Exterior walkthrough', alt: 'Finished exterior walkthrough video moving along a single-family home', orientation: 'square', duration: '0:31' },
  { kind: 'video', url: reelVideo, poster: reelPoster, category: 'Real estate videos', title: 'Editing reel', alt: 'Vertical editing reel showing a home finished from daylight into dusk', orientation: 'portrait', duration: '0:25' },
];

export const curatedPhotoCategories = [...new Set(curatedPhotos.map((p) => p.category))];
export const curatedVideoCategories = [...new Set(curatedVideos.map((v) => v.category))];

export const mediaTypeLabels: Record<string, string> = {
  photos: 'Photos',
  videos: 'Videos',
  'floor-plans': 'Floor plans',
  panorama: 'Panorama',
};
