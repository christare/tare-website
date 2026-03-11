"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type QueueStatus =
  | "waiting"
  | "notified"
  | "in_service"
  | "served"
  | "skipped"
  | "no_show"
  | "removed"
  | "error";

type QueueRecord = {
  id: string;
  guestName: string | null;
  phoneNumber: string | null;
  partySize: number | null;
  status: QueueStatus | null;
  checkInTimestamp: string | null;
  lastNotifiedAt: string | null;
  claimedAt: string | null;
  claimedBy: string | null;
  attemptCounter: number | null;
  sortOrder: number | null;
  priorityFlagVip: boolean;
  skipReason: string | null;
  noShowReason: string | null;
};

const PIN_STORAGE_KEY = "tare_queue_team_pin";
const UI_STATE_STORAGE_KEY = "tare_queue_ui_state_v1";

const HERO_BG_IMAGES = [
  "/images/Photo Wellness 1.jpg",
  "/images/Photo Wellness 3.jpg",
  "/images/Photo Wellness 2.png",
];

const STATUS_OPTIONS: Array<{ value: QueueStatus; label: string }> = [
  { value: "waiting", label: "Waiting" },
  { value: "notified", label: "Notified" },
  { value: "in_service", label: "In service" },
  { value: "served", label: "Served" },
  { value: "skipped", label: "Skipped" },
  { value: "no_show", label: "No-show" },
  { value: "removed", label: "Deleted" },
  { value: "error", label: "Error" },
];

type LaneKey =
  | "waiting"
  | "notified"
  | "in_service"
  | "skipped"
  | "no_show"
  | "deleted"
  | "served";

function formatLaneTitle(key: LaneKey) {
  switch (key) {
    case "waiting":
      return "WAITING";
    case "notified":
      return "NOTIFIED";
    case "in_service":
      return "IN SERVICE";
    case "skipped":
      return "SKIPPED";
    case "no_show":
      return "NO SHOW";
    case "deleted":
      return "DELETED";
    case "served":
      return "SERVED";
  }
}

function last4(phone: string | null) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-4);
}

function minutesAgo(iso: string | null) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  const mins = Math.floor((Date.now() - t) / 60000);
  return mins >= 0 ? mins : 0;
}

function sortLane(items: QueueRecord[]) {
  const copy = [...items];
  copy.sort((a, b) => {
    const ao = a.sortOrder ?? 1_000_000_000;
    const bo = b.sortOrder ?? 1_000_000_000;
    if (ao !== bo) return ao - bo;
    const at = a.checkInTimestamp ? new Date(a.checkInTimestamp).getTime() : 0;
    const bt = b.checkInTimestamp ? new Date(b.checkInTimestamp).getTime() : 0;
    if (at !== bt) return at - bt;
    return a.id.localeCompare(b.id);
  });
  return copy;
}

export default function TeamQueuePage() {
  const [needsPin, setNeedsPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [records, setRecords] = useState<QueueRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);
  const [activeLane, setActiveLane] = useState<LaneKey>("waiting");
  const [collapsed, setCollapsed] = useState<Record<LaneKey, boolean>>({
    waiting: false,
    notified: false,
    in_service: false,
    skipped: true,
    no_show: true,
    deleted: true,
    served: true,
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(PIN_STORAGE_KEY) || "";
    if (saved) setPin(saved);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(UI_STATE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as any;
      if (parsed?.activeLane) setActiveLane(parsed.activeLane);
      if (parsed?.collapsed) setCollapsed((prev) => ({ ...prev, ...parsed.collapsed }));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        UI_STATE_STORAGE_KEY,
        JSON.stringify({ activeLane, collapsed })
      );
    } catch {
      // ignore
    }
  }, [activeLane, collapsed]);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (pin) h["x-queue-pin"] = pin;
    return h;
  }, [pin]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const url = `/api/queue/list?includeArchive=1`;
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (res.status === 401) {
        setNeedsPin(true);
        setError("Unauthorized");
        return;
      }
      if (!res.ok) throw new Error(data?.error || "Failed to load queue");
      setRecords(data.records || []);
      setNeedsPin(false);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    if (pollingRef.current) window.clearInterval(pollingRef.current);
    pollingRef.current = window.setInterval(fetchList, 2500);
    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, showArchive]);

  const update = async (recordId: string, patch: any) => {
    const res = await fetch("/api/queue/update", {
      method: "POST",
      headers,
      body: JSON.stringify({ recordId, ...patch }),
    });
    const data = await res.json();
    if (res.status === 401) {
      setNeedsPin(true);
      setError("Unauthorized");
      return;
    }
    if (!res.ok) throw new Error(data?.error || "Update failed");
    await fetchList();
  };

  const notify = async (r: QueueRecord) => {
    const res = await fetch("/api/queue/notify", {
      method: "POST",
      headers,
      body: JSON.stringify({ recordId: r.id }),
    });
    const data = await res.json();
    if (res.status === 401) {
      setNeedsPin(true);
      setError("Unauthorized");
      return;
    }
    if (!res.ok) throw new Error(data?.error || "Notify failed");
    await fetchList();
  };

  const reorderLane = async (orderedIds: string[]) => {
    const res = await fetch("/api/queue/reorder", {
      method: "POST",
      headers,
      body: JSON.stringify({ orderedIds }),
    });
    const data = await res.json();
    if (res.status === 401) {
      setNeedsPin(true);
      setError("Unauthorized");
      return;
    }
    if (!res.ok) throw new Error(data?.error || "Reorder failed");
    await fetchList();
  };

  const waiting = useMemo(() => {
    return sortLane(records.filter((r) => r.status === "waiting"));
  }, [records]);

  const notified = useMemo(
    () => sortLane(records.filter((r) => r.status === "notified")),
    [records]
  );
  const inService = useMemo(
    () => sortLane(records.filter((r) => r.status === "in_service")),
    [records]
  );
  const skipped = useMemo(
    () => sortLane(records.filter((r) => r.status === "skipped")),
    [records]
  );
  const noShow = useMemo(
    () => sortLane(records.filter((r) => r.status === "no_show")),
    [records]
  );
  const served = useMemo(
    () => sortLane(records.filter((r) => r.status === "served")),
    [records]
  );
  const removed = useMemo(
    () => sortLane(records.filter((r) => r.status === "removed")),
    [records]
  );

  const handleDropReorder = async (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const ids = waiting.map((r) => r.id);
    const from = ids.indexOf(draggingId);
    const to = ids.indexOf(targetId);
    if (from === -1 || to === -1) return;

    const next = [...ids];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);

    setDraggingId(null);
    await reorderLane(next);
  };

  // Single team entry: only this page has the login form. From here you can switch to Taste dashboard.
  if (needsPin && !pin) {
    return (
      <main className="min-h-screen text-white relative" style={{ backgroundColor: "#2A2726" }}>
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
                <Image src={src} alt="" fill sizes="100vw" className="object-cover"
                  style={{ opacity: 0.25, filter: "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)" }} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(42,39,38,0.35) 0%, rgba(42,39,38,0.75) 50%, rgba(42,39,38,1) 100%)" }} />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-md border border-white/20 bg-[#2A2726]/90 backdrop-blur-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
                alt="TARE"
                width={60}
                height={60}
                className="w-[34px] h-auto opacity-90"
                priority
              />
              <div>
                <p className="text-xs tracking-widest text-gray-400" style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}>
                  TEAM ACCESS
                </p>
                <h1 className="text-xl font-light" style={{ fontFamily: "NonBureauExtended, sans-serif" }}>
                  Queue & events
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-4" style={{ fontFamily: "FragmentMono, monospace" }}>
              Log in to manage the in‑person queue and blind test RSVPs.
            </p>
            <input
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-b border-white/30 focus:outline-none focus:border-white py-3 text-lg text-white placeholder-gray-500"
              style={{ fontFamily: "FragmentMono, monospace" }}
              autoCapitalize="none"
              autoCorrect="off"
            />
            <button
              className="mt-6 w-full border-2 border-white px-10 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
              style={{ fontFamily: "FragmentMono, monospace" }}
              onClick={() => {
                const p = pinInput.trim();
                window.localStorage.setItem(PIN_STORAGE_KEY, p);
                setPin(p);
                setNeedsPin(false);
                setError("");
              }}
              disabled={!pinInput.trim()}
            >
              ENTER
            </button>
            <p className="text-gray-500 text-xs mt-4" style={{ fontFamily: "FragmentMono, monospace" }}>
              If you’re already logged into admin on this device, you can also use that session.
            </p>
            {error && (
              <p className="text-red-300 text-xs mt-3" style={{ fontFamily: "FragmentMono, monospace" }}>{error}</p>
            )}
          </div>
        </div>
      </main>
    );
  }

  const Lane = ({
    laneKey,
    items,
    tone,
  }: {
    laneKey: LaneKey;
    items: QueueRecord[];
    tone: "white" | "amber" | "green" | "gray" | "red";
  }) => {
    const title = formatLaneTitle(laneKey);
    const toneClass =
      tone === "amber"
        ? "border-amber-200/30"
        : tone === "green"
          ? "border-green-200/30"
          : tone === "red"
            ? "border-red-200/30"
            : tone === "gray"
              ? "border-white/10"
              : "border-white/20";

    return (
      <div className={`border ${toneClass} bg-white/5 p-4`}>
        <button
          type="button"
          className="w-full flex items-baseline justify-between gap-4 mb-3 text-left"
          onClick={() => setCollapsed((prev) => ({ ...prev, [laneKey]: !prev[laneKey] }))}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-gray-400 text-xs"
              style={{ fontFamily: "FragmentMono, monospace" }}
              aria-hidden="true"
            >
              {collapsed[laneKey] ? "▸" : "▾"}
            </span>
            <h2
              className="text-sm tracking-widest text-gray-300"
              style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
            >
              {title}
            </h2>
          </div>
          <span className="text-gray-400 text-xs" style={{ fontFamily: "FragmentMono, monospace" }}>
            {items.length}
          </span>
        </button>

        {!collapsed[laneKey] && (
          <div className="space-y-2">
          {items.map((r) => {
            const joinedMins = minutesAgo(r.checkInTimestamp);
            const notifiedMins = minutesAgo(r.lastNotifiedAt);
            const textDisabled = (r.attemptCounter || 0) >= 2;
            return (
              <div
                key={r.id}
                draggable={title === "WAITING"}
                onDragStart={() => setDraggingId(r.id)}
                onDragOver={(e) => {
                  if (title === "WAITING") e.preventDefault();
                }}
                onDrop={() => {
                  if (title === "WAITING") void handleDropReorder(r.id);
                }}
                className="border border-white/10 bg-black/20 px-3 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-base md:text-lg font-light truncate"
                        style={{ fontFamily: "NonBureauExtended, sans-serif" }}
                      >
                        {r.guestName || "—"}
                      </p>
                      {r.priorityFlagVip && (
                        <span
                          className="text-[10px] px-2 py-0.5 border border-amber-200/40 text-amber-100/90"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                        >
                          VIP
                        </span>
                      )}
                      {r.claimedBy && (
                        <span
                          className="text-[10px] px-2 py-0.5 border border-white/20 text-gray-200/90"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                        >
                          CLAIMED
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: "FragmentMono, monospace" }}>
                      Party {r.partySize || "—"} • ****{last4(r.phoneNumber)}{" "}
                      {joinedMins !== null ? `• ${joinedMins}m` : ""}
                      {notifiedMins !== null ? ` • notified ${notifiedMins}m` : ""}
                    </p>
                    {r.skipReason && (
                      <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: "FragmentMono, monospace" }}>
                        Skip: {r.skipReason}
                      </p>
                    )}
                    {r.noShowReason && (
                      <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: "FragmentMono, monospace" }}>
                        No-show: {r.noShowReason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2 flex-wrap justify-end">
                      <select
                        value={(r.status || "waiting") as QueueStatus}
                        onChange={(e) => {
                          const next = e.target.value as QueueStatus;
                          update(r.id, { status: next, appendLog: `STATUS -> ${next}` }).catch((err) =>
                            setError(err.message)
                          );
                        }}
                        className="bg-transparent border border-white/25 px-2.5 py-1 text-[11px] text-white"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="text-black">
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <button
                        className="border border-white/25 px-2 py-1 text-[11px] hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        disabled={items.length < 2 || items[0]?.id === r.id}
                        onClick={() => {
                          const idx = items.findIndex((x) => x.id === r.id);
                          if (idx <= 0) return;
                          const ids = items.map((x) => x.id);
                          const next = [...ids];
                          const [moved] = next.splice(idx, 1);
                          next.splice(idx - 1, 0, moved);
                          reorderLane(next).catch((e) => setError(e.message));
                        }}
                      >
                        ↑
                      </button>
                      <button
                        className="border border-white/25 px-2 py-1 text-[11px] hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        disabled={items.length < 2 || items[items.length - 1]?.id === r.id}
                        onClick={() => {
                          const idx = items.findIndex((x) => x.id === r.id);
                          if (idx === -1 || idx >= items.length - 1) return;
                          const ids = items.map((x) => x.id);
                          const next = [...ids];
                          const [moved] = next.splice(idx, 1);
                          next.splice(idx + 1, 0, moved);
                          reorderLane(next).catch((e) => setError(e.message));
                        }}
                      >
                        ↓
                      </button>

                      {!r.claimedBy ? (
                        <button
                          className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                          onClick={() =>
                            update(r.id, {
                              claimedBy: "team",
                              claimedAt: new Date().toISOString(),
                              appendLog: "CLAIM",
                            }).catch((e) => setError(e.message))
                          }
                        >
                          CLAIM
                        </button>
                      ) : (
                        <button
                          className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                          onClick={() =>
                            update(r.id, {
                              claimedBy: "",
                              claimedAt: "",
                              appendLog: "UNCLAIM",
                            }).catch((e) => setError(e.message))
                          }
                        >
                          UNCLAIM
                        </button>
                      )}

                      <button
                        className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        disabled={textDisabled}
                        onClick={() => notify(r).catch((e) => setError(e.message))}
                      >
                        {textDisabled ? "TEXTED" : "TEXT"}
                      </button>

                      <button
                        className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        onClick={() =>
                          update(r.id, { status: "in_service", appendLog: "STATUS -> in_service" }).catch((e) =>
                            setError(e.message)
                          )
                        }
                      >
                        IN SERVICE
                      </button>

                      <button
                        className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        onClick={() =>
                          update(r.id, {
                            status: "served",
                            servedTimestamp: new Date().toISOString(),
                            appendLog: "STATUS -> served",
                          }).catch((e) => setError(e.message))
                        }
                      >
                        SERVED
                      </button>

                      {r.status !== "skipped" ? (
                        <button
                          className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                          onClick={() =>
                            update(r.id, { status: "skipped", appendLog: "STATUS -> skipped" }).catch((e) =>
                              setError(e.message)
                            )
                          }
                        >
                          SKIP
                        </button>
                      ) : (
                        <button
                          className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                          style={{ fontFamily: "FragmentMono, monospace" }}
                          onClick={() =>
                            update(r.id, {
                              status: "waiting",
                              reAddedToQueue: true,
                              appendLog: "STATUS -> waiting (re-added)",
                            }).catch((e) => setError(e.message))
                          }
                        >
                          BACK TO WAIT
                        </button>
                      )}

                      <button
                        className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        onClick={() =>
                          update(r.id, { status: "no_show", appendLog: "STATUS -> no_show" }).catch((e) =>
                            setError(e.message)
                          )
                        }
                      >
                        NO-SHOW
                      </button>

                      <button
                        className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        onClick={() =>
                          (window.confirm("Delete this entry? (It will be archived under DELETED)") &&
                            update(r.id, { status: "removed", appendLog: "DELETE (archived)" }).catch((e) =>
                              setError(e.message)
                            ))
                        }
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen text-white relative" style={{ backgroundColor: "#2A2726" }}>
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 md:hidden">
          <Image src={HERO_BG_IMAGES[0]} alt="" fill sizes="100vw" className="object-cover"
            style={{ opacity: 0.2, filter: "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)" }} />
        </div>
        <div className="absolute inset-0 hidden md:grid md:grid-cols-3">
          {HERO_BG_IMAGES.map((src) => (
            <div key={src} className="relative h-full w-full">
              <Image src={src} alt="" fill sizes="100vw" className="object-cover"
                style={{ opacity: 0.2, filter: "grayscale(100%) contrast(1.2) brightness(0.9) saturate(0) blur(0.75px)" }} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(42,39,38,0.4) 0%, rgba(42,39,38,0.85) 40%, rgba(42,39,38,1) 100%)" }} />
      </div>
      <div className="relative z-10 px-6 pt-24 pb-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
              alt="TARE"
              width={70}
              height={70}
              className="w-[40px] h-auto opacity-90"
              priority
            />
            <div>
              <p
                className="text-xs tracking-widest text-gray-400"
                style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
              >
                TEAM • QUEUE
              </p>
              <h1
                className="text-2xl md:text-3xl font-light tracking-wide"
                style={{ fontFamily: "NonBureauExtended, sans-serif" }}
              >
                Guided Tasting
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-start md:justify-end">
            <Link
              href="/team/taste"
              className="border border-white/25 px-4 py-2 text-xs tracking-wide hover:bg-white hover:text-black transition-colors"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              TASTE DASHBOARD
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
                setPinInput("");
              }}
            >
              SIGN OUT
            </button>
            <label
              className="flex items-center gap-2 text-xs text-gray-300"
              style={{ fontFamily: "FragmentMono, monospace" }}
            >
              <input
                type="checkbox"
                checked={showArchive}
                onChange={(e) => setShowArchive(e.target.checked)}
              />
              Show archive
            </label>
          </div>
        </div>

        {error && (
          <p className="text-red-300 text-sm mb-4" style={{ fontFamily: "FragmentMono, monospace" }}>
            {error}
          </p>
        )}

        {/* Mobile: tabbed lanes */}
        <div className="md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
            {(
              [
                ["waiting", waiting.length],
                ["notified", notified.length],
                ["in_service", inService.length],
                ["skipped", skipped.length],
                ["no_show", noShow.length],
                ["deleted", removed.length],
                ...(showArchive ? ([["served", served.length]] as any) : []),
              ] as Array<[LaneKey, number]>
            ).map(([key, count]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveLane(key)}
                className={`shrink-0 border px-3 py-2 text-[11px] tracking-widest transition-colors ${
                  activeLane === key
                    ? "border-white text-white"
                    : "border-white/25 text-gray-300 hover:text-white hover:border-white/50"
                }`}
                style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.18em" }}
              >
                {formatLaneTitle(key)} ({count})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeLane === "waiting" && <Lane laneKey="waiting" items={waiting} tone="white" />}
            {activeLane === "notified" && <Lane laneKey="notified" items={notified} tone="amber" />}
            {activeLane === "in_service" && <Lane laneKey="in_service" items={inService} tone="green" />}
            {activeLane === "skipped" && <Lane laneKey="skipped" items={skipped} tone="gray" />}
            {activeLane === "no_show" && <Lane laneKey="no_show" items={noShow} tone="red" />}
            {activeLane === "deleted" && <Lane laneKey="deleted" items={removed} tone="gray" />}
            {activeLane === "served" && showArchive && <Lane laneKey="served" items={served} tone="gray" />}
          </div>
        </div>

        {/* Desktop+: grid lanes */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Lane laneKey="waiting" items={waiting} tone="white" />
          <Lane laneKey="notified" items={notified} tone="amber" />
          <Lane laneKey="in_service" items={inService} tone="green" />
          <Lane laneKey="skipped" items={skipped} tone="gray" />
          <Lane laneKey="no_show" items={noShow} tone="red" />
          <Lane laneKey="deleted" items={removed} tone="gray" />
          {showArchive && <Lane laneKey="served" items={served} tone="gray" />}
        </div>

        <p className="text-gray-500 text-xs mt-8" style={{ fontFamily: "FragmentMono, monospace" }}>
          Drag to reorder within WAITING. Use TASTE DASHBOARD above to manage blind test RSVPs.
          {loading ? " • loading…" : ""}
        </p>
      </div>
    </main>
  );
}

