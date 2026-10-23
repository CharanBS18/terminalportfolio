"use client";

import React, { useEffect, useState } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

export function AIStatusWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const [metrics, setMetrics] = useState({
    tokensPerSec: 74.2,
    totalTokens: 142080,
    gpuMemory: 18.4,
    latency: 18.5,
    status: "STANDBY"
  });

  const statuses = ["THINKING", "INFERENCE", "COMPILING", "STANDBY"];

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        if (prev.status.startsWith("SEARCHING") || prev.status.startsWith("ANALYZING") || prev.status === "WARNING") {
          return prev;
        }
        const nextTokens = prev.totalTokens + Math.floor(Math.random() * 85);
        const nextTps = parseFloat((65 + Math.random() * 30).toFixed(1));
        const nextGpu = parseFloat((17.5 + Math.random() * 2).toFixed(1));
        const nextLat = parseFloat((14 + Math.random() * 8).toFixed(1));
        const nextStatus = nextTps > 85 ? "INFERENCE" : nextTps < 72 ? "THINKING" : "STANDBY";

        return {
          tokensPerSec: nextTps,
          totalTokens: nextTokens,
          gpuMemory: nextGpu,
          latency: nextLat,
          status: nextStatus
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useTerminalEvent((detail: { command: string }) => {
    const { command } = detail;
    let targetStatus = "THINKING";
    let speed = 95.2;
    let lat = 12.4;

    if (command === "certificates") {
      targetStatus = "SEARCHING CREDENTIALS";
      speed = 108.4;
      lat = 43.1;
    } else if (command === "skills") {
      targetStatus = "ANALYZING SKILLS";
      speed = 120.2;
      lat = 18.5;
    } else if (command === "contact") {
      targetStatus = "COMM MODULE INIT";
      speed = 88.6;
      lat = 24.8;
    } else if (command === "hack") {
      targetStatus = "WARNING";
      speed = 12.4;
      lat = 210.4;
    } else if (command === "clear") {
      targetStatus = "STANDBY";
      speed = 0.0;
      lat = 0.0;
    }

    setMetrics(prev => ({
      ...prev,
      status: targetStatus,
      tokensPerSec: speed,
      latency: lat
    }));

    if (command !== "clear") {
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          status: "STANDBY"
        }));
      }, 3500);
    }
  });

  const textColors: Record<string, string> = {
    green: "text-emerald-400",
    cyan: "text-cyan-400",
    purple: "text-fuchsia-400",
    amber: "text-amber-400",
    red: "text-red-400 animate-pulse",
    white: "text-zinc-300"
  };

  const activeColor = textColors[themeColor] || textColors.cyan;

  return (
    <div className="w-full h-full flex flex-col font-mono text-[9px] select-none p-3 gap-3.5 bg-zinc-950/20">
      {/* HUD Info */}
      <div className="flex justify-between items-center text-zinc-500 border-b border-white/5 pb-1.5 uppercase text-[8px] tracking-wider shrink-0">
        <span>AI Coprocessor Diagnostic</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span>Active Session</span>
        </span>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <div className="bg-black/35 border border-white/5 rounded p-2 flex flex-col justify-center">
          <span className="text-[7.5px] text-zinc-500 uppercase tracking-wider">Inference Speed</span>
          <span className={`text-sm font-bold mt-0.5 ${activeColor}`}>{metrics.tokensPerSec} T/S</span>
        </div>

        <div className="bg-black/35 border border-white/5 rounded p-2 flex flex-col justify-center">
          <span className="text-[7.5px] text-zinc-500 uppercase tracking-wider">Model Status</span>
          <span className="text-xs font-bold mt-0.5 text-zinc-300 tracking-widest">{metrics.status}</span>
        </div>

        <div className="bg-black/35 border border-white/5 rounded p-2 flex flex-col justify-center">
          <span className="text-[7.5px] text-zinc-500 uppercase tracking-wider">GPU VRAM LOAD</span>
          <span className="text-xs font-bold mt-0.5 text-zinc-300">{metrics.gpuMemory} GB / 24.0 GB</span>
        </div>

        <div className="bg-black/35 border border-white/5 rounded p-2 flex flex-col justify-center">
          <span className="text-[7.5px] text-zinc-500 uppercase tracking-wider">Response Latency</span>
          <span className={`text-xs font-bold mt-0.5 ${activeColor}`}>{metrics.latency} MS</span>
        </div>
      </div>

      {/* Footer cumulative status */}
      <div className="flex justify-between items-center text-zinc-500 text-[8px] uppercase tracking-wider border-t border-white/5 pt-1.5 shrink-0">
        <span>Cumulative Tokens</span>
        <span className="font-bold text-zinc-300">{metrics.totalTokens.toLocaleString()}</span>
      </div>
    </div>
  );
}
