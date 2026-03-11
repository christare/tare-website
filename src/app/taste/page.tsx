"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BLIND_TASTE_EVENT } from "@/config/blind-taste";

const VISIBLE_NAMES = 5;

type Step = "gate" | "form" | "success";

export default function TastePage() {
  const [step, setStep] = useState<Step>("gate");
  const [publicAttendees, setPublicAttendees] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [justRsvpd, setJustRsvpd] = useState(false);
  const [removing, setRemoving] = useState(false);

  const refetchAttendees = async () => {
    try {
      const res = await fetch(
        `/api/events-rsvp/attendees?eventId=${encodeURIComponent(BLIND_TASTE_EVENT.eventId)}`
      );
      const data = await res.json();
      if (Array.isArray(data.attendees)) setPublicAttendees(data.attendees);
    } catch (_) {}
  };

  const onContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const phone = phoneNumber.trim();
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/events-rsvp/attendees?eventId=${encodeURIComponent(BLIND_TASTE_EVENT.eventId)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();
      if (data.found) {
        setPublicAttendees(data.attendees || []);
        setJustRsvpd(false);
        setStep("success");
      } else {
        setStep("form");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onRemoveSelf = async () => {
    if (!phoneNumber.trim() || removing) return;
    setRemoving(true);
    setError("");
    try {
      const res = await fetch("/api/events-rsvp/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: BLIND_TASTE_EVENT.eventId,
          phoneNumber: phoneNumber.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to remove");
      setStep("gate");
      setPhoneNumber("");
      setGuestName("");
      setPublicAttendees([]);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setRemoving(false);
    }
  };

  const onRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!guestName.trim()) {
      setError("Enter your name");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/events-rsvp/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to RSVP");
      await refetchAttendees();
      setJustRsvpd(true);
      setStep("success");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const heroBgImages = [
    "/images/cups.jpg",
    "/images/beans.jpg",
    "/images/brew.jpg",
  ];

  const bgImageStyle = {
    opacity: 0.35,
    filter: "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)",
  };

  const visible = publicAttendees.slice(0, VISIBLE_NAMES);
  const othersCount = Math.max(0, publicAttendees.length - VISIBLE_NAMES);

  return (
    <main className="min-h-screen text-white overflow-x-hidden relative" style={{ backgroundColor: "#2A2726" }}>
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 md:hidden">
          <Image
            src={heroBgImages[0]}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={bgImageStyle}
          />
        </div>
        <div className="absolute inset-0 hidden md:grid md:grid-cols-3">
          {heroBgImages.map((src) => (
            <div key={src} className="relative h-full w-full">
              <Image
                src={src}
                alt=""
                fill
                sizes="33vw"
                className="object-cover"
                style={bgImageStyle}
              />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(42,39,38,0.2) 0%, rgba(42,39,38,0.6) 50%, rgba(42,39,38,0.95) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-12 sm:py-16 min-h-screen">
        <div className="w-full max-w-xl">
          {/* Event details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center mb-6 rounded-sm px-4 py-5 sm:px-6 sm:py-6 bg-[#2A2726]/85 backdrop-blur-md border border-white/10"
          >
            <Image
              src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
              alt=""
              width={90}
              height={90}
              className="h-auto w-[54px] md:w-[70px] mb-4 opacity-90"
              priority
            />
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-white"
              style={{ fontFamily: "NonBureauExtended, sans-serif" }}
            >
              {BLIND_TASTE_EVENT.title}
            </h1>
            <p
              className="text-gray-300 sm:text-gray-400 mt-2 text-xs sm:text-sm tracking-wide"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              {BLIND_TASTE_EVENT.dateLabel} · {BLIND_TASTE_EVENT.timeRange}
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center max-w-lg mx-auto mb-6 sm:mb-8 rounded-sm px-4 py-5 sm:px-6 sm:py-6 bg-[#2A2726]/85 backdrop-blur-md border border-white/10"
          >
            <p
              className="text-gray-100 text-sm sm:text-base font-light leading-relaxed space-y-2 sm:space-y-2.5"
              style={{ fontFamily: "NonBureauExtended, sans-serif" }}
            >
              <span className="block">Preview the current TARE lineup.</span>
              <span className="block">Blind tests of new coffees, aromatics, and experimental creations.</span>
              <span className="block">Come experience everything and tell us what&apos;s actually better.</span>
            </p>
            <p
              className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-4 mb-3"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              Your feedback will help shape what we serve at upcoming collabs, launches, and public events.
            </p>
            <p
              className="text-gray-500 text-xs leading-snug"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              If you&apos;d like to bring a +1, let a TARE team member know and have them RSVP here.
            </p>
          </motion.div>

          {/* Step 1: Phone gate */}
          <AnimatePresence mode="wait">
            {step === "gate" && (
              <motion.div
                key="gate"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-sm px-4 py-5 sm:px-6 sm:py-6 bg-[#2A2726]/85 backdrop-blur-md border border-white/10"
              >
                <form onSubmit={onContinue} className="space-y-4">
                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2" style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}>
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full bg-transparent border-b border-white/30 focus:outline-none focus:border-white py-3 text-lg text-white placeholder-gray-500"
                      style={{ fontFamily: "FragmentMono, monospace" }}
                      inputMode="tel"
                      autoComplete="tel"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-300 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !phoneNumber.trim()}
                    className="w-full border-2 border-white px-10 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                  >
                    {loading ? "…" : "CONTINUE"}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-sm px-4 py-5 sm:px-6 sm:py-6 bg-[#2A2726]/85 backdrop-blur-md border border-white/10"
              >
                <p className="text-gray-400 text-xs tracking-widest mb-5" style={{ fontFamily: "FragmentMono, monospace" }}>
                  RSVP
                </p>
                <form onSubmit={onRsvpSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2" style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}>
                      NAME
                    </label>
                    <input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-transparent border-b border-white/30 focus:outline-none focus:border-white py-3 text-lg text-white placeholder-gray-500"
                      style={{ fontFamily: "FragmentMono, monospace" }}
                      autoComplete="name"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-300 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !guestName.trim()}
                    className="w-full border-2 border-white px-10 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                  >
                    {loading ? "…" : "RSVP"}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => { setStep("gate"); setError(""); }}
                  className="mt-4 w-full text-gray-400 text-xs hover:text-white transition-colors"
                  style={{ fontFamily: "FragmentMono, monospace" }}
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-sm px-4 py-5 sm:px-6 sm:py-6 bg-[#2A2726]/85 backdrop-blur-md border border-white/10 text-center"
              >
                <div className="mb-6">
                  <p className="text-xl sm:text-2xl font-light mb-2" style={{ fontFamily: "NonBureauExtended, sans-serif" }}>
                    You&apos;re on the list.
                  </p>
                  {justRsvpd && (
                    <p className="text-gray-300 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
                      We sent a confirmation text with the date and address.
                    </p>
                  )}
                </div>

                <div className="text-left mb-6 pt-2">
                  <p className="text-gray-400 text-xs tracking-widest mb-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                    WHO&apos;S COMING
                  </p>
                  {publicAttendees.length === 0 ? (
                    <p className="text-gray-500 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>Loading…</p>
                  ) : (
                    <ul className="space-y-1.5" style={{ fontFamily: "FragmentMono, monospace" }}>
                      {visible.map((name) => (
                        <li key={name} className="text-gray-200 text-sm">{name}</li>
                      ))}
                      {othersCount > 0 && (
                        <li className="text-gray-500 text-sm pt-1">
                          • {othersCount} other{othersCount !== 1 ? "s" : ""}
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3">
                  <Link
                    href="/"
                    className="inline-block border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                  >
                    RETURN HOME
                  </Link>
                  <button
                    type="button"
                    onClick={onRemoveSelf}
                    disabled={removing}
                    className="text-gray-400 text-xs hover:text-white transition-colors disabled:opacity-50"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                  >
                    {removing ? "…" : "Remove me from the list"}
                  </button>
                </div>
                {error && (
                  <p className="text-red-300 text-sm mt-2" style={{ fontFamily: "FragmentMono, monospace" }}>
                    {error}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-gray-500 text-xs mt-6 text-center" style={{ fontFamily: "FragmentMono, monospace" }}>
            TARE · Blind Test · {BLIND_TASTE_EVENT.dateLabel}
          </p>
        </div>
      </div>
    </main>
  );
}
