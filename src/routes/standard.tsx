import {createFileRoute} from '@tanstack/react-router';
import {StandardSection} from '@/components/studio-sections';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/standard')({staticData:{sitemap:true},head:()=>pageHead('Our editing standard','Natural, consistent property photo edits, with a human eye on every frame. Discover the 8pix Creative standard.','/standard'),component:Page});
function Page(){return <><h1 className="sr-only">Our property photo editing standard</h1><StandardSection/></>}
