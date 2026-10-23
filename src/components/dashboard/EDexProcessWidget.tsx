"use client";

import React, { useState, useEffect } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";
import { Activity, ShieldCheck } from "lucide-react";

interface ProcessItem {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  status: "RUN" | "SLEEP" | "IDLE";
}

const initialProcesses: ProcessItem[] = [
  { pid: 1042, name: "edex-ui", cpu: 14.2, mem: 4.8, status: "RUN" },
  { pid: 1089, name: "zsh (tty1)", cpu: 2.1, mem: 1.2, status: "RUN" },
  { pid: 1420, name: "node-server", cpu: 3.4, mem: 3.6, status: "RUN" },
  { pid: 2044, name: "charan-vfs", cpu: 1.8, mem: 2.4, status: "RUN" },
  { pid: 3102, name: "globe-render", cpu: 8.4, mem: 3.1, status: "RUN" },
  { pid: 4012, name: "sec-audit", cpu: 0.6, mem: 1.8, status: "SLEEP" },
  { pid: 5120, name: "packet-mon", cpu: 3.2, mem: 1.9, status: "RUN" },
  { pid: 6814, name: "audio-synth", cpu: 0.4, mem: 0.9, status: "SLEEP" },
];

export function EDexProcessWidget({ className = "" }: { className?: string }) {
  const [processes, setProcesses] = useState<ProcessItem[]>(initialProcesses);
  const [activePid, setActivePid] = useState<number | null>(null);

  // Background fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => {
          if (p.status === "SLEEP") return p;
          const delta = (Math.random() - 0.5) * 3;
          return {
            ...p,
            cpu: parseFloat(Math.max(0.5, Math.min(65, p.cpu + delta)).toFixed(1)),
            mem: parseFloat(Math.max(0.8, Math.min(12, p.mem + (Math.random() - 0.5) * 0.1)).toFixed(1)),
          };
        })
      );
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // React to terminal commands
  useTerminalEvent((detail) => {
    const cmd = (detail.command || "").toLowerCase();
    if (["projects", "skills", "certificates", "hack", "sudo", "neofetch"].includes(cmd)) {
      setProcesses((prev) =>
        prev.map((p) => {
          if (p.name.includes("zsh") || p.name.includes("edex")) {
            return { ...p, cpu: parseFloat((75 + Math.random() * 20).toFixed(1)), status: "RUN" };
          }
          return p;
        })
      );
      setTimeout(() => {
        setProcesses(initialProcesses);
      }, 3500);
    }
  });

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
            [ PROCESS_MANAGER // ACTIVE_TASKS ]
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[9px] text-cyan-400/80">
          <span>{processes.length} PROCS</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5" /> STABLE
          </span>
        </div>
      </div>

      {/* Table Column Headers */}
      <div className="grid grid-cols-12 bg-black/50 border-b border-cyan-500/15 px-2 py-1 text-[8px] font-bold text-cyan-400/80 tracking-wider shrink-0 uppercase">
        <span className="col-span-3">PID</span>
        <span className="col-span-5">PROCESS</span>
        <span className="col-span-2 text-right">CPU%</span>
        <span className="col-span-2 text-right">STAT</span>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto edex-scrollbar p-1 min-h-0 space-y-0.5 text-[9px]">
        {processes.map((p) => {
          const isSelected = activePid === p.pid;
          const isHigh = p.cpu > 50;

          return (
            <div
              key={p.pid}
              onClick={() => setActivePid(p.pid)}
              className={`grid grid-cols-12 px-2 py-1 rounded-xs transition-colors cursor-pointer items-center ${
                isSelected
                  ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/40"
                  : "hover:bg-cyan-500/10 text-zinc-300"
              }`}
            >
              <span className="col-span-3 text-[8px] text-zinc-500 font-mono">
                {p.pid}
              </span>
              <span className="col-span-5 text-cyan-200 font-bold truncate">
                {p.name}
              </span>
              <span className={`col-span-2 text-right font-mono ${isHigh ? "text-red-400 font-bold" : "text-cyan-300"}`}>
                {p.cpu}%
              </span>
              <span className="col-span-2 text-right">
                <span
                  className={`px-1 py-0.2 rounded-xs text-[7px] uppercase border font-bold ${
                    p.status === "RUN"
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/30"
                      : "border-zinc-700 text-zinc-400 bg-zinc-900/30"
                  }`}
                >
                  {p.status}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-[#030914] border-t border-cyan-500/15 px-2.5 py-0.5 flex items-center justify-between text-[8px] text-zinc-500 shrink-0">
        <span>MEM TOTAL: 16 GB</span>
        <span className="text-cyan-400/80">SCHEDULER: FIFO</span>
      </div>
    </div>
  );
}
