"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
    name: "AWAKE",
    coffee: "agaro",
    state: "clean / stable",
    spec: "ethiopia / washed",
  },
  {
    id: "02",
    name: "RED",
    coffee: "sidra",
    state: "dense / saturated",
    spec: "colombia / thermal shock washed",
  },
  {
    id: "03",
    name: "BROKEN",
    coffee: "nogales",
    state: "unstable / drifting",
    spec: "colombia / mosto anaerobic",
  },
  {
    id: "04",
    name: "PLAY",
    coffee: "nitro",
    state: "cool / controlled",
    spec: "colombia / nitrogen washed",
  },
] as const;

type ShopConfigResponse = {
  enabled: boolean;
  displayPrice?: string;
  checkoutItem?: string;
};

function ShopContent() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [displayPrice, setDisplayPrice] = useState(SHOP_PRODUCT.priceLabel);
  const [checkoutItem, setCheckoutItem] = useState(SHOP_PRODUCT.slug);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

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

  const [introHidden, setIntroHidden] = useState(false);
  useEffect(() => {
    if (reduceMotion) {
      setIntroHidden(true);
      return;
    }
    const t = window.setTimeout(() => setIntroHidden(true), 820);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setIntroComplete(true);
      return;
    }
    if (!introHidden) return;
    const t = window.setTimeout(() => setIntroComplete(true), 60);
    return () => window.clearTimeout(t);
  }, [introHidden, reduceMotion]);

  const fadeIn = {
    hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  } as const;

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

      {!introHidden && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          style={{
            background: SHOP_SURFACE.pageWash,
            backdropFilter: "blur(6px)",
          }}
          initial={reduceMotion ? false : { opacity: 1 }}
          animate={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
          onAnimationComplete={() => setIntroHidden(true)}
        >
          <div className="w-full max-w-3xl text-center">
            <motion.h1
              className="text-[2.6rem] sm:text-6xl md:text-7xl font-light tracking-wide text-white"
              style={{ fontFamily: "NonBureauExtended, sans-serif" }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="block">TARE 2026</span>
              <span className="block">SET 01</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-white/90 text-2xl sm:text-3xl"
              style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.18, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              &quot;NOISE&quot;
            </motion.p>
          </div>
        </motion.div>
      )}

      <motion.div
        className="relative z-10 min-w-0 px-6 py-24 sm:py-28"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: introHidden ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative mx-auto max-w-5xl min-w-0">
          <div
            aria-hidden
            className="absolute inset-x-2 top-10 bottom-0 -z-10 rounded-[28px] sm:inset-x-0"
            style={{
              backgroundColor: SHOP_SURFACE.contentVeil,
              backdropFilter: "blur(8px)",
            }}
          />
          <section className="grid min-w-0 gap-8 lg:grid-cols-[0.92fr_1.08fr] items-start">
            <div className="min-w-0 pt-2 lg:pt-8 order-1 lg:order-none lg:col-start-1">
              <motion.div
                className="rounded-sm border px-5 py-6 sm:px-8 sm:py-7"
                style={{
                  backgroundColor: SHOP_SURFACE.panel,
                  borderColor: SHOP_SURFACE.panelBorder,
                  backdropFilter: "blur(14px)",
                }}
                initial="hidden"
                animate={introComplete ? "show" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.45, delay: 0.02, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h1
                  className="text-[2.15rem] sm:text-5xl md:text-6xl font-light tracking-wide text-white mb-3 max-w-full"
                  style={{ fontFamily: "NonBureauExtended, sans-serif" }}
                >
                  <span className="block">TARE 2026</span>
                  <span className="block">SET 01</span>
                </h1>
                <p
                  className="text-white/90 text-xl sm:text-2xl mb-4 max-w-full"
                  style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}
                >
                  &quot;NOISE&quot;
                </p>
                <p className="text-gray-200 text-sm sm:text-[15px] mb-1 max-w-md leading-relaxed tracking-[0.12em]" style={{ fontFamily: "FragmentMono, monospace" }}>
                  LATEST FOUR-COFFEE SEQUENCE
                </p>
                <p className="text-gray-300 text-sm sm:text-[15px] mb-3 max-w-md leading-relaxed tracking-[0.12em]" style={{ fontFamily: "FragmentMono, monospace" }}>
                  FROM TARE STUDIO IN NYC
                </p>
              </motion.div>
            </div>

            <div className="min-w-0 space-y-4 order-2 lg:order-none lg:col-start-2 lg:row-span-2">
              <motion.div
                className="rounded-sm border p-5 sm:p-6 lg:sticky lg:top-24"
                style={{
                  backgroundColor: SHOP_SURFACE.panelStrong,
                  borderColor: SHOP_SURFACE.panelBorder,
                  backdropFilter: "blur(14px)",
                }}
                variants={fadeIn}
                initial="hidden"
                animate={introComplete ? "show" : "hidden"}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border mb-3" style={{ borderColor: SHOP_SURFACE.panelBorder }}>
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

                <div className="flex flex-col items-end text-right">
                  <p className="text-gray-200 text-xs sm:text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
                    4 × 100g (whole bean)
                  </p>
                  <p className="mt-1 text-gray-400 text-[11px] leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                    vacuum sealed or resealable
                  </p>
                  <p className="mt-3 text-white text-3xl sm:text-[2.1rem]" style={{ fontFamily: "NonBureauExtended, sans-serif", fontWeight: 300 }}>
                    {displayPrice}
                  </p>

                  <button
                    type="button"
                    onClick={handleBuy}
                    disabled={loading || configLoading || !enabled}
                    className="mt-6 w-full border px-8 py-4 text-sm tracking-[0.18em] transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/[0.04] disabled:text-white/60 disabled:hover:bg-white/[0.04] disabled:hover:text-white/60"
                    style={{
                      fontFamily: "FragmentMono, monospace",
                      borderColor: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {configLoading ? "LOADING..." : !enabled ? "COMING SOON" : loading ? "OPENING CHECKOUT..." : "PURCHASE"}
                  </button>

                  {notice && (
                    <p className="mt-4 text-gray-400 text-xs leading-relaxed text-left w-full" style={{ fontFamily: "FragmentMono, monospace" }}>
                      {notice}
                    </p>
                  )}
                  {error && (
                    <p className="mt-2 text-red-300 text-xs leading-relaxed text-left w-full" style={{ fontFamily: "FragmentMono, monospace" }}>
                      {error}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="min-w-0 space-y-6 order-3 lg:order-none lg:col-start-1">
              <motion.div
                className="rounded-sm border p-5 sm:p-6"
                style={{
                  backgroundColor: "rgba(23, 21, 21, 0.74)",
                  borderColor: SHOP_SURFACE.panelBorder,
                  backdropFilter: "blur(14px)",
                }}
                variants={fadeIn}
                initial="hidden"
                animate={introComplete ? "show" : "hidden"}
                transition={{ duration: 0.45, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p className="text-gray-500 text-[11px] tracking-[0.22em] mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                  FIELD NOTES
                </p>
                <div className="space-y-1 text-gray-300 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                  <p>50+ evaluated / 4 retained</p>
                  <p>blind test / n=30+ / p95</p>
                  <p>deployed 02.21.26</p>
                  <p>lvmh collaboration</p>
                </div>
              </motion.div>

              <motion.div
                className="min-w-0 space-y-3"
                variants={fadeIn}
                initial="hidden"
                animate={introComplete ? "show" : "hidden"}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="flex items-baseline justify-between gap-3 px-1 md:block">
                  <p className="text-gray-300 text-[11px] tracking-[0.26em]" style={{ fontFamily: "FragmentMono, monospace" }}>
                    SET CONTENTS
                  </p>
                  <p
                    className="md:hidden shrink-0 text-gray-500 text-[10px] tracking-[0.22em]"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                  >
                    SWIPE
                  </p>
                </div>

                {/* Mobile: horizontal rail — narrower cards so the next panel peeks (no overlays on content) */}
                <div className="md:hidden min-w-0">
                  <div className="min-w-0 overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-proximity [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
                    <div className="flex w-max max-w-none gap-3 pb-2 pe-6">
                      {LINEUP_SEQUENCE.map((coffee) => (
                        <div
                          key={coffee.id}
                          className="snap-start shrink-0 w-[min(70vw,16.5rem)] max-w-[420px] rounded-sm border p-4"
                          style={{
                            backgroundColor: SHOP_SURFACE.panel,
                            borderColor: SHOP_SURFACE.panelBorder,
                            backdropFilter: "blur(14px)",
                          }}
                        >
                          <p className="text-gray-200 text-xs tracking-[0.22em] mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                            {coffee.id}  {coffee.name}
                          </p>
                          <div className="space-y-1 text-gray-200 text-xs leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                            <p>coffee: {coffee.coffee}</p>
                            <p>state: {coffee.state}</p>
                            <p>spec: {coffee.spec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop+: vertical stack */}
                <div className="hidden md:block group space-y-3">
                  {LINEUP_SEQUENCE.map((coffee) => (
                    <div
                      key={coffee.id}
                      className="rounded-sm border p-4 sm:p-5 transition-all duration-200 group-hover:opacity-60 hover:opacity-100 hover:border-white/30"
                      style={{
                        backgroundColor: SHOP_SURFACE.panel,
                        borderColor: SHOP_SURFACE.panelBorder,
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <p className="text-gray-200 text-xs tracking-[0.22em] mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                        {coffee.id}  {coffee.name}
                      </p>
                      <div className="space-y-1 text-gray-200 text-xs leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                        <p>coffee: {coffee.coffee}</p>
                        <p>state: {coffee.state}</p>
                        <p>spec: {coffee.spec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              className="rounded-sm border p-5 sm:p-6 order-4 lg:order-none lg:col-start-2"
              style={{
                backgroundColor: SHOP_SURFACE.panel,
                borderColor: SHOP_SURFACE.panelBorder,
                backdropFilter: "blur(14px)",
              }}
              variants={fadeIn}
              initial="hidden"
              animate={introComplete ? "show" : "hidden"}
              transition={{ duration: 0.45, delay: 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-gray-200 text-xs tracking-[0.28em] mb-4 text-left" style={{ fontFamily: "FragmentMono, monospace" }}>
                BREW PROTOCOL
              </p>

              {/* Mobile: keep it short; expand for full detail */}
              <div className="md:hidden space-y-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                <details className="border border-white/10 rounded-sm px-4 py-3">
                  <summary className="text-gray-300 text-xs tracking-[0.18em] cursor-pointer select-none">
                    EXPAND
                  </summary>
                  <div className="mt-3 space-y-4 text-gray-200 text-xs leading-relaxed">
                    <div>
                      <p className="text-gray-400 text-[11px] tracking-[0.22em] mb-2">IMMERSION (PRIMARY)</p>
                      <div className="space-y-0.5">
                        <p>teapot / cup / bowl</p>
                        <p>95°C / 80–95 ppm</p>
                        <p>Mg:Ca:K 4:1:2</p>
                        <p>1:15</p>
                        <p>break 4:00 / strain 8:00</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] tracking-[0.22em] mb-2">PERCOLATION (SECONDARY)</p>
                      <div className="space-y-0.5">
                        <p>v60 / origami / orea</p>
                        <p>4x bloom 1:00 / 4 pours / 1:15</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] tracking-[0.22em] mb-2">HYBRID</p>
                      <div className="space-y-0.5">
                        <p>pulsar / switch</p>
                        <p>1:30 immersion (½ volume)</p>
                        <p>+2 pours / 1:15</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[11px] tracking-[0.22em] mb-2">grind references</p>
                      <div className="space-y-0.5 text-gray-300 text-xs leading-relaxed">
                        <p>ek43 9–10.5</p>
                        <p>zp6 5.0–5.4</p>
                        <p>k ultra 7.5–8.3</p>
                        <p>k6 80–100</p>
                        <p>j manual 3.2–3.7</p>
                        <p>comandante 19–24</p>
                        <p>ode gen 2 6–7.2</p>
                        <p>sculptor 078 6–7</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[11px] tracking-[0.22em] mb-2">MISUSE</p>
                      <div className="space-y-1 text-gray-300 text-xs leading-relaxed">
                        <p>out-of-order use reduces contrast</p>
                        <p>oxygen / moisture exposure degrades aromatics and flavor separation</p>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Desktop+: full detail */}
              <div className="hidden md:block space-y-4" style={{ fontFamily: "FragmentMono, monospace" }}>
                <div className="space-y-4 text-gray-200 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <p className="text-gray-400 text-[11px] tracking-[0.22em] mb-2">IMMERSION (PRIMARY)</p>
                    <div className="space-y-0.5">
                      <p>teapot / cup / bowl</p>
                      <p>95°C / 80–95 ppm</p>
                      <p>Mg:Ca:K 4:1:2</p>
                      <p>1:15</p>
                      <p>break 4:00 / strain 8:00</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-[11px] tracking-[0.22em] mb-2">PERCOLATION (SECONDARY)</p>
                    <div className="space-y-0.5">
                      <p>v60 / origami / orea</p>
                      <p>4x bloom 1:00 / 4 pours / 1:15</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-[11px] tracking-[0.22em] mb-2">HYBRID</p>
                    <div className="space-y-0.5">
                      <p>pulsar / switch</p>
                      <p>1:30 immersion (½ volume)</p>
                      <p>+2 pours / 1:15</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-[11px] tracking-[0.22em] mb-2">grind references</p>
                  <div className="space-y-0.5 text-gray-300 text-xs leading-relaxed">
                    <p>ek43 9–10.5</p>
                    <p>zp6 5.0–5.4</p>
                    <p>k ultra 7.5–8.3</p>
                    <p>k6 80–100</p>
                    <p>j manual 3.2–3.7</p>
                    <p>comandante 19–24</p>
                    <p>ode gen 2 6–7.2</p>
                    <p>sculptor 078 6–7</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-[11px] tracking-[0.22em] mb-2">MISUSE</p>
                  <div className="space-y-1 text-gray-300 text-xs leading-relaxed">
                    <p>out-of-order use reduces contrast</p>
                    <p>oxygen / moisture exposure degrades aromatics and flavor separation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

        </div>
      </motion.div>
    </main>
  );
}

export default function ShopPage() {
  return <ShopContent />;
}
