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

/** Hero + intro: why this edition exists (site-first). */
const SHOP_HERO_VALUE_LINES = [
  "FOUR RETAINED FROM THIS SEASON'S EVENTS & BLIND RUNS",
  "SEALED EDITION · NOT A STANDING SKU",
] as const;

/** How NOISE maps to what ships: roles are the design; coffees update with the live lineup. */
const SHOP_LINEUP_SYSTEM_LINES = [
  "NOISE · FOUR ROLES · FIXED BY DESIGN",
  "BEANS PER ROLE ROTATE WITH WHAT IS LIVE NOW",
  "STUDIO STILLS · NOT INDEXED TO THOSE ROLES",
] as const;

const LINEUP_SEQUENCE = [
  {
    id: "01",
    name: "AWAKE",
    coffee: "agaro",
    state: "clean / stable",
    spec: "ethiopia / washed",
    blindPulls: [
      "if i hated coffee but liked tea this is valid",
      "it smelled like normal coffee but now it's… soft",
      "it's fruity but not fruit like the punchy one",
    ],
  },
  {
    id: "02",
    name: "RED",
    coffee: "sidra",
    state: "dense / saturated",
    spec: "colombia / thermal shock washed",
    blindPulls: [
      "those chocolates with the berry jam",
      "yeah cherry yeah chocolate i see that",
      "ok this is the first time i get the notes",
    ],
  },
  {
    id: "03",
    name: "BROKEN",
    coffee: "nogales",
    state: "unstable / drifting",
    spec: "colombia / mosto anaerobic",
    blindPulls: [
      "it's sour but not like lemon more like vinegar",
      "almost like soy sauce… first sip was like huh but i kept going",
      "yeah funky for sure not my favorite but it made the next one crazy",
    ],
  },
  {
    id: "04",
    name: "PLAY",
    coffee: "nitro",
    state: "cool / controlled",
    spec: "colombia / nitrogen washed",
    blindPulls: [
      "shit i saw melon so i know… yeah, melon",
      "at first i thought cucumber maybe tomato then you said melon… yeah",
      "this is a good closer it's sweet you thought this through",
    ],
  },
] as const;

function LineupCoffeeBody({ coffee }: { coffee: (typeof LINEUP_SEQUENCE)[number] }) {
  return (
    <>
      <p className="text-gray-200 text-xs tracking-[0.22em] mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
        {coffee.id} {coffee.name}
      </p>
      <div className="space-y-1 text-gray-200 text-xs leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
        <p>coffee: {coffee.coffee}</p>
        <p>state: {coffee.state}</p>
        <p>spec: {coffee.spec}</p>
      </div>
      <div className="mt-3 border-t border-white/[0.08] pt-3">
        <p className="text-gray-500 text-[10px] tracking-[0.18em] mb-0.5" style={{ fontFamily: "FragmentMono, monospace" }}>
          BLIND PULL · VERBATIM
        </p>
        <p className="text-gray-600 text-[9px] tracking-[0.12em] mb-2.5 normal-case" style={{ fontFamily: "FragmentMono, monospace" }}>
          same session · uncorrected · n mixed
        </p>
        <ul className="space-y-2.5 list-none">
          {coffee.blindPulls.map((line) => (
            <li
              key={line}
              className="text-gray-200/92 text-[11px] sm:text-xs leading-[1.55] border-l-2 border-white/20 pl-3 -ml-px"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              <span className="text-gray-500 select-none" aria-hidden>
                “
              </span>
              {line}
              <span className="text-gray-500 select-none" aria-hidden>
                ”
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/** Portrait assets from `public/images/TARE Products 1 Edits` (height > width). */
const SHOP_PRODUCT_VERTICAL_IMAGES = [
  "/images/TARE%20Products%201%20Edits/Sel1.jpg",
  "/images/TARE%20Products%201%20Edits/SEl2.jpg",
  "/images/TARE%20Products%201%20Edits/Sel4.jpg",
  "/images/TARE%20Products%201%20Edits/Sel9.jpg",
  "/images/TARE%20Products%201%20Edits/Sel11.jpg",
] as const;

/**
 * Product carousel: lightly archival · softened contrast, drained saturation, hint of sepia,
 * a touch more grain + cream haze (file / print fade) without the heavy lab vignette pass.
 */
const SHOP_CAROUSEL_IMAGE_FILTER =
  "brightness(0.97) contrast(0.93) saturate(0.88) sepia(0.055) blur(0.18px)";

const SHOP_CAROUSEL_GRAIN_BG = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.76" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;

const SHOP_CAROUSEL_LEGACY_IMAGES = [
  "/images/still5.png",
  "/images/beans.jpg",
  "/images/cups.jpg",
  "/images/brew.jpg",
] as const;

function interleaveArrays<A, B>(first: readonly A[], second: readonly B[]): (A | B)[] {
  const n = Math.max(first.length, second.length);
  const out: (A | B)[] = [];
  for (let i = 0; i < n; i++) {
    if (i < first.length) out.push(first[i]);
    if (i < second.length) out.push(second[i]);
  }
  return out;
}

const SHOP_LINEUP_INTERLEAVED = interleaveArrays(SHOP_CAROUSEL_LEGACY_IMAGES, SHOP_PRODUCT_VERTICAL_IMAGES);
/** Former 6th slide (1-based) brought to front: Sel4.jpg */
const SHOP_LINEUP_LEAD = "/images/TARE%20Products%201%20Edits/Sel4.jpg";
const SHOP_LINEUP_IMAGES = [
  SHOP_LINEUP_LEAD,
  ...SHOP_LINEUP_INTERLEAVED.filter((src) => src !== SHOP_LINEUP_LEAD),
];

/** Pulled out of the product carousel for the full-width strip above the fold. */
const SHOP_GALLERY_FEATURED = [
  "/images/TARE%20Products%201%20Edits/Sel4.jpg",
  "/images/TARE%20Products%201%20Edits/Sel1.jpg",
  "/images/TARE%20Products%201%20Edits/SEl2.jpg",
] as const;

const SHOP_GALLERY_FEATURED_SET = new Set<string>(SHOP_GALLERY_FEATURED);

/** 4th & 5th vertical product stills (Sel9, Sel11) close the archive carousel. */
const SHOP_CAROUSEL_END_STILLS = [
  "/images/TARE%20Products%201%20Edits/Sel9.jpg",
  "/images/TARE%20Products%201%20Edits/Sel11.jpg",
] as const;

const SHOP_CAROUSEL_END_STILLS_SET = new Set<string>(SHOP_CAROUSEL_END_STILLS);

const SHOP_CAROUSEL_REST = SHOP_LINEUP_IMAGES.filter(
  (src) => !SHOP_GALLERY_FEATURED_SET.has(src) && !SHOP_CAROUSEL_END_STILLS_SET.has(src),
);

const SHOP_CAROUSEL_LINEUP = [...SHOP_CAROUSEL_REST, ...SHOP_CAROUSEL_END_STILLS];

function ShopStillsOverlays() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light opacity-[0.044]"
        style={{
          backgroundImage: SHOP_CAROUSEL_GRAIN_BG,
          backgroundSize: "108px 108px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ backgroundColor: "rgba(238, 228, 210, 0.055)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.038)" }}
      />
    </>
  );
}

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

  const lineupImages = SHOP_CAROUSEL_LINEUP;

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
    if (reduceMotion) return;
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % lineupImages.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, [lineupImages.length, reduceMotion]);

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
            <motion.div
              className="mt-6 max-w-md mx-auto space-y-2 text-gray-300 text-[11px] sm:text-xs leading-relaxed tracking-[0.14em] px-2"
              style={{ fontFamily: "FragmentMono, monospace" }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.18, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {SHOP_HERO_VALUE_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="relative z-10 min-w-0 px-6 pt-3 pb-20 sm:pt-6 sm:pb-24 lg:pt-24 lg:pb-28"
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
          <section className="flex flex-col gap-6 sm:gap-7 lg:gap-8 min-w-0">
            <motion.div
              className="min-w-0 order-first"
              variants={fadeIn}
              initial="hidden"
              animate={introComplete ? "show" : "hidden"}
              transition={{ duration: 0.45, delay: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-gray-500 text-[10px] tracking-[0.22em] mb-2" style={{ fontFamily: "FragmentMono, monospace" }}>
                SET STILLS · THREE UP
              </p>
              <div className="flex lg:grid lg:grid-cols-3 gap-2 sm:gap-3 -mx-1 px-1 sm:mx-0 sm:px-0 overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-proximity lg:overflow-visible lg:snap-none [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] pb-1 lg:pb-0">
                {SHOP_GALLERY_FEATURED.map((src, idx) => (
                  <div
                    key={src}
                    className="relative shrink-0 w-[min(82vw,17.5rem)] sm:w-[min(78vw,18rem)] lg:w-auto lg:shrink snap-start aspect-[4/5] overflow-hidden rounded-sm border"
                    style={{ borderColor: SHOP_SURFACE.panelBorder }}
                  >
                    <Image
                      src={src}
                      alt={`TARE SET 01 · still ${idx + 1} of ${SHOP_GALLERY_FEATURED.length}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 82vw, 33vw"
                      priority={idx < 3}
                      style={{ filter: SHOP_CAROUSEL_IMAGE_FILTER }}
                    />
                    <ShopStillsOverlays />
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid min-w-0 gap-6 sm:gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 items-start">
            {/* Mobile: contents = children keep order-1 / order-3 in flow. Desktop: one column cell spanning rows 1–2 so hero isn’t stretched under a tall purchase row. */}
            <div className="contents lg:flex lg:flex-col lg:gap-8 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:min-w-0">
            <div className="min-w-0 pt-0 sm:pt-1 lg:pt-8 order-1 lg:order-none">
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
                <div className="max-w-md space-y-2 mb-3">
                  {SHOP_HERO_VALUE_LINES.map((line) => (
                    <p
                      key={line}
                      className="text-gray-200 text-sm sm:text-[15px] leading-relaxed tracking-[0.12em]"
                      style={{ fontFamily: "FragmentMono, monospace" }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <p className="text-gray-400 text-xs sm:text-[13px] max-w-md leading-relaxed tracking-[0.1em]" style={{ fontFamily: "FragmentMono, monospace" }}>
                  TARE STUDIO · NYC
                </p>
              </motion.div>
            </div>

            <div className="min-w-0 space-y-6 order-3 lg:order-none">
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
                <p className="text-gray-500 text-[10px] tracking-[0.2em] px-1 mb-1" style={{ fontFamily: "FragmentMono, monospace" }}>
                  ORIGIN · PROCESS · BLIND PULL
                </p>
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
                <div className="px-1 mb-3 max-w-xl space-y-1">
                  <p className="text-gray-500 text-[10px] tracking-[0.2em]" style={{ fontFamily: "FragmentMono, monospace" }}>
                    LINEUP
                  </p>
                  {SHOP_LINEUP_SYSTEM_LINES.map((line) => (
                    <p
                      key={line}
                      className="text-gray-400 text-[10px] sm:text-[11px] leading-relaxed tracking-[0.12em]"
                      style={{ fontFamily: "FragmentMono, monospace" }}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Mobile: horizontal rail · narrower cards so the next panel peeks (no overlays on content) */}
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
                          <LineupCoffeeBody coffee={coffee} />
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
                      <LineupCoffeeBody coffee={coffee} />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            </div>

            <div className="contents lg:flex lg:flex-col lg:gap-5 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:min-w-0">
              <motion.div
                className="rounded-sm border p-5 sm:p-6 lg:sticky lg:top-24 order-2 lg:order-none w-full min-w-0"
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
                <p className="text-gray-500 text-[10px] tracking-[0.2em] mb-2" style={{ fontFamily: "FragmentMono, monospace" }}>
                  ARCHIVE CAROUSEL
                </p>
                <div className="relative mb-3 aspect-[4/5] max-h-[min(78vh,640px)] overflow-hidden rounded-sm border" style={{ borderColor: SHOP_SURFACE.panelBorder }}>
                  {lineupImages.map((src, idx) => (
                    <Image
                      key={src}
                      src={src}
                      alt="TARE SET 01 · archive carousel"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={idx === 0}
                      className={`object-cover transition-opacity duration-700 ${idx === activeSlide ? "opacity-100" : "opacity-0"}`}
                      style={{ filter: SHOP_CAROUSEL_IMAGE_FILTER }}
                    />
                  ))}
                  <ShopStillsOverlays />
                  <div className="absolute bottom-3 left-3 right-3 z-[4] flex items-center justify-between">
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
                    400g total · whole bean
                  </p>
                  <p className="mt-1 text-gray-400 text-[11px] leading-relaxed" style={{ fontFamily: "FragmentMono, monospace" }}>
                    each coffee: 50g resealable + 50g vacuum sealed
                  </p>
                  <p className="mt-2 text-gray-500 text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.16em] leading-snug" style={{ fontFamily: "FragmentMono, monospace" }}>
                    ORDER INCLUDES · BREW PROTOCOL VIDEO (REPLAY)
                  </p>
                  <p className="mt-2 text-gray-500 text-[11px] tracking-[0.18em]" style={{ fontFamily: "FragmentMono, monospace" }}>
                    SET 01 · &quot;NOISE&quot; · 2026
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

            <motion.div
              className="rounded-sm border p-5 sm:p-6 order-4 lg:order-none w-full min-w-0"
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
              <p className="text-gray-200 text-xs tracking-[0.28em] mb-3 text-left" style={{ fontFamily: "FragmentMono, monospace" }}>
                BREW PROTOCOL
              </p>

              <details
                className="group border border-white/[0.12] rounded-sm px-4 py-3 open:pb-4"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex flex-col gap-2 text-left outline-none focus-visible:ring-1 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(23,21,21,0.95)] rounded-sm -mx-1 -mt-1 px-1 pt-1">
                  <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed tracking-[0.08em]">
                    IMMERSION-FIRST · MATCHED ION WATER (Mg:Ca:K) · PERC + HYBRID FORKS · GRINDER DIAL-IN GRID
                  </p>
                  <p className="text-gray-500 text-[10px] tracking-[0.2em] group-open:hidden">OPEN IF CURIOUS</p>
                  <p className="text-gray-500 text-[10px] tracking-[0.2em] hidden group-open:block">COLLAPSE</p>
                </summary>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-4 text-gray-200 text-xs sm:text-sm leading-relaxed">
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
            </motion.div>
            </div>
            </div>
          </section>

        </div>
      </motion.div>
    </main>
  );
}

export default function ShopPage() {
  return <ShopContent />;
}
