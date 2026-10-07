import {createFileRoute} from '@tanstack/react-router';
import {ServicesSection,RhythmSection} from '@/components/studio-sections';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/services')({head:()=>pageHead('Editing services','Interior editing, exterior enhancement and day-to-dusk property photo editing from 8pix Creative. Photography is not included.'),component:Services});
function Services(){return <><ServicesSection/><RhythmSection/></>}
