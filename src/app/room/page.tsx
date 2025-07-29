"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RoomPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

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
    <main className="min-h-screen text-white pt-24 relative" style={{backgroundColor: '#2A2726'}}>
      {/* Full-width logo section */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/images/TARE Logo ROOM.png"
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
        className="max-w-2xl mx-auto px-6 pt-4 pb-20"
      >
        <div className="space-y-12">
          <div className="text-center">
            <p className="text-gray-300 mb-2 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
              An intimate coffee omakase experience, custom-designed for each group by our founder Chris. Hosted inside our all-white Midtown studio.
            </p>
            <p className="text-gray-300 mb-2 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Rare coffees, curated in real time. Experimental techniques. Previews of new creations.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace', fontSize: '0.95em' }}>
              $90 per guest
            </p>
          </div>
          <div className="border-t border-b border-gray-800 py-6 px-6 space-y-3" style={{ fontFamily: 'FragmentMono, monospace' }}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-400 flex-shrink-0" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Experience</span>
              <span className="text-white text-right">TARE ROOM</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-400 flex-shrink-0" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Duration</span>
              <span className="text-white text-right">2 hours (11am - 1pm)</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-400 flex-shrink-0" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Location</span>
              <span className="text-white text-right">
                45 W 29th St Suite 301<br />
                New York, NY 10001
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-400 flex-shrink-0" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Price</span>
              <span className="text-white text-right">$90</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-6 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
              After booking, Chris will reach out personally with a brief questionnaire to design the perfect lineup for you and your group.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handlePurchase("price_1RfuvWF5JUni5zIQaC5g3ZEF")}
                disabled={loadingPriceId !== null}
                className="border border-white px-4 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {loadingPriceId === "price_1RfuvWF5JUni5zIQaC5g3ZEF" ? "PROCESSING..." : "AUGUST 10"}
              </button>
              <button
                onClick={() => handlePurchase("price_1RqEtdF5JUni5zIQ8wJSZsJb")}
                disabled={loadingPriceId !== null}
                className="border border-white px-4 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {loadingPriceId === "price_1RqEtdF5JUni5zIQ8wJSZsJb" ? "PROCESSING..." : "AUGUST 17"}
              </button>
              <button
                onClick={() => handlePurchase("price_1RqEufF5JUni5zIQ7IM5TDrf")}
                disabled={loadingPriceId !== null}
                className="border border-white px-4 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {loadingPriceId === "price_1RqEufF5JUni5zIQ7IM5TDrf" ? "PROCESSING..." : "AUGUST 24"}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-4" style={{ fontFamily: 'FragmentMono, monospace' }}>{error}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Experience Preview Gallery */}
      <div className="w-full pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="aspect-[4/5] overflow-hidden relative">
            <Image
              src="/images/Room1.jpg"
              alt="TARE Room Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)',
                imageRendering: 'pixelated'
              }}
            />
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle, transparent 0.5px, rgba(255,255,255,0.3) 0.5px),
                  linear-gradient(90deg, transparent 49%, rgba(0,0,0,0.2) 50%, transparent 51%),
                  linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
                `,
                backgroundSize: '2px 2px, 1px 100%, 100% 1px',
                mixBlendMode: 'overlay'
              }}
            />
          </div>
          <div className="aspect-[4/5] overflow-hidden relative">
            <Image
              src="/images/Room2.jpg"
              alt="TARE Room Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)',
                imageRendering: 'pixelated'
              }}
            />
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle, transparent 0.5px, rgba(255,255,255,0.3) 0.5px),
                  linear-gradient(90deg, transparent 49%, rgba(0,0,0,0.2) 50%, transparent 51%),
                  linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
                `,
                backgroundSize: '2px 2px, 1px 100%, 100% 1px',
                mixBlendMode: 'overlay'
              }}
            />
          </div>
          <div className="aspect-[4/5] overflow-hidden relative">
            <Image
              src="/images/Room3.jpg"
              alt="TARE Room Experience"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              style={{ 
                filter: 'grayscale(100%) contrast(1.4) brightness(1) saturate(0) hue-rotate(0deg) invert(0.1)',
                imageRendering: 'pixelated'
              }}
            />
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle, transparent 0.5px, rgba(255,255,255,0.3) 0.5px),
                  linear-gradient(90deg, transparent 49%, rgba(0,0,0,0.2) 50%, transparent 51%),
                  linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
                `,
                backgroundSize: '2px 2px, 1px 100%, 100% 1px',
                mixBlendMode: 'overlay'
              }}
            />
          </div>
        </div>
      </div>

    </main>
  );
} 