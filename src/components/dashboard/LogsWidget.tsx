"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

const logPool = [
  "Node connected",
  "Heartbeat received",
  "Satellite synchronized",
  "Packet dropped",
  "Authentication refreshed",
  "DNS cache updated",
  "Repository mirrored",
  "Neural model initialized",
  "Signal uplink secured // 98% quality",
  "Memory block encrypted",
  "Sensor sweep completed // no anomalies",
  "Operator bypass approved"
];

export function LogsWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING DIAGNOSTIC SUITE...",
    "establish connection to main node...",
    "SECURE SSH TUNNEL SOLVED.",
    "monitoring network activity..."
  ]);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useTerminalEvent((detail: { command: string; timestamp: string }) => {
    const { command, timestamp } = detail;
    let customLogs: string[] = [];

    switch (command) {
      case "certificates":
        customLogs = [
          "Certificate request received",
          "Filesystem mounted",
          "Verification complete",
          "Archive generated",
          "Transmission finished"
        ];
        break;
      case "projects":
        customLogs = [
          "Repository indexed",
          "Building dependencies",
          "Scanning modules",
          "Build complete"
        ];
        break;
      case "skills":
        customLogs = [
          "Accessing skill matrix database...",
          "Mapping technology proficiencies...",
          "Skill index rendering complete."
        ];
        break;
      case "about":
        customLogs = [
          "Loading identity...",
          "Resolving operator fingerprint...",
          "Fingerprint match: CHARAN"
        ];
        break;
      case "experience":
        customLogs = [
          "Employment records loaded.",
          "Historical timelines reconstructed."
        ];
        break;
      case "contact":
        customLogs = [
          "Initiating secure handshake...",
          "Uplink tunnels secured.",
          "vCard package generated."
        ];
        break;
      case "github":
        customLogs = [
          "Authenticated with GitHub.",
          "Fetching remote repositories...",
          "Local branch mirrored."
        ];
        break;
      case "hack":
        customLogs = [
          "WARNING: Threat monitor anomaly detected!",
          "Sandbox isolation protocol active.",
          "Scanning local interface for intrusions..."
        ];
        break;
      case "clear":
        setLogs([]);
        return;
      case "sudo":
        customLogs = [
          "Privilege escalation request detected.",
          "Operator authorized: ROOT LEVEL ACCESS GRANTED."
        ];
        break;
      default:
        customLogs = [`Subsystem instruction parsed: ${command.toUpperCase()}`];
    }

    setLogs((prev) => {
      const next = [...prev];
      customLogs.forEach(log => {
        next.push(`[${timestamp}] ${log}`);
      });
      if (next.length > 50) return next.slice(-50);
      return next;
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev];
        const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
        const timestamp = new Date().toLocaleTimeString();
        next.push(`[${timestamp}] ${randomLog}`);

        if (next.length > 50) next.shift(); // keep last 50 logs
        return next;
      });
    }, 7000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const textColors: Record<string, string> = {
    green: "text-emerald-400 drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]",
    cyan: "text-cyan-400 drop-shadow-[0_0_3px_rgba(6,182,212,0.3)]",
    purple: "text-fuchsia-400 drop-shadow-[0_0_3px_rgba(217,70,239,0.3)]",
    amber: "text-amber-400 drop-shadow-[0_0_3px_rgba(245,158,11,0.3)]",
    red: "text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)] animate-pulse",
    white: "text-zinc-300"
  };

  const textColor = textColors[themeColor] || textColors.cyan;

  return (
    <div className="w-full h-full font-mono text-[9px] leading-relaxed p-3 bg-black/45 overflow-y-auto select-text scrollbar-thin scrollbar-thumb-zinc-800">
      <div className="space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className={`${textColor} flex gap-1.5`}>
            <span className="opacity-45 select-none shrink-0">&gt;&gt;</span>
            <span>{log}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
