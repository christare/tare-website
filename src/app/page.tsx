"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PriorityPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const instagramValue = formData.get('instagram') as string;
    // Strip @ symbol from Instagram handle if present
    const cleanInstagram = instagramValue ? instagramValue.replace(/^@/, '') : '';
    
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      instagram: cleanInstagram,
      why: formData.get('why'),
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
    } catch (err) {
      setError('There was an error submitting your form. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Function to handle Instagram input changes
  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value;
    
    // Remove any @ symbols from the beginning
    value = value.replace(/^@+/, '');
    
    // If there's a value, ensure it starts with @
    if (value) {
      value = '@' + value;
    }
    
    // Update the input value
    input.value = value;
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = "https://tarecoffeeroom.com/home";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-16 pt-32 text-white overflow-hidden relative">
      {/* Hero dial, logo, and subheader */}
      <div className="w-full min-h-screen flex flex-col items-center justify-start relative bg-black" style={{ zIndex: 2 }}>
        <div className="w-full h-screen flex flex-col items-center justify-center relative">
          <svg width="100vw" height="100vh" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', minHeight: 600, maxHeight: '100vh', zIndex: 1, pointerEvents: 'none', opacity: 0.18 }}>
            {Array.from({ length: 48 }).map((_, i) => {
              const angle = (i / 48) * 2 * Math.PI;
              const isMajor = i % 8 === 0;
              const length = isMajor ? 60 : i % 2 === 0 ? 32 : 16;
              const strokeWidth = isMajor ? 3 : 1.5;
              const r1 = 320;
              const r2 = r1 + length;
              const x1 = 400 + r1 * Math.cos(angle - Math.PI / 2);
              const y1 = 400 + r1 * Math.sin(angle - Math.PI / 2);
              const x2 = 400 + r2 * Math.cos(angle - Math.PI / 2);
              const y2 = 400 + r2 * Math.sin(angle - Math.PI / 2);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#fff"
                  strokeWidth={strokeWidth}
                  opacity={isMajor ? 0.9 : 0.6}
                />
              );
            })}
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -54%)', textAlign: 'center', zIndex: 2, width: 'min(90vw, 500px)' }}>
            <img
              src="/images/TARE LOGOS/Logo01/rgb-web/white/tare-logo01-white-rgb.svg"
              alt="TARE"
              style={{ width: 'min(80vw, 340px)', maxWidth: 340, margin: '0 auto', display: 'block' }}
            />
            <div style={{ color: '#fff', fontSize: 18, lineHeight: 1.4, letterSpacing: '0.04em', fontFamily: 'NonBureauExtended, sans-serif', marginTop: 18 }}>
              THIS IS NOT A DRINK.<br />
              IT'S A PERFORMANCE—<br />
              BUILT FROM COFFEE.
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            className="max-w-xl w-full relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="text-center mb-16" variants={itemVariants}>
            
              <motion.div 
                className="w-16 h-px bg-white mx-auto mb-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <motion.p 
                className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                We host three kinds of public events:
              </motion.p>
              <motion.div 
                className="w-8 h-px bg-gray-700 mx-auto my-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              />
              <nav className="w-full flex flex-col items-center justify-center mt-8" style={{zIndex:3}}>
                <ul className="flex flex-col md:flex-row gap-6 md:gap-12 text-center">
                  <li><a href="/room" style={{ fontFamily: 'FragmentMono, monospace', fontSize: 18, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none' }}>01 ROOM</a>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">Intimate founder-led tasting sessions in Long Island City</p>
                  </li>
                  <li><a href="/studio" style={{ fontFamily: 'FragmentMono, monospace', fontSize: 18, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none' }}>02 STUDIO</a>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">Fine-dining-style coffee tastings in our all-white gallery space</p>
                  </li>
                  <li><a href="/runway" style={{ fontFamily: 'FragmentMono, monospace', fontSize: 18, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none' }}>03 RUNWAY</a>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">Legendary cultural collaborations and creative releases</p>
                  </li>
                </ul>
              </nav>
              <motion.div
                className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
           
              </motion.div>
              <motion.div 
                className="w-8 h-px bg-gray-700 mx-auto my-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
              <motion.div
                className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <span className="text-white">Next available session:</span><br />
                <span className="text-white tracking-wider">TARE STUDIO 01 — June 7, 2025 (Midtown NYC)</span>
                <div className="text-gray-500 text-xs mt-2">Invites to reserve a seat are sent personally via text</div>
              </motion.div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center mb-6"
              >
                {error}
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-8"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="grid grid-cols-2 gap-6" variants={itemVariants}>
                <div className="relative">
                  <motion.input
                    type="text"
                    name="firstName"
                    required
                    placeholder="First Name"
                    className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                    whileFocus={{ borderColor: "white" }}
                    transition={{ duration: 0.2 }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <motion.input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                    whileFocus={{ borderColor: "white" }}
                    transition={{ duration: 0.2 }}
                    disabled={isSubmitting}
                  />
                </div>
              </motion.div>
              <motion.div className="relative" variants={itemVariants}>
                <motion.input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                  whileFocus={{ borderColor: "white" }}
                  transition={{ duration: 0.2 }}
                  disabled={isSubmitting}
                />
              </motion.div>
              <motion.div className="relative" variants={itemVariants}>
                <motion.input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                  whileFocus={{ borderColor: "white" }}
                  transition={{ duration: 0.2 }}
                  disabled={isSubmitting}
                />
              </motion.div>
              <motion.div className="relative" variants={itemVariants}>
                <motion.input
                  type="text"
                  name="instagram"
                  placeholder="Instagram Handle (Optional)"
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                  whileFocus={{ borderColor: "white" }}
                  transition={{ duration: 0.2 }}
                  disabled={isSubmitting}
                  onChange={handleInstagramChange}
                />
              </motion.div>
              <motion.div className="relative" variants={itemVariants}>
                <motion.textarea
                  name="why"
                  placeholder="What brings you to TARE? (Optional)"
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 resize-none"
                  rows={2}
                  whileFocus={{ borderColor: "white" }}
                  transition={{ duration: 0.2 }}
                  disabled={isSubmitting}
                />
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-transparent border border-white py-4 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </motion.button>
            </motion.form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-2xl md:text-3xl font-light tracking-wider mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              THANK YOU
            </motion.h1>
            <motion.div 
              className="w-16 h-px bg-white mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.p 
              className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              You have been added to our priority list. 
              We will be in touch when new experiences become available.
            </motion.p>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="w-32 h-px bg-white mx-auto mb-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
              <motion.p
                className="text-gray-400 text-xs tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                Redirecting...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}