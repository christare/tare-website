"use client";

import Image from "next/image";

export default function LabPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#2A2726" }}>
      {/* Quiet dial background mark (no animation) */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          {/* Match homepage dial positioning: centered, full-height */}
          <div className="absolute top-0 left-1/2 h-full w-screen -translate-x-1/2 flex items-center justify-center">
            <Image
              src="/images/Group 15.png"
              alt=""
              width={1800}
              height={1800}
              className="w-screen h-full object-cover"
              priority
              style={{
                opacity: 0.24,
                transform: "scale(0.84)",
                filter: "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.6px)",
              }}
            />
          </div>
        </div>

        {/* Large negative space + composed plate */}
        <div className="max-w-6xl mx-auto px-6 pt-28 md:pt-32 pb-24 relative min-h-[calc(100vh-7rem)] flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start md:items-center w-full">
            {/* Object image placeholder (swap later with a photo) */}
            <div className="w-full">
              <div
                className="mb-4 flex items-baseline justify-between gap-4"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                <div className="text-[10px] tracking-[0.32em] text-[#8B7F6F]">
                  TARE / LAB
                </div>
                <div className="text-[10px] tracking-[0.32em] text-[#5A544B]">
                  CAT. SIGNAL-001
                </div>
              </div>
              <div
                className="w-full"
                style={{
                  aspectRatio: "3 / 4",
                  backgroundColor: "#33302E",
                  border: "1px solid #3A3736",
                }}
                aria-label="SIGNAL object image placeholder"
                role="img"
              />
            </div>

            {/* Object record */}
            <div className="w-full text-left">
              <div className="hidden md:block w-full h-px mb-8" style={{ backgroundColor: "#3A3736" }} />

              <h1
                className="text-[clamp(2.4rem,5.0vw,3.8rem)] leading-[1.0] tracking-wide text-[#E8E3DD]"
                style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
              >
                SIGNAL
              </h1>

              <p
                className="mt-6 text-base md:text-lg leading-[1.55] text-[#E8E3DD]/90"
                style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
              >
                Our clean focus coffee shot.
              </p>

              <div className="mt-10 w-full h-px" style={{ backgroundColor: "#3A3736" }} />

              {/* Metadata (footnote-like) */}
              <dl
                className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 text-xs text-[#8B7F6F]"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                <div>
                  <dt className="tracking-[0.22em] text-[#5A544B]">FORMAT</dt>
                  <dd className="mt-1 tracking-wide text-[#A39B8B]">Concentrate</dd>
                </div>
                <div>
                  <dt className="tracking-[0.22em] text-[#5A544B]">USE</dt>
                  <dd className="mt-1 tracking-wide text-[#A39B8B]">Guided tasting reference</dd>
                </div>
                <div>
                  <dt className="tracking-[0.22em] text-[#5A544B]">CONTEXT</dt>
                  <dd className="mt-1 tracking-wide text-[#A39B8B]">TARE Studio sessions</dd>
                </div>
                <div>
                  <dt className="tracking-[0.22em] text-[#5A544B]">ORIGIN</dt>
                  <dd className="mt-1 tracking-wide text-[#A39B8B]">Prepared in-house</dd>
                </div>
              </dl>

              {/* No CTA zone */}
              <p
                className="mt-12 text-[10px] md:text-xs text-[#8B7F6F] tracking-[0.24em]"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                Available during TARE sessions and limited releases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

