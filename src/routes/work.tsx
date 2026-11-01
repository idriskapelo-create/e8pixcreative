import {createFileRoute} from '@tanstack/react-router';
import {WorkSection, SectionHeading} from '@/components/studio-sections';
import {VideoShowcase} from '@/components/curated-work';
import {PortfolioGallery} from '@/components/portfolio-gallery';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/work')({staticData:{sitemap:true},head:()=>pageHead('Selected property frames','Explore finished interior, exterior and day-to-dusk edits plus finished real estate videos from the 8pix Creative portfolio.','/work'),component:Page});
function Page(){return <>
<h1 className="sr-only">Real estate photo editing portfolio</h1>
<WorkSection/>
<section className="section paper"><div className="site-width"><SectionHeading number="03" label="Finished videos" title={<>Work that <em>moves.</em></>} description="Finished real estate videos, edited and delivered listing-ready."/><VideoShowcase/></div></section>
<section className="section"><div className="site-width"><SectionHeading number="04" label="Latest uploads" title={<>Fresh from <em>the studio.</em></>} description="The newest finished work published by the studio."/><PortfolioGallery/></div></section>
</>}
