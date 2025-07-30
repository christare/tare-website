"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";

export default function RoomPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
        className="w-full flex justify-center mb-6 mt-4"
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
          width={72}
          height={72}
          className="w-[72px] h-auto"
        />
      </motion.div>

      {/* Full-width logo section */}
      <div className="w-full flex justify-center mb-12 mt-4">
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
        className="max-w-2xl mx-auto px-6 sm:px-6 pt-4 pb-20"
      >
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center">
            <p className="text-gray-300 mb-2 leading-relaxed text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
              An intimate coffee omakase experience, custom-designed for each group by our founder Chris.
            </p>
            <p className="text-gray-300 mb-2 leading-relaxed text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Hosted inside our all-white Midtown studio.
            </p>
            <p className="text-gray-300 mb-2 leading-relaxed text-xs sm:text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Rare coffees, curated in real time. Experimental techniques. Previews of new creations.
            </p>
            <p className="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-xs" style={{ fontFamily: 'FragmentMono, monospace' }}>
              $90 per guest
            </p>
          </div>
          <div className="border-t border-b border-gray-800 py-4 sm:py-6 px-4 sm:px-6 space-y-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 sm:gap-4">
              <span className="text-gray-400 text-xs font-medium" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Experience</span>
              <span className="text-white text-xs sm:text-sm sm:text-right">TARE ROOM</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 sm:gap-4">
              <span className="text-gray-400 text-xs font-medium" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Duration</span>
              <span className="text-white text-xs sm:text-sm sm:text-right">2 hours (11am - 1pm)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 sm:gap-4">
              <span className="text-gray-400 text-xs font-medium" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Location</span>
              <div className="text-white text-xs sm:text-sm sm:text-right">
                <div>45 W 29th St Suite 301</div>
                <div>New York, NY 10001</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 sm:gap-4">
              <span className="text-gray-400 text-xs font-medium" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Price</span>
              <span className="text-white text-xs sm:text-sm sm:text-right">$90</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-6 leading-relaxed px-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
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
                disabled={loadingPriceId !== null}
                className="border border-white px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
                initial={{ opacity: 0 }}
                animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {loadingPriceId === "price_1RfuvWF5JUni5zIQaC5g3ZEF" ? "PROCESSING..." : "AUGUST 10"}
              </motion.button>
              <motion.button
                onClick={() => handlePurchase("price_1RqEtdF5JUni5zIQ8wJSZsJb")}
                disabled={loadingPriceId !== null}
                className="border border-white px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
                initial={{ opacity: 0 }}
                animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {loadingPriceId === "price_1RqEtdF5JUni5zIQ8wJSZsJb" ? "PROCESSING..." : "AUGUST 17"}
              </motion.button>
              <motion.button
                onClick={() => handlePurchase("price_1RqEufF5JUni5zIQ7IM5TDrf")}
                disabled={loadingPriceId !== null}
                className="border border-white px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 sm:col-span-2 md:col-span-1"
                style={{ fontFamily: 'FragmentMono, monospace' }}
                initial={{ opacity: 0 }}
                animate={buttonsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {loadingPriceId === "price_1RqEufF5JUni5zIQ7IM5TDrf" ? "PROCESSING..." : "AUGUST 24"}
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