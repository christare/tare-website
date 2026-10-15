"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
export default function Header(){
 const path=usePathname(); const [open,setOpen]=useState(false);
 useEffect(()=>setOpen(false),[path]);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[]);
 const links=[["/","Tastings"],["/private","Private"],["/shop","Coffee"],["/waitlist","Stay in touch"]];
 return <header className="site-header"><Link href="/" aria-label="TARE home" className="wordmark">TARE<span>®</span></Link><nav aria-label="Main navigation" className="desktop-nav">{links.map(([href,label])=><Link key={href} href={href} aria-current={path===href?"page":undefined}>{label}</Link>)}</nav><button className="menu-toggle micro" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)}>{open?"Close −":"Menu +"}</button>{open&&<nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{links.map(([href,label],i)=><Link key={href} href={href} onClick={()=>setOpen(false)}><span className="micro">0{i+1}</span>{label}<span>↗</span></Link>)}<a href="https://instagram.com/tarestudionyc">Instagram ↗</a></nav>}</header>
}
