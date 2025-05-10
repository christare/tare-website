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
      {/* Background dial animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.circle
            cx="400"
            cy="400"
            r="350"
            stroke="white"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.circle
            cx="400"
            cy="400"
            r="300"
            stroke="white"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
          />
          <motion.circle
            cx="400"
            cy="400"
            r="250"
            stroke="white"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-8 right-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.a
          href="https://www.tarecoffeeroom.com/home"
          className="text-gray-400 text-sm tracking-wider hover:text-white transition-colors duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="hidden md:inline">Visit TARE</span>
          <span className="inline md:hidden">Visit TARE</span>
          <span>→</span>
        </motion.a>
      </motion.div>

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
              <motion.h1 
                className="text-2xl md:text-4xl font-light tracking-wider mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                TARE PRIORITY LIST
              </motion.h1>
              <motion.div 
                className="w-16 h-px bg-white mx-auto mb-12"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <motion.p 
                className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Access private invitations to TARE, a coffee experience that has never existed until now.
              </motion.p>
              <motion.div 
                className="w-8 h-px bg-gray-700 mx-auto my-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              />
              <motion.p 
                className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Our work spans intimate tastings, flagship large-format events, and experimental collaborations — all centered around reimagining coffee as art, cuisine, and performance.
              </motion.p>
              <motion.div 
                className="w-8 h-px bg-gray-700 mx-auto my-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              <motion.p 
                className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Sign up to be considered for upcoming sessions (delivered personally via text). Most of our events fill through this list before they're ever publicly announced.
              </motion.p>
              <motion.div 
                className="w-8 h-px bg-gray-700 mx-auto my-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              />
              <motion.div
                className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <span className="text-white">Next available session:</span><br />
                <span className="text-white tracking-wider">TARE STUDIO 01 — June 7, 2024 (Midtown NYC)</span>
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