"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

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

  useEffect(() => {
    const saved = window.localStorage.getItem(PIN_STORAGE_KEY) || "";
    if (saved) setPin(saved);
  }, []);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (pin) h["x-queue-pin"] = pin;
    return h;
  }, [pin]);

  const fetchList = async () => {
    setLoading(true);
    // Don't clear error every poll; keep it visible if APIs are failing.
    try {
      const url = `/api/queue/list?includeArchive=${showArchive ? "1" : "0"}`;
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (res.status === 401) {
        setNeedsPin(true);
        throw new Error("Unauthorized");
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
    if (!res.ok) throw new Error(data?.error || "Update failed");
    await fetchList();
  };

  const notify = async (r: QueueRecord) => {
    const res = await fetch("/api/queue/notify", {
      method: "POST",
      headers,
      body: JSON.stringify({
        recordId: r.id,
        phoneNumber: r.phoneNumber,
        guestName: r.guestName,
        attemptCounter: r.attemptCounter || 0,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Notify failed");
    await fetchList();
  };

  const reorderWaiting = async (orderedIds: string[]) => {
    const res = await fetch("/api/queue/reorder", {
      method: "POST",
      headers,
      body: JSON.stringify({ orderedIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Reorder failed");
    await fetchList();
  };

  const waiting = useMemo(() => {
    return records
      .filter((r) => r.status === "waiting")
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [records]);

  const notified = useMemo(() => records.filter((r) => r.status === "notified"), [records]);
  const inService = useMemo(() => records.filter((r) => r.status === "in_service"), [records]);
  const skipped = useMemo(() => records.filter((r) => r.status === "skipped"), [records]);
  const noShow = useMemo(() => records.filter((r) => r.status === "no_show"), [records]);
  const served = useMemo(() => records.filter((r) => r.status === "served"), [records]);
  const removed = useMemo(() => records.filter((r) => r.status === "removed"), [records]);

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
    await reorderWaiting(next);
  };

  // If we have no saved/entered pin AND the server says we need one, show login.
  // If a pin exists (even if wrong), show the dashboard shell and surface the error banner.
  if (needsPin && !pin) {
    return (
      <main className="min-h-screen text-white" style={{ backgroundColor: "#2A2726" }}>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-md border border-white/20 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
                alt="TARE"
                width={60}
                height={60}
                className="w-[34px] h-auto opacity-90"
                priority
              />
              <div>
                <p
                  className="text-xs tracking-widest text-gray-400"
                  style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
                >
                  TEAM ACCESS
                </p>
                <h1
                  className="text-xl font-light"
                  style={{ fontFamily: "NonBureauExtended, sans-serif" }}
                >
                  Queue Dashboard
                </h1>
              </div>
            </div>

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
              <p className="text-red-300 text-xs mt-3" style={{ fontFamily: "FragmentMono, monospace" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  const Lane = ({
    title,
    items,
    tone,
  }: {
    title: string;
    items: QueueRecord[];
    tone: "white" | "amber" | "green" | "gray" | "red";
  }) => {
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
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h2
            className="text-sm tracking-widest text-gray-300"
            style={{ fontFamily: "FragmentMono, monospace", letterSpacing: "0.2em" }}
          >
            {title}
          </h2>
          <span className="text-gray-400 text-xs" style={{ fontFamily: "FragmentMono, monospace" }}>
            {items.length}
          </span>
        </div>
        <div className="space-y-2">
          {items.map((r) => {
            const joinedMins = minutesAgo(r.checkInTimestamp);
            const notifiedMins = minutesAgo(r.lastNotifiedAt);
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
                        className="border border-white/25 px-2.5 py-1 text-[11px] hover:bg-white hover:text-black transition-colors"
                        style={{ fontFamily: "FragmentMono, monospace" }}
                        onClick={() => notify(r).catch((e) => setError(e.message))}
                      >
                        TEXT
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
                          update(r.id, { status: "removed", appendLog: "STATUS -> removed" }).catch((e) =>
                            setError(e.message)
                          )
                        }
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#2A2726" }}>
      <div className="px-6 pt-24 pb-10 max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Lane title="WAITING" items={waiting} tone="white" />
          <Lane title="NOTIFIED" items={notified} tone="amber" />
          <Lane title="IN SERVICE" items={inService} tone="green" />
          <Lane title="SKIPPED" items={skipped} tone="gray" />
          <Lane title="NO SHOW" items={noShow} tone="red" />
          {showArchive && (
            <>
              <Lane title="SERVED" items={served} tone="gray" />
              <Lane title="REMOVED" items={removed} tone="gray" />
            </>
          )}
        </div>

        <p className="text-gray-500 text-xs mt-8" style={{ fontFamily: "FragmentMono, monospace" }}>
          Tip: drag to reorder within WAITING. All actions write to Airtable.
          {loading ? " • loading…" : ""}
        </p>
      </div>
    </main>
  );
}

