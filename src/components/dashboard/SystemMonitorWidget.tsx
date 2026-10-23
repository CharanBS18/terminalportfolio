"use client";

import React, { useEffect, useState } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

export function SystemMonitorWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const [stats, setStats] = useState({
    cpu: 28,
    ram: 64,
    gpu: 18,
    disk: 52,
    temp: 42
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        cpu: Math.max(10, Math.min(95, Math.floor(prev.cpu + (Math.random() - 0.5) * 12))),
        ram: Math.max(40, Math.min(90, Math.floor(prev.ram + (Math.random() - 0.5) * 4))),
        gpu: Math.max(5, Math.min(85, Math.floor(prev.gpu + (Math.random() - 0.5) * 10))),
        disk: prev.disk,
        temp: Math.max(35, Math.min(75, Math.floor(prev.temp + (Math.random() - 0.5) * 3)))
      }));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useTerminalEvent((detail: { command: string }) => {
    const { command } = detail;
    let cpuSpike = 35;
    let ramSpike = 3;
    let tempSpike = 4;

    if (command === "certificates" || command === "projects" || command === "hack" || command === "sudo") {
      cpuSpike = 92;
      ramSpike = 12;
      tempSpike = 18;
    } else if (command === "skills" || command === "github" || command === "neofetch" || command === "fastfetch") {
      cpuSpike = 78;
      ramSpike = 8;
      tempSpike = 9;
    } else if (command === "clear") {
      setStats(prev => ({
        ...prev,
        cpu: 10,
        temp: 36
      }));
      return;
    }

    setStats((prev) => ({
      ...prev,
      cpu: cpuSpike,
      ram: Math.min(92, prev.ram + ramSpike),
      temp: Math.min(80, prev.temp + tempSpike)
    }));

    // Return to idle after a few seconds
    setTimeout(() => {
      setStats((prev) => ({
        ...prev,
        cpu: Math.max(15, Math.floor(prev.cpu * 0.35)),
        ram: Math.max(45, prev.ram - ramSpike),
        temp: Math.max(38, prev.temp - tempSpike)
      }));
    }, 3000);
  });

  const themeColors: Record<string, string> = {
    green: "#00FF8C",
    cyan: "#00FFD0",
    purple: "#93FFB6",
    amber: "#F59E0B",
    red: "#EF4444",
    white: "#D2FFF0"
  };

  const activeColor = themeColors[themeColor] || themeColors.cyan;

  // Circle SVG calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  const renderGauge = (title: string, value: number, index: number) => {
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div key={index} className="flex flex-col items-center justify-center font-mono">
        <div className="relative w-16 h-16">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="3.5"
            />
            {/* Active circle */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke={activeColor}
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{
                filter: `drop-shadow(0 0 4px ${activeColor})`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-300">
            {value}%
          </div>
        </div>
        <span className="text-[8px] text-zinc-500 uppercase mt-1 tracking-widest">{title}</span>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-[9px] select-none p-3 gap-3 bg-zinc-950/20">
      {/* Top row: radial gauges */}
      <div className="grid grid-cols-3 gap-2 py-1 bg-black/10 border border-white/5 rounded-lg p-2 justify-around">
        {renderGauge("CPU CORE", stats.cpu, 0)}
        {renderGauge("RAM REGS", stats.ram, 1)}
        {renderGauge("GPU ADPT", stats.gpu, 2)}
      </div>

      {/* Bottom rows: progress bars */}
      <div className="flex-1 flex flex-col gap-2.5 justify-center">
        {/* Disk Usage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[8px] uppercase tracking-wider">System Root Disk Partition</span>
            <span className="font-semibold">{stats.disk}% (240GB / 512GB)</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-900 border border-white/5 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${stats.disk}%`,
                backgroundColor: activeColor,
                boxShadow: `0 0 8px ${activeColor}`
              }}
            />
          </div>
        </div>

        {/* Temp Monitor */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[8px] uppercase tracking-wider">Thermal Heat Sensors</span>
            <span className={`font-semibold ${stats.temp > 65 ? 'text-red-400 animate-pulse' : 'text-zinc-300'}`}>
              {stats.temp}°C {stats.temp > 65 ? "[WARNING]" : "[COOL]"}
            </span>
          </div>
          <div className="w-full h-2.5 bg-zinc-900 border border-white/5 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${stats.temp}%`,
                backgroundColor: stats.temp > 65 ? "#ef4444" : activeColor,
                boxShadow: `0 0 8px ${stats.temp > 65 ? "#ef4444" : activeColor}`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
