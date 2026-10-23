"use client";

import React, { RefObject, useState, useEffect } from "react";

interface TerminalInputProps {
  input: string;
  setInput: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currentPath: string[];
  glitchPrompt: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  userState: "guest" | "visitor" | "developer" | "root" | "charan";
}

export function TerminalInput({
  input,
  setInput,
  onKeyDown,
  currentPath,
  glitchPrompt,
  inputRef,
  disabled = false,
  userState
}: TerminalInputProps) {
  const [selectionIndex, setSelectionIndex] = useState(input.length);

  // Keep selectionIndex in sync when input changes externally (e.g. backspace, clear)
  useEffect(() => {
    if (inputRef.current) {
      setSelectionIndex(inputRef.current.selectionStart ?? input.length);
    } else {
      setSelectionIndex(input.length);
    }
  }, [input, inputRef]);

  // Format directory display: replace /home/charan with ~
  let dirStr = "";
  if (currentPath.length >= 2 && currentPath[0] === "home" && currentPath[1] === "charan") {
    const subPath = currentPath.slice(2);
    dirStr = subPath.length === 0 ? "~" : "~/" + subPath.join("/");
  } else {
    dirStr = "/" + currentPath.join("/");
  }
  
  const username = glitchPrompt ? "unknown" : userState;
  const hostname = glitchPrompt 
    ? "system" 
    : userState === "guest" 
    ? "unknown-machine" 
    : userState === "charan" 
    ? "portfolio" 
    : "charan-system";

  // Split input based on visual caret position
  const caretPos = Math.max(0, Math.min(input.length, selectionIndex));
  const before = input.slice(0, caretPos);
  const after = input.slice(caretPos);

  return (
    <div className="flex items-center space-x-1.5 font-mono text-sm leading-relaxed mt-2 select-none relative">
      {/* Prompt Prefix */}
      <span className={`font-bold transition-colors duration-200 font-mono tracking-tight ${
        glitchPrompt ? 'text-red-500 animate-pulse' : 'text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.35)]'
      }`}>
        {username}@{hostname}
      </span>
      <span className="text-cyan-600/80">:</span>
      <span className="text-sky-300 font-bold transition-all drop-shadow-[0_0_4px_rgba(56,189,248,0.25)]">{dirStr}</span>
      <span className="text-cyan-400 font-bold drop-shadow-[0_0_6px_rgba(0,240,255,0.4)] mr-1">$</span>

      {/* Hidden input taking up cursor focus */}
      <div className="flex-1 relative flex items-center min-w-[100px] font-semibold break-all whitespace-pre-wrap text-cyan-100 font-mono">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSelectionIndex(e.target.selectionStart ?? e.target.value.length);
          }}
          onKeyDown={onKeyDown}
          onSelect={(e) => {
            setSelectionIndex(e.currentTarget.selectionStart ?? e.currentTarget.value.length);
          }}
          className="absolute inset-0 opacity-0 cursor-default focus:outline-none w-full h-full z-10"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={disabled}
        />
        
        {/* Render text before the cursor */}
        <span className="text-cyan-50 selection:bg-cyan-500/30 selection:text-white">{before}</span>
        
        {/* eDEX-UI Glowing Block Cursor */}
        <span className="inline-block w-2 h-4 bg-cyan-400 shadow-[0_0_8px_#00f0ff] align-middle shrink-0 select-none mx-[0.5px] animate-[blink_1s_infinite] opacity-90" />

        {/* Render text after the cursor */}
        <span className="text-cyan-50 selection:bg-cyan-500/30 selection:text-white">{after}</span>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
