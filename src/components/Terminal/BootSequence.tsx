"use client";

import { useEffect, useState, useRef } from "react";
import { useAudio } from "@/hooks/useAudio";

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  "eDEX-UI v3.1 // BOOTSTRAP INITIALIZATION",
  "Loading Cybernetic Kernel...",
  " [OK] Core scheduler operational // x86_64 architecture",
  "Checking System Memory...",
  " [OK] RAM allocation verified // 16384 MB OK",
  "Initializing Secure Shell Subsystem...",
  "  -> Link status: SECURED [PORT: 22 // AES-256-GCM]",
  "Establishing Geospatial Telemetry Grid...",
  "  -> Coordinates locked // 12.9716° N, 77.5946° E",
  "Decrypting Operator Profile: Charan B S...",
  "  [████████████████████] 100% (Success)",
  "Authorizing Session...",
  "  -> Level-5 root credentials approved.",
  "Welcome Operator. eDEX-UI Workstation Online.",
  "Type \"help\" to display available commands."
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const { playClick, playBeep, playDiskAccess, playBuzzer } = useAudio();

  const onCompleteRef = useRef(onComplete);
  const playClickRef = useRef(playClick);
  const playBeepRef = useRef(playBeep);
  const playDiskAccessRef = useRef(playDiskAccess);
  const playBuzzerRef = useRef(playBuzzer);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    playClickRef.current = playClick;
    playBeepRef.current = playBeep;
    playDiskAccessRef.current = playDiskAccess;
    playBuzzerRef.current = playBuzzer;
  });

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootLines.length) {
        const line = bootLines[index];
        setLogs(prev => [...prev, line]);
        
        // Contextual audio effects
        if (index === 0) {
          playBeepRef.current(520, 0.2);
        } else if (line.startsWith("WARNING")) {
          playBuzzerRef.current();
        } else if (line.includes("Loading") || line.includes("Checking")) {
          playDiskAccessRef.current();
        } else {
          playClickRef.current();
        }
        
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onCompleteRef.current();
        }, 800);
      }
    }, 90 + Math.random() * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-sm leading-relaxed p-4 select-none min-h-screen flex flex-col justify-center items-center edex-grid-bg">
      <div className="edex-panel p-6 max-w-2xl w-full border border-cyan-500/35 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative">
        <span className="edex-bracket-tl" />
        <span className="edex-bracket-tr" />
        <span className="edex-bracket-bl" />
        <span className="edex-bracket-br" />

        <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20 text-[10px]">
          <span className="font-bold tracking-widest text-cyan-300 flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_6px_#00f0ff]" />
            [ SYSTEM_INITIALIZATION // DIAGNOSTIC_BOOT ]
          </span>
          <span className="text-cyan-400/70">ARCH: x86_64</span>
        </div>

        <div className="space-y-1.5 max-h-[380px] overflow-hidden">
          {logs.map((log, idx) => {
            let styleClass = "text-cyan-100 opacity-90";
            if (log.startsWith("WARNING") || log.includes("BLOCK")) {
              styleClass = "text-red-400 font-bold animate-pulse drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]";
            } else if (log.includes("[OK]") || log.includes("(Success)")) {
              styleClass = "text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]";
            } else if (log.includes("Operator") || log.includes("eDEX-UI")) {
              styleClass = "text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]";
            } else if (log.includes("Level-5") || log.includes("SECURED")) {
              styleClass = "text-sky-300 font-bold";
            }

            return (
              <div key={idx} className={`${styleClass} text-xs font-mono tracking-tight`}>
                {log}
              </div>
            );
          })}
          {logs.length < bootLines.length && (
            <div className="text-cyan-400 animate-pulse inline-block ml-1">
              █
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
