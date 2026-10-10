import { createFileRoute } from '@tanstack/react-router';
import { Hero, ServicesSection, WorkSection, StandardSection, RhythmSection, PackagesSection } from '@/components/studio-sections';
import { ContactSection } from '@/components/contact-section';
import { pageHead, servicesJsonLd } from '@/lib/page-head';
export const Route=createFileRoute('/')({staticData:{sitemap:true},head:()=>pageHead('Real estate photo editing','8pix Creative refines real estate photos with interior, exterior and day-to-dusk editing. Explore packages from $25 and request your next edit.','/',[servicesJsonLd]),component:Index});
function Index(){return <><Hero/><ServicesSection/><WorkSection/><StandardSection/><RhythmSection/><PackagesSection/><ContactSection/></>}
