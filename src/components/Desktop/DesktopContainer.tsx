"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TerminalContainer } from "../Terminal/TerminalContainer";
import { EDexKeyboardDeck } from "../dashboard/EDexKeyboardDeck";
import { EDexFileSystemWidget } from "../dashboard/EDexFileSystemWidget";
import { EDexProcessWidget } from "../dashboard/EDexProcessWidget";
import { SystemMonitorWidget } from "../dashboard/SystemMonitorWidget";
import { GlobeWidget } from "../dashboard/GlobeWidget";
import { NetworkWidget } from "../dashboard/NetworkWidget";
import { EDexSecurityWidget } from "../dashboard/EDexSecurityWidget";
import { MeltdownEffect } from "../Effects/MeltdownEffect";
import { FutureEnvironment2099 } from "./FutureEnvironment2099";
import { useAudio } from "@/hooks/useAudio";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Terminal,
  Activity,
  Globe,
  Radio,
  Cpu,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";

export function DesktopContainer() {
  // Theme state: defaults to eDEX signature cyan
  const [workspaceTheme, setWorkspaceTheme] = useState("cyan");
  const [dimension, setDimension] = useState("2026");
  const [isMelting, setIsMelting] = useState(false);
  const [isTornadoActive, setIsTornadoActive] = useState(false);
  const [isSandboxActive, setIsSandboxActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time & Uptime counters
  const [timeStr, setTimeStr] = useState("");
  const [uptimeSeconds, setUptimeSeconds] = useState(14820); // ~4 hours initial uptime
  const [systemLoad, setSystemLoad] = useState("0.28 0.34 0.19");

  // Mobile navigation tab: "terminal" | "telemetry" | "network"
  const [mobileTab, setMobileTab] = useState<"terminal" | "telemetry" | "network">("terminal");
  const [isMobile, setIsMobile] = useState(false);

  const { playClick, playBeep, isMuted, toggleMute } = useAudio();

  // Screen resize detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync theme with data-theme on container / html
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", workspaceTheme);
  }, [workspaceTheme]);

  // Digital Clock and Uptime Loop
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const mins = String(now.getUTCMinutes()).padStart(2, "0");
      const secs = String(now.getUTCSeconds()).padStart(2, "0");
      const ms = String(now.getUTCMilliseconds()).padStart(3, "0");
      setTimeStr(`${hours}:${mins}:${secs}.${ms} UTC`);
      setUptimeSeconds((prev) => prev + 1);
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Format Uptime
  const formatUptime = (totalSecs: number) => {
    const h = String(Math.floor(totalSecs / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, "0");
    const s = String(totalSecs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Fullscreen Handler
  const toggleFullscreen = useCallback(() => {
    playBeep(880, 0.05);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, [playBeep]);

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
      if (state.theme && state.theme !== workspaceTheme) {
        setWorkspaceTheme(state.theme);
      }
    },
    [dimension, isMelting, isTornadoActive, isSandboxActive, workspaceTheme]
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

  // Theme palettes available in eDEX HUD
  const themes = [
    { id: "cyan", label: "CYAN", color: "#00f0ff" },
    { id: "green", label: "MATRIX", color: "#00ff88" },
    { id: "purple", label: "NEON", color: "#c084fc" },
    { id: "amber", label: "AMBER", color: "#ffb700" },
    { id: "red", label: "ALERT", color: "#ff3355" },
  ];

  // Quick action command chips for mobile and HUD
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
    return <FutureEnvironment2099 />;
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col bg-[#020610] text-cyan-400 select-none relative font-mono text-xs"
      data-theme={workspaceTheme}
    >
      {/* 1. Global Sci-Fi Backdrop & Scanlines */}
      <div className="absolute inset-0 edex-grid-bg opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none z-0" />
      <div className="scanlines fixed inset-0 pointer-events-none z-40 opacity-15" />

      {/* 2. Top Header HUD Bar */}
      <header className="h-9 shrink-0 bg-[#040c1c]/95 border-b border-cyan-500/25 px-3 flex items-center justify-between text-[11px] font-mono z-20 shadow-[0_2px_15px_rgba(0,240,255,0.08)]">
        {/* Left Identity & Architecture */}
        <div className="flex items-center space-x-2.5 truncate">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_6px_#00f0ff] shrink-0" />
          <span className="font-bold tracking-widest text-cyan-100 uppercase truncate">
            [ eDEX-UI // CHARAN-OS v2.2.8 ]
          </span>
          <span className="hidden md:inline text-[9px] text-cyan-400/60 border-l border-cyan-500/20 pl-2">
            DARWIN 24.3.0 // x86_64
          </span>
          <span className="hidden xl:inline text-[9px] text-zinc-500 border-l border-cyan-500/20 pl-2">
            UPTIME: {formatUptime(uptimeSeconds)}
          </span>
          <span className="hidden xl:inline px-1.5 py-0.2 rounded-xs bg-cyan-950/40 border border-cyan-500/30 text-[8px] text-cyan-300 font-bold">
            SECURE // TLS-1.3
          </span>
        </div>

        {/* Center Clock & System Time */}
        <div className="hidden sm:flex items-center space-x-3 text-[10px] text-cyan-300 tracking-wider">
          <span className="text-zinc-500">2026-10-23</span>
          <span className="text-zinc-600">|</span>
          <span className="font-bold text-cyan-100 font-mono drop-shadow-[0_0_5px_rgba(0,240,255,0.4)]">
            {timeStr}
          </span>
          <span className="hidden lg:inline text-zinc-600">|</span>
          <span className="hidden lg:inline text-[9px] text-zinc-400">
            LOAD: {systemLoad}
          </span>
        </div>

        {/* Right Controls: Theme Selector, Audio SFX, Fullscreen */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Theme Selector Pills */}
          <div className="hidden sm:flex items-center space-x-1 border-r border-cyan-500/20 pr-2">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => {
                  playBeep(520, 0.04);
                  setWorkspaceTheme(th.id);
                }}
                className={`px-1.5 py-0.5 rounded-xs text-[8px] font-bold tracking-wider transition-all cursor-pointer ${
                  workspaceTheme === th.id
                    ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                    : "text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent"
                }`}
                title={`Switch theme to ${th.label}`}
              >
                {th.label}
              </button>
            ))}
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => {
              toggleMute();
              playBeep(isMuted ? 880 : 440, 0.05);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-xs border border-cyan-500/25 hover:border-cyan-400 text-cyan-400 hover:text-cyan-100 hover:bg-cyan-500/20 transition-colors text-[9px] cursor-pointer"
            title={isMuted ? "Enable Audio SFX" : "Mute Audio SFX"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3 h-3 text-red-400" />
                <span className="hidden md:inline text-red-400">SFX: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="hidden md:inline text-cyan-200">SFX: ON</span>
              </>
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded-xs border border-cyan-500/25 hover:border-cyan-400 text-cyan-400 hover:text-cyan-100 hover:bg-cyan-500/20 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </header>

      {/* 3. Mobile Navigation Switcher (<1024px) */}
      {isMobile && (
        <div className="bg-[#030914] border-b border-cyan-500/20 p-1 flex items-center justify-around text-[10px] z-20 shrink-0 font-mono">
          <button
            onClick={() => {
              playClick();
              setMobileTab("terminal");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              mobileTab === "terminal"
                ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400 font-bold"
                : "text-zinc-400 hover:text-cyan-300"
            }`}
          >
            <Terminal className="w-3 h-3" /> TERMINAL
          </button>
          <button
            onClick={() => {
              playClick();
              setMobileTab("telemetry");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              mobileTab === "telemetry"
                ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400 font-bold"
                : "text-zinc-400 hover:text-cyan-300"
            }`}
          >
            <Activity className="w-3 h-3" /> TELEMETRY
          </button>
          <button
            onClick={() => {
              playClick();
              setMobileTab("network");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              mobileTab === "network"
                ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400 font-bold"
                : "text-zinc-400 hover:text-cyan-300"
            }`}
          >
            <Globe className="w-3 h-3" /> NETWORK
          </button>
        </div>
      )}

      {/* 4. Cockpit Main Grid Viewport */}
      <main className="flex-1 overflow-hidden relative z-10 p-2 min-h-0">
        {/* DESKTOP 3-COLUMN COCKPIT (>=1024px) */}
        {!isMobile ? (
          <div className="grid grid-cols-12 gap-2 h-full min-h-0">
            {/* COLUMN 1: LEFT HUD PANEL (Hardware Telemetry + Processes + Filesystem) */}
            <div className="col-span-3 h-full flex flex-col gap-2 min-h-0">
              {/* Top: Multi-core CPU & RAM Telemetry (~33% height) */}
              <div className="h-[33%] min-h-0">
                <SystemMonitorWidget
                  themeColor={workspaceTheme}
                  className="w-full h-full"
                />
              </div>

              {/* Middle: Live Process Manager (~33% height) */}
              <div className="h-[33%] min-h-0">
                <EDexProcessWidget className="w-full h-full" />
              </div>

              {/* Bottom: Interactive Filesystem Explorer (~34% height) */}
              <div className="h-[34%] min-h-0">
                <EDexFileSystemWidget
                  themeColor={workspaceTheme}
                  onExecuteCommand={executeTerminalCommand}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* COLUMN 2: CENTER MAIN HUD (Terminal Emulator + On-screen Keyboard Deck) */}
            <div className="col-span-6 h-full flex flex-col gap-2 min-h-0">
              {/* Top: Main Terminal Emulator (~58% height) */}
              <div className="h-[58%] min-h-0 edex-panel relative overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />

                <div className="flex-1 min-h-0">
                  <TerminalContainer
                    theme={workspaceTheme}
                    setTheme={setWorkspaceTheme}
                    onStateChange={handleStateChange}
                  />
                </div>
              </div>

              {/* Bottom: Virtual On-Screen Keyboard Deck (~42% height) */}
              <div className="h-[42%] min-h-0">
                <EDexKeyboardDeck
                  themeColor={workspaceTheme}
                  onExecuteCommand={executeTerminalCommand}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* COLUMN 3: RIGHT HUD PANEL (Geospatial Globe + Network I/O + Security Logs) */}
            <div className="col-span-3 h-full flex flex-col gap-2 min-h-0">
              {/* Top: 3D Vector Geospatial Globe (~36% height) */}
              <div className="h-[36%] min-h-0">
                <GlobeWidget
                  themeColor={workspaceTheme}
                  className="w-full h-full"
                />
              </div>

              {/* Middle: Network I/O & Port Monitor (~32% height) */}
              <div className="h-[32%] min-h-0">
                <NetworkWidget
                  themeColor={workspaceTheme}
                  className="w-full h-full"
                />
              </div>

              {/* Bottom: DEFCON Threat Intel & Security Logs (~32% height) */}
              <div className="h-[32%] min-h-0">
                <EDexSecurityWidget
                  themeColor={workspaceTheme}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        ) : (
          /* MOBILE TABBED VIEW (<1024px) */
          <div className="h-full flex flex-col min-h-0">
            {mobileTab === "terminal" && (
              <div className="flex-1 flex flex-col gap-2 min-h-0">
                <div className="flex-1 min-h-0 edex-panel relative overflow-hidden flex flex-col">
                  <span className="edex-bracket-tl" />
                  <span className="edex-bracket-tr" />
                  <span className="edex-bracket-bl" />
                  <span className="edex-bracket-br" />
                  <TerminalContainer
                    theme={workspaceTheme}
                    setTheme={setWorkspaceTheme}
                    onStateChange={handleStateChange}
                  />
                </div>

                {/* Mobile Quick Action Chips */}
                <div className="bg-[#030914] border border-cyan-500/20 p-1.5 flex gap-1.5 overflow-x-auto edex-scrollbar shrink-0">
                  {quickActions.map((act) => (
                    <button
                      key={act.label}
                      onClick={() => {
                        playClick();
                        executeTerminalCommand(act.cmd);
                      }}
                      className="px-2.5 py-1 rounded-xs bg-cyan-950/40 border border-cyan-500/30 text-[9px] font-bold text-cyan-200 hover:text-white hover:bg-cyan-500/30 shrink-0 cursor-pointer"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mobileTab === "telemetry" && (
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto edex-scrollbar min-h-0">
                <div className="h-48 shrink-0">
                  <SystemMonitorWidget
                    themeColor={workspaceTheme}
                    className="w-full h-full"
                  />
                </div>
                <div className="h-44 shrink-0">
                  <EDexProcessWidget className="w-full h-full" />
                </div>
                <div className="h-56 shrink-0">
                  <EDexFileSystemWidget
                    themeColor={workspaceTheme}
                    onExecuteCommand={executeTerminalCommand}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {mobileTab === "network" && (
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto edex-scrollbar min-h-0">
                <div className="h-52 shrink-0">
                  <GlobeWidget
                    themeColor={workspaceTheme}
                    className="w-full h-full"
                  />
                </div>
                <div className="h-44 shrink-0">
                  <NetworkWidget
                    themeColor={workspaceTheme}
                    className="w-full h-full"
                  />
                </div>
                <div className="h-48 shrink-0">
                  <EDexSecurityWidget
                    themeColor={workspaceTheme}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Bottom HUD Footer Bar */}
      <footer className="h-7 shrink-0 bg-[#030814]/95 border-t border-cyan-500/25 px-3 flex items-center justify-between text-[10px] font-mono z-20">
        <div className="flex items-center space-x-2 text-cyan-300 font-bold truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate">
            OPERATOR: CHARAN BS // OFFENSIVE SECURITY & FULL STACK DEVELOPER
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-[9px] text-zinc-400 truncate">
          <span className="text-cyan-500">//</span>
          <span className="truncate">
            SYSTEM STATUS: NOMINAL // ALL TELEMETRY STREAMS ACTIVE // ZERO ANOMALIES
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[9px] text-zinc-400 shrink-0 font-mono">
          <span className="hidden sm:inline text-cyan-300">BAT: 100% ⚡</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden md:inline text-cyan-300">RAM: 46%</span>
          <span className="hidden md:inline text-zinc-600">|</span>
          <span className="text-emerald-400 font-bold">ETH0: 1000M</span>
        </div>
      </footer>

      {/* 6. Special Meltdown Visual FX */}
      {isMelting && (
        <MeltdownEffect onClose={() => setIsMelting(false)} />
      )}
    </div>
  );
}
