"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const PRIVATE_EMAIL = "chris@tarestudionyc.com";
const MAILTO_SUBJECT = "Private / Custom TARE inquiry";

const heroBackgroundMobileImage = "/images/Photo Wellness 1.jpg";
const heroBackgroundImages = [
  "/images/Photo Wellness 1.jpg",
  "/images/Photo Wellness 3.jpg",
  "/images/Photo Wellness 2.png",
];

function PrivatePageContent() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PRIVATE_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: open mailto
      window.location.href = `mailto:${PRIVATE_EMAIL}?subject=${encodeURIComponent(MAILTO_SUBJECT)}`;
    }
  };

  return (
    <main className="min-h-screen text-white relative" style={{ backgroundColor: "#2A2726" }}>
      {/* Hero — same structure as homepage */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 md:hidden">
            <Image
              src={heroBackgroundMobileImage}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
              style={{
                opacity: 0.4,
                filter:
                  "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)",
              }}
            />
          </div>
          <div className="absolute inset-0 hidden md:grid md:grid-cols-3">
            {heroBackgroundImages.map((src, idx) => (
              <div key={src} className="relative h-full w-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  className="object-cover"
                  style={{
                    opacity: 0.4,
                    filter:
                      "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)",
                  }}
                />
              </div>
            ))}
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(42,39,38,0.18) 0%, rgba(42,39,38,0.55) 45%, rgba(42,39,38,0.92) 82%, rgba(42,39,38,1) 100%)",
            }}
          />
        </div>

        <motion.div
          className="absolute top-0 left-1/2 h-full w-screen -translate-x-1/2 flex items-center justify-center pointer-events-none z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.24, scale: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src="/images/Group 15.png"
            alt=""
            width={1920}
            height={1080}
            className="w-screen h-full object-cover"
            priority
          />
        </motion.div>

        <div className="relative z-20 w-full max-w-3xl mx-auto px-6 py-16 sm:py-20 md:py-24 flex flex-col items-center justify-center">
          <motion.div
            className="w-full flex justify-center mb-3 md:mb-4"
            initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
              scale: { type: "spring", stiffness: 200, damping: 20 },
            }}
          >
            <Image
              src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
              alt=""
              width={101}
              height={101}
              className="w-[60px] md:w-[80px] h-auto"
            />
          </motion.div>

          <motion.div
            className="w-full flex justify-center mb-4 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Image
              src="/images/TARE%20logo%20STUDIO%20page.png"
              alt="TARE STUDIO"
              width={1200}
              height={200}
              className="w-[92%] sm:w-[88%] md:w-[85%] lg:w-[80%] h-auto"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center text-gray-200 text-lg sm:text-xl tracking-wide mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed"
            style={{
              fontFamily: "NonBureauExtended, sans-serif",
              fontWeight: 300,
              textWrap: "balance",
            }}
          >
            We also offer custom coffee experiences for companies, brand activations, and private celebrations—we can bring TARE to you.
          </motion.p>

          {/* CTAs: Email button + Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center flex flex-col items-center gap-4"
          >
            <a
              href={`mailto:${PRIVATE_EMAIL}?subject=${encodeURIComponent(MAILTO_SUBJECT)}`}
              className="inline-block border-2 border-white px-10 py-3.5 text-sm sm:text-base tracking-wide hover:bg-white hover:text-black transition-all duration-300"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              EMAIL US
            </a>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span
                className="text-gray-400 text-sm"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                {PRIVATE_EMAIL}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="border border-white/50 px-4 py-2 text-xs tracking-wide hover:bg-white hover:text-black transition-all duration-200"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid lines */}
      <div
        style={{
          position: "relative",
          width: "100vw",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          zIndex: 10,
        }}
        className="my-2 sm:my-3"
      >
        <Image
          src="/images/Line 43.png"
          alt=""
          width={1920}
          height={100}
          style={{ width: "100vw", height: "auto", display: "block" }}
        />
        <Image
          src="/images/Group 24.png"
          alt=""
          width={1920}
          height={100}
          style={{ width: "100vw", height: "auto", display: "block" }}
        />
      </div>

      <div className="max-w-xl mx-auto px-6 py-12 sm:py-16 text-center">
        <p
          className="text-gray-400 text-sm mb-8"
          style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
        >
          We&apos;ll get back to you soon.
        </p>
        <Link
          href="/"
          className="inline-block border border-white/50 px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 text-gray-300"
          style={{ fontFamily: "FragmentMono, monospace" }}
        >
          RETURN HOME
        </Link>
      </div>
    </main>
  );
}

export default function PrivatePage() {
  return <PrivatePageContent />;
}
