import { useEffect, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Our work' },
  { to: '/services', label: 'Services' },
  { to: '/packages', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
] as const;

function Brand(){return <><span className="mark" aria-hidden="true">8P</span><strong>8PIX <span>CREATIVE</span></strong></>}
export function StudioHeader(){
  const [open,setOpen]=useState(false);
  const location=useLocation();
  useEffect(()=>setOpen(false),[location.pathname,location.searchStr]);
  useEffect(()=>{if(!open)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[open]);
  const links=primaryLinks.map(link=><Link key={link.to} to={link.to} search={link.to==='/contact'?{package:'custom'}:{}} activeOptions={{exact:link.to==='/'}} activeProps={{className:'active','aria-current':'page'}} onClick={()=>setOpen(false)}>{link.label}</Link>);
  return <header className="studio-header"><div className="site-header site-width"><Link to="/" className="wordmark" aria-label="8pix Creative home"><Brand/></Link><nav className="nav-links" aria-label="Main navigation">{links}</nav><Button variant="studioOutline" asChild className="header-quote"><Link to="/contact" search={{package:'custom'}}>Start a project <ArrowUpRight/></Link></Button><Button variant="studioGhost" size="icon" className="mobile-menu" aria-label={open?'Close menu':'Open menu'} aria-controls="mobile-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div>{open&&<nav id="mobile-navigation" className="mobile-nav micro" aria-label="Mobile navigation">{links}<Button variant="studio" asChild><Link to="/contact" search={{package:'custom'}} onClick={()=>setOpen(false)}>Start a project <ArrowUpRight/></Link></Button></nav>}</header>
}
export function StudioFooter(){return <footer className="site-footer"><div className="site-width footer-inner"><Link to="/" className="wordmark" aria-label="8pix Creative home"><Brand/></Link><p>Professional real estate photo editing.<br/>Photography is not included.</p><nav className="footer-links micro" aria-label="Footer navigation"><Link to="/packages">Pricing</Link><Link to="/standard">Our standard</Link><Link to="/contact" search={{package:'custom'}}>Contact</Link><a href="https://wa.me/254742602830" target="_blank" rel="noreferrer">WhatsApp ↗</a></nav></div></footer>}
