"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Client component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [redirectCounter, setRedirectCounter] = useState(5);

  // Determine product name based on type
  const productName = type === "studio" ? "TARE STUDIO" : "TARE ROOM";

  // Redirect after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/home";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] },
    },
  };

  const lineVariants = {
    hidden: { width: "0%" },
    visible: {
      width: "100%",
      transition: {
        duration: 5,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      className="max-w-xl w-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl md:text-5xl font-light mb-8 tracking-wide"
        variants={itemVariants}
      >
        THANK YOU
      </motion.h1>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="w-12 h-px bg-white mx-auto mb-8" />
        <p className="text-gray-300 mb-6">
          Your {productName} purchase has been confirmed. 
          You will receive an email with your receipt shortly.
        </p>
        <p className="text-gray-500 text-sm">
          Redirecting in {redirectCounter}...
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-xs h-px bg-gray-800 relative overflow-hidden mx-auto mb-12"
        variants={itemVariants}
      >
        <motion.div
          className="absolute top-0 left-0 h-full bg-white"
          variants={lineVariants}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link
          href="/home"
          className="border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 inline-block"
        >
          RETURN TO HOME
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Loading fallback for Suspense
function SuccessLoading() {
  return (
    <div className="max-w-xl w-full text-center">
      <h1 className="text-3xl font-light mb-8 tracking-wide">
        LOADING...
      </h1>
      <div className="w-12 h-px bg-white mx-auto mb-8" />
    </div>
  );
}

// Main page component with Suspense boundary
export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <Suspense fallback={<SuccessLoading />}>
        <SuccessContent />
      </Suspense>
    </main>
  );
} 