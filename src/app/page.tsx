"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PriorityPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = "https://tarecoffeeroom.com/home";
      }, 2000); // 2 seconds delay to allow animation to complete
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-16 text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            className="max-w-xl w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <motion.h1 
                className="text-2xl md:text-4xl font-light tracking-wider mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                TARE PRIORITY LIST
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
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Private access to our curated coffee experiences. 
                Limited seats for our tastings, flagship events, and collaborations.
                Invitations are extended personally.
              </motion.p>
            </motion.div>

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
                />
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-transparent border border-white py-4 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                SUBMIT
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