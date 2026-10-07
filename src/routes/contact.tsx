import {createFileRoute} from '@tanstack/react-router';
import {ContactSection} from '@/components/contact-section';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/contact')({validateSearch:(search:Record<string,unknown>)=>({package:typeof search.package==='string'&&['starter','professional','premium','custom'].includes(search.package)?search.package:'custom'}),head:()=>pageHead('Request an edit','Request your next property edit, upload your photos, or contact 8pix Creative directly on WhatsApp, Facebook, Instagram, TikTok or LinkedIn.'),component:Contact});
function Contact(){const search=Route.useSearch();return <ContactSection initialPackage={search.package}/>}
