import {createFileRoute} from '@tanstack/react-router';
import {PackagesSection} from '@/components/studio-sections';
import {pageHead,packagesJsonLd} from '@/lib/page-head';
export const Route=createFileRoute('/packages')({staticData:{sitemap:true},head:()=>pageHead('Real estate editing packages','Starter $25, Professional $60 and Premium $120 photo editing packages. Compare inclusions, add-ons and custom quotes from 8pix Creative.','/packages',packagesJsonLd),component:Page});
function Page(){return <><h1 className="sr-only">Real estate photo editing packages and pricing</h1><PackagesSection/></>}
