"use client";

import { useEffect, useState } from "react";

const ZONES = [
  { label: "LIS", tz: "Europe/Lisbon" },
  { label: "BER", tz: "Europe/Berlin" },
  { label: "DXB", tz: "Asia/Dubai" },
  { label: "SGP", tz: "Asia/Singapore" },
  { label: "NYC", tz: "America/New_York" },
];

function fmt(tz: string, now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(now);
}

export default function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-6 text-[10px] md:text-[11px] tracking-[0.14em] md:tracking-[0.18em] text-[var(--ink-dim)]">
      {ZONES.map((z) => (
        <span key={z.tz} className="tabular-nums">
          <span className="text-[var(--ink-faint)]">{z.label}</span>{" "}
          <span className="text-[var(--ink)]">
            {now ? fmt(z.tz, now) : "--:--:--"}
          </span>
        </span>
      ))}
    </div>
  );
}
