import {createFileRoute} from '@tanstack/react-router';
import {PackagesSection} from '@/components/studio-sections';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/packages')({head:()=>pageHead('Real estate editing packages','Starter $25, Professional $60 and Premium $120 photo editing packages. Compare inclusions, add-ons and custom quotes from 8pix Creative.'),component:PackagesSection});
