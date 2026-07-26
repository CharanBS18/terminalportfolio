"use client";

import { useEffect, useState, useRef } from "react";
import { useAudio } from "@/hooks/useAudio";

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  "Loading Kernel...",
  " [OK] Core scheduler operational",
  "Checking Memory...",
  " [OK] RAM allocation verified",
  "Initializing Secure Shell...",
  "  -> link status: SECURE [PORT: 22]",
  "Decrypting Credentials...",
  "  [████████████████████] 100% (Success)",
  "Authorizing Session...",
  "  -> Level-5 credentials approved.",
  "Welcome Operator.",
  "Type \"help\" to display available options."
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
        } else if (line.includes("Loading kernel") || line.includes("Mounting")) {
          playDiskAccessRef.current();
        } else {
          playClickRef.current();
        }
        
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onCompleteRef.current();
        }, 900);
      }
    }, 110 + Math.random() * 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-sm leading-relaxed p-4 select-none min-h-screen flex flex-col justify-end pb-12">
      <div className="max-w-4xl mx-auto w-full space-y-1">
        {logs.map((log, idx) => {
          let styleClass = "text-[var(--term-fg)] opacity-85";
          if (log.startsWith("WARNING") || log.includes("BLOCK")) {
            styleClass = "text-red-500 font-bold animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]";
          } else if (log.includes("[OK]") || log.includes("[MOUNTED]")) {
            styleClass = "text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]";
          } else if (log.includes("Guest") || log.includes("visitor")) {
            styleClass = "text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]";
          } else if (log.includes("DEV-OS")) {
            styleClass = "text-white font-bold drop-shadow-[0_0_8px_var(--term-glow)]";
          }

          return (
            <div key={idx} className={styleClass}>
              {log}
            </div>
          );
        })}
        {logs.length < bootLines.length && (
          <div className="text-[var(--term-fg)] animate-pulse inline-block ml-1">
            █
          </div>
        )}
      </div>
    </div>
  );
}
