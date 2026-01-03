"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CURRENT_EVENT_CONFIG } from "@/config/events";

// Client component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // Determine product name based on type
  const productName = type === "studio" ? "TARE STUDIO" : "TARE ROOM";

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
        CONFIRMED
      </motion.h1>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="w-12 h-px bg-white mx-auto mb-10" />
        
        {type === "room" ? (
          <>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Thank you! We're excited to welcome you to TARE ROOM.
            </p>
            
            {/* Event Details Table */}
            <div className="py-8">
              {/* Line 43 above event details */}
              <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="mb-8">
                <Image
                  src="/images/Line 43.png"
                  alt="Line 43"
                  width={1920}
                  height={100}
                  style={{ width: '100vw', height: 'auto', display: 'block', opacity: '0.2' }}
                />
              </div>
              
              <div className="py-4 px-4 space-y-4 max-w-md mx-auto" style={{ fontFamily: 'FragmentMono, monospace' }}>
                <div className="text-center">
                  <span className="text-white text-xs block" style={{ fontFamily: 'FragmentMono, monospace' }}>1:45pm doors open</span>
                </div>
                <div className="text-center">
                  <span className="text-white text-xs block" style={{ fontFamily: 'FragmentMono, monospace' }}>2pm - Ends around 3:30 PM</span>
                </div>
                <div className="text-center">
                  <div className="text-white text-xs" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    <div>{CURRENT_EVENT_CONFIG.addressLine1}</div>
                    <div>{CURRENT_EVENT_CONFIG.addressLine2}</div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-white text-xs block" style={{ fontFamily: 'FragmentMono, monospace' }}>$90</span>
                </div>
              </div>
              
              {/* Line 44 below event details */}
              <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="mt-8">
                <Image
                  src="/images/Line 44.png"
                  alt="Line 44"
                  width={1920}
                  height={100}
                  style={{ width: '100vw', height: 'auto', display: 'block', opacity: '0.2' }}
                />
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mt-10">
              — Chris, TARE
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-300 text-lg italic mb-8 leading-relaxed">
              Your seat at {productName} is reserved.
            </p>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              I'll be reaching out personally with location details closer to the date.
            </p>
            
            <p className="text-gray-400 text-sm mt-10">
              — Chris, TARE
            </p>
          </>
        )}
      </motion.div>



      <motion.div variants={itemVariants}>
        <Link
          href="/"
          className="border border-gray-700 px-8 py-3 text-sm tracking-wide hover:border-white hover:text-white transition-all duration-300 inline-block text-gray-400"
        >
          RETURN
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white" style={{backgroundColor: '#2A2726'}}>
      <Suspense fallback={<SuccessLoading />}>
        <SuccessContent />
      </Suspense>
    </main>
  );
} 