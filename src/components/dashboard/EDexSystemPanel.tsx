"use client";

import React, { useState, useEffect } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

export function EDexSystemPanel({ className = "" }: { className?: string }) {
  const [clockTime, setClockTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [dateStr, setDateStr] = useState("2026 OCT 23");
  const [uptimeSecs, setUptimeSecs] = useState(14820);
  const [cpuLoads, setCpuLoads] = useState([24, 38]);
  const [temp, setTemp] = useState(48);
  const [ramUsed, setRamUsed] = useState(5.5);
  const totalRam = 16.0;

  const [processes, setProcesses] = useState([
    { pid: 13798, name: "edex-ui", cpu: "8.4%", mem: "2.3%" },
    { pid: 15961, name: "zsh", cpu: "5.1%", mem: "2.8%" },
    { pid: 13775, name: "charan-vfs", cpu: "4.2%", mem: "1.2%" },
    { pid: 15857, name: "node-server", cpu: "1.8%", mem: "0.5%" },
    { pid: 13698, name: "globe-render", cpu: "1.2%", mem: "0.7%" },
    { pid: 11492, name: "packet-mon", cpu: "0.9%", mem: "0.4%" },
  ]);

  // Digital clock loop
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClockTime({
        hours: String(now.getHours()).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
        seconds: String(now.getSeconds()).padStart(2, "0"),
      });
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      setDateStr(`${now.getFullYear()} ${months[now.getMonth()]} ${now.getDate()}`);
      setUptimeSecs((prev) => prev + 1);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoads([
        Math.floor(15 + Math.random() * 45),
        Math.floor(20 + Math.random() * 50),
      ]);
      setTemp(Math.floor(45 + Math.random() * 6));
      setRamUsed(parseFloat((5.2 + Math.random() * 0.8).toFixed(1)));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Terminal commands reactive spikes
  useTerminalEvent((detail) => {
    const cmd = (detail.command || "").toLowerCase();
    if (["projects", "skills", "certificates", "hack", "sudo", "neofetch"].includes(cmd)) {
      setCpuLoads([84, 92]);
      setTemp(68);
      setRamUsed(8.4);
      setProcesses((prev) =>
        prev.map((p, idx) => (idx === 0 || idx === 1 ? { ...p, cpu: "78.4%" } : p))
      );
      setTimeout(() => {
        setCpuLoads([24, 38]);
        setTemp(48);
        setRamUsed(5.5);
        setProcesses([
          { pid: 13798, name: "edex-ui", cpu: "8.4%", mem: "2.3%" },
          { pid: 15961, name: "zsh", cpu: "5.1%", mem: "2.8%" },
          { pid: 13775, name: "charan-vfs", cpu: "4.2%", mem: "1.2%" },
          { pid: 15857, name: "node-server", cpu: "1.8%", mem: "0.5%" },
          { pid: 13698, name: "globe-render", cpu: "1.2%", mem: "0.7%" },
          { pid: 11492, name: "packet-mon", cpu: "0.9%", mem: "0.4%" },
        ]);
      }, 3500);
    }
  });

  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const ramPercent = Math.round((ramUsed / totalRam) * 100);

  return (
    <div className={`edex-panel select-none overflow-hidden flex flex-col font-mono text-zinc-300 ${className}`}>
      {/* Corner Brackets */}
      <span className="edex-bracket-tl" />
      <span className="edex-bracket-tr" />
      <span className="edex-bracket-bl" />
      <span className="edex-bracket-br" />

      {/* Header bar matching eDEX-UI */}
      <div className="bg-[#0e0e13] border-b border-white/10 px-3 py-1 flex items-center justify-between text-[10px] text-zinc-400 font-bold tracking-wider shrink-0 uppercase">
        <span>PANEL</span>
        <span>SYSTEM</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-y-auto edex-scrollbar flex flex-col justify-between gap-2.5 min-h-0 text-[10px]">
        {/* Big Digital Clock */}
        <div>
          <div className="text-3xl font-extrabold tracking-widest text-white leading-none font-mono">
            {clockTime.hours} : {clockTime.minutes} : {clockTime.seconds}
          </div>
          <div className="flex items-center justify-between text-[9px] text-zinc-500 mt-1 uppercase tracking-wide">
            <div>
              <span>{dateStr}</span>
            </div>
            <div>
              <span className="text-zinc-600 mr-1">UPTIME</span>
              <span className="text-zinc-300 font-bold">{formatUptime(uptimeSecs)}</span>
            </div>
            <div>
              <span className="text-zinc-600 mr-1">TYPE</span>
              <span className="text-zinc-300 font-bold">LINUX</span>
            </div>
            <div>
              <span className="text-zinc-600 mr-1">POWER</span>
              <span className="text-zinc-300 font-bold">ON</span>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="border-t border-white/5 pt-1.5 flex justify-between text-[8px] text-zinc-500 uppercase">
          <div>
            <span>MANUFACTURER </span>
            <span className="text-zinc-300 font-bold">APPLE</span>
          </div>
          <div>
            <span>MODEL </span>
            <span className="text-zinc-300 font-bold">MACBOOKPRO</span>
          </div>
          <div>
            <span>CHASSIS </span>
            <span className="text-zinc-300 font-bold">NOTEBOOK</span>
          </div>
        </div>

        {/* CPU Usage Bars */}
        <div className="border-t border-white/5 pt-1.5 space-y-1.5">
          <div className="flex justify-between items-center text-[9px]">
            <span className="text-zinc-400 font-bold uppercase">CPU USAGE</span>
            <span className="text-[8px] text-zinc-500">Apple Silicon M-Series</span>
          </div>

          {/* Core pair 1 */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[8px] text-zinc-500">
              <span>#1 - 4</span>
              <span>Avg. {cpuLoads[0]}%</span>
            </div>
            <div className="h-1 bg-zinc-900 border border-white/10 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${cpuLoads[0]}%` }}
              />
            </div>
          </div>

          {/* Core pair 2 */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[8px] text-zinc-500">
              <span>#5 - 8</span>
              <span>Avg. {cpuLoads[1]}%</span>
            </div>
            <div className="h-1 bg-zinc-900 border border-white/10 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${cpuLoads[1]}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hardware Status Chips */}
        <div className="grid grid-cols-4 gap-1 text-[8px] text-zinc-500 uppercase border-t border-white/5 pt-1.5">
          <div>
            <div>TEMP</div>
            <div className="text-zinc-200 font-bold text-[9px]">{temp}°C</div>
          </div>
          <div>
            <div>MIN</div>
            <div className="text-zinc-200 font-bold text-[9px]">2.4GHz</div>
          </div>
          <div>
            <div>MAX</div>
            <div className="text-zinc-200 font-bold text-[9px]">3.8GHz</div>
          </div>
          <div>
            <div>TASKS</div>
            <div className="text-zinc-200 font-bold text-[9px]">258</div>
          </div>
        </div>

        {/* Memory Bar */}
        <div className="border-t border-white/5 pt-1.5 space-y-1">
          <div className="flex justify-between text-[9px]">
            <span className="text-zinc-400 font-bold uppercase">MEMORY</span>
            <span className="text-[8px] text-zinc-400">
              USING {ramUsed} OUT OF {totalRam} GIB
            </span>
          </div>
          <div className="h-1.5 bg-zinc-900 border border-white/10 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${ramPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-zinc-500">
            <span>SWAP</span>
            <span className="text-zinc-400">0.2 GIB</span>
          </div>
        </div>

        {/* Top Processes Table */}
        <div className="border-t border-white/5 pt-1.5 flex-1 min-h-0 flex flex-col">
          <div className="grid grid-cols-12 text-[8px] text-zinc-500 uppercase pb-1 border-b border-white/5">
            <span className="col-span-3">PID</span>
            <span className="col-span-5">NAME</span>
            <span className="col-span-2 text-right">CPU</span>
            <span className="col-span-2 text-right">MEM</span>
          </div>
          <div className="space-y-0.5 pt-1 flex-1 overflow-y-auto edex-scrollbar">
            {processes.map((p) => (
              <div key={p.pid} className="grid grid-cols-12 text-[8px] text-zinc-400">
                <span className="col-span-3 text-zinc-600">{p.pid}</span>
                <span className="col-span-5 text-zinc-200 truncate font-semibold">{p.name}</span>
                <span className="col-span-2 text-right">{p.cpu}</span>
                <span className="col-span-2 text-right text-zinc-500">{p.mem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clipboard Access Buttons */}
        <div className="border-t border-white/5 pt-1.5 flex items-center justify-between text-[8px]">
          <span className="text-zinc-500 uppercase font-bold">CLIPBOARD ACCESS</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText("charan@portfolio");
                }
              }}
              className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-xs transition-colors cursor-pointer"
            >
              COPY
            </button>
            <button
              onClick={() => {}}
              className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-xs transition-colors cursor-pointer"
            >
              PASTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
