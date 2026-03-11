"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BLIND_TASTE_EVENT } from "@/config/blind-taste";

const PIN_STORAGE_KEY = "tare_queue_team_pin";

const HERO_BG_IMAGES = [
  "/images/Photo Wellness 1.jpg",
  "/images/Photo Wellness 3.jpg",
  "/images/Photo Wellness 2.png",
];

type EventRsvpRecord = {
  id: string;
  eventId: string | null;
  guestName: string | null;
  phoneNumber: string | null;
  rsvpAt: string | null;
  messageLog: string | null;
  showOnList?: boolean;
};

function last4(phone: string | null) {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 4 ? `****${digits.slice(-4)}` : "—";
}

function formatRsvpAt(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function TeamTastePage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [pinChecked, setPinChecked] = useState(false);
  const [records, setRecords] = useState<EventRsvpRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Single team entry: only /team/queue has the login form. If no saved PIN, redirect there.
  useEffect(() => {
    const saved = window.localStorage.getItem(PIN_STORAGE_KEY) || "";
    setPinChecked(true);
    if (!saved) {
      router.replace("/team/queue");
      return;
    }
    setPin(saved);
  }, [router]);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (pin) h["x-queue-pin"] = pin;
    return h;
  }, [pin]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events-rsvp/list", { headers, cache: "no-store" });
      const data = await res.json();
      if (res.status === 401) {
        window.localStorage.removeItem(PIN_STORAGE_KEY);
        router.replace("/team/queue");
        return;
      }
      if (!res.ok) throw new Error(data?.error || "Failed to load RSVPs");
      setRecords(data.records || []);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to load RSVPs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pin) return;
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, [pin]);

  const sendMessage = async (recordId: string) => {
    const message = customMessage.trim();
    if (!message) return;
    setSendingId(recordId);
    setError("");
    try {
      const res = await fetch("/api/events-rsvp/send-message", {
        method: "POST",
        headers,
        body: JSON.stringify({ recordId, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send");
      setExpandedId(null);
      setCustomMessage("");
      await fetchList();
    } catch (e: any) {
      setError(e?.message || "Failed to send message");
    } finally {
      setSendingId(null);
    }
  };

  const toggleShowOnList = async (r: EventRsvpRecord) => {
    const next = !(r.showOnList !== false);
    setTogglingId(r.id);
    setError("");
    try {
      const res = await fetch("/api/events-rsvp/update", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ recordId: r.id, showOnList: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update");
      // Optimistic update so UI reflects change immediately
      setRecords((prev) =>
        prev.map((rec) =>
          rec.id === r.id ? { ...rec, showOnList: next } : rec
        )
      );
      await fetchList();
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  const removeGuest = async (r: EventRsvpRecord) => {
    if (!confirm(`Remove ${r.guestName || "this guest"} from the list?`)) return;
    setRemovingId(r.id);
    setError("");
    try {
      const res = await fetch("/api/events-rsvp/leave", {
        method: "POST",
        headers,
        body: JSON.stringify({
          eventId: BLIND_TASTE_EVENT.eventId,
          phoneNumber: r.phoneNumber || "",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to remove");
      }
      setExpandedId(null);
      await fetchList();
    } catch (e: any) {
      setError(e?.message || "Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  const messageLogLines = (log: string | null) => {
    if (!log || !log.trim()) return [];
    return log.trim().split(/\n/).filter(Boolean);
  };

  // Single team entry: only /team/queue has login. Redirect if no saved PIN.
  if (!pinChecked || !pin) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: "#2A2726" }}>
        <p className="text-gray-400 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
          Redirecting to team login…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white relative" style={{ backgroundColor: "#2A2726" }}>
      {/* Homepage-style background */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 md:hidden">
          <Image
            src={HERO_BG_IMAGES[0]}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ opacity: 0.25, filter: "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)" }}
          />
        </div>
        <div className="absolute inset-0 hidden md:grid md:grid-cols-3">
          {HERO_BG_IMAGES.map((src) => (
            <div key={src} className="relative h-full w-full">
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                style={{ opacity: 0.25, filter: "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)" }}
              />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(42,39,38,0.3) 0%, rgba(42,39,38,0.75) 50%, rgba(42,39,38,1) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 px-6 pt-24 pb-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
              alt=""
              width={70}
              height={70}
              className="w-[40px] h-auto opacity-90"
            />
            <div>
              <p className="text-xs tracking-widest text-gray-400" style={{ fontFamily: "FragmentMono, monospace" }}>
                TEAM · BLIND TEST
              </p>
              <h1 className="text-2xl md:text-3xl font-light tracking-wide" style={{ fontFamily: "NonBureauExtended, sans-serif" }}>
                {BLIND_TASTE_EVENT.title}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: "FragmentMono, monospace" }}>
                {BLIND_TASTE_EVENT.dateLabel} · {BLIND_TASTE_EVENT.timeRange}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/team/queue"
              className="border border-white/25 px-4 py-2 text-xs tracking-wide hover:bg-white hover:text-black transition-colors"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              QUEUE DASHBOARD
            </Link>
            <button
              className="border border-white/25 px-4 py-2 text-xs tracking-wide hover:bg-white hover:text-black transition-colors"
              style={{ fontFamily: "FragmentMono, monospace" }}
              onClick={() => fetchList()}
            >
              REFRESH
            </button>
            <button
              className="border border-white/25 px-4 py-2 text-xs tracking-wide hover:bg-white hover:text-black transition-colors"
              style={{ fontFamily: "FragmentMono, monospace" }}
              onClick={() => {
                window.localStorage.removeItem(PIN_STORAGE_KEY);
                setPin("");
                router.replace("/team/queue");
              }}
            >
              SIGN OUT
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-300 text-sm mb-4" style={{ fontFamily: "FragmentMono, monospace" }}>
            {error}
          </p>
        )}

        <div className="border border-white/20 bg-white/5 p-4">
          <h2 className="text-xs tracking-widest text-gray-400 mb-4" style={{ fontFamily: "FragmentMono, monospace" }}>
            RSVPs ({records.length})
          </h2>
          {loading && records.length === 0 ? (
            <p className="text-gray-400 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
              Loading…
            </p>
          ) : records.length === 0 ? (
            <p className="text-gray-400 text-sm" style={{ fontFamily: "FragmentMono, monospace" }}>
              No RSVPs yet.
            </p>
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-light" style={{ fontFamily: "NonBureauExtended, sans-serif" }}>
                        {r.guestName || "—"}
                        {r.showOnList === false && (
                          <span className="ml-2 text-gray-500 text-xs" style={{ fontFamily: "FragmentMono, monospace" }}>
                            (hidden from list)
                          </span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: "FragmentMono, monospace" }}>
                        {last4(r.phoneNumber)} · {formatRsvpAt(r.rsvpAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className="border border-white/25 px-3 py-1.5 text-[11px] hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        disabled={togglingId === r.id}
                        onClick={() => toggleShowOnList(r)}
                        title={r.showOnList !== false ? "Hide from public Who's Coming" : "Show on public list"}
                      >
                        {togglingId === r.id ? "…" : r.showOnList !== false ? "HIDE FROM LIST" : "SHOW ON LIST"}
                      </button>
                      <button
                        className="border border-white/25 px-3 py-1.5 text-[11px] hover:bg-white hover:text-black transition-colors"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      >
                        {expandedId === r.id ? "CLOSE" : "MORE"}
                      </button>
                      <button
                        className="border border-red-400/50 px-3 py-1.5 text-[11px] text-red-300 hover:bg-red-400/20 transition-colors disabled:opacity-50"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        disabled={removingId === r.id}
                        onClick={() => removeGuest(r)}
                      >
                        {removingId === r.id ? "…" : "REMOVE"}
                      </button>
                    </div>
                  </div>
                  {expandedId === r.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-4">
                      {/* Expandable message history */}
                      <div>
                        <p className="text-[11px] tracking-widest text-gray-500 mb-2" style={{ fontFamily: "FragmentMono, monospace" }}>
                          MESSAGE HISTORY
                        </p>
                        {messageLogLines(r.messageLog).length === 0 ? (
                          <p className="text-gray-500 text-xs" style={{ fontFamily: "FragmentMono, monospace" }}>
                            No messages yet.
                          </p>
                        ) : (
                          <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                            {messageLogLines(r.messageLog).map((line, i) => (
                              <li key={i} className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words">
                                {line}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {/* Send message */}
                      <div>
                        <p className="text-[11px] tracking-widest text-gray-500 mb-2" style={{ fontFamily: "FragmentMono, monospace" }}>
                          SEND MESSAGE
                        </p>
                        <textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="Custom message (use {name} for their name)"
                          rows={3}
                          className="w-full bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                        />
                        <button
                          className="mt-2 border border-white/25 px-3 py-1.5 text-[11px] hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                          disabled={!customMessage.trim() || sendingId === r.id}
                          onClick={() => sendMessage(r.id)}
                        >
                          {sendingId === r.id ? "SENDING…" : "SEND"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-gray-500 text-xs mt-6" style={{ fontFamily: "FragmentMono, monospace" }}>
          Same PIN as queue dashboard. Messages are sent via Twilio and logged in Airtable.
        </p>
      </div>
    </main>
  );
}
