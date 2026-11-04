import { describe, expect, it } from 'vitest';
import { curatedPhotoCategories, curatedPhotos, curatedVideos, mediaTypeLabels } from '@/lib/portfolio-curations';

describe('curated portfolio media', () => {
 it('shows photo categories only for assets that actually exist', () => {
  expect(curatedPhotoCategories).toEqual(['Day-to-dusk', 'Exterior editing']);
  expect(curatedPhotos).toHaveLength(4);
  for (const photo of curatedPhotos) {
   expect(photo.url).toMatch(/portfolio-(exterior-day|exterior-dusk|porch-dusk|townhouse)\.jpg$/);
   expect(photo.alt.length).toBeGreaterThan(10);
   expect(photo.title.length).toBeGreaterThan(2);
  }
 });
 it('gives every finished video a poster frame and a playable file', () => {
  expect(curatedVideos).toHaveLength(2);
  for (const video of curatedVideos) {
   expect(video.url).toMatch(/\.mp4$/);
   expect(video.poster).toMatch(/\.jpg$/);
   expect(['square', 'portrait']).toContain(video.orientation);
   expect(video.duration).toMatch(/^\d:\d\d$/);
  }
 });
 it('labels all four studio upload folders', () => {
  expect(Object.keys(mediaTypeLabels).sort()).toEqual(['floor-plans', 'panorama', 'photos', 'videos']);
 });
});
