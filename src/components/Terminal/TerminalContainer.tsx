"use client";

import { useEffect, useRef } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { BootSequence } from "./BootSequence";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { MatrixRain } from "../Effects/MatrixRain";
import { SecretEnding } from "./SecretEnding";
import { Volume2, VolumeX, Terminal } from "lucide-react";

interface TerminalContainerProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMinimized?: boolean;
  onSystemCrash?: () => void;
  onSystemRecovery?: () => void;
  onStateChange?: (state: { 
    userState: string; 
    secretSequenceLength: number;
    dimension: string;
    isMelting: boolean;
    isTornadoActive: boolean;
    isSandboxActive: boolean;
    theme?: string;
  }) => void;
  onHeaderPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  theme?: string;
  setTheme?: (theme: string) => void;
}

export function TerminalContainer({
  onClose,
  onMinimize,
  onMaximize,
  isMinimized = false,
  onSystemCrash,
  onSystemRecovery,
  onStateChange,
  onHeaderPointerDown,
  theme: propTheme,
  setTheme: propSetTheme
}: TerminalContainerProps) {
  const terminalData = useTerminal({
    onSystemCrash,
    onSystemRecovery
  });

  const theme = propTheme !== undefined ? propTheme : terminalData.theme;
  const setTheme = propSetTheme !== undefined ? propSetTheme : terminalData.setTheme;

  const {
    input,
    setInput,
    history,
    currentPath,
    isBooting,
    setIsBooting,
    isMatrixActive,
    setIsMatrixActive,
    isSecretEndingActive,
    setIsSecretEndingActive,
    handleKeyDown,
    commandHistoryCount,
    isMuted,
    toggleMute,
    isGlitched,
    glitchType,
    glitchPrompt,
    triggerGlitchEffect,
    playClick,
    playBeep,
    userState,
    setUserState,
    isGhostTyping,
    isExecuting,
    triggerClear,
    secretSequence,
    dimension,
    isMelting,
    isTornadoActive,
    isSandboxActive
  } = terminalData;

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Report state transitions to the desktop container
  useEffect(() => {
    onStateChange?.({ 
      userState, 
      secretSequenceLength: secretSequence.length,
      dimension,
      isMelting,
      isTornadoActive,
      isSandboxActive,
      theme: terminalData.theme
    });
  }, [userState, secretSequence, dimension, isMelting, isTornadoActive, isSandboxActive, terminalData.theme, onStateChange]);

  // Scroll to bottom on history change
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Keep focus on input and restore after command execution completes
  useEffect(() => {
    const restoreFocus = () => {
      if (!isBooting && !isMatrixActive && !isSecretEndingActive && !isGhostTyping && !isExecuting && !isMinimized) {
        inputRef.current?.focus();
      }
    };

    restoreFocus();

    // Re-focus when switching back to terminal window
    window.addEventListener("focus", restoreFocus);
    return () => {
      window.removeEventListener("focus", restoreFocus);
    };
  }, [isBooting, isMatrixActive, isSecretEndingActive, isGhostTyping, isExecuting, isMinimized]);

  const triggerMobileKey = (key: string) => {
    if (key === "ENTER") {
      if (input.trim()) {
        setInput("");
        const syntheticEvent = {
          key: "Enter",
          preventDefault: () => {}
        } as unknown as React.KeyboardEvent<HTMLInputElement>;
        handleKeyDown(syntheticEvent);
      }
    } else if (key === "TAB") {
      const tabEvent = {
        key: "Tab",
        preventDefault: () => {}
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      handleKeyDown(tabEvent);
    } else if (key === "UP") {
      const upEvent = {
        key: "ArrowUp",
        preventDefault: () => {}
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      handleKeyDown(upEvent);
    } else if (key === "DOWN") {
      const downEvent = {
        key: "ArrowDown",
        preventDefault: () => {}
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      handleKeyDown(downEvent);
    } else if (key === "ESC") {
      setIsMatrixActive(false);
      setIsSecretEndingActive(false);
      playBeep(440, 0.1, false);
    } else if (key === "CLR") {
      triggerClear();
      playBeep(440, 0.1, false);
    }
  };

  // Dynamically set glitch classes
  let glitchClass = "";
  if (isGlitched) {
    if (glitchType === "flicker") glitchClass = "crt-flicker screen-glitch-flicker";
    if (glitchType === "static") glitchClass = "glitch-scanlines";
    if (glitchType === "invert") glitchClass = "screen-glitch-flicker invert";
  }

  const username = isGlitched ? "unknown" : userState;
  const hostname = isGlitched 
    ? "system" 
    : userState === "guest" 
    ? "unknown-machine" 
    : userState === "charan" 
    ? "portfolio" 
    : "charan-system";

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black text-[var(--term-fg)] crt-container z-[9999]" data-theme={theme}>
        <div className="scanlines" />
        <div className="crt-bezel" />
        <BootSequence onComplete={() => setIsBooting(false)} />
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-full flex flex-col overflow-hidden relative select-none dimension-window text-[var(--term-fg)] transition-all duration-300 ${glitchClass}`}
      data-theme={theme}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Background scanline filters */}
      <div className="scanlines z-10 pointer-events-none" />
      
      {/* Matrix rain and Secret ending overlays */}
      {isMatrixActive && <MatrixRain onClose={() => setIsMatrixActive(false)} />}
      {isSecretEndingActive && <SecretEnding onClose={() => setIsSecretEndingActive(false)} />}

      {/* macOS Traffic Lights Header */}
      {dimension === "1995" ? (
        /* Windows 95 Title Bar */
        <div 
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button")) return;
            onHeaderPointerDown?.(e);
          }}
          className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between select-none shrink-0 font-sans cursor-grab active:cursor-grabbing text-xs border-b border-[#808080]"
        >
          <span className="font-bold flex items-center gap-1.5 pl-1 select-none">
            💻 Terminal — {username}@{hostname}
          </span>
          <div className="flex items-center space-x-1 select-none">
            <button 
              onClick={(e) => { e.stopPropagation(); playBeep(330, 0.1, false); onMinimize?.(); }}
              className="w-[18px] h-[16px] bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-zinc-700 border-b-zinc-700 font-bold text-[10px] flex items-center justify-center cursor-pointer active:border-t-zinc-700 active:border-l-zinc-700 active:border-r-white active:border-b-white pb-0.5"
            >
              _
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); playBeep(440, 0.1, false); onMaximize?.(); }}
              className="w-[18px] h-[16px] bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-zinc-700 border-b-zinc-700 font-bold text-[9px] flex items-center justify-center cursor-pointer active:border-t-zinc-700 active:border-l-zinc-700 active:border-r-white active:border-b-white"
            >
              ■
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); playBeep(220, 0.1, false); onClose?.(); }}
              className="w-[18px] h-[16px] bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-zinc-700 border-b-zinc-700 font-bold text-[10px] flex items-center justify-center cursor-pointer active:border-t-zinc-700 active:border-l-zinc-700 active:border-r-white active:border-b-white"
            >
              ✕
            </button>
          </div>
        </div>
      ) : dimension === "1984" ? (
        /* Mac System 1 Title Bar */
        <div 
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".close-box")) return;
            onHeaderPointerDown?.(e);
          }}
          className="bg-white border-b-2 border-black h-8 flex items-center relative select-none shrink-0 font-mono cursor-grab active:cursor-grabbing text-black text-sm"
        >
          {/* Flat Close Box on Left */}
          <div 
            onClick={(e) => { e.stopPropagation(); playBeep(220, 0.1, false); onClose?.(); }}
            className="close-box w-3.5 h-3.5 border border-black bg-white absolute left-3 hover:bg-black cursor-pointer"
          />
          {/* Horizontal Grip Bars */}
          <div className="flex-1 flex flex-col gap-0.5 px-10 h-3 justify-center select-none pointer-events-none opacity-40">
            <div className="h-[1px] bg-black w-full" />
            <div className="h-[1px] bg-black w-full" />
            <div className="h-[1px] bg-black w-full" />
            <div className="h-[1px] bg-black w-full" />
          </div>
          {/* Title centered */}
          <div className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-bold select-none text-[12px]">
            Terminal
          </div>
        </div>
      ) : (
        /* Default macOS style header (for 2026 and 2099) */
        <div 
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest("input")) return;
            onHeaderPointerDown?.(e);
          }}
          className={`px-4 py-3 flex items-center justify-between border-b select-none shrink-0 font-sans cursor-grab active:cursor-grabbing ${
            dimension === "2099" 
              ? "bg-red-950/90 text-red-500 border-b-red-500/20" 
              : "bg-[#18181b]/95 text-zinc-300 border-b-white/5"
          }`}
        >
          <div className="flex-1 flex items-center gap-2 cursor-default">
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => { e.stopPropagation(); playBeep(220, 0.1, false); onClose?.(); }}
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] flex items-center justify-center text-[7px] text-red-900/60 font-bold hover:after:content-['✕'] active:opacity-85 cursor-pointer"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); playBeep(330, 0.1, false); onMinimize?.(); }}
                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] flex items-center justify-center text-[7px] text-yellow-900/60 font-bold hover:after:content-['─'] active:opacity-85 cursor-pointer"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); playBeep(440, 0.1, false); onMaximize?.(); }}
                className="w-3.5 h-3.5 rounded-full bg-[#27c93f] flex items-center justify-center text-[7px] text-green-900/60 font-bold hover:after:content-['⤢'] active:opacity-85 cursor-pointer"
              />
            </div>
          </div>
          <span className="text-xs font-medium select-none flex items-center">
            <Terminal className="w-3.5 h-3.5 text-zinc-500 mr-2" />
            Terminal — {username}@{hostname}
          </span>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700 text-zinc-400 uppercase tracking-widest text-[9px]">
              {theme} mode
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
                playBeep(isMuted ? 880 : 440, 0.05);
              }}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded hover:bg-zinc-800 cursor-pointer"
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.3)]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[var(--term-fg)] drop-shadow-[0_0_4px_var(--term-glow)]" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Viewport */}
      <section className="flex-1 overflow-y-auto p-4 pr-3 terminal-scrollbar select-text min-h-0">
        <div className="w-full">
          {/* Welcome Header */}
          <div className="mb-6 font-mono text-sm leading-relaxed select-none opacity-80 border-b border-zinc-800/40 pb-4">
            <p className="text-lg font-bold text-[var(--term-fg)] drop-shadow-[0_0_8px_var(--term-glow)] mb-1">
              SYSTEM HOST LOGGED: UNKNOWN NODE
            </p>
            <p>Type <span className="text-[var(--term-fg)] font-bold bg-[var(--term-dim)]/20 px-1 py-0.5 rounded">help</span> to scan available instructions.</p>
            <p className="text-xs text-[var(--term-dim)] mt-1">Terminal connection: SECURED // Shell history count: {commandHistoryCount}</p>
          </div>

          {/* Historical command feed */}
          <TerminalOutput history={history} />

          {/* Active prompt row */}
          <TerminalInput
            input={input}
            setInput={setInput}
            onKeyDown={handleKeyDown}
            currentPath={currentPath}
            glitchPrompt={glitchPrompt}
            inputRef={inputRef}
            disabled={isGhostTyping || isExecuting}
            userState={userState}
          />
          <div ref={terminalEndRef} />
        </div>
      </section>

      {/* Footer Virtual Keys */}
      <footer className="border-t border-zinc-800 bg-[#0c0c0e]/95 px-4 py-3 select-none flex flex-col sm:flex-row items-center justify-between font-mono text-[9px] text-[var(--term-dim)] gap-3 shrink-0">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span>GRID LINK: STABLE // OPERATOR ACTIVE</span>
        </div>

        {/* Virtual Quick Keys */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("CLR"); }}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-500 active:text-black border border-zinc-700 rounded transition-colors cursor-pointer"
          >
            CLR
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("UP"); }}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-500 active:text-black border border-zinc-700 rounded transition-colors cursor-pointer"
          >
            ▲
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("DOWN"); }}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-500 active:text-black border border-zinc-700 rounded transition-colors cursor-pointer"
          >
            ▼
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("TAB"); }}
            className="px-3.5 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-500 active:text-black border border-zinc-700 rounded transition-colors cursor-pointer"
          >
            TAB
          </button>
          {(isMatrixActive || isSecretEndingActive) && (
            <button
              onClick={(e) => { e.stopPropagation(); triggerMobileKey("ESC"); }}
              className="px-2.5 py-1 bg-red-950/20 active:bg-red-500 active:text-black border border-red-500/30 text-red-400 rounded transition-colors cursor-pointer"
            >
              ESC
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("ENTER"); }}
            className="px-3.5 py-1 bg-cyan-950/30 active:bg-cyan-400 active:text-black border border-cyan-400 text-cyan-400 font-bold rounded transition-colors cursor-pointer"
          >
            RUN
          </button>
        </div>
      </footer>
    </div>
  );
}
