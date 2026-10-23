"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Terminal, Activity, Cpu, Wifi } from "lucide-react";

interface EDexKeyboardDeckProps {
  onKeyPress?: (key: string) => void;
  onExecuteCommand?: (cmd: string) => void;
  className?: string;
  themeColor?: string;
}

export function EDexKeyboardDeck({
  onKeyPress,
  onExecuteCommand,
  className = "",
  themeColor = "cyan"
}: EDexKeyboardDeckProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKeyPressed, setLastKeyPressed] = useState<string>("READY");

  // Simulated CPU micro telemetry for flanking bars
  const [cpuLoads, setCpuLoads] = useState([28, 42, 19, 64]);
  const [netRx, setNetRx] = useState(1.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoads([
        Math.floor(15 + Math.random() * 55),
        Math.floor(20 + Math.random() * 60),
        Math.floor(10 + Math.random() * 50),
        Math.floor(30 + Math.random() * 65),
      ]);
      setNetRx(parseFloat((1.1 + Math.random() * 2.2).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code.toUpperCase();
      const key = e.key.toUpperCase();
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(code);
        next.add(key);
        return next;
      });
      setLastKeyPressed(e.key.length === 1 ? e.key.toUpperCase() : e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code.toUpperCase();
      const key = e.key.toUpperCase();
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(code);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleKeyClick = useCallback((label: string, value: string, isCommand = false) => {
    setLastKeyPressed(label);
    
    // Quick visual flash
    setPressedKeys(prev => new Set(prev).add(label.toUpperCase()));
    setTimeout(() => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(label.toUpperCase());
        return next;
      });
    }, 150);

    if (isCommand) {
      if (onExecuteCommand) {
        onExecuteCommand(value);
      } else if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("edex-command", {
            detail: { command: value }
          })
        );
      }
      return;
    }

    if (onKeyPress) {
      onKeyPress(value);
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("edex-key", {
          detail: { key: value }
        })
      );
    }
  }, [onKeyPress, onExecuteCommand]);

  const isPressed = (keyId: string) => pressedKeys.has(keyId.toUpperCase());

  const quickCommands = [
    { label: "HELP", cmd: "help" },
    { label: "ABOUT", cmd: "about" },
    { label: "PROJECTS", cmd: "projects" },
    { label: "SKILLS", cmd: "skills" },
    { label: "EXP", cmd: "experience" },
    { label: "CONTACT", cmd: "contact" },
    { label: "WHOAMI", cmd: "whoami" },
    { label: "CLEAR", cmd: "clear" },
    { label: "MATRIX", cmd: "matrix" },
  ];

  const row1 = [
    { label: "`", val: "`", code: "Backquote" },
    { label: "1", val: "1", code: "Digit1" },
    { label: "2", val: "2", code: "Digit2" },
    { label: "3", val: "3", code: "Digit3" },
    { label: "4", val: "4", code: "Digit4" },
    { label: "5", val: "5", code: "Digit5" },
    { label: "6", val: "6", code: "Digit6" },
    { label: "7", val: "7", code: "Digit7" },
    { label: "8", val: "8", code: "Digit8" },
    { label: "9", val: "9", code: "Digit9" },
    { label: "0", val: "0", code: "Digit0" },
    { label: "-", val: "-", code: "Minus" },
    { label: "=", val: "=", code: "Equal" },
    { label: "BKSP", val: "BACKSPACE", code: "Backspace", width: "col-span-2" },
  ];

  const row2 = [
    { label: "TAB", val: "TAB", code: "Tab", width: "col-span-2" },
    { label: "Q", val: "q", code: "KeyQ" },
    { label: "W", val: "w", code: "KeyW" },
    { label: "E", val: "e", code: "KeyE" },
    { label: "R", val: "r", code: "KeyR" },
    { label: "T", val: "t", code: "KeyT" },
    { label: "Y", val: "y", code: "KeyY" },
    { label: "U", val: "u", code: "KeyU" },
    { label: "I", val: "i", code: "KeyI" },
    { label: "O", val: "o", code: "KeyO" },
    { label: "P", val: "p", code: "KeyP" },
    { label: "[", val: "[", code: "BracketLeft" },
    { label: "]", val: "]", code: "BracketRight" },
    { label: "\\", val: "\\", code: "Backslash" },
  ];

  const row3 = [
    { label: "CAPS", val: "CAPS", code: "CapsLock", width: "col-span-2" },
    { label: "A", val: "a", code: "KeyA" },
    { label: "S", val: "s", code: "KeyS" },
    { label: "D", val: "d", code: "KeyD" },
    { label: "F", val: "f", code: "KeyF" },
    { label: "G", val: "g", code: "KeyG" },
    { label: "H", val: "h", code: "KeyH" },
    { label: "J", val: "j", code: "KeyJ" },
    { label: "K", val: "k", code: "KeyK" },
    { label: "L", val: "l", code: "KeyL" },
    { label: ";", val: ";", code: "Semicolon" },
    { label: "'", val: "'", code: "Quote" },
    { label: "ENTER", val: "ENTER", code: "Enter", width: "col-span-2", isAccent: true },
  ];

  const row4 = [
    { label: "SHIFT", val: "SHIFT", code: "ShiftLeft", width: "col-span-2" },
    { label: "Z", val: "z", code: "KeyZ" },
    { label: "X", val: "x", code: "KeyX" },
    { label: "C", val: "c", code: "KeyC" },
    { label: "V", val: "v", code: "KeyV" },
    { label: "B", val: "b", code: "KeyB" },
    { label: "N", val: "n", code: "KeyN" },
    { label: "M", val: "m", code: "KeyM" },
    { label: ",", val: ",", code: "Comma" },
    { label: ".", val: ".", code: "Period" },
    { label: "/", val: "/", code: "Slash" },
    { label: "▲", val: "ArrowUp", code: "ArrowUp" },
    { label: "SHIFT", val: "SHIFT", code: "ShiftRight", width: "col-span-2" },
  ];

  const row5 = [
    { label: "CTRL", val: "CTRL", code: "ControlLeft" },
    { label: "ALT", val: "ALT", code: "AltLeft" },
    { label: "SPACE", val: " ", code: "Space", width: "col-span-7" },
    { label: "ALT", val: "ALT", code: "AltRight" },
    { label: "◄", val: "ArrowLeft", code: "ArrowLeft" },
    { label: "▼", val: "ArrowDown", code: "ArrowDown" },
    { label: "►", val: "ArrowRight", code: "ArrowRight" },
    { label: "RUN", val: "ENTER", code: "Enter", width: "col-span-2", isAction: true },
  ];

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
            [ VIRTUAL_KEYBOARD // HARDWARE_HUD ]
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[9px] text-cyan-400/80">
          <span className="hidden sm:inline">KEY_BUFFER: <strong className="text-cyan-200">{lastKeyPressed}</strong></span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3 h-3" /> ONLINE
          </span>
        </div>
      </div>

      {/* Main Body: Flanking Telemetry + Center Keyboard Grid */}
      <div className="flex-1 p-2 flex gap-2 min-h-0 overflow-hidden">
        {/* Left Telemetry Strip */}
        <div className="hidden lg:flex flex-col justify-between w-28 shrink-0 bg-black/40 border border-cyan-500/15 p-1.5 rounded-xs text-[9px]">
          <div>
            <div className="flex items-center gap-1 text-cyan-400 font-bold mb-1">
              <Cpu className="w-3 h-3" /> CORE ACTIVITY
            </div>
            <div className="space-y-1">
              {cpuLoads.map((load, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[8px] text-zinc-400">
                    <span>C{idx + 1}</span>
                    <span className="text-cyan-300">{load}%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 overflow-hidden rounded-xs border border-cyan-500/10">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${load}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-1 border-t border-cyan-500/10 text-[8px] text-zinc-500 space-y-0.5">
            <div>IRQ: ACTIVE</div>
            <div>DMA: LOCKED</div>
          </div>
        </div>

        {/* Center Keyboard Deck */}
        <div className="flex-1 flex flex-col justify-between gap-1 min-w-0">
          {/* Quick Command Action Chips */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
            <span className="text-[9px] text-cyan-400/60 font-bold uppercase shrink-0 mr-1">// CMD:</span>
            {quickCommands.map((q) => (
              <button
                key={q.cmd}
                onClick={() => handleKeyClick(q.label, q.cmd, true)}
                className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-950/30 hover:bg-cyan-500/20 text-cyan-400 hover:text-white border border-cyan-500/30 hover:border-cyan-400 rounded-xs transition-all shrink-0 cursor-pointer active:scale-95"
              >
                [{q.label}]
              </button>
            ))}
          </div>

          {/* Row 1 */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
            {row1.map((k) => (
              <button
                key={k.code}
                onClick={() => handleKeyClick(k.label, k.val)}
                className={`edex-key h-6 ${k.width || "col-span-1"} ${
                  isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
            {row2.map((k) => (
              <button
                key={k.code}
                onClick={() => handleKeyClick(k.label, k.val)}
                className={`edex-key h-6 ${k.width || "col-span-1"} ${
                  isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Row 3 */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
            {row3.map((k) => (
              <button
                key={k.code}
                onClick={() => handleKeyClick(k.label, k.val)}
                className={`edex-key h-6 ${k.width || "col-span-1"} ${
                  k.isAccent ? "edex-key-accent" : ""
                } ${isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""}`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Row 4 */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
            {row4.map((k) => (
              <button
                key={k.code}
                onClick={() => handleKeyClick(k.label, k.val)}
                className={`edex-key h-6 ${k.width || "col-span-1"} ${
                  isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Row 5 */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
            {row5.map((k) => (
              <button
                key={k.code}
                onClick={() => handleKeyClick(k.label, k.val)}
                className={`edex-key h-6 ${k.width || "col-span-1"} ${
                  k.isAction ? "edex-key-action font-bold !text-cyan-300" : ""
                } ${isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""}`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Telemetry Strip */}
        <div className="hidden lg:flex flex-col justify-between w-28 shrink-0 bg-black/40 border border-cyan-500/15 p-1.5 rounded-xs text-[9px]">
          <div>
            <div className="flex items-center gap-1 text-cyan-400 font-bold mb-1">
              <Wifi className="w-3 h-3" /> UPLINK // I/O
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] text-zinc-400">
                <span>RX RATE</span>
                <span className="text-cyan-300">{netRx} MB/s</span>
              </div>
              <div className="h-1 bg-zinc-900 overflow-hidden rounded-xs border border-cyan-500/10">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, netRx * 35)}%` }}
                />
              </div>

              <div className="flex justify-between text-[8px] text-zinc-400 pt-1">
                <span>LATENCY</span>
                <span className="text-emerald-400">12ms</span>
              </div>
              <div className="flex justify-between text-[8px] text-zinc-400">
                <span>SECURITY</span>
                <span className="text-cyan-400">AES-256</span>
              </div>
            </div>
          </div>
          <div className="pt-1 border-t border-cyan-500/10 text-[8px] text-zinc-500 space-y-0.5">
            <div>PACKETS: VERIFIED</div>
            <div>STATUS: ENCRYPTED</div>
          </div>
        </div>
      </div>
    </div>
  );
}
