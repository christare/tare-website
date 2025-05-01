"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StudioPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "studio") {
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
      console.log("Starting checkout for STUDIO with price ID: price_1RJbkjF5JUni5zIQf801xKE6");
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1RJbkjF5JUni5zIQf801xKE6",
          type: "studio"
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.04, 0.62, 0.23, 0.98] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const lineAnimation = {
    hidden: { width: 0 },
    visible: { 
      width: "100%", 
      transition: { duration: 1, ease: "easeOut" } 
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
            <h1 className="text-3xl font-light mb-10 tracking-wide">TARE STUDIO</h1>
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
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto px-6 py-12 md:py-20"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-light mb-6 tracking-wide text-center"
            >
              TARE STUDIO
            </motion.h1>
            
            <motion.div 
              variants={lineAnimation}
              className="w-12 h-px bg-white mx-auto mb-12" 
            />
            
            <motion.div variants={fadeIn} className="mb-16">
              <p className="text-gray-300 text-center italic text-lg md:text-xl mb-1 leading-relaxed">
                An immersive, multi-sensory experience.
              </p>
            </motion.div>
            
            {/* Experience Description with Improved Hierarchy */}
            <motion.div variants={fadeIn} className="mb-16">
              <div className="bg-gray-900/20 border border-gray-800 p-8">
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">The Experience</h2>
                    <p className="text-white text-sm leading-relaxed">
                      Tasting courses built from rare, experimental coffees.
                    </p>
                    <p className="text-white text-sm leading-relaxed mt-4">
                      Designed like fine dining. Curated through narrative.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">The Setting</h2>
                    <p className="text-white text-sm leading-relaxed">
                      Set inside our new minimalist studio in Midtown — part gallery, part ritual lab.
                    </p>
                    <p className="text-gray-500 text-xs mt-3">
                      Address provided after booking.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="border-t border-b border-gray-800 py-8 px-4 space-y-4 mb-12"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Experience</span>
                <span className="text-white text-sm">TARE STUDIO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Duration</span>
                <span className="text-white text-sm">90 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Location</span>
                <span className="text-white text-sm">Midtown Manhattan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Price</span>
                <span className="text-white text-sm">$150</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="text-center">
              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="border border-white px-12 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 inline-block"
              >
                {isLoading ? "PROCESSING..." : "RESERVE EXPERIENCE"}
              </button>
              
              {error && (
                <p className="text-red-400 text-sm mt-4">{error}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 