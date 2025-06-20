"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Navigation items
  const navItems = [
    { name: "01 STUDIO", path: studioUrl },
    { name: "02 ROOM", path: roomUrl },
    { name: "03 RUNWAY", path: runwayUrl },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3 backdrop-blur-sm" : "py-6 backdrop-blur-sm"}`} style={{backgroundColor: scrolled ? 'rgba(42, 39, 38, 0.9)' : 'rgba(42, 39, 38, 0.5)'}}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center relative">
        {/* Logo - positioned absolutely on the left */}
        <Link href="/" className="text-white text-xl font-light absolute left-6">
          <Image
            src="/images/TARE LOGOS/Logo02/rgb-web/white/tare-logo02-white-rgb.svg"
            alt="TARE"
            width={80}
            height={30}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation - centered */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-sm tracking-wide transition-colors duration-300 ${
                pathname === item.path 
                  ? "text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button - positioned absolutely on the right */}
        <button
          className="md:hidden text-white absolute right-6"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: menuOpen ? "auto" : 0,
          opacity: menuOpen ? 1 : 0,
          display: menuOpen ? "block" : "none"
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-4 backdrop-blur-sm space-y-4 flex flex-col items-center" style={{backgroundColor: 'rgba(42, 39, 38, 0.9)'}}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-wide transition-colors duration-300 py-2 w-full text-center ${
                pathname === item.path 
                  ? "text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </header>
  );
} 