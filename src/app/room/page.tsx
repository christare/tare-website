"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";

function RoomPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const buttonsInView = useInView(buttonsRef, { once: true, margin: "-50px" });
  const imagesInView = useInView(imagesRef, { once: true, margin: "-200px" });
  const image1InView = useInView(image1Ref, { once: true, margin: "-100px" });
  const image2InView = useInView(image2Ref, { once: true, margin: "-100px" });
  const image3InView = useInView(image3Ref, { once: true, margin: "-100px" });

  const handlePurchase = async (priceId: string) => {
    setLoadingPriceId(priceId);
    setError("");
    try {
      console.log(`Starting checkout for ROOM with price ID: ${priceId}`);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceId,
          type: "room"
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
    <main className="min-h-screen text-white pt-8 md:pt-16 relative" style={{backgroundColor: '#2A2726'}}>
      {/* TARE Room Artifact - above logo */}
      <motion.div 
        className="w-full flex justify-center mb-4 md:mb-12 mt-8 md:mt-2"
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
          alt="TARE Room Artifact"
          width={101}
          height={101}
          className="w-[72px] md:w-[101px] h-auto"
        />
      </motion.div>

      {/* Full-width logo section */}
      <div className="w-full flex justify-center mb-12">
        <Image
          src="/images/TARE logo ROOM.png"
          alt="TARE ROOM"
          width={1200}
          height={200}
          className="w-[80%] h-auto"
        />
      </div>

      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-xl mx-auto px-6 sm:px-6 pt-4 pb-20"
      >
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center">
            <p className="text-gray-300 mb-2 leading-relaxed text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Not a café. Not a drink.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
              An intimate, cinematic coffee tasting - designed live, in real time.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Served in our all-white Midtown studio. Rare coffees. Experimental techniques. New creations.
            </p>
            <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Two hours. Five courses.
            </p>
          </div>
          
          <div style={{ height: '20px' }}></div>
          
          {/* Line 43 above experience details */}
          <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="my-12 sm:my-16">
            <Image
              src="/images/Line 43.png"
              alt="Line 43"
              width={1920}
              height={100}
              style={{ width: '100vw', height: 'auto', display: 'block', opacity: '0.2' }}
            />
          </div>

          {/* <div style={{ height: '1px' }}></div> */}

          <div className="py-4 sm:py-6 px-4 sm:px-6 space-y-4 sm:max-w-md sm:mx-auto" style={{ fontFamily: 'FragmentMono, monospace' }}>
            <div className="text-center">
              <span className="text-white text-xs sm:text-sm block" style={{ fontFamily: 'FragmentMono, monospace' }}>2 hours (11am - 1pm)</span>
            </div>
            <div className="text-center">
              <div className="text-white text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                <div>45 W 29th St, Suite 301</div>
                <div>New York, NY 10001</div>
              </div>
            </div>
            <div className="text-center">
              <span className="text-white text-xs sm:text-sm block" style={{ fontFamily: 'FragmentMono, monospace' }}>$90</span>
            </div>
          </div>
          
          {/* <div style={{ height: '1px' }}></div> */}
          
          {/* Line 44 below experience details */}
          <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="my-12 sm:my-16">
            <Image
              src="/images/Line 44.png"
              alt="Line 44"
              width={1920}
              height={100}
              style={{ width: '100vw', height: 'auto', display: 'block', opacity: '0.2' }}
            />
          </div>

          {/* <div style={{ height: '1px' }}></div> */}

          <div className="text-center">
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed px-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
              After booking, Chris will reach out personally with a brief questionnaire to design the perfect lineup for you and your group.
            </p>
            <motion.div 
              ref={buttonsRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
              initial={{ opacity: 0 }}
              animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.button
                onClick={() => handlePurchase("price_1RfuvWF5JUni5zIQaC5g3ZEF")}
                disabled={loadingPriceId === "price_1RfuvWF5JUni5zIQaC5g3ZEF"}
                className={`border px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                  loadingPriceId === "price_1RfuvWF5JUni5zIQaC5g3ZEF" 
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-200 cursor-not-allowed" 
                    : "border-white hover:bg-white hover:text-black disabled:opacity-50"
                }`}
                style={{ fontFamily: 'FragmentMono, monospace' }}
                initial={{ opacity: 0 }}
                animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {loadingPriceId === "price_1RfuvWF5JUni5zIQaC5g3ZEF" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    PROCESSING...
                  </span>
                ) : <>RESERVE<span className="sm:hidden"> </span><br className="hidden sm:block" />AUGUST 10</>}
              </motion.button>
              <motion.button
                onClick={() => handlePurchase("price_1RqEtdF5JUni5zIQ8wJSZsJb")}
                disabled={loadingPriceId === "price_1RqEtdF5JUni5zIQ8wJSZsJb"}
                className={`border px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                  loadingPriceId === "price_1RqEtdF5JUni5zIQ8wJSZsJb" 
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-200 cursor-not-allowed" 
                    : "border-white hover:bg-white hover:text-black disabled:opacity-50"
                }`}
                style={{ fontFamily: 'FragmentMono, monospace' }}
                initial={{ opacity: 0 }}
                animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {loadingPriceId === "price_1RqEtdF5JUni5zIQ8wJSZsJb" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    PROCESSING...
                  </span>
                ) : <>RESERVE<span className="sm:hidden"> </span><br className="hidden sm:block" />AUGUST 17</>}
              </motion.button>
              <motion.button
                onClick={() => handlePurchase("price_1RqEufF5JUni5zIQ7IM5TDrf")}
                disabled={loadingPriceId === "price_1RqEufF5JUni5zIQ7IM5TDrf"}
                className={`border px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm tracking-wide transition-all duration-300 sm:col-span-2 md:col-span-1 ${
                  loadingPriceId === "price_1RqEufF5JUni5zIQ7IM5TDrf" 
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-200 cursor-not-allowed" 
                    : "border-white hover:bg-white hover:text-black disabled:opacity-50"
                }`}
                style={{ fontFamily: 'FragmentMono, monospace' }}
                initial={{ opacity: 0 }}
                animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {loadingPriceId === "price_1RqEufF5JUni5zIQ7IM5TDrf" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    PROCESSING...
                  </span>
                ) : <>RESERVE<span className="sm:hidden"> </span><br className="hidden sm:block" />AUGUST 24</>}
              </motion.button>
            </motion.div>
            {error && (
              <p className="text-red-400 text-xs mt-4" style={{ fontFamily: 'FragmentMono, monospace' }}>{error}</p>
            )}
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
        <div className="grid grid-cols-1 md:grid-cols-3">
          <motion.div 
            ref={image1Ref}
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={
              (imagesInView && !isMobile) || 
              (image1InView && isMobile) 
                ? { opacity: 1 } 
                : { opacity: 0 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/Room1.jpg"
              alt="TARE Room Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
          <motion.div 
            ref={image2Ref}
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={
              (imagesInView && !isMobile) || 
              (image2InView && isMobile) 
                ? { opacity: 1 } 
                : { opacity: 0 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/Room3.jpg"
              alt="TARE Room Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)'
              }}
            />
          </motion.div>
          <motion.div 
            ref={image3Ref}
            className="aspect-[4/5] overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={
              (imagesInView && !isMobile) || 
              (image3InView && isMobile) 
                ? { opacity: 1 } 
                : { opacity: 0 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/Room2.jpg"
              alt="TARE Room Experience"
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

function RoomPageLoading() {
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

export default function RoomPage() {
  return (
    <Suspense fallback={<RoomPageLoading />}>
      <RoomPageContent />
    </Suspense>
  );
}
