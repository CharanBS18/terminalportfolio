"use client";

import React, { useEffect, useState } from "react";

interface MatrixLine {
  address: string;
  bytes: string;
  assembly: string;
  status: string;
}

const instructions = [
  "MOV EAX, EBX",
  "ADD ESP, 0x10",
  "PUSH EBP",
  "CMP ECX, EDX",
  "JE 0x7FFF4B",
  "XOR EAX, EAX",
  "INT 0x80",
  "CALL 0x401020",
  "RET",
  "NOP",
  "SUB ESI, EDI",
  "LEA EAX, [ESP+4]"
];

const statuses = ["OK", "SYS_READ", "CACHED", "JMP", "MUTEX_WAIT", "STACK_PUSH"];

export function MatrixScannerWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const [lines, setLines] = useState<MatrixLine[]>([]);

  const generateLine = (): MatrixLine => {
    const addrHead = "0x" + Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
    const addrTail = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const address = `${addrHead}${addrTail}`;

    const byteArr = Array(6).fill(0).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase());
    const bytes = byteArr.join(" ");

    const assembly = instructions[Math.floor(Math.random() * instructions.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return { address, bytes, assembly, status };
  };

  useEffect(() => {
    const initial = Array(12).fill(0).map(() => generateLine());
    setLines(initial);

    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev];
        next.shift();
        next.push(generateLine());
        return next;
      });
    }, 900 + Math.random() * 400);

    return () => clearInterval(interval);
  }, []);

  const textColors: Record<string, string> = {
    green: "text-emerald-400/90",
    cyan: "text-cyan-400/90",
    purple: "text-fuchsia-400/90",
    amber: "text-amber-400/90",
    red: "text-red-400/90",
    white: "text-zinc-300"
  };

  const statusColors: Record<string, string> = {
    OK: "text-emerald-400 bg-emerald-950/30",
    SYS_READ: "text-cyan-400 bg-cyan-950/30",
    CACHED: "text-zinc-500 bg-zinc-900/30",
    JMP: "text-fuchsia-400 bg-fuchsia-950/30",
    MUTEX_WAIT: "text-amber-500 bg-amber-950/30",
    STACK_PUSH: "text-blue-400 bg-blue-950/30"
  };

  const baseTextColor = textColors[themeColor] || textColors.cyan;

  return (
    <div className="w-full h-full font-mono text-[9px] select-none p-3 bg-black/45 overflow-hidden flex flex-col justify-end">
      <div className="flex justify-between items-center text-zinc-500 mb-2 border-b border-white/5 pb-1 uppercase text-[8px] tracking-wider shrink-0">
        <span>Offset Register Map</span>
        <span>Instr Speed: 8.2 Op/ms</span>
      </div>

      <div className={`flex-1 flex flex-col gap-0.5 justify-end overflow-hidden ${baseTextColor}`}>
        {lines.map((line, idx) => (
          <div key={idx} className="flex justify-between items-center py-[1px] hover:bg-white/5 px-1 rounded transition-colors duration-100 font-semibold select-none leading-none">
            <span className="opacity-45 select-none">{line.address}</span>
            <span className="hidden sm:inline opacity-75 font-normal tracking-wide">{line.bytes}</span>
            <span className="font-bold tracking-wide w-28 text-left truncate">{line.assembly}</span>
            <span className={`px-1 rounded text-[7px] font-bold ${statusColors[line.status] || "text-zinc-400"}`}>
              {line.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
