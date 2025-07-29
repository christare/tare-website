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
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-2xl mx-auto px-6 py-20"
      >
        <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide text-center">
          <div className="flex flex-col items-center">
            <Image
              src="/images/TARE LOGOS/Logo02/rgb-web/white/tare-logo02-white-rgb.svg"
              alt="TARE"
              width={180}
              height={68}
              className="h-16 md:h-20 w-auto mb-1"
            />
            <span className="text-xl md:text-2xl font-light tracking-wide" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>ROOM</span>
          </div>
        </h1>
        <div className="w-12 h-px bg-white mx-auto mb-10" />
        <div className="space-y-12">
          <div className="text-center">
            <p className="text-gray-300 mb-2 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
              An intimate coffee omakase experience, custom-designed for each group by our founder Chris. Hosted inside our all-white Midtown studio.
            </p>
            <p className="text-gray-300 mb-2 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Rare coffees, curated in real time. Experimental techniques. Previews of new creations.
            </p>
          </div>
          <div className="border-t border-b border-gray-800 py-6 px-4 space-y-2" style={{ fontFamily: 'FragmentMono, monospace' }}>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Experience</span>
              <span className="text-white">TARE ROOM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Duration</span>
              <span className="text-white">2 hours (11am - 1pm)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Location</span>
              <span className="text-white">45 W 29th St Suite 301, New York, NY 10001</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Price</span>
              <span className="text-white">$90 per guest</span>
            </div>
          </div>
          <div className="text-center">
            <div className="space-y-3">
              <button
                onClick={() => handlePurchase("price_1RfuvWF5JUni5zIQaC5g3ZEF")}
                disabled={loadingPriceId !== null}
                className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {loadingPriceId === "price_1RfuvWF5JUni5zIQaC5g3ZEF" ? "PROCESSING..." : "RESERVE - SUNDAY, AUGUST 10"}
              </button>
              <button
                onClick={() => handlePurchase("price_1RqEtdF5JUni5zIQ8wJSZsJb")}
                disabled={loadingPriceId !== null}
                className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {loadingPriceId === "price_1RqEtdF5JUni5zIQ8wJSZsJb" ? "PROCESSING..." : "RESERVE - SUNDAY, AUGUST 17"}
              </button>
              <button
                onClick={() => handlePurchase("price_1RqEufF5JUni5zIQ7IM5TDrf")}
                disabled={loadingPriceId !== null}
                className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {loadingPriceId === "price_1RqEufF5JUni5zIQ7IM5TDrf" ? "PROCESSING..." : "RESERVE - SUNDAY, AUGUST 24"}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-4" style={{ fontFamily: 'FragmentMono, monospace' }}>{error}</p>
            )}
          </div>
        </div>
      </motion.div>

    </main>
  );
} 