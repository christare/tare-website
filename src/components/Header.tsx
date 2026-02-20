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
  const waitlistUrl = isProduction ? "/waitlist" : "/waitlist";
  const studioUrl = isProduction ? "/" : "/";
  const privateUrl = isProduction ? "/private" : "/private";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "py-3" : "py-6"}`} 
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center relative">
        {/* Mobile Navigation - horizontal across top */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex md:hidden justify-between items-center px-4 pt-4 pb-2" style={{
          backgroundColor: scrolled ? 'rgba(42, 39, 38, 0.95)' : 'rgba(42, 39, 38, 0.8)',
          backdropFilter: 'blur(12px)'
        }}>
          <div className="flex space-x-4">
            <Link
              href={studioUrl}
              className={`text-sm tracking-wide transition-colors duration-300 ${
                pathname === "/" 
                  ? "text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              STUDIO
            </Link>

            <Link
              href={privateUrl}
              className={`text-sm tracking-wide transition-colors duration-300 ${
                pathname === "/private"
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              PRIVATE
            </Link>

            <Link
              href={waitlistUrl}
              className={`text-sm tracking-wide transition-colors duration-300 ${
                pathname === "/waitlist" 
                  ? "text-white" 
                  : "text-gray-200 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              WAITLIST
            </Link>

            {/* Story link temporarily hidden */}
          </div>
          <a
            href="https://instagram.com/tarestudionyc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 hover:text-white transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
            </svg>
          </a>
        </nav>

        {/* Desktop Navigation - vertical on left */}
        <nav className="hidden md:flex fixed left-6 top-8 z-50 flex-col space-y-3">
          <Link
            href={studioUrl}
            className={`text-base tracking-wide transition-colors duration-300 ${
              pathname === "/" 
                ? "text-white" 
                : "text-gray-300 hover:text-white"
            }`}
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            STUDIO
          </Link>
          <Link
            href={privateUrl}
            className={`text-base tracking-wide transition-colors duration-300 ${
              pathname === "/private"
                ? "text-white"
                : "text-gray-300 hover:text-white"
            }`}
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            PRIVATE
          </Link>
          {/* Story link temporarily hidden */}
          <Link
            href={waitlistUrl}
            className={`text-base tracking-wide transition-colors duration-300 ${
              pathname === "/waitlist" 
                ? "text-white" 
                : "text-gray-300 hover:text-white"
            }`}
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            WAITLIST
          </Link>

        </nav>
        
        {/* Instagram Link - Desktop */}
        <div className="hidden md:flex fixed right-6 top-8 z-50">
          <a
            href="https://instagram.com/tarestudionyc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors duration-300"
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
            </svg>
          </a>
        </div>

      </div>
    </header>
  );
} 