import {createFileRoute} from '@tanstack/react-router';
import {StandardSection} from '@/components/studio-sections';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/standard')({head:()=>pageHead('Our editing standard','Natural, consistent property photo edits, with a human eye on every frame. Discover the 8pix Creative standard.'),component:StandardSection});
