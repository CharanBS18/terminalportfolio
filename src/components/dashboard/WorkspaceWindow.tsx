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

  // Accents strictly styled to matches: #00FF8C (green), #00FFD0 (cyan), #93FFB6 (mint), #D2FFF0 (light)
  const accentBorderColors: Record<string, string> = {
    green: "border-[#00FF8C]/30 hover:border-[#00FF8C]/60 shadow-[0_0_12px_rgba(0,255,140,0.1)]",
    cyan: "border-[#00FFD0]/30 hover:border-[#00FFD0]/60 shadow-[0_0_12px_rgba(0,255,208,0.1)]",
    purple: "border-[#93FFB6]/30 hover:border-[#93FFB6]/60 shadow-[0_0_12px_rgba(147,255,182,0.1)]",
    amber: "border-amber-500/35 hover:border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.1)]",
    red: "border-red-500/40 hover:border-red-500/70 shadow-[0_0_12px_rgba(239,68,68,0.12)]",
    white: "border-[#D2FFF0]/25 hover:border-[#D2FFF0]/55 shadow-[0_0_12px_rgba(210,255,240,0.08)]",
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
    // Classified military terminal style: sharp corners, dark slate bg, scratched reflection glass
    containerStyles = `rounded-md backdrop-blur-md bg-[#050505]/90 border font-mono ${borderClass} signal-glitch-anim`;
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
      className={`absolute select-none overflow-hidden flex flex-col pointer-events-auto ${containerStyles} ${animationClass} ${
        isMaximized 
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
        /* Military Classified style Header bar */
        <div
          onPointerDown={handlePointerDown}
          className="bg-[#0A0A0A]/95 border-b border-[#00FF8C]/15 px-4 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing text-zinc-300 text-xs select-none shrink-0 z-20"
        >
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-2.5 h-2.5 rounded-full bg-red-600/60 hover:bg-red-500 border border-red-950 flex items-center justify-center text-[6px] text-red-100 font-bold active:opacity-85 cursor-pointer relative"
              aria-label="Close"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-2.5 h-2.5 rounded-full bg-amber-600/60 hover:bg-amber-500 border border-amber-950 flex items-center justify-center text-[6px] text-amber-100 font-bold active:opacity-85 cursor-pointer relative"
              aria-label="Minimize"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-2.5 h-2.5 rounded-full bg-emerald-600/60 hover:bg-emerald-500 border border-emerald-950 flex items-center justify-center text-[6px] text-green-100 font-bold active:opacity-85 cursor-pointer relative"
              aria-label="Maximize"
            />
          </div>

          <span className="font-extrabold flex items-center tracking-wider text-[9px] uppercase opacity-85 select-none font-mono truncate px-4">
            {icon && <span className="mr-1.5 text-zinc-500 select-none shrink-0">{icon}</span>}
            {title}
          </span>

          <div className="flex items-center space-x-1 shrink-0">
            <span className="w-1 h-1 rounded-full bg-[#00FF8C] animate-ping" />
          </div>
        </div>
      )}

      {/* Widget Container Content */}
      <div className={`flex-1 overflow-auto select-none flex flex-col z-20 ${
        dimension === "1995" 
          ? "bg-black text-[#00FF8C] border-t border-l border-zinc-800" 
          : dimension === "1984" 
          ? "bg-black text-white p-1 border-t-2 border-white" 
          : "bg-black/60"
      }`}>
        {children}
      </div>
    </motion.div>
  );
}
