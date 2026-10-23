"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useDragControls } from "framer-motion";

interface WorkspaceWindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: string;
  accentColor?: string; // 'green' | 'cyan' | 'purple' | 'amber' | 'red' | 'white'
  dimension?: string;    // '1984' | '1995' | '2099' | '2026'
  className?: string;
  zIndex?: number;
  animateDelay?: number;
  initialX?: number;
  initialY?: number;
  onFocus?: () => void;
}

export function WorkspaceWindow({
  id,
  title,
  icon,
  children,
  isOpen,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  defaultPosition = { x: 0, y: 0 },
  defaultSize = "w-96 h-64",
  accentColor = "cyan",
  dimension = "2026",
  className = "",
  zIndex = 20,
  animateDelay = 0,
  initialX = 0,
  initialY = 0,
  onFocus,
}: WorkspaceWindowProps) {
  const dragControls = useDragControls();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setBooted(true);
      }, (animateDelay * 1000) + 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animateDelay]);

  if (!isOpen) return null;

  // Accents strictly styled to eDEX-UI neon tones
  const accentBorderColors: Record<string, string> = {
    cyan: "border-cyan-400/35 hover:border-cyan-400/70 shadow-[0_0_15px_rgba(0,240,255,0.12)]",
    green: "border-emerald-400/35 hover:border-emerald-400/70 shadow-[0_0_15px_rgba(52,211,153,0.12)]",
    purple: "border-purple-400/35 hover:border-purple-400/70 shadow-[0_0_15px_rgba(192,132,252,0.12)]",
    amber: "border-amber-400/35 hover:border-amber-400/70 shadow-[0_0_15px_rgba(251,191,36,0.12)]",
    red: "border-red-400/40 hover:border-red-400/75 shadow-[0_0_15px_rgba(248,113,113,0.15)]",
    white: "border-teal-200/30 hover:border-teal-200/60 shadow-[0_0_15px_rgba(204,251,241,0.1)]",
  };

  const borderClass = accentBorderColors[accentColor] || accentBorderColors.cyan;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onFocus?.();
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input")) return;
    dragControls.start(e);
  };

  // Define dimension specific wrapper styles
  let containerStyles = "";
  if (dimension === "1995") {
    containerStyles = "border-t-2 border-l-2 border-t-zinc-500 border-l-zinc-500 border-b-2 border-r-2 border-b-black border-r-black bg-[#202020] text-white rounded-none font-mono";
  } else if (dimension === "1984") {
    containerStyles = "border-2 border-white bg-black text-white rounded-none outline outline-1 outline-white -outline-offset-[5px] font-mono";
  } else {
    // Authentic panel: precision borders, dark glass, subtle inner glow
    containerStyles = `rounded-sm backdrop-blur-md bg-[#030914]/92 border font-mono ${borderClass}`;
  }

  // Animation delay style
  const animationClass = !booted ? "monitor-warmup-anim" : "";

  return (
    <motion.div
      id={id}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.92, y: 0 }}
      animate={isMinimized ? { scale: 0.1, y: 500, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: animateDelay, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={() => onFocus?.()}
      className={`absolute select-none overflow-hidden flex flex-col pointer-events-auto ${containerStyles} ${animationClass} ${isMaximized
          ? "fixed inset-x-4 top-16 bottom-24 !z-[999] !w-auto !h-auto"
          : `${defaultSize}`
        } ${className}`}
      style={{
        display: isMinimized ? "none" : "flex",
        zIndex: isMaximized ? 999 : zIndex,
        left: defaultPosition.x,
        top: defaultPosition.y,
        // Slide / Warmup delay
        animationDelay: `${animateDelay}s`,
      }}
    >
      {/* eDEX-UI Distinctive Corner Brackets */}
      {dimension !== "1984" && dimension !== "1995" && (
        <>
          <span className="edex-bracket-tl" />
          <span className="edex-bracket-tr" />
          <span className="edex-bracket-bl" />
          <span className="edex-bracket-br" />
        </>
      )}

      {/* Dirty glass, reflection screen overlay */}
      {dimension !== "1984" && dimension !== "1995" && (
        <div className="absolute inset-0 pointer-events-none dirty-glass z-10" />
      )}

      {/* Title Bar */}
      {dimension === "1995" ? (
        /* Windows 95 style title bar */
        <div
          onPointerDown={handlePointerDown}
          className="bg-[#000080] text-white px-2 py-1.5 flex items-center justify-between text-xs font-bold shrink-0 cursor-grab active:cursor-grabbing z-20"
        >
          <span className="flex items-center gap-1.5 pl-1 truncate">
            {icon && <span className="shrink-0">{icon}</span>}
            {title}
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-[18px] h-[16px] bg-[#202020] text-white border border-t-zinc-500 border-l-zinc-500 border-r-black border-b-black font-bold text-[9px] flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-r-zinc-500 active:border-b-zinc-500 pb-0.5"
            >
              _
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-[18px] h-[16px] bg-[#202020] text-white border border-t-zinc-500 border-l-zinc-500 border-r-black border-b-black font-bold text-[8px] flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-r-zinc-500 active:border-b-zinc-500"
            >
              ■
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-[18px] h-[16px] bg-[#202020] text-white border border-t-zinc-500 border-l-zinc-500 border-r-black border-b-black font-bold text-[9px] flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-r-zinc-500 active:border-b-zinc-500"
            >
              ✕
            </button>
          </div>
        </div>
      ) : dimension === "1984" ? (
        /* Mac System 1 style title bar */
        <div
          onPointerDown={handlePointerDown}
          className="bg-black border-b-2 border-white h-8 flex items-center relative text-white text-[12px] shrink-0 cursor-grab active:cursor-grabbing z-20"
        >
          <div
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3.5 h-3.5 border border-white bg-black absolute left-3 hover:bg-white cursor-pointer"
          />
          <div className="flex-1 flex flex-col gap-0.5 px-10 h-3 justify-center select-none pointer-events-none opacity-40">
            <div className="h-[1px] bg-white w-full" />
            <div className="h-[1px] bg-white w-full" />
            <div className="h-[1px] bg-white w-full" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bg-black px-3 font-bold select-none truncate max-w-[150px]">
            {title}
          </div>
        </div>
      ) : (
        /* eDEX-UI Sci-Fi HUD Header Bar */
        <div
          onPointerDown={handlePointerDown}
          className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between cursor-grab active:cursor-grabbing text-zinc-300 text-xs select-none shrink-0 z-20"
        >
          <div className="flex items-center space-x-2 shrink-0 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_4px_#00f0ff]" />
            <span className="text-[9px] font-mono text-cyan-400/75 uppercase tracking-wider hidden sm:inline">
              // [{id.replace(/^window-/, "").toUpperCase()}]
            </span>
          </div>

          <span className="font-bold flex items-center tracking-widest text-[10px] uppercase text-cyan-100 font-mono truncate px-2">
            {icon && <span className="mr-1.5 text-cyan-400 select-none shrink-0">{icon}</span>}
            {title}
          </span>

          {/* eDEX-UI HUD Window Controls */}
          <div className="flex items-center space-x-1 shrink-0 font-mono">
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-5 h-4 flex items-center justify-center text-[9px] text-cyan-400/70 hover:text-cyan-200 border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-cyan-500/10 rounded-xs transition-colors cursor-pointer"
              title="Minimize"
              aria-label="Minimize"
            >
              _
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-5 h-4 flex items-center justify-center text-[8px] text-cyan-400/70 hover:text-cyan-200 border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-cyan-500/10 rounded-xs transition-colors cursor-pointer"
              title="Maximize"
              aria-label="Maximize"
            >
              ▢
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-5 h-4 flex items-center justify-center text-[9px] text-red-400/70 hover:text-red-200 border border-red-500/20 hover:border-red-400/70 hover:bg-red-500/15 rounded-xs transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Widget Container Content */}
      <div className={`flex-1 overflow-auto select-none flex flex-col z-20 edex-scrollbar ${dimension === "1995"
          ? "bg-black text-[#00FF8C] border-t border-l border-zinc-800"
          : dimension === "1984"
            ? "bg-black text-white p-1 border-t-2 border-white"
            : "bg-[#020713]/85"
        }`}>
        {children}
      </div>
    </motion.div>
  );
}
