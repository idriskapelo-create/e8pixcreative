import {createFileRoute} from '@tanstack/react-router';
import {ServicesSection,RhythmSection} from '@/components/studio-sections';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/services')({staticData:{sitemap:true},head:()=>pageHead('Editing services','Interior editing, exterior enhancement and day-to-dusk property photo editing from 8pix Creative. Photography is not included.','/services'),component:Services});
function Services(){return <><h1 className="sr-only">Real estate photo editing services</h1><ServicesSection/><RhythmSection/></>}
