"use client";

import React, { useEffect, useState } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";
import { Cpu, Zap, Thermometer, Fan, HardDrive } from "lucide-react";

interface SystemMonitorWidgetProps {
  themeColor?: string;
  className?: string;
}

export function SystemMonitorWidget({
  themeColor = "cyan",
  className = ""
}: SystemMonitorWidgetProps) {
  const [coreLoads, setCoreLoads] = useState([24, 38, 19, 52]);
  const [ramUsed, setRamUsed] = useState(7.42);
  const [totalRam] = useState(16.0);
  const [swapUsed, setSwapUsed] = useState(1.8);
  const [temp, setTemp] = useState(42);
  const [fanRpm, setFanRpm] = useState(2150);
  const [clockSpeed, setClockSpeed] = useState(3.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoreLoads([
        Math.floor(15 + Math.random() * 45),
        Math.floor(20 + Math.random() * 55),
        Math.floor(10 + Math.random() * 40),
        Math.floor(25 + Math.random() * 60)
      ]);
      setRamUsed(parseFloat((7.1 + Math.random() * 0.8).toFixed(2)));
      setTemp(Math.floor(40 + Math.random() * 6));
      setFanRpm(Math.floor(2100 + Math.random() * 150));
      setClockSpeed(parseFloat((3.6 + Math.random() * 0.4).toFixed(2)));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useTerminalEvent((detail: { command: string }) => {
    const { command } = detail;
    if (["projects", "skills", "certificates", "hack", "sudo", "neofetch"].includes(command)) {
      setCoreLoads([88, 94, 91, 86]);
      setRamUsed(11.2);
      setTemp(68);
      setFanRpm(3800);
      setClockSpeed(4.4);

      setTimeout(() => {
        setCoreLoads([28, 34, 22, 41]);
        setRamUsed(7.42);
        setTemp(44);
        setFanRpm(2200);
        setClockSpeed(3.8);
      }, 3500);
    } else if (command === "clear") {
      setCoreLoads([8, 12, 6, 14]);
      setTemp(37);
      setFanRpm(1800);
    }
  });

  const avgCpu = Math.round(coreLoads.reduce((a, b) => a + b, 0) / coreLoads.length);
  const ramPercent = Math.round((ramUsed / totalRam) * 100);

  // SVG Gauge calculations
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  const renderGauge = (label: string, val: number, sublabel: string, isAlert = false) => {
    const offset = circumference - (val / 100) * circumference;
    return (
      <div className="flex flex-col items-center justify-center font-mono">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="transparent"
              stroke="rgba(0, 240, 255, 0.08)"
              strokeWidth="3"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="transparent"
              stroke={isAlert ? "#ef4444" : "#00f0ff"}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
              style={{
                filter: isAlert
                  ? "drop-shadow(0 0 4px #ef4444)"
                  : "drop-shadow(0 0 4px #00f0ff)"
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-cyan-100 leading-none">
              {val}%
            </span>
          </div>
        </div>
        <span className="text-[8px] text-zinc-400 uppercase mt-0.5 font-bold tracking-wider">
          {label}
        </span>
        <span className="text-[7px] text-cyan-400/70">{sublabel}</span>
      </div>
    );
  };

  return (
    <div className={`edex-panel select-none overflow-hidden flex flex-col font-mono text-zinc-300 ${className}`}>
      {/* Corner Brackets */}
      <span className="edex-bracket-tl" />
      <span className="edex-bracket-tr" />
      <span className="edex-bracket-bl" />
      <span className="edex-bracket-br" />

      {/* Header telemetry strip */}
      <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1 flex items-center justify-between text-[10px] shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_4px_#00f0ff]" />
          <span className="font-bold tracking-widest text-cyan-200 uppercase">
            [ HARDWARE_TELEMETRY // CPU_CORES ]
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[9px] text-cyan-400/80">
          <span>{clockSpeed} GHz</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400 font-bold">{avgCpu}% LOAD</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-2 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden">
        {/* 4 CPU Core Radial Gauges */}
        <div className="grid grid-cols-4 gap-1 bg-black/40 border border-cyan-500/15 p-1 rounded-xs">
          {coreLoads.map((load, idx) =>
            renderGauge(`C${idx + 1}`, load, `${(clockSpeed - 0.05 * idx).toFixed(2)}G`, load > 80)
          )}
        </div>

        {/* RAM & Swap Allocation */}
        <div className="space-y-1 bg-black/30 border border-cyan-500/15 p-1.5 rounded-xs text-[9px]">
          <div className="flex justify-between items-center text-zinc-400 text-[8px]">
            <span className="flex items-center gap-1 text-cyan-300 font-bold">
              <Zap className="w-2.5 h-2.5" /> PHYSICAL RAM
            </span>
            <span>
              <strong className="text-cyan-200">{ramUsed} GB</strong> / {totalRam} GB [{ramPercent}%]
            </span>
          </div>
          <div className="h-1.5 bg-zinc-950 rounded-xs overflow-hidden border border-cyan-500/20">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{
                width: `${ramPercent}%`,
                boxShadow: "0 0 6px rgba(0,240,255,0.6)"
              }}
            />
          </div>

          <div className="flex justify-between items-center text-zinc-500 text-[8px] pt-0.5">
            <span>SWAP PARTITION</span>
            <span>{swapUsed} GB / 8.0 GB [22%]</span>
          </div>
        </div>

        {/* Thermal Sensors & Cooling Fan */}
        <div className="grid grid-cols-2 gap-1.5 text-[8px] shrink-0">
          <div className="flex items-center justify-between px-2 py-1 bg-black/40 border border-cyan-500/15 rounded-xs">
            <span className="flex items-center gap-1 text-zinc-400">
              <Thermometer className="w-2.5 h-2.5 text-cyan-400" /> THERMAL
            </span>
            <span className={`font-bold ${temp > 60 ? "text-red-400 animate-pulse" : "text-cyan-300"}`}>
              {temp}°C {temp > 60 ? "[HOT]" : "[NOM]"}
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1 bg-black/40 border border-cyan-500/15 rounded-xs">
            <span className="flex items-center gap-1 text-zinc-400">
              <Fan className="w-2.5 h-2.5 text-cyan-400 animate-spin" /> COOLING
            </span>
            <span className="text-cyan-300 font-bold">{fanRpm} RPM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
