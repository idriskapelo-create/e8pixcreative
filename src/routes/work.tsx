import {createFileRoute} from '@tanstack/react-router';
import {WorkSection} from '@/components/studio-sections';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/work')({head:()=>pageHead('Selected property frames','Explore selected interior and twilight property images from the 8pix Creative real estate editing portfolio.'),component:WorkSection});
