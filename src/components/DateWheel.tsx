"use client";

import { motion } from "framer-motion";

export type DateOption = { date: string; label: string };

type DateWheelProps = {
  dates: DateOption[];
  loadingDate: string | null;
  onSelect: (date: string) => void;
  error?: string;
};

export function DateWheel({ dates, loadingDate, onSelect, error }: DateWheelProps) {
  if (dates.length === 0) return null;

  const size = 320;
  const radius = 125;
  const center = size / 2;

  return (
    <div className="relative flex flex-col items-center">
      <p className="text-gray-400 text-xs tracking-widest mb-2" style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}>
        SELECT SATURDAY OR SUNDAY
      </p>
      <p className="text-gray-500 text-[10px] sm:text-xs mb-6" style={{ fontFamily: "FragmentMono, monospace" }}>
        Booking closes Thursday 11pm EST for that weekend.
      </p>

      {/* Wheel container — fixed size for consistent circle math */}
      <div className="relative flex items-center justify-center sm:scale-110" style={{ width: size, height: size }}>
        {/* Outer ring — echoes the hero dial */}
        <div
          className="absolute rounded-full border border-white/25"
          style={{ width: size, height: size }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full border border-white/10"
          style={{ width: size * 0.5, height: size * 0.5, left: size * 0.25, top: size * 0.25 }}
        />
        {/* Center label */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ width: size, height: size }}
        >
          <span
            className="text-gray-500 text-[10px] sm:text-xs tracking-widest"
            style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.15em" }}
          >
            PICK A DATE
          </span>
        </div>

        {/* Date pills placed on the circle */}
        {dates.map(({ date, label }, i) => {
          const total = dates.length;
          const angleDeg = (i / total) * 360 - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = center + radius * Math.cos(angleRad);
          const y = center + radius * Math.sin(angleRad);
          const isLoading = loadingDate === date;

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.05 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.button
                whileHover={!loadingDate ? { scale: 1.08 } : undefined}
                whileTap={!loadingDate ? { scale: 0.98 } : undefined}
                onClick={() => onSelect(date)}
                disabled={!!loadingDate}
                className="w-[96px] sm:w-[106px] py-2.5 border-2 border-white text-center text-xs sm:text-sm tracking-wide hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                {isLoading ? "…" : label}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-4 text-center max-w-[320px]" style={{ fontFamily: "FragmentMono, monospace" }}>
          {error}
        </p>
      )}
    </div>
  );
}
