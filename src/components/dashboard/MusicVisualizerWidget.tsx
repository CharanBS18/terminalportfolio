"use client";

import React, { useEffect, useState } from "react";

export function MusicVisualizerWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const [bars, setBars] = useState<number[]>(Array(18).fill(30));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          // Bounces with standard fluctuation
          const randomBase = 15 + Math.random() * 70;
          return Math.floor(randomBase);
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const themeColors: Record<string, string> = {
    green: "bg-emerald-500 shadow-emerald-500/35",
    cyan: "bg-cyan-500 shadow-cyan-500/35",
    purple: "bg-fuchsia-500 shadow-fuchsia-500/35",
    amber: "bg-amber-500 shadow-amber-500/35",
    red: "bg-red-500 shadow-red-500/35",
    white: "bg-zinc-300 shadow-zinc-300/35"
  };

  const activeColor = themeColors[themeColor] || themeColors.cyan;

  return (
    <div className="w-full h-full flex flex-col font-mono text-[9px] select-none p-3 gap-3 bg-zinc-950/20">
      <div className="flex justify-between items-center text-zinc-500 border-b border-white/5 pb-1.5 uppercase text-[8px] tracking-wider shrink-0">
        <span>Audio Spectrum Interceptor</span>
        <span>Decibel: -12.4 DB</span>
      </div>

      {/* Visualizer bars */}
      <div className="flex-1 flex items-end justify-between bg-[#08080a]/40 border border-white/5 rounded-lg p-3 min-h-0">
        {bars.map((height, idx) => (
          <div
            key={idx}
            className={`w-[4.5%] rounded-t-sm transition-all duration-250 ease-in-out ${activeColor}`}
            style={{
              height: `${height}%`,
              boxShadow: `0 0 10px currentColor`
            }}
          />
        ))}
      </div>

      {/* Spectrum metadata */}
      <div className="flex justify-around text-zinc-500 text-[7px] tracking-widest shrink-0 select-none">
        <span>30Hz</span>
        <span>250Hz</span>
        <span>1kHz</span>
        <span>4kHz</span>
        <span>16kHz</span>
      </div>
    </div>
  );
}
