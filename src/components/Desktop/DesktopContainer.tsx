"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TerminalContainer } from "../Terminal/TerminalContainer";
import { EDexKeyboardDeck } from "../dashboard/EDexKeyboardDeck";
import { EDexSystemPanel } from "../dashboard/EDexSystemPanel";
import { EDexFilesystemPanel } from "../dashboard/EDexFilesystemPanel";
import { EDexNetworkPanel } from "../dashboard/EDexNetworkPanel";
import { MeltdownEffect } from "../Effects/MeltdownEffect";
import { FutureEnvironment2099 } from "./FutureEnvironment2099";
import { ClassicDesktopContainer } from "./ClassicDesktopContainer";
import { useAudio } from "@/hooks/useAudio";
import { Terminal, Activity, Folder, Globe } from "lucide-react";

export function DesktopContainer() {
  const [workspaceTheme, setWorkspaceTheme] = useState("blade");
  const [dimension, setDimension] = useState("edex");
  const [isMelting, setIsMelting] = useState(false);
  const [isTornadoActive, setIsTornadoActive] = useState(false);
  const [isSandboxActive, setIsSandboxActive] = useState(false);

  // Mobile navigation tab: "terminal" | "system" | "files" | "network"
  const [mobileTab, setMobileTab] = useState<"terminal" | "system" | "files" | "network">("terminal");
  const [isMobile, setIsMobile] = useState(false);

  const { playClick } = useAudio();

  // Screen resize detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "blade");
  }, []);

  // Handle Dimension and State Transitions
  const handleStateChange = useCallback(
    (state: {
      userState: string;
      secretSequenceLength: number;
      dimension: string;
      isMelting: boolean;
      isTornadoActive: boolean;
      isSandboxActive: boolean;
      theme?: string;
    }) => {
      if (state.dimension && state.dimension !== dimension) {
        setDimension(state.dimension);
      }
      if (state.isMelting !== undefined && state.isMelting !== isMelting) {
        setIsMelting(state.isMelting);
      }
      if (state.isTornadoActive !== undefined && state.isTornadoActive !== isTornadoActive) {
        setIsTornadoActive(state.isTornadoActive);
      }
      if (state.isSandboxActive !== undefined && state.isSandboxActive !== isSandboxActive) {
        setIsSandboxActive(state.isSandboxActive);
      }
    },
    [dimension, isMelting, isTornadoActive, isSandboxActive]
  );

  // Dispatch custom commands to terminal
  const executeTerminalCommand = useCallback((cmd: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("edex-command", {
          detail: { command: cmd },
        })
      );
    }
  }, []);

  // Mobile Quick Action Chips
  const quickActions = [
    { label: "HELP", cmd: "help" },
    { label: "ABOUT", cmd: "about" },
    { label: "PROJECTS", cmd: "projects" },
    { label: "SKILLS", cmd: "skills" },
    { label: "EXP", cmd: "experience" },
    { label: "CERTS", cmd: "certificates" },
    { label: "CONTACT", cmd: "contact" },
    { label: "MATRIX", cmd: "matrix" },
    { label: "CLEAR", cmd: "clear" },
  ];

  // Render 2099 Cyberpunk Future overlay if triggered
  if (dimension === "2099") {
    return <FutureEnvironment2099 isGlitching={false} />;
  }

  // Roll back to oldest/classic desktop design for computing dimensions (1984, 1995, 2026, etc.)
  if (dimension !== "edex") {
    return (
      <ClassicDesktopContainer 
        initialDimension={dimension} 
        onDimensionChange={(dim) => setDimension(dim)} 
      />
    );
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col bg-black text-[#e4e4e7] select-none relative font-mono text-xs"
      data-theme="blade"
    >
      {/* Background Orthographic Grid & Subtle Scanlines */}
      <div className="absolute inset-0 edex-grid-bg pointer-events-none z-0" />
      <div className="scanlines fixed inset-0 pointer-events-none z-40 opacity-10" />

      {/* Mobile Tab Switcher (<1024px) */}
      {isMobile && (
        <header className="bg-[#0a0a0f] border-b border-white/10 p-1 flex items-center justify-around text-[10px] z-20 shrink-0 font-mono">
          <button
            onClick={() => {
              playClick();
              setMobileTab("terminal");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              mobileTab === "terminal"
                ? "bg-white/15 text-white border border-white/25 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Terminal className="w-3 h-3" /> TERMINAL
          </button>
          <button
            onClick={() => {
              playClick();
              setMobileTab("system");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              mobileTab === "system"
                ? "bg-white/15 text-white border border-white/25 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Activity className="w-3 h-3" /> SYSTEM
          </button>
          <button
            onClick={() => {
              playClick();
              setMobileTab("files");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              mobileTab === "files"
                ? "bg-white/15 text-white border border-white/25 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Folder className="w-3 h-3" /> FILES
          </button>
          <button
            onClick={() => {
              playClick();
              setMobileTab("network");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              mobileTab === "network"
                ? "bg-white/15 text-white border border-white/25 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Globe className="w-3 h-3" /> NETWORK
          </button>
        </header>
      )}

      {/* Main Cockpit Layout Matching Reference 1, 2, and 3 Exactly */}
      <main className="flex-1 p-2 overflow-hidden relative z-10 min-h-0 bg-black">
        {!isMobile ? (
          /* DESKTOP 3-COLUMN LAYOUT */
          <div className="grid grid-cols-12 gap-2 h-full min-h-0">
            {/* COLUMN 1: LEFT SIDEBAR (System Panel ~58% + Filesystem ~42%) */}
            <div className="col-span-3 h-full flex flex-col gap-2 min-h-0">
              {/* Top: System Panel */}
              <div className="h-[58%] min-h-0">
                <EDexSystemPanel className="w-full h-full" />
              </div>

              {/* Bottom: Filesystem Panel */}
              <div className="h-[42%] min-h-0">
                <EDexFilesystemPanel
                  onExecuteCommand={executeTerminalCommand}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* COLUMN 2: CENTER MAIN (Terminal ~60% + Virtual Keyboard Deck ~40%) */}
            <div className="col-span-6 h-full flex flex-col gap-2 min-h-0">
              {/* Top: Terminal Container */}
              <div className="h-[60%] min-h-0 edex-panel relative overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="flex-1 min-h-0">
                  <TerminalContainer onStateChange={handleStateChange} />
                </div>
              </div>

              {/* Bottom: Virtual Keyboard Deck */}
              <div className="h-[40%] min-h-0">
                <EDexKeyboardDeck
                  onExecuteCommand={executeTerminalCommand}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* COLUMN 3: RIGHT SIDEBAR (Network Panel 100%) */}
            <div className="col-span-3 h-full min-h-0">
              <EDexNetworkPanel className="w-full h-full" />
            </div>
          </div>
        ) : (
          /* MOBILE TABBED LAYOUT (<1024px) */
          <div className="h-full flex flex-col min-h-0">
            {mobileTab === "terminal" && (
              <div className="flex-1 flex flex-col gap-2 min-h-0">
                <div className="flex-1 min-h-0 edex-panel relative overflow-hidden flex flex-col">
                  <span className="edex-bracket-tl" />
                  <span className="edex-bracket-tr" />
                  <span className="edex-bracket-bl" />
                  <span className="edex-bracket-br" />
                  <TerminalContainer onStateChange={handleStateChange} />
                </div>

                {/* Mobile Quick Action Chips */}
                <div className="bg-[#0a0a0f] border border-white/10 p-1.5 flex gap-1.5 overflow-x-auto edex-scrollbar shrink-0">
                  {quickActions.map((act) => (
                    <button
                      key={act.label}
                      onClick={() => {
                        playClick();
                        executeTerminalCommand(act.cmd);
                      }}
                      className="px-2.5 py-1 rounded-xs bg-zinc-900 border border-white/10 text-[9px] font-bold text-zinc-300 hover:text-white shrink-0 cursor-pointer"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mobileTab === "system" && (
              <div className="flex-1 min-h-0 overflow-y-auto edex-scrollbar">
                <EDexSystemPanel className="w-full h-full min-h-[500px]" />
              </div>
            )}

            {mobileTab === "files" && (
              <div className="flex-1 min-h-0 overflow-y-auto edex-scrollbar">
                <EDexFilesystemPanel
                  onExecuteCommand={executeTerminalCommand}
                  className="w-full h-full min-h-[400px]"
                />
              </div>
            )}

            {mobileTab === "network" && (
              <div className="flex-1 min-h-0 overflow-y-auto edex-scrollbar">
                <EDexNetworkPanel className="w-full h-full min-h-[500px]" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Meltdown Visual FX Easter Egg */}
      {isMelting && <MeltdownEffect onClose={() => setIsMelting(false)} />}
    </div>
  );
}
