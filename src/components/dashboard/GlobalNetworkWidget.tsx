"use client";

import React from "react";
import { WorldMap } from "../ui/map";

interface GlobalNetworkWidgetProps {
  themeColor?: string;
}

export function GlobalNetworkWidget({ themeColor = "green" }: GlobalNetworkWidgetProps) {
  const dots = [
    {
      start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" },
      end: { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
    },
    {
      start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" },
      end: { lat: -15.7975, lng: -47.8919, label: "Brasília" },
    },
    {
      start: { lat: -15.7975, lng: -47.8919, label: "Brasília" },
      end: { lat: 38.7223, lng: -9.1393, label: "Lisbon" },
    },
    {
      start: { lat: 51.5074, lng: -0.1278, label: "London" },
      end: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
    },
    {
      start: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
      end: { lat: 43.1332, lng: 131.9113, label: "Vladivostok" },
    },
    {
      start: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
      end: { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
    },
  ];

  const themeColors: Record<string, string> = {
    green: "#00FF8C",
    cyan: "#00FFD0",
    purple: "#a855f7",
    amber: "#f59e0b",
    red: "#ef4444",
    white: "#ffffff"
  };
  const color = themeColors[themeColor] || "#00FF8C";

  return (
    <div 
      className="w-full h-full flex font-mono text-[9px] select-none bg-zinc-950/20"
      style={{ color }}
    >
      {/* Side panel */}
      <div 
        className="w-[145px] border-r p-2.5 flex flex-col gap-2 shrink-0 bg-black/40"
        style={{ borderColor: `${color}15` }}
      >
        <div 
          className="border-b pb-1 text-[#D2FFF0] font-bold uppercase tracking-wider"
          style={{ borderColor: `${color}20` }}
        >
          Node Telemetry
        </div>
        
        <div className="space-y-1.5 text-[8.5px]">
          <div className="flex justify-between">
            <span className="opacity-60">ACTIVE NODES:</span>
            <span className="text-[#D2FFF0] font-bold">6</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">ONLINE:</span>
            <span className="text-emerald-400 font-bold">6 / 6</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">LATENCY:</span>
            <span className="font-bold text-[#D2FFF0]">42ms AVG</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">PACKET LOSS:</span>
            <span className="text-[#D2FFF0]">0.00%</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">ENCRYPTION:</span>
            <span className="text-zinc-400 font-bold text-[8px]">AES-256-GCM</span>
          </div>
        </div>

        <div 
          className="border-t pt-1.5 mt-1.5"
          style={{ borderColor: `${color}10` }}
        >
          <span className="text-zinc-500 font-bold block mb-1 uppercase tracking-wider text-[8px]">Routes</span>
          <div className="space-y-1 text-[7.5px] max-h-[85px] overflow-y-auto scrollbar-none text-[#D2FFF0]/80">
            <div className="truncate">Fairbanks ↔ LA</div>
            <div className="truncate">Fairbanks ↔ Brasília</div>
            <div className="truncate">Brasília ↔ Lisbon</div>
            <div className="truncate">London ↔ New Delhi</div>
            <div className="truncate">New Delhi ↔ Vladivostok</div>
            <div className="truncate">New Delhi ↔ Nairobi</div>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 min-w-0 p-2 flex items-center justify-center relative overflow-hidden bg-black/10">
        <WorldMap dots={dots} lineColor={color} />
      </div>
    </div>
  );
}

export default GlobalNetworkWidget;
