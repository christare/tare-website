"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RoomPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "room") {
      setIsAuthorized(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Starting checkout for ROOM with price ID: price_1RJbcVF5JUni5zIQhXrKHeWo");
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1RJbcVF5JUni5zIQhXrKHeWo",
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
    <main className="min-h-screen bg-black text-white pt-24">
      <AnimatePresence mode="wait">
        {!isAuthorized ? (
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[70vh]"
          >
            <h1 className="text-3xl font-light mb-10 tracking-wide">TARE ROOM</h1>
            <div className="w-12 h-px bg-white mx-auto mb-10" />
            
            <form onSubmit={handlePasswordSubmit} className="w-full">
              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                />
              </div>
              
              {error && (
                <p className="text-red-400 text-sm mb-6">{error}</p>
              )}
              
              <button
                type="submit"
                className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
              >
                CONTINUE
              </button>
            </form>
          </motion.div>
        ) : (
          
          <motion.div
          
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto px-6 py-20"
          >
            <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide text-center">TARE ROOM</h1>
            <div className="w-12 h-px bg-white mx-auto mb-10" />
            
            <div className="space-y-12">
              <div className="text-center">
                <p className="text-gray-300 mb-8 leading-relaxed">
                Our casual, social coffee session in a cozy apartment in Long Island City. 
        
                </p>
                <p>
                Join our founder and team to preview world-class coffees, unreleased recipes, and experimental brewing methods.
                </p>
              </div>
              
              <div className="border-t border-b border-gray-800 py-6 px-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-white">TARE ROOM - Sunday May 25th, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">1 hour (11am-1pm)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="text-white">$35</span>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 inline-block"
                >
                  {isLoading ? "PROCESSING..." : "PURCHASE"}
                </button>
                
                {error && (
                  <p className="text-red-400 text-sm mt-4">{error}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 