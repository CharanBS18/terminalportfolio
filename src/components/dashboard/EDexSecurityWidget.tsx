"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";
import { Shield, ShieldAlert, Lock, Terminal } from "lucide-react";

interface EDexSecurityWidgetProps {
  themeColor?: string;
  className?: string;
}

export function EDexSecurityWidget({
  themeColor = "cyan",
  className = ""
}: EDexSecurityWidgetProps) {
  const [defconLevel, setDefconLevel] = useState(5);
  const [defconLabel, setDefconLabel] = useState("ALL SYSTEMS NOMINAL");
  const [isAlert, setIsAlert] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "SEC_INIT: Cryptographic subsystem mounted",
    "NET_GUARD: Firewall packet filtering rules active",
    "AUTH_DAEMON: Operator session authenticated (CHARAN)",
    "AUDIT: Zero breach attempts recorded in buffer",
    "LINK_CIPHER: TLS 1.3 / AES-256-GCM validated"
  ]);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Periodic simulated logs
  useEffect(() => {
    const pool = [
      "INTEGRITY: SHA-256 binary validation passed",
      "NET_INSPECT: Port 22 SSH handshake successful",
      "DAEMON: Kernel telemetry stream synchronized",
      "SOCKET_WATCH: Active listener on 0.0.0.0:3000",
      "GEO_SAT: Orbit telemetry signal lock confirmed",
      "SEC_AUDIT: Memory paging checksum verified"
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setLogs((prev) => [...prev.slice(-25), `[${timeStr}] ${randomMsg}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // React to terminal commands
  useTerminalEvent((detail) => {
    const cmd = (detail.command || "").toLowerCase();
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];

    if (cmd === "hack" || cmd === "sudo") {
      setDefconLevel(2);
      setDefconLabel("THREAT_PROTOCOL_ACTIVE");
      setIsAlert(true);
      setLogs((prev) => [
        ...prev,
        `[${timeStr}] ALERT: PRIVILEGE ESCALATION EVENT DETECTED`,
        `[${timeStr}] DEFCON ELEVATED TO LEVEL 2`,
        `[${timeStr}] INTRUSION COUNTERMEASURES ARMED`
      ]);

      setTimeout(() => {
        setDefconLevel(5);
        setDefconLabel("ALL SYSTEMS NOMINAL");
        setIsAlert(false);
        setLogs((prev) => [
          ...prev,
          `[${timeStr}] DEFCON RESTORED TO LEVEL 5: NOMINAL`
        ]);
      }, 5000);
    } else if (cmd === "clear") {
      setLogs([`[${timeStr}] BUFFER CLEARED BY OPERATOR`]);
    } else {
      setLogs((prev) => [
        ...prev.slice(-25),
        `[${timeStr}] EXEC: [${cmd.toUpperCase()}] status: 200 OK`
      ]);
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
          <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? "bg-red-500 animate-ping" : "bg-cyan-400 animate-pulse"} drop-shadow-[0_0_4px_#00f0ff]`} />
          <span className="font-bold tracking-widest text-cyan-200 uppercase">
            [ SECURITY_AUDIT // DEFCON_FEED ]
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[9px]">
          <span className={`font-bold ${isAlert ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
            DEFCON {defconLevel}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-cyan-400/80 flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> AES-256
          </span>
        </div>
      </div>

      {/* DEFCON Status Banner */}
      <div className={`px-2.5 py-1.5 border-b text-[9px] flex items-center justify-between shrink-0 transition-colors ${
        isAlert
          ? "bg-red-950/40 border-red-500/30 text-red-300"
          : "bg-black/40 border-cyan-500/15 text-cyan-300"
      }`}>
        <div className="flex items-center gap-1.5">
          {isAlert ? (
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-bounce shrink-0" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span className="font-bold tracking-wider uppercase text-[8px] truncate">
            {defconLabel}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[8px] font-mono shrink-0">
          <span className="text-zinc-500">FIREWALL:</span>
          <span className="text-emerald-400 font-bold">ARMED</span>
        </div>
      </div>

      {/* Auto-scrolling audit logs */}
      <div className="flex-1 overflow-y-auto edex-scrollbar p-2 min-h-0 space-y-1 font-mono text-[8px] select-text">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`leading-relaxed truncate ${
              log.includes("ALERT") || log.includes("DEFCON 2")
                ? "text-red-400 font-bold bg-red-950/20 px-1 rounded-xs"
                : log.includes("EXEC:")
                ? "text-cyan-200 font-semibold"
                : "text-zinc-400"
            }`}
          >
            {log}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Footer */}
      <div className="bg-[#030914] border-t border-cyan-500/15 px-2.5 py-0.5 flex items-center justify-between text-[8px] text-zinc-500 shrink-0">
        <span>SESSION LOG: LIVE</span>
        <span className="text-cyan-400/80">HASH: SHA-256/OK</span>
      </div>
    </div>
  );
}
