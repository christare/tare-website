"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export type DateOption = { date: string; label: string; bookable?: boolean };

type DateCarouselProps = {
  dates: DateOption[];
  loadingDate: string | null;
  onSelect: (date: string) => void;
  error?: string;
};

const CARD_WIDTH = 116; // px per date pill + gap
const VISIBLE = 4; // show ~4 dates in view; arrows scroll by 2

export function DateCarousel({ dates, loadingDate, onSelect, error }: DateCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    el.addEventListener("scroll", updateArrows);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateArrows);
    };
  }, [dates.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = CARD_WIDTH * 2;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  if (dates.length === 0) return null;

  return (
    <div className="relative flex flex-col items-center w-full max-w-lg mx-auto">
      <p className="text-gray-500 text-[10px] sm:text-xs mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
        Booking closes Thursday 11pm EST for that weekend.
      </p>

      <div className="relative w-full flex items-center gap-2">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous dates"
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-white/50 rounded-full hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
          style={{ fontFamily: "FragmentMono, monospace" }}
        >
          ←
        </button>

        {/* Scrollable date strip */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden flex gap-3 pb-2 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dates.map(({ date, label, bookable = true }, i) => {
            const isLoading = loadingDate === date;
            const disabled = !!loadingDate || !bookable;
            return (
              <motion.button
                key={date}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                onClick={() => bookable && onSelect(date)}
                disabled={disabled}
                className={`flex-shrink-0 w-[100px] sm:w-[108px] py-3 border-2 text-center text-xs sm:text-sm tracking-wide transition-all duration-300 snap-start ${
                  bookable
                    ? "border-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                    : "border-white/30 text-gray-500 cursor-not-allowed"
                }`}
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                {isLoading ? "…" : label}
              </motion.button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Next dates"
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-white/50 rounded-full hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
          style={{ fontFamily: "FragmentMono, monospace" }}
        >
          →
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-4 text-center w-full" style={{ fontFamily: "FragmentMono, monospace" }}>
          {error}
        </p>
      )}
    </div>
  );
}
