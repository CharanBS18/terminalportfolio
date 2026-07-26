"use client";

import React from "react";
import { GlobePulse } from "../ui/component";

interface SatelliteWidgetProps {
  themeColor?: string;
}

export function SatelliteWidget({ themeColor = "green" }: SatelliteWidgetProps) {
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
      className="w-full h-full relative overflow-hidden bg-black/40 flex flex-col font-mono"
      style={{ color }}
    >
      {/* Globe Canvas Pulse Viewport */}
      <div className="flex-1 min-h-0 relative">
        <GlobePulse themeColor={themeColor} />
      </div>
    </div>
  );
}
export default SatelliteWidget;
