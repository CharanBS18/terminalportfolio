"use client";

import React, { useEffect, useState } from "react";

interface ClockZone {
  name: string;
  tz: string;
  offset: number;
}

const zones: ClockZone[] = [
  { name: "UTC/GMT", tz: "UTC", offset: 0 },
  { name: "LOCAL", tz: "Local", offset: 0 },
  { name: "NEW YORK", tz: "America/New_York", offset: -4 },
  { name: "LONDON", tz: "Europe/London", offset: 1 },
  { name: "TOKYO", tz: "Asia/Tokyo", offset: 9 }
];

export function WorldClockWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const updatedTimes: Record<string, string> = {};

      zones.forEach((zone) => {
        let timeStr = "";
        try {
          if (zone.tz === "Local") {
            timeStr = now.toLocaleTimeString("en-US", { hour12: false });
          } else {
            timeStr = new Date(now.toLocaleString("en-US", { timeZone: zone.tz })).toLocaleTimeString("en-US", { hour12: false });
          }
        } catch (e) {
          // Fallback to simple calculation if timezone list fails
          const utc = now.getTime() + now.getTimezoneOffset() * 60000;
          const zoneTime = new Date(utc + 3600000 * zone.offset);
          timeStr = zoneTime.toLocaleTimeString("en-US", { hour12: false });
        }
        updatedTimes[zone.name] = timeStr;
      });

      setTimes(updatedTimes);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const textColors: Record<string, string> = {
    green: "text-emerald-400/90",
    cyan: "text-cyan-400/90",
    purple: "text-fuchsia-400/90",
    amber: "text-amber-400/90",
    red: "text-red-400/90",
    white: "text-zinc-300"
  };

  const activeColor = textColors[themeColor] || textColors.cyan;

  return (
    <div className="w-full h-full flex flex-col font-mono text-[9px] select-none p-3 gap-2 bg-zinc-950/20">
      <div className="flex justify-between items-center text-zinc-500 border-b border-white/5 pb-1 uppercase text-[8px] tracking-wider shrink-0">
        <span>Cybernet Chronometer</span>
        <span>Epoch: {Math.floor(Date.now() / 1000)}</span>
      </div>

      {/* Clocks grid layout */}
      <div className="flex-1 flex flex-col justify-around gap-1 min-h-0 py-1">
        {zones.map((zone, idx) => (
          <div key={idx} className="flex justify-between items-center py-1 hover:bg-white/5 px-2 rounded border border-white/5 bg-black/10">
            <span className="text-zinc-400 font-bold text-[8px] tracking-widest uppercase">{zone.name}</span>
            <span className={`text-[11px] font-extrabold tracking-widest ${activeColor}`}>
              {times[zone.name] || "00:00:00"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
