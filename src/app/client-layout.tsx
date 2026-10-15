"use client";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function ClientLayout({children}:{children:React.ReactNode}){
 const path=usePathname();const print=path.startsWith("/print");const guest=path==="/form";
 return <>{!print&&<Header/>}<div className={!print?"site-content":""}>{children}</div>{!print&&!guest&&<footer className="site-footer"><Link className="wordmark" href="/">TARE<span>®</span></Link><p className="micro">Coffee tastings.<br/>Long Island City · New York</p><div><a href="mailto:chris@tarestudionyc.com">Email</a><a href="https://instagram.com/tarestudionyc" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><p className="micro footer-bottom">TARE · New York</p></footer>}</>
}
