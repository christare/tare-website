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
        staggerChildren: 0.25,
        delayChildren: 0.5
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
  
  // Enhanced animation variants for more dramatic effects
  const drawPath = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    }
  };
  
  const titleReveal = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.4, 
        ease: [0.25, 1, 0.5, 1]
      } 
    }
  };
  
  const cascadeIn = {
    hidden: { opacity: 0, y: 60 },
    visible: (delay = 0) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.2, 
        delay: delay,
        ease: [0.25, 1, 0.5, 1]
      } 
    })
  };
  
  const slideFromLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 1, 
        ease: [0.25, 1, 0.5, 1] 
      } 
    }
  };
  
  const slideFromRight = {
    hidden: { opacity: 0, x: 80 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 1, 
        ease: [0.25, 1, 0.5, 1] 
      } 
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {!isAuthorized ? (
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div 
                initial={{ width: "10vw", height: "10vw", opacity: 0 }}
                animate={{ width: "20vw", height: "20vw", opacity: 0.3 }}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                className="border border-gray-900 opacity-30" 
              />
            </motion.div>
            
            <motion.h1 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="text-2xl font-extralight mb-16 tracking-[0.25em] uppercase"
            >
              TARE STUDIO
            </motion.h1>
            
            <motion.form 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 1, 0.5, 1] }}
              onSubmit={handlePasswordSubmit} 
              className="w-full max-w-xs"
            >
              <motion.div 
                className="mb-12"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, delay: 1.2, ease: "easeInOut" }}
              >
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full bg-transparent border-b border-gray-800 focus:outline-none focus:border-white py-3 text-sm tracking-[0.15em] placeholder-gray-800 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                />
              </motion.div>
              
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mb-6 text-center"
                >
                  {error}
                </motion.p>
              )}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.8 }}
                className="flex justify-center"
              >
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, borderColor: "#ffffff", color: "#ffffff" }}
                  className="border border-gray-900 hover:border-white px-8 py-3 text-sm tracking-[0.25em] hover:text-white text-gray-500 transition-all duration-700"
                >
                  CONTINUE
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        ) : (
          <div className="pt-16 px-6 md:px-12">
            <motion.div
              key="content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-screen-lg mx-auto"
            >
              {/* Title as art piece */}
              <motion.div 
                variants={fadeIn}
                className="min-h-[40vh] md:min-h-[50vh] flex flex-col items-center justify-center mb-20 relative"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute top-[20vh] md:top-[25vh] left-1/2 -translate-x-1/2 w-px h-[20vh] bg-gray-900 hidden md:block"
                />
                
                {/* Circular dial - more prominent */}
                <motion.div 
                  className="absolute w-[250px] h-[250px] md:w-[330px] md:h-[330px]"
                  initial={{ opacity: 0, rotate: -120, scale: 0.8 }}
                  animate={{ opacity: 0.4, rotate: 0, scale: 1 }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="48" 
                      stroke="#FFFFFF" 
                      strokeWidth="0.7" 
                      variants={drawPath}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                    />
                    
                    {/* Notches for settings - more defined */}
                    {[...Array(24)].map((_, i) => {
                      const angle = (i * 15 * Math.PI) / 180;
                      const isMain = i % 4 === 0;
                      const x1 = 50 + (isMain ? 42 : 45) * Math.sin(angle);
                      const y1 = 50 - (isMain ? 42 : 45) * Math.cos(angle);
                      const x2 = 50 + 48 * Math.sin(angle);
                      const y2 = 50 - 48 * Math.cos(angle);
                      
                      return (
                        <motion.line 
                          key={i}
                          x1={x1} 
                          y1={y1} 
                          x2={x2} 
                          y2={y2} 
                          stroke="#FFFFFF" 
                          strokeWidth={isMain ? "1" : "0.5"} 
                          opacity={isMain ? "0.85" : "0.5"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isMain ? 0.85 : 0.5 }}
                          transition={{ delay: 0.8 + i * 0.04, duration: 0.5 }}
                        />
                      );
                    })}
                    
                    {/* Inner circle */}
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="30" 
                      stroke="#FFFFFF" 
                      strokeWidth="0.3" 
                      opacity="0.4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                    />
                    
                    {/* Indicator */}
                    <motion.circle 
                      cx="50" 
                      cy="14" 
                      r="1.5" 
                      fill="#FFFFFF" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      transition={{ delay: 2, duration: 0.6 }}
                    />
                  </svg>
                </motion.div>
                
                <motion.h1 
                  variants={titleReveal}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl md:text-5xl font-extralight tracking-[0.3em] uppercase text-center mb-8 relative z-10"
                >
                  TARE
                  <br />
                  <span className="text-3xl md:text-4xl">STUDIO 01</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 1 }}
                  className="text-gray-500 text-xs tracking-[0.15em] uppercase"
                >
                  June 7, 2024
                </motion.p>
              </motion.div>
              
              {/* Manifesto */}
              <div className="mb-24">
                <motion.div 
                  variants={fadeIn}
                  className="flex justify-center mb-16"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <div className="max-w-md">
                    <motion.p 
                      variants={cascadeIn}
                      custom={0}
                      className="text-center italic text-gray-400 text-xl md:text-2xl leading-relaxed font-extralight"
                    >
                      TARE STUDIO is not a café. 
                      <br />
                      It's not an omakase.
                      <br /><br />
                      It's a new category.
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-24 mb-16"
                >
                  <motion.div 
                    variants={slideFromLeft}
                    className="md:col-span-2 md:col-start-1"
                  >
                    <p className="text-gray-300 text-sm leading-loose font-light">
                      Coffee is the most complex flavor-producing ingredient on earth.
                      But culturally, it's been reduced — to fuel. Routine. "The coffee chat."
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    variants={slideFromRight}
                    className="md:col-span-2 md:col-start-4"
                  >
                    <p className="text-gray-300 text-sm leading-loose font-light">
                      At TARE, we asked: What if we started from scratch?
              
                      What if coffee was treated like cuisine?
                      Like art? Like performance?
                    </p>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  variants={cascadeIn}
                  custom={0.6}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  className="flex justify-center"
                >
                  <div className="max-w-md">
                    <p className="text-center text-gray-300 text-sm leading-loose font-light">
                      TARE STUDIO is our answer. A new format of rare coffees, reimagined as a multi-sensory tasting menu —
                      inspired by fine dining, structured as a performance, driven by music.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Experience as art */}
              <motion.div 
                variants={fadeIn}
                className="mb-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-900"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-900"
                  >
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="block text-gray-600 uppercase text-[10px] tracking-[0.3em] mb-8 md:mb-16"
                    >
                      The Experience
                    </motion.span>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.3}
                      className="text-gray-300 text-sm leading-loose font-light mb-6"
                    >
                      Guests move through a progression of coffee-based courses, guided by narrative.
                    </motion.p>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.5}
                      className="text-gray-300 text-sm leading-loose font-light"
                    >
                      We showcase experimental techniques to create textures, forms, and flavors 
                      that haven't existed in coffee — until now.
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-900"
                  >
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="block text-gray-600 uppercase text-[10px] tracking-[0.3em] mb-8 md:mb-16"
                    >
                      The Setting
                    </motion.span>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.7}
                      className="text-gray-300 text-sm leading-loose font-light mb-6"
                    >
                      Set inside our all-white Midtown studio space — part gallery, part coffee R&D lab.
                    </motion.p>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.8}
                      className="text-gray-600 text-xs font-light"
                    >
                      Exact location will be shared after booking.
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="p-8 md:p-10"
                  >
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="block text-gray-600 uppercase text-[10px] tracking-[0.3em] mb-8 md:mb-16"
                    >
                      The Details
                    </motion.span>
                    
                    <motion.div 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false }}
                      className="space-y-4 text-sm"
                    >
                      {[
                        { label: "Experience", value: "TARE STUDIO 01", delay: 0.1 },
                        { label: "Date", value: "June 7, 2024", delay: 0.2 },
                        { label: "Time", value: "11am - 12:30pm", delay: 0.3 },
                        { label: "Duration", value: "90 minutes", delay: 0.4 },
                        { label: "Location", value: "Midtown Manhattan", delay: 0.5 },
                        { label: "Price", value: "$150", delay: 0.6 }
                      ].map((item) => (
                        <motion.div 
                          key={item.label}
                          variants={cascadeIn}
                          custom={item.delay}
                        >
                          <span className="text-gray-600 block">{item.label}</span>
                          <span className="text-gray-300 font-light">{item.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Reserve button as art */}
              <motion.div 
                variants={fadeIn}
                className="flex justify-center py-16 md:py-24 mb-16"
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: false, amount: 0.6 }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="text-center"
                >
                  {isLoading ? (
                    <motion.button
                      disabled={true}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 0.5 }}
                      className="border border-gray-900 px-12 py-4 text-sm tracking-[0.25em] hover:border-white text-gray-600 transition-all duration-700 disabled:opacity-50 uppercase font-light"
                    >
                      Processing
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handlePurchase}
                      whileHover={{ scale: 1.05, borderColor: "#ffffff", color: "#ffffff" }}
                      className="border border-gray-900 px-12 py-4 text-sm tracking-[0.25em] hover:border-white text-gray-500 hover:text-white transition-all duration-700 uppercase font-light"
                    >
                      Reserve Your Seat
                    </motion.button>
                  )}
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-gray-700 text-xs mt-6 font-light"
                  >
                    You'll receive an email confirmation after checkout.
                  </motion.p>
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
} 