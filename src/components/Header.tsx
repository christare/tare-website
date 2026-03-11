"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Single entry point for team: close menu on nav
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const homeUrl = isProduction ? "/home" : "/home";
  const waitlistUrl = isProduction ? "/waitlist" : "/waitlist";
  const studioUrl = isProduction ? "/" : "/";
  const privateUrl = isProduction ? "/private" : "/private";

  const mobileNavLinks = [
    { href: studioUrl, label: "STUDIO" },
    { href: privateUrl, label: "PRIVATE" },
    { href: waitlistUrl, label: "WAITLIST" },
    { href: "/taste", label: "TASTE" },
    { href: "/queue", label: "IN-PERSON QUEUE" },
    { href: "/team/queue", label: "TEAM LOGIN" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{ minHeight: 0 }}
      >
        {/* Mobile: minimal bar — hamburger + Instagram, fixed height so content doesn't overlap */}
        <div
          className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between h-14 px-4 safe-area-inset"
          style={{
            backgroundColor: scrolled || mobileMenuOpen ? "rgba(42, 39, 38, 0.98)" : "rgba(42, 39, 38, 0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex items-center justify-center w-10 h-10 -ml-2 text-gray-200 hover:text-white transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <span className="text-xl leading-none" style={{ fontFamily: "FragmentMono, monospace" }}>×</span>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <a
            href="https://instagram.com/tarestudionyc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 hover:text-white transition-colors p-2"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
            </svg>
          </a>
        </div>

        {/* Mobile: collapsible menu overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden
              />
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="fixed top-14 left-0 right-0 z-50 md:hidden overflow-y-auto border-b border-white/10 py-4 px-4 max-h-[calc(100vh-3.5rem)]"
                style={{
                  backgroundColor: "rgba(42, 39, 38, 0.98)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex flex-col gap-1" style={{ fontFamily: "FragmentMono, monospace" }}>
                  {mobileNavLinks.map(({ href, label }) => (
                    <Link
                      key={href + label}
                      href={href}
                      className={`block py-3 px-2 text-sm tracking-wide transition-colors ${
                        pathname === href || (href === "/" && pathname === "/") ? "text-white" : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Navigation - vertical on left, two groups */}
        <nav className="hidden md:flex fixed left-6 top-8 z-50 flex-col">
          <div className="flex flex-col space-y-3">
            <Link
              href={studioUrl}
              className={`text-base tracking-wide transition-colors duration-300 ${
                pathname === "/" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              STUDIO
            </Link>
            <Link
              href={privateUrl}
              className={`text-base tracking-wide transition-colors duration-300 ${
                pathname === "/private" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              PRIVATE
            </Link>
            <Link
              href={waitlistUrl}
              className={`text-base tracking-wide transition-colors duration-300 ${
                pathname === "/waitlist" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              WAITLIST
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-col space-y-3">
            <Link
              href="/taste"
              className={`text-base tracking-wide transition-colors duration-300 ${
                pathname === "/taste" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              TASTE
            </Link>
            <Link
              href="/queue"
              className={`text-base tracking-wide transition-colors duration-300 ${
                pathname === "/queue" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              IN-PERSON QUEUE
            </Link>
            <Link
              href="/team/queue"
              className={`text-base tracking-wide transition-colors duration-300 ${
                pathname === "/team/queue" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              TEAM LOGIN
            </Link>
          </div>
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
      </header>
    </>
  );
} 