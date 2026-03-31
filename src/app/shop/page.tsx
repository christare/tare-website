"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SHOP_PRODUCT } from "@/config/shop";

const SHOP_SURFACE = {
  pageWash: "linear-gradient(to bottom, rgba(12,11,11,0.52) 0%, rgba(18,16,16,0.76) 42%, rgba(24,22,22,0.95) 82%, rgba(42,39,38,1) 100%)",
  contentVeil: "rgba(10, 10, 10, 0.38)",
  panel: "rgba(23, 21, 21, 0.86)",
  panelStrong: "rgba(19, 17, 17, 0.9)",
  panelBorder: "rgba(255, 255, 255, 0.12)",
  imageOverlay: "rgba(0, 0, 0, 0.44)",
} as const;

const LINEUP_SEQUENCE = [
  {
    id: "01",
    name: "AGARO",
    role: "entry",
    state: "clean / stable",
    spec: "ethiopia / washed",
  },
  {
    id: "02",
    name: "SIDRA",
    role: "expansion",
    state: "dense / saturated",
    spec: "colombia / thermal shock washed",
  },
  {
    id: "03",
    name: "NOGALES",
    role: "disruption",
    state: "unstable / drifting",
    spec: "colombia / mosto anaerobic",
  },
  {
    id: "04",
    name: "NITRO",
    role: "resolution",
    state: "cool / synthetic clarity",
    spec: "colombia / nitrogen washed",
  },
] as const;

type ShopConfigResponse = {
  enabled: boolean;
  displayPrice?: string;
  checkoutItem?: string;
};

function ShopContent() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [displayPrice, setDisplayPrice] = useState(SHOP_PRODUCT.priceLabel);
  const [checkoutItem, setCheckoutItem] = useState(SHOP_PRODUCT.slug);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const lineupImages = ["/images/still5.png", "/images/beans.jpg", "/images/cups.jpg", "/images/brew.jpg"];

  useEffect(() => {
    const fromCanceled = new URLSearchParams(window.location.search).get("from");
    if (fromCanceled === "canceled") {
      setNotice("Checkout canceled.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/shop/config", { cache: "no-store" });
        const data: ShopConfigResponse = await res.json();
        if (!cancelled) {
          setEnabled(Boolean(data.enabled));
          if (data.displayPrice) setDisplayPrice(data.displayPrice);
          if (data.checkoutItem) setCheckoutItem(data.checkoutItem);
        }
      } catch {
        if (!cancelled) setEnabled(false);
      } finally {
        if (!cancelled) setConfigLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuy = async () => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: checkoutItem }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.details || data?.error || "Checkout unavailable");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const heroBgImages = ["/images/beans.jpg", "/images/cups.jpg", "/images/brew.jpg"];
  const bgImageStyle = {
    opacity: 0.18,
    filter: "grayscale(100%) contrast(1.2) brightness(0.64) saturate(0) blur(1.8px)",
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % lineupImages.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, [lineupImages.length]);

  return (
    <main className="min-h-screen text-white relative overflow-x-hidden" style={{ backgroundColor: "#2A2726" }}>
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 md:hidden">
          <Image src={heroBgImages[0]} alt="" fill sizes="100vw" className="object-cover" style={bgImageStyle} />
        </div>
        <div className="absolute inset-0 hidden md:grid md:grid-cols-3">
          {heroBgImages.map((src) => (
            <div key={src} className="relative h-full w-full">
              <Image src={src} alt="" fill sizes="33vw" className="object-cover" style={bgImageStyle} />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: SHOP_SURFACE.pageWash,
          }}
        />
      </div>

      <div className="relative z-10 px-6 py-24 sm:py-28">
        <div className="relative max-w-5xl mx-auto">
          <div
            aria-hidden
            className="absolute inset-x-2 top-10 bottom-0 -z-10 rounded-[28px] sm:inset-x-0"
            style={{
              backgroundColor: SHOP_SURFACE.contentVeil,
              backdropFilter: "blur(8px)",
            }}
          />
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] items-start"
          >
            <div className="space-y-6 pt-2 lg:pt-8">
              <div
                className="rounded-sm border px-5 py-6 sm:px-8 sm:py-7"
                style={{
                  backgroundColor: SHOP_SURFACE.panel,
                  borderColor: SHOP_SURFACE.panelBorder,
                  backdropFilter: "blur(14px)",
                }}
              >
                <p className="text-gray-400 text-xs tracking-[0.25em] mb-4" style={{ fontFamily: "FragmentMono, monospace" }}>
                  SHOP
                </p>
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide text-white mb-5"
                  style={{ fontFamily: "NonBureauExtended, sans-serif" }}
                >
                  <span className="block">TARE</span>
                  <span className="block">LINEUP 01</span>
                </h1>
                <p className="text-gray-200 text-sm sm:text-[15px] mb-3 max-w-md leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                  Four coffees selected for contrast, progression, and recall.
                </p>
              </div>

              <div
                className="rounded-sm border p-5 sm:p-6"
                style={{
                  backgroundColor: SHOP_SURFACE.panel,
                  borderColor: SHOP_SURFACE.panelBorder,
                  backdropFilter: "blur(14px)",
                }}
              >
                <p className="text-gray-400 text-xs tracking-[0.22em] mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                  SYSTEM PROFILE
                </p>
                <p className="text-white text-sm sm:text-base leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                  entry / expansion / disruption / resolution
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400 text-[11px] tracking-[0.24em] px-1" style={{ fontFamily: "FragmentMono, monospace" }}>
                  SEQUENCE CONTENTS
                </p>
                {LINEUP_SEQUENCE.map((coffee) => (
                  <div
                    key={coffee.id}
                    className="rounded-sm border p-4 sm:p-5"
                    style={{
                      backgroundColor: SHOP_SURFACE.panel,
                      borderColor: SHOP_SURFACE.panelBorder,
                      backdropFilter: "blur(14px)",
                    }}
                  >
                    <p className="text-gray-300 text-xs tracking-[0.22em] mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                      {coffee.id}  {coffee.name}
                    </p>
                    <div className="space-y-1 text-gray-300 text-xs leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                      <p>role: {coffee.role}</p>
                      <p>state: {coffee.state}</p>
                      <p>spec: {coffee.spec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-sm border p-5 sm:p-6 lg:sticky lg:top-24"
              style={{
                backgroundColor: SHOP_SURFACE.panelStrong,
                borderColor: SHOP_SURFACE.panelBorder,
                backdropFilter: "blur(14px)",
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border mb-5" style={{ borderColor: SHOP_SURFACE.panelBorder }}>
                {lineupImages.map((src, idx) => (
                  <Image
                    key={src}
                    src={src}
                    alt="TARE Lineup 01"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className={`object-cover transition-opacity duration-700 ${idx === activeSlide ? "opacity-100" : "opacity-0"}`}
                    style={{ filter: "contrast(1.08) brightness(0.94) saturate(0.92)" }}
                  />
                ))}
                <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.16)" }} />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {lineupImages.map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`Show image ${idx + 1}`}
                        className={`h-1 transition-all ${idx === activeSlide ? "w-6 bg-white/80" : "w-3 bg-white/35 hover:bg-white/60"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev - 1 + lineupImages.length) % lineupImages.length)}
                      aria-label="Previous image"
                      className="h-8 w-8 border border-white/30 bg-black/30 text-white/80 hover:border-white/60 hover:text-white transition-colors"
                      style={{ fontFamily: "FragmentMono, monospace" }}
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev + 1) % lineupImages.length)}
                      aria-label="Next image"
                      className="h-8 w-8 border border-white/30 bg-black/30 text-white/80 hover:border-white/60 hover:text-white transition-colors"
                      style={{ fontFamily: "FragmentMono, monospace" }}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b border-white/10 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-gray-400 text-[11px] tracking-[0.24em] mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                        ARCHIVE SET
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
                        4 x 100g
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-[11px] tracking-[0.22em]" style={{ fontFamily: "FragmentMono, monospace" }}>
                        PRICE
                      </p>
                      <p className="mt-2 text-white text-3xl sm:text-[2.1rem]" style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}>
                        {displayPrice}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-gray-300 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                    <p>FORMAT</p>
                    <p>whole bean</p>
                    <p>self-brew</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={loading || configLoading || !enabled}
                  className="w-full border px-8 py-4 text-sm tracking-[0.24em] transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/[0.04] disabled:text-white/60 disabled:hover:bg-white/[0.04] disabled:hover:text-white/60"
                  style={{
                    fontFamily: "FragmentMono, monospace",
                    borderColor: "rgba(255,255,255,0.65)",
                  }}
                >
                  {configLoading ? "LOADING..." : !enabled ? "COMING SOON" : loading ? "OPENING CHECKOUT..." : "PURCHASE SET"}
                </button>

                {notice && (
                  <p className="text-gray-400 text-xs leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                    {notice}
                  </p>
                )}
                {error && (
                  <p className="text-red-300 text-xs leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                    {error}
                  </p>
                )}
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return <ShopContent />;
}
