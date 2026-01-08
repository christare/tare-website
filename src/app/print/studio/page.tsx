import Image from "next/image";
import { CURRENT_EVENT_CONFIG } from "@/config/events";

export const dynamic = "force-static";

export default function StudioPrintPage() {
  return (
    <div className="print-surface">
      <div className="print-page text-white" style={{ backgroundColor: "#2A2726" }}>
        {/* HERO */}
        <section className="relative overflow-hidden print-hero">
          {/* Background photos */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 grid grid-cols-3">
              {[
                "/images/Photo Wellness 2.png",
                "/images/Photo Wellness 3.jpg",
                "/images/Photo Wellness 1.jpg",
              ].map((src) => (
                <div key={src} className="relative h-full w-full">
                  <Image
                    src={src}
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

          {/* Dial */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 flex items-center justify-center pointer-events-none"
            style={{ opacity: 0.24 }}
          >
            <Image
              src="/images/Group 15.png"
              alt=""
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full w-full px-10 flex flex-col items-center justify-center text-center">
            <div className="flex justify-center mb-3">
              <Image
                src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
                alt="TARE Studio Artifact"
                width={90}
                height={90}
                className="h-auto w-[64px]"
                priority
              />
            </div>

            <div className="w-full flex justify-center mb-4">
              <Image
                src="/images/TARE%20logo%20STUDIO%20page.png"
                alt="TARE STUDIO"
                width={1200}
                height={200}
                className="w-[78%] h-auto"
                priority
              />
            </div>

            <p
              className="text-white mb-6 leading-[1.65] text-[20px]"
              style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
            >
              <span className="block">A guided wellness session</span>
              <span className="block">using coffee in multiple physical forms</span>
              <span className="block">to improve the way you feel.</span>
            </p>

            <div className="mt-2 text-gray-200">
              <div
                className="text-[12px] tracking-[0.22em] mb-3"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                NEXT SESSION
              </div>

              <div
                className="text-[18px] mb-1"
                style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
              >
                Saturday · January 10 · 2026
              </div>
              <div
                className="text-[14px] text-gray-300 mb-3"
                style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
              >
                {CURRENT_EVENT_CONFIG.eventTime}
              </div>

              <div
                className="text-[12px] text-gray-200"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                <div>{CURRENT_EVENT_CONFIG.addressLine1}</div>
                <div>{CURRENT_EVENT_CONFIG.addressLine2}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 90-MINUTE EXPERIENCE */}
        <section className="print-90min" style={{ backgroundColor: "#32302E" }}>
          <div className="h-full w-full px-12 py-10 flex flex-col items-center justify-center text-center">
            <h2
              className="text-gray-200 tracking-wide mb-3 text-[20px]"
              style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
            >
              A 90-MINUTE EXPERIENCE
            </h2>

            <p
              className="text-gray-400 tracking-wide mb-7 text-[16px] leading-[1.35]"
              style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
            >
              <span className="block">that takes you through the most</span>
              <span className="block">effective elements of:</span>
            </p>

            <div
              className="text-gray-300 text-[14px] tracking-wider space-y-1 mb-7"
              style={{ fontFamily: "FragmentMono, monospace", lineHeight: "1.6" }}
            >
              <p>Aromatherapy</p>
              <p>Skin treatments</p>
              <p>Sound immersion</p>
              <p>Breathwork</p>
              <p>Deep tasting</p>
            </div>

            <p
              className="text-gray-400 text-[13px]"
              style={{ fontFamily: "FragmentMono, monospace", lineHeight: "1.6" }}
            >
              Each delivered through world-class coffee
              <br />
              and its well-documented physiological effects.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}


