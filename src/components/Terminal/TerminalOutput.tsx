"use client";

import { HistoryItem } from "@/lib/types";
import { useState, useEffect } from "react";

interface TerminalOutputProps {
  history: HistoryItem[];
}

const asciiLines = [
  " ██████╗██╗  ██╗ █████╗ ██████╗  █████╗ ███╗   ██╗",
  "██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗████╗  ██║",
  "██║     ███████║███████║██████╔╝███████║██╔██╗ ██║",
  "██║     ██╔══██║██╔══██║██╔══██╗██╔══██║██║╚██╗██║",
  "╚██████╗██║  ██║██║  ██║██║  ██║██║  ██║██║ ╚████║",
  " ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝"
];

function NeofetchRenderer() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= asciiLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 items-start py-2 select-text font-mono text-sm leading-relaxed max-w-full overflow-hidden">
      {/* Left Side: Animated ASCII logo */}
      <pre className="text-white font-bold shrink-0 overflow-x-auto text-[10px] sm:text-xs leading-tight">
        {asciiLines.slice(0, visibleLines).join("\n")}
      </pre>

      {/* Right Side: Information */}
      <div className="mt-4 lg:mt-0 flex-1 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-6 space-y-1 text-inherit w-full">
        <div className="text-zinc-500">--------------------------------</div>
        <div><span className="text-[var(--term-fg)] font-bold">Name</span>        : Charan B S</div>
        <div><span className="text-[var(--term-fg)] font-bold">Role</span>        : Offensive Security & Penetration Testing</div>
        <div><span className="text-[var(--term-fg)] font-bold">Location</span>    : Hassan, India</div>
        <div><span className="text-[var(--term-fg)] font-bold">OS</span>          : Charan OS v3.1</div>
        <div><span className="text-[var(--term-fg)] font-bold">Focus</span>       : Web App Security, Pentesting, Network Defense</div>
        <div><span className="text-[var(--term-fg)] font-bold">Toolkit</span>     : Burp Suite, Nmap, Wireshark, Metasploit</div>
        <div><span className="text-[var(--term-fg)] font-bold">Languages</span>   : Python, Bash, Go, JavaScript, C</div>
        <div><span className="text-[var(--term-fg)] font-bold">GitHub</span>      : github.com/charanbs18</div>
        <div><span className="text-[var(--term-fg)] font-bold">Status</span>      : <span className="text-green-400 font-bold animate-pulse">Online</span></div>
        <div className="text-zinc-500">--------------------------------</div>
      </div>
    </div>
  );
}

function PikachuRenderer() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev + 1) % 2);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const frame1 = [
    "       /\\_/\\        ",
    "      ( o.o )       ⚡ Pika! ⚡",
    "       > ^ <        ",
    "     /  | |  \\      ",
    "    (   | |   )     ",
    "     `--■■--■■-'      "
  ].join("\n");

  const frame2 = [
    "       /\\_/\\  ⚡     ",
    "  ⚡  ( >.< )       ⚡ PIKACHU! ⚡",
    "       > ^ <        ",
    "     /  | |  \\      ",
    "    (   | |   )     ",
    "     `--██--██-'      "
  ].join("\n");

  const ansiArt = frame === 0 ? frame1 : frame2;

  return (
    <div className="py-2 text-yellow-400 font-mono text-sm select-none leading-tight border border-yellow-500/20 bg-yellow-500/5 p-4 rounded max-w-sm">
      <pre className="whitespace-pre">{ansiArt}</pre>
      <div className="mt-2 text-xs text-yellow-500/70 text-center animate-pulse">
        [ SECRET PIKACHU BLOCK INJECTED ]
      </div>
    </div>
  );
}

export function TerminalOutput({ history }: TerminalOutputProps) {
  // Parse simple console ANSI color escapes into React styled spans
  const parseAnsiColors = (text: string) => {
    if (!text) return "";
    const parts = text.split(/\x1b\[/);
    if (parts.length === 1) return text;

    return parts.map((part, index) => {
      if (index === 0) return part;

      const match = part.match(/^([0-9;]+)m([\s\S]*)$/);
      if (!match) return part;

      const code = match[1];
      const content = match[2];

      let className = "";
      if (code === "32") {
        className = "text-[var(--term-fg)]";
      } else if (code === "1;36" || code === "36") {
        className = "text-cyan-400 font-bold drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]";
      } else if (code === "31") {
        className = "text-red-500 font-bold animate-pulse";
      } else if (code === "0") {
        className = "text-[var(--term-fg)]";
      }

      return (
        <span key={index} className={className}>
          {content}
        </span>
      );
    });
  };

  return (
    <div className="space-y-4">
      {history.map((item, idx) => (
        <div key={idx} className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-text">
          {/* Command Prompt Line */}
          {item.command !== undefined && (() => {
            const username = item.isGlitch ? "unknown" : (item.userState || "guest");
            const hostname = item.isGlitch 
              ? "system" 
              : username === "guest" 
              ? "unknown-machine" 
              : username === "charan" 
              ? "portfolio" 
              : "charan-system";
            return (
              <div className="flex items-center space-x-1.5 opacity-90 select-none">
                <span className="text-[var(--term-fg)] font-bold">
                  {username}@{hostname}
                </span>
                <span className="text-zinc-500">:</span>
                <span className="text-zinc-300 font-bold">{item.dir || "~"}</span>
                <span className="text-white font-bold">$</span>
                <span className="text-white ml-1 font-semibold">{item.command}</span>
              </div>
            );
          })()}

          {/* Command Output */}
          {(item.output || item.type === "neofetch" || item.type === "pikachu") && (
            <div className="mt-1 text-[var(--term-fg)] opacity-95 pl-2 border-l border-dashed border-[var(--term-dim)]/20 py-0.5">
              {item.type === "neofetch" ? (
                <NeofetchRenderer />
              ) : item.type === "pikachu" ? (
                <PikachuRenderer />
              ) : (
                parseAnsiColors(item.output)
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
