"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  // Determine if we're in production (tarecoffeeroom.com) or local
  useEffect(() => {
    const hostname = window.location.hostname;
    setIsProduction(hostname.includes('tarecoffeeroom.com'));
  }, []);

  // Add scroll effect to header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get proper URLs based on environment
  const homeUrl = isProduction ? "/home" : "/home";
  const rootUrl = isProduction ? "/" : "/";
  const runwayUrl = isProduction ? "/runway" : "/runway";
  const roomUrl = isProduction ? "/room" : "/room";
  const studioUrl = isProduction ? "/studio" : "/studio";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "py-3" : "py-6"}`} 
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center relative">
        {/* Mobile Navigation - horizontal across top */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex md:hidden justify-center pt-4 pb-2" style={{
          backgroundColor: scrolled ? 'rgba(42, 39, 38, 0.95)' : 'rgba(42, 39, 38, 0.8)',
          backdropFilter: 'blur(12px)'
        }}>
          <div className="flex space-x-6">
            <Link
              href={rootUrl}
              className={`text-xs tracking-wide transition-colors duration-300 ${
                pathname === "/" 
                  ? "text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              HOME
            </Link>
            <Link
              href={roomUrl}
              className={`text-xs tracking-wide transition-colors duration-300 ${
                pathname === "/room" 
                  ? "text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              ROOM
            </Link>
            <Link
              href={studioUrl}
              className={`text-xs tracking-wide transition-colors duration-300 ${
                pathname === "/studio" 
                  ? "text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              STUDIO
            </Link>
            <Link
              href={runwayUrl}
              className={`text-xs tracking-wide transition-colors duration-300 ${
                pathname === "/runway" 
                  ? "text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              RUNWAY
            </Link>
          </div>
        </nav>

        {/* Desktop Navigation - vertical on left */}
        <nav className="hidden md:flex fixed left-4 top-6 z-50 flex-col space-y-1">
          <Link
            href={rootUrl}
            className={`text-sm tracking-wide transition-colors duration-300 ${
              pathname === "/" 
                ? "text-white" 
                : "text-gray-200 hover:text-white"
            }`}
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            HOME
          </Link>
          <Link
            href={roomUrl}
            className={`text-sm tracking-wide transition-colors duration-300 ${
              pathname === "/room" 
                ? "text-white" 
                : "text-gray-200 hover:text-white"
            }`}
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            ROOM
          </Link>
          <Link
            href={studioUrl}
            className={`text-sm tracking-wide transition-colors duration-300 ${
              pathname === "/studio" 
                ? "text-white" 
                : "text-gray-200 hover:text-white"
            }`}
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            STUDIO
          </Link>
          <Link
            href={runwayUrl}
            className={`text-sm tracking-wide transition-colors duration-300 ${
              pathname === "/runway" 
                ? "text-white" 
                : "text-gray-200 hover:text-white"
            }`}
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            RUNWAY
          </Link>
        </nav>

      </div>
    </header>
  );
} 