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
      
      {/* eDEX-UI Corner Brackets */}
      {dimension !== "1984" && dimension !== "1995" && (
        <>
          <span className="edex-bracket-tl" />
          <span className="edex-bracket-tr" />
          <span className="edex-bracket-bl" />
          <span className="edex-bracket-br" />
        </>
      )}

      {/* Matrix rain and Secret ending overlays */}
      {isMatrixActive && <MatrixRain onClose={() => setIsMatrixActive(false)} />}
      {isSecretEndingActive && <SecretEnding onClose={() => setIsSecretEndingActive(false)} />}

      {/* macOS / Dimension / eDEX-UI Header */}
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
        /* eDEX-UI High-Tech HUD Terminal Header */
        <div 
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest("input")) return;
            onHeaderPointerDown?.(e);
          }}
          className={`px-3 py-2 flex items-center justify-between border-b select-none shrink-0 font-mono cursor-grab active:cursor-grabbing ${
            dimension === "2099" 
              ? "bg-red-950/90 text-red-500 border-b-red-500/30" 
              : "bg-[#040e1f]/95 text-cyan-200 border-b-cyan-500/25"
          }`}
        >
          <div className="flex items-center gap-2 cursor-default min-w-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_6px_#00f0ff] shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-cyan-100 uppercase truncate">
              [ TTY-01 // CHARAN_SHELL ]
            </span>
            <span className="hidden md:inline text-[9px] text-cyan-400/70 border-l border-cyan-500/20 pl-2">
              {username}@{hostname}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2 py-0.5 rounded-xs bg-cyan-950/40 border border-cyan-500/20 text-[9px] text-cyan-300 tracking-wider">
            <span>LINK: SECURE</span>
            <span className="text-zinc-600">//</span>
            <span>PORT: 22</span>
            <span className="text-zinc-600">//</span>
            <span>ENCRYPT: AES-256</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="hidden sm:inline bg-cyan-950/40 px-2 py-0.5 rounded-xs border border-cyan-500/30 text-cyan-300 uppercase tracking-widest text-[9px] font-bold">
              [{theme}]
            </span>

            {/* Audio Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
                playBeep(isMuted ? 880 : 440, 0.05);
              }}
              className="text-cyan-400/80 hover:text-cyan-100 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400/60 p-1 rounded-xs transition-colors cursor-pointer"
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.3)]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(0,240,255,0.4)]" />
              )}
            </button>

            {/* eDEX Terminal Action Controls */}
            <div className="flex items-center space-x-1 pl-1 border-l border-cyan-500/20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playBeep(440, 0.05);
                  triggerClear();
                }}
                className="px-1.5 py-0.5 text-[8px] font-mono text-cyan-400/80 hover:text-cyan-100 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 rounded-xs transition-colors cursor-pointer"
                title="Clear terminal buffer"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Viewport */}
      <section className="flex-1 overflow-y-auto p-4 pr-3 edex-scrollbar select-text min-h-0 bg-[#020713]/90">
        <div className="w-full">
          {/* eDEX-UI Welcome Header Card */}
          <div className="mb-5 font-mono text-xs leading-relaxed select-none border border-cyan-500/25 bg-cyan-950/20 p-3 rounded-xs relative">
            <span className="edex-bracket-tl" />
            <span className="edex-bracket-br" />
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-500/20 text-[10px]">
              <span className="text-cyan-300 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                eDEX-UI // SECURE SHELL v3.1 [HOST: PORTFOLIO]
              </span>
              <span className="text-cyan-400/70 hidden sm:inline">AUTH: LEVEL-5 ROOT // SESSION: TTY-1</span>
            </div>
            <p className="text-cyan-100 font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.4)] text-sm mb-1">
              CHARAN B S — OFFENSIVE SECURITY & PENETRATION TESTING
            </p>
            <p className="text-cyan-300/90 text-xs">
              Type <span className="text-cyan-200 font-bold bg-cyan-500/20 px-1 py-0.5 rounded border border-cyan-400/40">help</span> to scan available instructions, or run <span className="text-cyan-200 font-bold bg-cyan-500/20 px-1 py-0.5 rounded border border-cyan-400/40">projects</span>, <span className="text-cyan-200 font-bold bg-cyan-500/20 px-1 py-0.5 rounded border border-cyan-400/40">skills</span>, <span className="text-cyan-200 font-bold bg-cyan-500/20 px-1 py-0.5 rounded border border-cyan-400/40">contact</span>.
            </p>
            <div className="flex items-center justify-between text-[10px] text-cyan-400/60 mt-2 pt-1 border-t border-cyan-500/10">
              <span>LINK: SECURE [AES-256]</span>
              <span>SHELL HIST: {commandHistoryCount} COMMANDS</span>
            </div>
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
      <footer className="border-t border-cyan-500/20 bg-[#030916]/95 px-3 py-2 select-none flex flex-col sm:flex-row items-center justify-between font-mono text-[9px] text-cyan-300/80 gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse drop-shadow-[0_0_4px_#34d399]" />
          <span className="font-semibold tracking-wider text-cyan-200">GRID LINK: STABLE // OPERATOR ACTIVE</span>
        </div>

        {/* Virtual Quick Keys */}
        <div className="flex flex-wrap items-center justify-center gap-1 w-full sm:w-auto">
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("CLR"); }}
            className="px-2.5 py-0.5 bg-cyan-950/30 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xs transition-colors cursor-pointer font-bold"
          >
            CLR
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("UP"); }}
            className="px-2 py-0.5 bg-cyan-950/30 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xs transition-colors cursor-pointer"
          >
            ▲
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("DOWN"); }}
            className="px-2 py-0.5 bg-cyan-950/30 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xs transition-colors cursor-pointer"
          >
            ▼
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("TAB"); }}
            className="px-3 py-0.5 bg-cyan-950/30 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xs transition-colors cursor-pointer font-bold"
          >
            TAB
          </button>
          {(isMatrixActive || isSecretEndingActive) && (
            <button
              onClick={(e) => { e.stopPropagation(); triggerMobileKey("ESC"); }}
              className="px-2.5 py-0.5 bg-red-950/30 hover:bg-red-500/30 text-red-400 hover:text-red-100 border border-red-500/40 rounded-xs transition-colors cursor-pointer font-bold"
            >
              ESC
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); triggerMobileKey("ENTER"); }}
            className="px-3.5 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 hover:text-white border border-cyan-400 font-bold rounded-xs transition-colors cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.3)]"
          >
            RUN
          </button>
        </div>
      </footer>
    </div>
  );
}
