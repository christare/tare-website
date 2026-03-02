"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBookableWeekendDates } from "@/lib/studio-dates";
import { DateCarousel } from "@/components/DateCarousel";
import { CURRENT_EVENT_CONFIG } from "@/config/events";

const STUDIO_PRICE_ID = "price_1SHQJQF5JUni5zIQzHCq9zox";

function StudioPageContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loadingDate, setLoadingDate] = useState<string | null>(null);
  const [bookableDates, setBookableDates] = useState<{ date: string; label: string }[]>([]);
  const heroBackgroundMobileImage = "/images/Photo Wellness 1.jpg";
  const heroBackgroundImages = [
    
    "/images/Photo Wellness 1.jpg",
    "/images/Photo Wellness 3.jpg",

    "/images/Photo Wellness 2.png",

  ];

  // Fresh dates on load and when user returns to the tab (e.g. next day or after Thursday cutoff)
  const refreshDates = () => setBookableDates(getBookableWeekendDates(12));
  useEffect(() => {
    refreshDates();
  }, []);
  useEffect(() => {
    const onFocus = () => refreshDates();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Reset loading state when returning from checkout
  useEffect(() => {
    const fromCheckout = searchParams.get('from');
    if (fromCheckout === 'canceled') {
      setLoadingDate(null);
      setError("");
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('from');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    const reset = () => { if (loadingDate) { setLoadingDate(null); setError(""); } };
    const onVisibility = () => { if (!document.hidden) reset(); };
    window.addEventListener('focus', reset);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { window.removeEventListener('focus', reset); document.removeEventListener('visibilitychange', onVisibility); };
  }, [loadingDate]);

  const imagesRef = useRef(null);
  const detailsRef = useRef(null);
  const bookSectionRef = useRef(null);
  const imagesInView = useInView(imagesRef, { once: false, margin: "-50px" });
  const detailsInView = useInView(detailsRef, { once: false, margin: "-40px" });
  const bookSectionInView = useInView(bookSectionRef, { once: false, margin: "-80px" });

  const handlePurchase = async (eventId: string) => {
    setLoadingDate(eventId);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: STUDIO_PRICE_ID,
          type: "studio",
          eventId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.details?.message || data.error || "Failed to create checkout session");
        setLoadingDate(null);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned");
        setLoadingDate(null);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
      setLoadingDate(null);
    }
  };

  return (
    <main className="min-h-screen text-white relative" style={{backgroundColor: '#2A2726'}}>
      {/* Hero section with dial background */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Full-screen background photos (ultra-faded) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* Mobile: single full-screen image */}
          <div className="absolute inset-0 md:hidden">
            <Image
              src={heroBackgroundMobileImage}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
              style={{
                opacity: 0.4,
                filter:
                  "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)",
              }}
            />
          </div>

          {/* Desktop+: three-panel grid */}
          <div className="absolute inset-0 hidden md:grid md:grid-cols-3">
            {heroBackgroundImages.map((src, idx) => (
              <div key={src} className="relative h-full w-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  className="object-cover"
                  style={{
                    opacity: 0.4,
                    filter:
                      "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Soft wash to keep dial/text crisp and readable */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(42,39,38,0.18) 0%, rgba(42,39,38,0.55) 45%, rgba(42,39,38,0.92) 82%, rgba(42,39,38,1) 100%)",
            }}
          />
        </div>

        {/* Dial background */}
        <motion.div 
          className="absolute top-0 left-1/2 h-full w-screen -translate-x-1/2 flex items-center justify-center pointer-events-none z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.24, scale: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src="/images/Group 15.png"
            alt="Dial"
            width={1920}
            height={1080}
            className="w-screen h-full object-cover"
            priority
          />
        </motion.div>

        {/* Content on top of dial */}
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-18 md:py-24 flex flex-col items-center justify-center">
          {/* TARE Studio Artifact - above logo */}
          <motion.div 
            className="w-full flex justify-center mb-2 sm:mb-4"
            initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
              scale: { type: "spring", stiffness: 200, damping: 20 }
            }}
          >
            <Image
              src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
              alt="TARE Studio Artifact"
              width={101}
              height={101}
              className="w-[60px] md:w-[80px] h-auto"
            />
          </motion.div>

          {/* Full-width logo section - DOMINANT ELEMENT */}
          <motion.div 
            className="w-full flex justify-center mb-3 sm:mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Image
              src="/images/TARE%20logo%20STUDIO%20page.png"
              alt="TARE STUDIO"
              width={1200}
              height={200}
              className="w-[92%] sm:w-[88%] md:w-[85%] lg:w-[80%] h-auto"
            />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center text-gray-200 text-lg sm:text-xl tracking-wide mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed px-1"
            style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300, textWrap: "balance" }}
          >
            A guided session using coffee in multiple forms to elevate your mood and sharpen your senses.
          </motion.p>

          {/* Primary CTA — scrolls to date selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <motion.button
              type="button"
              onClick={() => document.getElementById("book-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="inline-block border-2 border-white px-10 py-3.5 text-sm sm:text-base tracking-wide hover:bg-white hover:text-black transition-colors duration-300"
              style={{ fontFamily: "FragmentMono, monospace" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              BOOK A SESSION
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Grid lines — right under hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }}
        className="my-0"
      >
        <Image
          src="/images/Line 43.png"
          alt=""
          width={1920}
          height={100}
          style={{ width: '100vw', height: 'auto', display: 'block' }}
        />
        <Image
          src="/images/Group 24.png"
          alt=""
          width={1920}
          height={100}
          style={{ width: '100vw', height: 'auto', display: 'block' }}
        />
      </motion.div>

      {/* What it is — experience only (scroll target for BOOK A SESSION) */}
      <div id="book-section" ref={bookSectionRef} className="w-full scroll-mt-24">
        <motion.div
          initial="hidden"
          animate={bookSectionInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-10"
        >
          <div className="text-center max-w-xl mx-auto">
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-gray-200 text-lg sm:text-xl md:text-2xl tracking-wide mb-1.5 sm:mb-2"
              style={{ fontFamily: 'NonBureauExtended, sans-serif', fontWeight: 300 }}
            >
              WE TAKE YOU THROUGH
            </motion.h2>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-gray-400 tracking-wide mb-4 sm:mb-6 text-sm sm:text-base leading-[1.4]"
              style={{ fontFamily: 'NonBureauExtended, sans-serif', fontWeight: 300 }}
            >
              the most effective elements of:
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-4 sm:mb-6"
            >
              <div
                className="text-gray-300 text-sm sm:text-base tracking-wider space-y-0.5 sm:space-y-1"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.7' }}
              >
                <p>Aromatherapy</p>
                <p>Skin treatments</p>
                <p>Sound immersion</p>
                <p>Breathwork</p>
                <p>Deep tasting</p>
              </div>
            </motion.div>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-gray-400 text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.6' }}
            >
              Each delivered through world-class coffee and its well-documented physiological effects.
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Event logistics — where, when, book */}
      <div ref={detailsRef} className="w-full py-10 sm:py-14 border-t border-white/20" style={{ backgroundColor: '#32302E' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={detailsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-3xl mx-auto px-4 sm:px-6"
        >
          <div className="text-center max-w-xl mx-auto">
            {/* Spec-sheet style DETAILS grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={detailsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-md mx-auto text-left border border-white/30 rounded-sm overflow-hidden mb-6 sm:mb-8"
            >
              <div className="px-4 py-2.5 sm:py-3 border-b border-white/20">
                <p className="text-gray-400 text-xs tracking-[0.25em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  DETAILS
                </p>
              </div>
              <div className="divide-y divide-white/20">
                <div className="px-4 py-3 sm:py-3.5">
                  <p className="text-gray-400 text-xs tracking-wider mb-1" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    ADDRESS
                  </p>
                  <p className="text-white text-sm sm:text-base leading-snug" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {CURRENT_EVENT_CONFIG.addressLine1Public}<br />
                    {CURRENT_EVENT_CONFIG.addressLine2}
                  </p>
                </div>
                <div className="px-4 py-3 sm:py-3.5">
                  <p className="text-gray-400 text-xs tracking-wider mb-1" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    TIME
                  </p>
                  <p className="text-white text-sm sm:text-base leading-snug" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {CURRENT_EVENT_CONFIG.eventTime.replace(' - ', ' – ')}
                  </p>
                  <p className="text-gray-300 text-xs mt-0.5" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    Doors {CURRENT_EVENT_CONFIG.doorsOpen}
                  </p>
                </div>
              </div>
            </motion.div>

            <DateCarousel
              dates={bookableDates}
              loadingDate={loadingDate}
              onSelect={handlePurchase}
              error={error || undefined}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={detailsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-gray-500 text-xs mt-4 sm:mt-5"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              No date that works? <Link href="/waitlist" className="text-gray-400 hover:text-white underline transition-colors duration-200">Join the waitlist</Link>.
            </motion.p>
          </div>
        </motion.div>
      </div>

      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-xl mx-auto px-4 sm:px-6"
      >
        <div>
          {/* Group 25 and Line 44 divider */}
          <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="my-8 sm:my-12">
            <Image
                        src="/images/Group 25.png"
                        alt="Group 25"
              width={1920}
              height={100}
                        style={{ width: '100vw', height: 'auto', display: 'block' }}
                      />
            <Image
                        src="/images/Line 44.png"
                        alt="Line 44"
              width={1920}
              height={100}
                        style={{ width: '100vw', height: 'auto', display: 'block' }}
                      />
                </div>
              </div>
           </motion.div>

      {/* Experience Preview Gallery */}
      <motion.div 
        ref={imagesRef}
        className="w-full pb-16 sm:pb-24"
        initial={{ opacity: 0 }}
        animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0, y: 14 }}
            animate={imagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/images/Room1.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(0.96) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0, y: 14 }}
            animate={imagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/images/Room3.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(0.96) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
          <motion.div
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0, y: 14 }}
            animate={imagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/images/still5.png"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(0.96) saturate(0) hue-rotate(0deg) invert(0.1)',
                objectPosition: 'center 35%'
              }}
            />
          </motion.div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 mt-4 md:mt-4">
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0, y: 14 }}
            animate={imagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/images/still4.png"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(0.96) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0, y: 14 }}
            animate={imagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/images/Still6.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(0.96) saturate(0) hue-rotate(0deg) invert(0.1)',
                objectPosition: 'center 30%'
              }}
            />
          </motion.div>
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0, y: 14 }}
            animate={imagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.45, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/images/Room2.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(0.96) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
        </div>
      </motion.div>

    </main>
  );
}

function StudioPageLoading() {
  return (
    <main className="min-h-screen text-white pt-8 md:pt-16 relative" style={{backgroundColor: '#2A2726'}}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400" style={{ fontFamily: 'FragmentMono, monospace' }}>Loading...</p>
        </div>
         </div>
    </main>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<StudioPageLoading />}>
      <StudioPageContent />
    </Suspense>
  );
}
