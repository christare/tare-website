"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";

function StudioPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  // Handle return from checkout (canceled or back button)
  useEffect(() => {
    const fromCheckout = searchParams.get('from');
    if (fromCheckout === 'canceled') {
      console.log('User returned from canceled checkout, resetting state');
      setLoadingPriceId(null);
      setError("");
      // Clean up URL by removing the parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('from');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  // Reset processing state when page regains focus (user returns from Stripe)
  useEffect(() => {
    const handlePageFocus = () => {
      // Reset processing state when user returns to page
      if (loadingPriceId) {
        console.log('Page regained focus, resetting processing state');
        setLoadingPriceId(null);
        setError("");
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handlePageFocus();
      }
    };

    window.addEventListener('focus', handlePageFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handlePageFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadingPriceId]);

  // Auto-reset processing state after timeout (30 seconds)
  useEffect(() => {
    if (loadingPriceId) {
      const timeout = setTimeout(() => {
        console.log('Processing timeout reached, resetting state');
        setLoadingPriceId(null);
        setError("Request timed out. Please try again.");
      }, 30000); // 30 seconds

      return () => clearTimeout(timeout);
    }
  }, [loadingPriceId]);
  
  const buttonsRef = useRef(null);
  const imagesRef = useRef(null);
  const buttonsInView = useInView(buttonsRef, { once: true, margin: "-50px" });
  const imagesInView = useInView(imagesRef, { once: true, margin: "-50px" });

  const handlePurchase = async (priceId: string) => {
    setLoadingPriceId(priceId);
    setError("");
    try {
      console.log(`Starting checkout for STUDIO with price ID: ${priceId}`);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceId,
          type: "studio"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout response error:", data);
        setError(data.details?.message || data.error || "Failed to create checkout session");
        setLoadingPriceId(null);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned");
        setLoadingPriceId(null);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong with the checkout process");
      setLoadingPriceId(null);
    }
  };

  return (
    <main className="min-h-screen text-white relative" style={{backgroundColor: '#2A2726'}}>
      {/* Hero section with dial background */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative py-16 md:py-24">
        {/* Dial background */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none" 
          style={{ zIndex: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src="/images/Group 15.png"
            alt="Dial"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>

        {/* Content on top of dial */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
          {/* TARE Studio Artifact - above logo */}
          <motion.div 
            className="w-full flex justify-center mb-6 md:mb-10"
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
            className="w-full flex justify-center mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Image
              src="/images/TARE logo STUDIO page.png"
              alt="TARE STUDIO"
              width={1200}
              height={200}
              className="w-[85%] md:w-[80%] lg:w-[75%] h-auto"
            />
          </motion.div>

          {/* Main description - Secondary hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center max-w-xl mx-auto px-4"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl text-white mb-5 sm:mb-6 leading-tight tracking-wide" style={{ fontFamily: 'NonBureauExtended, sans-serif', fontWeight: 300 }}>
              A Coffee Wellness Transformation
            </h2>
            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base mb-3" style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.7' }}>
              Meditation uses breath.<br />
              Yoga uses movement.<br />
              We use coffee.
            </p>
            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base" style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.7' }}>
              A two-hour guided experience using coffee as liquid, aroma, and texture — sensory anchors to train your attention and enhance the way you experience everyday life.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-xl mx-auto px-6 sm:px-6 pb-20"
      >
        <div className="space-y-8 sm:space-y-12">
          
          {/* Line 43 and Group 24 divider */}
          <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="my-12 sm:my-16">
            <Image
              src="/images/Line 43.png"
              alt="Line 43"
              width={1920}
              height={100}
              style={{ width: '100vw', height: 'auto', display: 'block' }}
            />
            <Image
              src="/images/Group 24.png"
              alt="Group 24"
              width={1920}
              height={100}
              style={{ width: '100vw', height: 'auto', display: 'block' }}
            />
          </div>

          {/* <div style={{ height: '1px' }}></div> */}

          <div className="py-6 sm:py-8 px-4 sm:px-6 space-y-6 sm:space-y-8 max-w-lg mx-auto">
            {/* Next Event Label */}
            <div className="text-center">
              <p className="text-gray-400 text-xs tracking-widest mb-6" style={{ fontFamily: 'FragmentMono, monospace', letterSpacing: '0.2em' }}>
                NEXT EVENT
              </p>
          </div>

            {/* Date and Time */}
            <div className="text-center space-y-2">
              <p className="text-white text-base sm:text-lg font-light" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                Sunday  ·  October 26  ·  2025
              </p>
              <p className="text-white text-sm sm:text-base" style={{ fontFamily: 'FragmentMono, monospace' }}>
                11:00 AM - 1:00 PM
              </p>
          </div>

            {/* Location */}
            <div className="text-center space-y-2 pt-2">
              <div className="text-white text-sm sm:text-base" style={{ fontFamily: 'FragmentMono, monospace' }}>
                <div>231 West 29th St</div>
                <div>New York, NY 10001</div>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-center pt-2">
              <p className="text-white text-lg sm:text-xl font-light" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                $ 90
              </p>
            </div>
            
            {/* Reserve Button */}
            <motion.div 
              ref={buttonsRef}
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
                Limited seats available
              </p>
              <motion.button
                onClick={() => handlePurchase('price_1SHQJQF5JUni5zIQzHCq9zox')}
                disabled={loadingPriceId === 'price_1SHQJQF5JUni5zIQzHCq9zox'}
                className="inline-block border border-white px-8 py-3 text-xs sm:text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'FragmentMono, monospace' }}
                initial={{ opacity: 0 }}
                animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                {loadingPriceId === 'price_1SHQJQF5JUni5zIQzHCq9zox' ? 'PROCESSING...' : 'RESERVE YOUR SEAT'}
              </motion.button>
              {error && (
                <p className="text-red-400 text-xs mt-4" style={{ fontFamily: 'FragmentMono, monospace' }}>{error}</p>
              )}
            </motion.div>
            </div>
            
          {/* <div style={{ height: '1px' }}></div> */}
          
          {/* Group 25 and Line 44 divider */}
          <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="my-12 sm:my-16">
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
        className="w-full pb-20"
        initial={{ opacity: 0 }}
        animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 mb-0 md:mb-4">
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/Room1.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <Image
              src="/images/Room3.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
           <motion.div
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Image
              src="/images/still5.png"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)',
                objectPosition: 'center 35%'
              }}
            />
           </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <Image
              src="/images/still4.png"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <Image
              src="/images/Still6.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)',
                objectPosition: 'center 30%'
              }}
            />
          </motion.div>
          <motion.div 
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={imagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          >
            <Image
              src="/images/Room2.jpg"
              alt="TARE Studio Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)'
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
