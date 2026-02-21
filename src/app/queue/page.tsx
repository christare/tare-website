"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export default function QueueSignupPage() {
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      guestName.trim().length > 0 &&
      phoneNumber.trim().length > 0 &&
      partySize >= 1 &&
      partySize <= 12 &&
      !loading
    );
  }, [guestName, phoneNumber, partySize, loading]);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          phoneNumber,
          partySize,
          specialRequests,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to join queue");

      setSuccess(true);
      setGuestName("");
      setPhoneNumber("");
      setPartySize(1);
      setSpecialRequests("");
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="text-white overflow-x-hidden"
      style={{ backgroundColor: "#2A2726" }}
    >
      <div
        className="flex flex-col items-center justify-center px-6 py-12"
        style={{ minHeight: "100svh" }}
      >
        <div className="w-full max-w-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
              alt="TARE"
              width={90}
              height={90}
              className="h-auto w-[54px] md:w-[70px] mb-4 opacity-90"
              priority
            />
            <h1
              className="text-3xl md:text-4xl font-light tracking-wide"
              style={{ fontFamily: "NonBureauExtended, sans-serif" }}
            >
              Guided Tasting Queue
            </h1>
            <p
              className="text-gray-300 mt-3 text-sm md:text-base leading-relaxed"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              Add your party. We’ll text you when it’s your turn.
            </p>
          </div>

          {success ? (
            <div
              className="border border-white/20 bg-white/5 p-6 md:p-8 text-center"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <p
                className="text-xl md:text-2xl font-light mb-3"
                style={{ fontFamily: "NonBureauExtended, sans-serif" }}
              >
                You’re in.
              </p>
              <p
                className="text-gray-300 text-sm md:text-base"
                style={{ fontFamily: "FragmentMono, monospace" }}
              >
                Feel free to shop. We’ll notify you when your tasting is ready.
              </p>
              <button
                className="mt-6 inline-block border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
                style={{ fontFamily: "FragmentMono, monospace" }}
                onClick={() => setSuccess(false)}
              >
                Add another party
              </button>
            </div>
          ) : (
            <div className="border border-white/20 bg-white/5 p-6 md:p-8">
              <div className="space-y-5">
                <div>
                  <label
                    className="block text-xs tracking-widest text-gray-400 mb-2"
                    style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
                  >
                    GUEST NAME
                  </label>
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-white/30 focus:outline-none focus:border-white py-3 text-lg text-white placeholder-gray-500"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs tracking-widest text-gray-400 mb-2"
                    style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
                  >
                    PHONE NUMBER
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full bg-transparent border-b border-white/30 focus:outline-none focus:border-white py-3 text-lg text-white placeholder-gray-500"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <div>
                    <label
                      className="block text-xs tracking-widest text-gray-400 mb-2"
                      style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
                    >
                      PARTY SIZE
                    </label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full bg-transparent border border-white/20 px-4 py-3 text-base text-white"
                      style={{ fontFamily: "FragmentMono, monospace" }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n} className="text-black">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs tracking-widest text-gray-400 mb-2"
                    style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
                  >
                    SPECIAL REQUESTS (OPTIONAL)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Dietary needs, accessibility, anything we should know"
                    rows={3}
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    style={{ fontFamily: "FragmentMono, monospace" }}
                  />
                </div>

                {error && (
                  <p className="text-red-300 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  className="w-full border-2 border-white px-10 py-4 text-sm md:text-base tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "FragmentMono, monospace" }}
                >
                  {loading ? "ADDING..." : "JOIN THE QUEUE"}
                </button>
              </div>
            </div>
          )}

          <p
            className="text-gray-500 text-xs mt-6 text-center"
            style={{ fontFamily: "FragmentMono, monospace" }}
          >
            TARE • Please keep your phone available for updates
          </p>
        </div>
      </div>
    </main>
  );
}

