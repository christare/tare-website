"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CURRENT_EVENT_CONFIG } from "@/config/events";

function formatSessionDate(dateStr: string | null): string | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Time display: match config (use en-dash for range)
const EVENT_TIME = CURRENT_EVENT_CONFIG.eventTime.replace(" - ", " – ");
const DOORS_OPEN = CURRENT_EVENT_CONFIG.doorsOpen;

function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const dateParam = searchParams.get("date");
  const sessionDateFormatted = formatSessionDate(dateParam);
  const isBeans = type === "beans";
  const isLineup = type === "lineup";
  const productName =
    type === "studio" ? "TARE STUDIO" : isLineup ? "TARE LINEUP 01" : isBeans ? "TARE BEANS" : "TARE ROOM";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <motion.div
      className="relative z-10 w-full max-w-lg mx-auto text-center px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Content card — compact, no scroll */}
      <div className="relative border border-white/25 rounded-sm bg-[#2A2726]/80 backdrop-blur-[1px] py-5 sm:py-6 px-5 sm:px-8 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        {/* Artifact */}
      <motion.div className="relative z-10 flex justify-center mb-3" variants={itemVariants}>
        <Image
          src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
          alt=""
          width={64}
          height={64}
          className="w-10 h-auto opacity-90"
        />
      </motion.div>

      <motion.p
        className="relative z-10 text-gray-500 text-xs tracking-[0.25em] mb-2"
        style={{ fontFamily: "FragmentMono, monospace" }}
        variants={itemVariants}
      >
        YOU&apos;RE IN
      </motion.p>

      <motion.h1
        className="relative z-10 text-xl sm:text-2xl font-light text-white tracking-wide mb-2"
        style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
        variants={itemVariants}
      >
        {isLineup
          ? "Your lineup order is in."
          : isBeans
          ? "Your coffee order is in."
          : `Your seat at ${productName}${sessionDateFormatted ? ` for ${sessionDateFormatted}` : ""} is reserved.`}
      </motion.h1>

      {isLineup ? (
        <motion.div
          className="relative z-10 border border-white/20 rounded-sm py-3 px-4 sm:py-4 sm:px-5 mb-4 text-left"
          style={{ fontFamily: "FragmentMono, monospace" }}
          variants={itemVariants}
        >
          <p className="text-gray-500 text-xs tracking-[0.2em] mb-3">ORDER DETAILS</p>
          <div className="space-y-2.5 text-sm text-gray-300">
            <div>
              <span className="text-gray-500 text-xs tracking-wider block mb-0.5">PRODUCT</span>
              <span className="text-white">TARE Lineup 01 · 4 x 100g</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs tracking-wider block mb-0.5">STATUS</span>
              <span className="text-white">Order received</span>
            </div>
          </div>
        </motion.div>
      ) : isBeans ? (
        <motion.div
          className="relative z-10 border border-white/20 rounded-sm py-3 px-4 sm:py-4 sm:px-5 mb-4 text-left"
          style={{ fontFamily: "FragmentMono, monospace" }}
          variants={itemVariants}
        >
          <p className="text-gray-500 text-xs tracking-[0.2em] mb-3">ORDER DETAILS</p>
          <div className="space-y-2.5 text-sm text-gray-300">
            <div>
              <span className="text-gray-500 text-xs tracking-wider block mb-0.5">PRODUCT</span>
              <span className="text-white">TARE Release 01 · 120g bag</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs tracking-wider block mb-0.5">STATUS</span>
              <span className="text-white">Order received</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs tracking-wider block mb-0.5">NEXT</span>
              <span className="text-white">Fulfillment and shipping copy can be added once logistics are connected.</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="relative z-10 border border-white/20 rounded-sm py-3 px-4 sm:py-4 sm:px-5 mb-4 text-left"
          style={{ fontFamily: "FragmentMono, monospace" }}
          variants={itemVariants}
        >
          <p className="text-gray-500 text-xs tracking-[0.2em] mb-3">DETAILS</p>
          <div className="space-y-2.5 text-sm text-gray-300">
            <div>
              <span className="text-gray-500 text-xs tracking-wider block mb-0.5">ADDRESS</span>
              <div className="text-white">
                <div>{CURRENT_EVENT_CONFIG.addressLine1}</div>
                <div>{CURRENT_EVENT_CONFIG.addressLine2}</div>
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs tracking-wider block mb-0.5">TIME</span>
              <span className="text-white">{EVENT_TIME}</span>
              <span className="text-gray-400 block mt-0.5 text-xs">Doors open {DOORS_OPEN}</span>
            </div>
            {sessionDateFormatted && (
              <div>
                <span className="text-gray-500 text-xs tracking-wider block mb-0.5">DATE</span>
                <span className="text-white">{sessionDateFormatted}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <motion.p
        className="relative z-10 text-gray-300 text-xs sm:text-sm leading-snug mb-4 max-w-md mx-auto"
        style={{ fontFamily: "FragmentMono, monospace" }}
        variants={itemVariants}
      >
        {isLineup
          ? "Confirmation is complete. Shipping and fulfillment updates follow your selected delivery method."
          : isBeans
          ? "This page is ready for beans checkout now; fulfillment messaging can be refined once shipping or pickup is finalized."
          : "You&apos;ll get a confirmation text with the details and a short questionnaire so we can tailor the experience."}
      </motion.p>

      <motion.div className="relative z-10" variants={itemVariants}>
        <Link
          href={isBeans || isLineup ? "/shop" : "/"}
          className="inline-block border-2 border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
          style={{ fontFamily: "FragmentMono, monospace" }}
        >
          {isBeans || isLineup ? "RETURN TO SHOP" : "RETURN HOME"}
        </Link>
      </motion.div>
      </div>
    </motion.div>
  );
}

function SuccessLoading() {
  return (
    <div className="w-full max-w-lg mx-auto text-center px-6">
      <div className="w-12 h-12 border border-white/20 rounded-sm mx-auto mb-6 animate-pulse" />
      <p className="text-gray-500 text-xs tracking-widest" style={{ fontFamily: "FragmentMono, monospace" }}>
        LOADING...
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-8 text-white"
      style={{ backgroundColor: "#2A2726" }}
    >
      <Suspense fallback={<SuccessLoading />}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
