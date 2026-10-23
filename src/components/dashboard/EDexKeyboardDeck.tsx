"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAudio } from "@/hooks/useAudio";

interface EDexKeyboardDeckProps {
  onKeyPress?: (key: string) => void;
  onExecuteCommand?: (cmd: string) => void;
  className?: string;
}

export function EDexKeyboardDeck({
  onKeyPress,
  onExecuteCommand,
  className = "",
}: EDexKeyboardDeckProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { playClick, playBeep } = useAudio();

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code.toUpperCase();
      const key = e.key.toUpperCase();
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        next.add(key);
        return next;
      });
      playClick();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code.toUpperCase();
      const key = e.key.toUpperCase();
      setPressedKeys((prev) => {
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
  }, [playClick]);

  const handleKeyClick = useCallback(
    (label: string, value: string, isCommand = false) => {
      playClick();

      // Quick visual flash
      setPressedKeys((prev) => new Set(prev).add(label.toUpperCase()));
      setTimeout(() => {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(label.toUpperCase());
          return next;
        });
      }, 120);

      if (isCommand) {
        if (onExecuteCommand) {
          onExecuteCommand(value);
        } else if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("edex-command", {
              detail: { command: value },
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
            detail: { key: value },
          })
        );
      }
    },
    [onKeyPress, onExecuteCommand, playClick]
  );

  const isPressed = (keyId: string) => pressedKeys.has(keyId.toUpperCase());

  const quickCommands = [
    { label: "HELP", cmd: "help" },
    { label: "ABOUT", cmd: "about" },
    { label: "PROJECTS", cmd: "projects" },
    { label: "SKILLS", cmd: "skills" },
    { label: "EXPERIENCE", cmd: "experience" },
    { label: "CERTIFICATES", cmd: "certificates" },
    { label: "CONTACT", cmd: "contact" },
    { label: "WHOAMI", cmd: "whoami" },
    { label: "CLEAR", cmd: "clear" },
    { label: "MATRIX", cmd: "matrix" },
  ];

  // Authentic eDEX-UI Keyboard rows matching reference 1 & 3
  const row1 = [
    { label: "ESC", val: "Escape", code: "Escape", width: "col-span-1" },
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
    { label: "BACK", val: "BACKSPACE", code: "Backspace", width: "col-span-2" },
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
    { label: "ENTER", val: "ENTER", code: "Enter", width: "col-span-2" },
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
    { label: "SHIFT", val: "SHIFT", code: "ShiftRight", width: "col-span-2" },
    { label: "▲", val: "ArrowUp", code: "ArrowUp" },
  ];

  const row5 = [
    { label: "CTRL", val: "CTRL", code: "ControlLeft", width: "col-span-2" },
    { label: "FN", val: "FN", code: "Fn" },
    { label: "SPACE", val: " ", code: "Space", width: "col-span-7" },
    { label: "ALT GR", val: "ALT", code: "AltRight", width: "col-span-2" },
    { label: "CTRL", val: "CTRL", code: "ControlRight" },
    { label: "◄", val: "ArrowLeft", code: "ArrowLeft" },
    { label: "▼", val: "ArrowDown", code: "ArrowDown" },
    { label: "►", val: "ArrowRight", code: "ArrowRight" },
  ];

  return (
    <div className={`edex-panel select-none overflow-hidden flex flex-col font-mono text-zinc-300 ${className}`}>
      {/* Corner Brackets */}
      <span className="edex-bracket-tl" />
      <span className="edex-bracket-tr" />
      <span className="edex-bracket-bl" />
      <span className="edex-bracket-br" />

      {/* Main Keyboard Grid */}
      <div className="flex-1 p-2 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden bg-black">
        {/* Quick Command Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto edex-scrollbar pb-1 shrink-0">
          <span className="text-[9px] text-zinc-500 font-bold uppercase shrink-0 mr-1">// CMD:</span>
          {quickCommands.map((q) => (
            <button
              key={q.cmd}
              onClick={() => handleKeyClick(q.label, q.cmd, true)}
              className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-white/30 rounded-xs transition-colors shrink-0 cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Row 1 */}
        <div className="grid gap-1 flex-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {row1.map((k) => (
            <button
              key={k.code}
              onClick={() => handleKeyClick(k.label, k.val)}
              className={`edex-key h-full ${k.width || "col-span-1"} ${
                isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid gap-1 flex-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {row2.map((k) => (
            <button
              key={k.code}
              onClick={() => handleKeyClick(k.label, k.val)}
              className={`edex-key h-full ${k.width || "col-span-1"} ${
                isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Row 3 */}
        <div className="grid gap-1 flex-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {row3.map((k) => (
            <button
              key={k.code}
              onClick={() => handleKeyClick(k.label, k.val)}
              className={`edex-key h-full ${k.width || "col-span-1"} ${
                isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Row 4 */}
        <div className="grid gap-1 flex-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {row4.map((k) => (
            <button
              key={k.code}
              onClick={() => handleKeyClick(k.label, k.val)}
              className={`edex-key h-full ${k.width || "col-span-1"} ${
                isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Row 5 */}
        <div className="grid gap-1 flex-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {row5.map((k, i) => (
            <button
              key={`${k.code}-${i}`}
              onClick={() => handleKeyClick(k.label, k.val)}
              className={`edex-key h-full ${k.width || "col-span-1"} ${
                isPressed(k.code) || isPressed(k.label) ? "is-pressed" : ""
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
