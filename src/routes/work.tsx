import {createFileRoute} from '@tanstack/react-router';
import {WorkSection} from '@/components/studio-sections';
import {PortfolioGallery} from '@/components/portfolio-gallery';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/work')({staticData:{sitemap:true},head:()=>pageHead('Selected property frames','Explore selected interior and twilight property images from the 8pix Creative real estate editing portfolio.','/work'),component:Page});
function Page(){return <><h1 className="sr-only">Real estate photo editing portfolio</h1><WorkSection/><section className="section pt-0"><div className="site-width"><PortfolioGallery/></div></section></>}
