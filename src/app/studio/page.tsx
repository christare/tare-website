"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Font declarations for custom typography
const engineeredStyle = {
  fontFamily: "'Inter', 'SF Pro Display', 'Roboto', sans-serif",
  fontWeight: "200",
  letterSpacing: "0.05em"
};

const monospaceStyle = {
  fontFamily: "'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace",
  letterSpacing: "0.02em"
};

export default function StudioPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isAuthorized]);

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
  
  const letterReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1, 
        delay: delay,
        ease: [0.25, 1, 0.5, 1]
      } 
    })
  };
  
  // Special emphasis animations
  const emphasizeText = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 1.5, 
        ease: [0.19, 1, 0.22, 1]
      } 
    }
  };
  
  const slowFadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 2.5, 
        ease: "easeOut" 
      } 
    }
  };
  
  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 1.2, 
        ease: [0.25, 1, 0.5, 1]
      } 
    }
  };
  
  const fadeInStaggered = {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({ 
      opacity: 1, 
      transition: { 
        duration: 1.2, 
        delay: delay, 
        ease: "easeOut" 
      } 
    })
  };

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Remove gradient effect */}
      
      <AnimatePresence mode="wait">
        {!isAuthorized && false ? (
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-black"
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
                className="border border-gray-700 opacity-30" 
              />
            </motion.div>
            
            <motion.h1 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="text-2xl font-extralight mb-16 tracking-[0.25em] uppercase"
              style={engineeredStyle}
            >
              TARE STUDIO
            </motion.h1>
            
            <motion.form 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
              onSubmit={handlePasswordSubmit} 
              className="w-full max-w-xs"
            >
              <motion.div 
                className="mb-12"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
              >
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-[0.15em] placeholder-gray-700 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  style={{ ...monospaceStyle, fontSize: "16px" }}
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
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex justify-center"
              >
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, borderColor: "#ffffff", color: "#ffffff" }}
                  className="border border-gray-700 hover:border-white px-8 py-3 text-sm tracking-[0.25em] hover:text-white text-gray-400 transition-all duration-700"
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
                  className="absolute top-[20vh] md:top-[25vh] left-1/2 -translate-x-1/2 w-px h-[20vh] bg-gray-700 hidden md:block"
                />
                
                {/* Circular dial - more minimal and mythical */}
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
                      strokeWidth="0.5" 
                      variants={drawPath}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                    />
                    
                    {/* Fewer, more significant notches */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      const isMain = i % 3 === 0;
                      const x1 = 50 + (isMain ? 40 : 44) * Math.sin(angle);
                      const y1 = 50 - (isMain ? 40 : 44) * Math.cos(angle);
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
                          strokeWidth={isMain ? "0.7" : "0.3"} 
                          opacity={isMain ? "0.9" : "0.4"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isMain ? 0.9 : 0.4 }}
                          transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                        />
                      );
                    })}
                    
                    {/* Mythical star points */}
                    {[...Array(3)].map((_, i) => {
                      const angle = (i * 120 * Math.PI) / 180;
                      const x = 50 + 20 * Math.sin(angle);
                      const y = 50 - 20 * Math.cos(angle);
                      
                      return (
                        <motion.circle 
                          key={`star-${i}`}
                          cx={x} 
                          cy={y} 
                          r="0.5" 
                          fill="#FFFFFF" 
                          opacity="0.8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.8 }}
                          transition={{ delay: 1.6 + i * 0.2, duration: 0.5 }}
                        />
                      );
                    })}
                    
                    {/* Inner circle */}
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="25" 
                      stroke="#FFFFFF" 
                      strokeWidth="0.2" 
                      opacity="0.3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                    />
                    
                    {/* Elegant celestial positioning indicator */}
                    <motion.circle 
                      cx="50" 
                      cy="14" 
                      r="1" 
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
                  className="text-4xl md:text-5xl font-extralight tracking-[0.35em] uppercase text-center mb-8 relative z-10"
                  style={engineeredStyle}
                >
                  TARE
                  <br />
                  <span className="text-3xl md:text-4xl">STUDIO 01</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 1 }}
                  className="text-gray-400 text-xs tracking-[0.15em] uppercase"
                >
                  June 7, 2025
                </motion.p>
              </motion.div>
              
              {/* Manifesto - refined and more subtle */}
              <div className="mb-24">
                <motion.div 
                  variants={fadeIn}
                  className="flex justify-center mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <div className="max-w-md">
                    <motion.p 
                      variants={cascadeIn}
                      custom={0}
                      className="text-center text-gray-300 text-sm md:text-base leading-loose font-extralight tracking-wide"
                      style={engineeredStyle}
                    >
                      Not a café. Not an omakase.
                      <span className="block h-6"></span>
                      We created a format for coffee that's never existed.

                    </motion.p>
                  </div>
                </motion.div>
                
                {/* Visual break - with horizontal scroll effect */}
                <div className="md:col-span-12 h-16 relative">
                  <motion.div
                    className="absolute h-px bg-gray-700 opacity-30 top-[50%] left-[10%] w-[80%]"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "80%" }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                
                {/* Experimental Narrative Section - With Blueprint Style */}
                <div className="relative">
                  {/* Background grid for blueprint effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.05 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.5 }}
                  >
                    <div className="w-full h-full" style={{ 
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                    }}></div>
                  </motion.div>
                  
                  {/* Experimental questions - staggered but compact */}
                  <motion.div 
                    className="md:col-span-10 md:col-start-2 mb-4 flex items-center justify-center"
                    variants={letterReveal}
                    custom={1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                  >
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light tracking-wide text-center" style={engineeredStyle}>
                      What if we brewed tea from the skins of coffee cherries?
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="md:col-span-10 md:col-start-2 mb-8 flex items-center justify-center"
                    variants={letterReveal}
                    custom={1.1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                  >
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light tracking-wide text-center" style={engineeredStyle}>
                      What if we turned carbonic fermentation into caviar — then carbonated it?
                    </p>
                  </motion.div>
                  
                  {/* Introduction to iterations as internal lab record */}
                  <motion.div
                    className="mt-16 mb-4 flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <div className="border-t border-gray-800 pt-8 w-full max-w-3xl">
                      <p className="text-blue-300 text-xs md:text-sm tracking-wider text-center" style={monospaceStyle}>
                        /// TARE INTERNAL LAB RECORD — STUDIO_01 DEPLOYMENT PHASE ///
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Visually distinct experimental stories - with monospace details - simplified */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                      <motion.div 
                        className="my-12 p-8 border-l border-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
                          <div className="md:col-span-6 order-2 md:order-1">
                            <motion.div 
                              className="w-full h-auto relative"
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: false }}
                              transition={{ duration: 1.2, delay: 0.4 }}
                            >
                              <Image
                                src="/images/tuile.png"
                                alt="Espresso tuile"
                                width={400}
                                height={400}
                                // className="filter invert contrast-200 brightness-150"
                              />
                            </motion.div>
                          </div>
                          <div className="md:col-span-6 order-1 md:order-2 md:pl-4">
                            <div className="opacity-80" style={monospaceStyle}>
                              <p className="text-xs md:text-sm text-blue-300 leading-relaxed mb-0">
                                ARCHIVE_LOG: TUILE_ESPRESSO_17<br/>
                                ENVIRONMENT: 72.4°F · 43% HUMIDITY<br/>
                                TEXTURE INDEX: 9.2<br/>
                                CRYSTALLIZATION EVENT: 18 SEC<br/>
                                STABILITY: VERIFIED<br/>
                                ITERATION: 3<br/>
                                STATUS: FORM LOCKED — ADOPTED FOR STUDIO 01
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="my-12 p-8 border-l border-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
                          <div className="md:col-span-6 order-1 md:pr-4">
                            <div className="opacity-80 flex flex-col items-end" style={monospaceStyle}>
                              <p className="text-xs md:text-sm text-blue-300 leading-relaxed text-right mb-0">
                                MOLDING_SPEC: V3.2 — FINAL RUN<br/>
                                MATERIAL: FOOD-GRADE SILICONE<br/>
                                CURE PROFILE: 6–7 HRS<br/>
                                THERMAL RANGE: ≤ 400°F<br/>
                                FLEX INDEX: 87%<br/>
                                EXPECTED LIFECYCLE: 4,500+ USES<br/>
                                STATUS: PRODUCTION INTEGRATED — STUDIO 01
                              </p>
                            </div>
                          </div>
                          <div className="md:col-span-6 order-2">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: false }}
                              transition={{ duration: 1.2, delay: 0.4 }}
                            >
                              <Image
                                src="/images/beans.png"
                                alt="Silicone mold"
                                width={400}
                                height={400}
                                // className="filter invert contrast-200 brightness-150"
                              />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="my-12 p-8 border-l border-gray-700 mb-12"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
                          <div className="md:col-span-6 order-2 md:order-1">
                            <motion.div 
                              className="w-full h-auto relative"
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: false }}
                              transition={{ duration: 1.2, delay: 0.4 }}
                            >
                              <Image
                                src="/images/blueprint dark brewer 1.png"
                                alt="Custom brewer"
                                width={400}
                                height={400}
                                // className="filter invert contrast-200 brightness-150"
                              />
                            </motion.div>
                          </div>
                          <div className="md:col-span-6 order-1 md:order-2 md:pl-4">
                            <div className="opacity-80" style={monospaceStyle}>
                              <p className="text-xs md:text-sm text-blue-300 leading-relaxed mb-0">
                                DEVICE_ID: EXTRACTOR_X1<br/>
                                EXTRACTION RATE: 8g/sec<br/>
                                AROMA RETENTION: 91.3% VOLATILES<br/>
                                PRESSURE MODULATION: 1.5–2.1 BAR<br/>
                                FLOW: VARIABLE | ADAPTIVE<br/>
                                RELEASE STATUS: INTERNAL FINALIZATION<br/>
                                TARGET DEPLOYMENT: STUDIO 01 — Q4 LAUNCH
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Visual break before sign-off */}
                <div className="md:col-span-12 h-16 md:h-24 relative">
                  <motion.div 
                    className="absolute left-[25%] top-1/2 transform -translate-y-1/2 flex items-center gap-4 w-1/2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="h-px bg-gray-700 flex-grow opacity-30"></div>
                  </motion.div>
                </div>
                
                {/* Personal Sign-off Section - minimalist version */}
                <motion.div 
                  className="md:col-span-8 md:col-start-3 my-12 flex justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <div className="text-center">
                    <p className="text-gray-300 text-sm leading-loose font-light tracking-wide" style={engineeredStyle}>
                      We're not elevating coffee.
                      <br/>
                      We're creating a new category.
                      <br/>
                      I'd love for you to experience it with us.
                    </p>
                  </div>
                </motion.div>
                
                {/* Signature - more centered */}
                <motion.div 
                  className="md:col-span-6 md:col-start-4 mb-8 text-center"
                  variants={fadeInStaggered}
                  custom={3}
                >
                  <p className="text-gray-300 text-base leading-relaxed font-light" style={engineeredStyle}>
                    See you in the STUDIO,
                  </p>
                  <p className="text-gray-400 text-base leading-relaxed font-light italic mt-1" style={engineeredStyle}>
                    — Chris
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed font-light mt-1" style={monospaceStyle}>
                    Creative Director, TARE
                  </p>
                </motion.div>
              </div>
              
              {/* Visual breather */}
              <div className="h-16 md:h-24"></div>
              
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
                  className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-800"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-800 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute h-[80%] w-[1px] bg-gray-800 opacity-20 right-0 top-[10%] hidden md:block"
                      initial={{ height: "0%" }}
                      whileInView={{ height: "80%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                    />
                    
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="block text-gray-500 uppercase text-[10px] tracking-[0.3em] mb-8 md:mb-16"
                      style={engineeredStyle}
                    >
                      The Experience
                    </motion.span>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.3}
                      className="text-white text-base md:text-base leading-loose font-light mb-6"
                      style={engineeredStyle}
                    >
                      Guests move through a progression of coffee-based courses, guided by narrative.
                    </motion.p>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.5}
                      className="text-white text-base md:text-base leading-loose font-light"
                      style={engineeredStyle}
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
                    className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-800 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute h-[80%] w-[1px] bg-gray-800 opacity-20 right-0 top-[10%] hidden md:block"
                      initial={{ height: "0%" }}
                      whileInView={{ height: "80%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.2, delay: 1 }}
                    />
                    
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="block text-gray-500 uppercase text-[10px] tracking-[0.3em] mb-8 md:mb-16"
                      style={engineeredStyle}
                    >
                      The Setting
                    </motion.span>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.7}
                      className="text-white text-base md:text-base leading-loose font-light mb-6"
                      style={engineeredStyle}
                    >
                      Set inside our all-white Midtown studio space — part gallery, part coffee R&D lab.
                    </motion.p>
                    
                    <motion.p 
                      variants={cascadeIn}
                      custom={0.8}
                      className="text-gray-400 text-sm font-light"
                      style={monospaceStyle}
                    >
                      Exact location will be shared after booking.
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="p-8 md:p-10 relative overflow-hidden"
                  >
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="block text-gray-500 uppercase text-[10px] tracking-[0.3em] mb-8 md:mb-16"
                      style={engineeredStyle}
                    >
                      The Details
                    </motion.span>
                    
                    <motion.div 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false }}
                      className="space-y-5 text-sm"
                    >
                      {[
                        { label: "Experience", value: "TARE STUDIO 01", delay: 0.1 },
                        { label: "Date", value: "June 7, 2025", delay: 0.2 },
                        { label: "Time", value: "11am - 12:30pm", delay: 0.3 },
                        { label: "Duration", value: "90 minutes", delay: 0.4 },
                        { label: "Location", value: "Midtown Manhattan", delay: 0.5 },
                        { label: "Price", value: "$150", delay: 0.6 }
                      ].map((item) => (
                        <motion.div 
                          key={item.label}
                          variants={cascadeIn}
                          custom={item.delay}
                          className="border-b border-gray-800 border-opacity-20"
                        >
                          <span className="text-gray-500 block text-sm tracking-wider" style={monospaceStyle}>{item.label}</span>
                          <span className="text-white font-light text-base" style={engineeredStyle}>{item.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  
                </motion.div>
                {/* Reserve button as art — moved up for visibility */}
<motion.div 
  variants={fadeIn}
  className="flex justify-center py-12 md:py-16 mb-16"
  initial="hidden"
  whileInView="visible" 
  viewport={{ once: false, amount: 0.6 }}
>
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false }}
    transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
    className="text-center max-w-sm px-8"
  >
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="uppercase text-gray-500 text-xs tracking-[0.2em] mb-8"
      style={monospaceStyle}
    >
      LAST TICKET AVAILABLE
    </motion.p>

    {isLoading ? (
      <motion.button
        disabled={true}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5 }}
        className="border border-gray-700 px-12 py-4 text-sm tracking-[0.25em] hover:border-white text-gray-500 transition-all duration-700 disabled:opacity-50 uppercase font-light"
        style={engineeredStyle}
      >
        Processing
      </motion.button>
    ) : (
      <motion.button
        onClick={handlePurchase}
        whileHover={{ scale: 1.05, borderColor: "#ffffff", color: "#ffffff" }}
        className="border border-white px-12 py-4 text-sm tracking-[0.25em] hover:border-white hover:text-white transition-all duration-700 uppercase font-light"
        style={engineeredStyle}
      >
        Reserve Your Seat
      </motion.button>
    )}

    <motion.p 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      transition={{ delay: 0.7, duration: 0.8 }}
      className="text-gray-500 text-sm mt-8 font-light tracking-wide"
      style={monospaceStyle}
    >
      You'll receive an email with location details after checkout.
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
              
              {/* Visual transition to reservation */}
              {/* <motion.div 
                className="flex justify-center mb-16 relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <motion.div className="relative">
                  <motion.div 
                    className="w-[1px] h-[40px] bg-gray-800 opacity-50 absolute left-1/2 -translate-x-1/2"
                    initial={{ height: 0 }}
                    whileInView={{ height: 40 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: false, amount: 0.8 }}
                  />
                  <motion.div 
                    className="w-4 h-4 border border-gray-700 rounded-full flex items-center justify-center absolute top-[40px] left-1/2 -translate-x-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    viewport={{ once: false, amount: 0.8 }}
                  >
                    <motion.div 
                      className="w-1 h-1 bg-gray-500 rounded-full"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.6 }}
                      viewport={{ once: false, amount: 0.8 }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div> */}
              
              {/* Reserve button as art */}
              
          
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
} 