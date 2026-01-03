"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CURRENT_EVENT_CONFIG } from "@/config/events";

export default function RoomDevPage() {
  const router = useRouter();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "room") {
      setError("");
      setShowPasswordPrompt(false);
      setPassword("");
      handlePurchase();
    } else {
      setError("Incorrect password");
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Starting checkout for ROOM with price ID: price_1RfuvWF5JUni5zIQaC5g3ZEF");
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1RfuvWF5JUni5zIQaC5g3ZEF",
          type: "room"
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Checkout response error:", data);
        setError(data.details?.message || data.error || "Failed to create checkout session");
        setIsLoading(false);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong with the checkout process");
      setIsLoading(false);
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
            <span className="text-xl md:text-2xl font-light tracking-wide" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>ROOM DEV</span>
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
            <p className="text-gray-400 mb-8 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace', fontSize: '0.95em' }}>
              $90 per guest
            </p>
          </div>
          <div className="border-t border-b border-gray-800 py-6 px-4 space-y-2" style={{ fontFamily: 'FragmentMono, monospace' }}>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Experience</span>
              <span className="text-white">TARE ROOM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Date</span>
              <span className="text-white">Sunday, July 20, 2025</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Duration</span>
              <span className="text-white">2 hours (11am - 1pm)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Location</span>
              <span className="text-white">{CURRENT_EVENT_CONFIG.address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>Price</span>
              <span className="text-white">$90</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
              Invite-only from our priority list
            </p>
            <button
              onClick={() => setShowPasswordPrompt(true)}
              disabled={isLoading}
              className="border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 inline-block"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              {isLoading ? "PROCESSING..." : "RESERVE"}
            </button>
            {error && !showPasswordPrompt && (
              <p className="text-red-400 text-sm mt-4" style={{ fontFamily: 'FragmentMono, monospace' }}>{error}</p>
            )}
          </div>
        </div>
        <AnimatePresence>
          {showPasswordPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(42, 39, 38, 0.8)'}}
            >
              <form onSubmit={handlePasswordSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-xs">
                <h2 className="text-xl font-light mb-6 text-center" style={{ fontFamily: 'FragmentMono, monospace' }}>Enter Access Code</h2>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 mb-4"
                  style={{ fontFamily: 'FragmentMono, monospace' }}
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm mb-4 text-center" style={{ fontFamily: 'FragmentMono, monospace' }}>{error}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowPasswordPrompt(false); setError(""); setPassword(""); }}
                    className="flex-1 border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 rounded transition-all"
                    style={{ fontFamily: 'FragmentMono, monospace' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 border border-white px-4 py-2 text-sm text-white hover:bg-white hover:text-black rounded transition-all"
                    style={{ fontFamily: 'FragmentMono, monospace' }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
 
    </main>
  );
} 