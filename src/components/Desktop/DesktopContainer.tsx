"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { TerminalContainer } from "../Terminal/TerminalContainer";
import { Dock, DockIcon } from "@/components/ui/dock";
import { MeltdownEffect } from "../Effects/MeltdownEffect";
import { 
  Terminal as TermIcon, 
  Folder, 
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Globe,
  Activity,
  FileText,
  Cpu,
  Binary,
  Compass,
  Code,
  Music,
  Brain,
  Clock,
  Video,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2
} from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { FutureEnvironment2099 } from "./FutureEnvironment2099";

// Import custom dashboard widgets
import { WorkspaceWindow } from "../dashboard/WorkspaceWindow";
import { SatelliteWidget } from "../dashboard/SatelliteWidget";
import { GlobalNetworkWidget } from "../dashboard/GlobalNetworkWidget";
import { GithubWidget } from "../dashboard/GithubWidget";
import { LogsWidget } from "../dashboard/LogsWidget";
import { SystemMonitorWidget } from "../dashboard/SystemMonitorWidget";
import { MatrixScannerWidget } from "../dashboard/MatrixScannerWidget";
import { RadarWidget } from "../dashboard/RadarWidget";
import { CodeViewerWidget } from "../dashboard/CodeViewerWidget";
import { AudioSpectrumWidget } from "../dashboard/AudioSpectrumWidget";
import { AIStatusWidget } from "../dashboard/AIStatusWidget";
import { SurveillanceWidget } from "../dashboard/SurveillanceWidget";
import { WorldClockWidget } from "../dashboard/WorldClockWidget";
import { WarningWidget } from "../dashboard/WarningWidget";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";
import { EDexKeyboardDeck } from "../dashboard/EDexKeyboardDeck";

// Import Bunker monitoring widgets
import { 
  ThreatIntelWidget, 
  NetworkTopologyWidget, 
  PacketInspectorWidget, 
  SshSessionsWidget, 
  DockerK8sWidget, 
  ProcessManagerWidget, 
  FileExplorerWidget, 
  GitActivityWidget, 
  MemoryMapWidget, 
  FirewallStatusWidget, 
  MissionObjectivesWidget, 
  CryptoTickerWidget, 
  WeatherTimeWidget, 
  DiskActivityWidget, 
  PowerMonitorWidget, 
  SecureNotesWidget, 
  TerminalHistoryWidget, 
  ActiveServicesWidget, 
  SignalAnalyzerWidget, 
  SatelliteFeedInfoWidget 
} from "../dashboard/BunkerWidgets";

// Custom SVG Github icon for backward-compatibility with older lucide versions
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function AsciiArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src="https://assets.21st.dev/ascii-recipes/videos/user_39720J8FZrHCoGeL23ljF4x20L3/ffa79616-dc73-4587-93ba-ff3f8ff354ef.mp4"
      poster="https://assets.21st.dev/ascii-recipes/thumbnails/user_39720J8FZrHCoGeL23ljF4x20L3/9b9bf5f4-272f-415d-bbb6-436ffba39927.webp"
      autoPlay
      loop
      muted
      playsInline
      aria-label="Terminal Pikachu — animated ASCII art"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}

// Pixel-perfect vector SVGs for high fidelity macOS Dock icons
const terminalIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%2318181b' stroke='%233f3f46' stroke-width='2'/><path d='M6 18 L58 18' stroke='%2327272a' stroke-width='2'/><circle cx='14' cy='9' r='3' fill='%23ef4444'/><circle cx='22' cy='9' r='3' fill='%23f59e0b'/><circle cx='30' cy='9' r='3' fill='%2310b981'/><path d='M12 28 L22 34 L12 40' fill='none' stroke='%2310b981' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><line x1='26' y1='40' x2='44' y2='40' stroke='%2310b981' stroke-width='4' stroke-linecap='round'/></svg>";
const finderIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='finder-grad' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%233b82f6'/><stop offset='100%25' stop-color='%231d4ed8'/></linearGradient></defs><rect width='64' height='64' rx='14' fill='url(%23finder-grad)'/><path d='M32 0 L32 64' stroke='%231e3a8a' stroke-width='2'/><path d='M0 32 L64 32' stroke='%231e3a8a' stroke-width='2'/><circle cx='18' cy='22' r='4.5' fill='%23ffffff'/><circle cx='18' cy='22' r='2' fill='%23000000'/><circle cx='46' cy='22' r='4.5' fill='%23ffffff'/><circle cx='46' cy='22' r='2' fill='%23000000'/><path d='M32 24 L32 38 L22 38' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M42 38 A 10 10 0 0 1 22 38' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round'/></svg>";
const portfolioIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M6 12 C6 9.8 7.8 8 10 8 L24 8 C25.6 8 27.1 8.8 28 10.1 L32.8 17.1 C33.3 17.7 34 18 34.8 18 L54 18 C56.2 18 58 19.8 58 22 L58 52 C58 54.2 56.2 56 54 56 L10 56 C7.8 56 6 54.2 6 52 Z' fill='%23eab308' stroke='%23ca8a04' stroke-width='2'/><path d='M6 24 C6 21.8 7.8 20 10 20 L54 20 C56.2 20 58 21.8 58 24 L58 52 C58 54.2 56.2 56 54 56 L10 56 C7.8 56 6 54.2 6 52 Z' fill='%23facc15' opacity='0.95'/></svg>";
const secretIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M6 12 C6 9.8 7.8 8 10 8 L24 8 C25.6 8 27.1 8.8 28 10.1 L32.8 17.1 C33.3 17.7 34 18 34.8 18 L54 18 C56.2 18 58 19.8 58 22 L58 52 C58 54.2 56.2 56 54 56 L10 56 C7.8 56 6 54.2 6 52 Z' fill='%23991b1b' stroke='%237f1d1d' stroke-width='2'/><path d='M6 24 C6 21.8 7.8 20 10 20 L54 20 C56.2 20 58 21.8 58 24 L58 52 C58 54.2 56.2 56 54 56 L10 56 C7.8 56 6 54.2 6 52 Z' fill='%23b91c1c' opacity='0.95'/><text x='32' y='44' fill='%23ffffff' font-family='monospace' font-size='14' font-weight='bold' text-anchor='middle'>???</text></svg>";
const trashIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect x='14' y='20' width='36' height='38' rx='4' fill='%23e4e4e7' stroke='%23a1a1aa' stroke-width='2'/><path d='M10 14 L54 14' stroke='%23a1a1aa' stroke-width='4' stroke-linecap='round'/><rect x='26' y='8' width='12' height='6' rx='1' fill='none' stroke='%23a1a1aa' stroke-width='3'/><line x1='24' y1='28' x2='24' y2='50' stroke='%23a1a1aa' stroke-width='3' stroke-linecap='round'/><line x1='32' y1='28' x2='32' y2='50' stroke='%23a1a1aa' stroke-width='3' stroke-linecap='round'/><line x1='40' y1='28' x2='40' y2='50' stroke='%23a1a1aa' stroke-width='3' stroke-linecap='round'/></svg>";

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
}

export function DesktopContainer() {
  // Theme & Dimension states (defaulting to eDEX-UI signature cyan)
  const [workspaceTheme, setWorkspaceTheme] = useState("cyan");
  const [dimension, setDimension] = useState("2026");
  const [isMelting, setIsMelting] = useState(false);
  const [isTornadoActive, setIsTornadoActive] = useState(false);
  const [isSandboxActive, setIsSandboxActive] = useState(false);
  const [isGlitchingPikachu, setIsGlitchingPikachu] = useState(false);
  const [isTrashBouncing, setIsTrashBouncing] = useState(false);
  const [unlockedSecret, setUnlockedSecret] = useState(false);
  const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);

  // Layout responsiveness
  const [isDesktop, setIsDesktop] = useState(true);
  const [systemTime, setSystemTime] = useState("");

  const desktopRef = useRef<HTMLDivElement>(null);
  const terminalDragControls = useDragControls();
  const { playClick, playBeep, playBuzzer, isMuted, toggleMute } = useAudio();

  // Unified window management state
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>({
    terminal: { isOpen: true, isMinimized: false, isMaximized: false },
    globe: { isOpen: true, isMinimized: false, isMaximized: false },
    network: { isOpen: true, isMinimized: false, isMaximized: false },
    github: { isOpen: false, isMinimized: false, isMaximized: false },
    logs: { isOpen: true, isMinimized: false, isMaximized: false },
    cpu: { isOpen: false, isMinimized: false, isMaximized: false },
    matrix: { isOpen: false, isMinimized: false, isMaximized: false },
    radar: { isOpen: false, isMinimized: false, isMaximized: false },
    code: { isOpen: false, isMinimized: false, isMaximized: false },
    visualizer: { isOpen: false, isMinimized: false, isMaximized: false },
    ai: { isOpen: false, isMinimized: false, isMaximized: false },
    clock: { isOpen: false, isMinimized: false, isMaximized: false },
    ascii: { isOpen: true, isMinimized: false, isMaximized: false },
    warning: { isOpen: false, isMinimized: false, isMaximized: false },
    finder: { isOpen: false, isMinimized: false, isMaximized: false },
    
    // Bunker Windows states
    threatIntel: { isOpen: false, isMinimized: false, isMaximized: false },
    netTopology: { isOpen: false, isMinimized: false, isMaximized: false },
    packetInspector: { isOpen: false, isMinimized: false, isMaximized: false },
    sshSessions: { isOpen: false, isMinimized: false, isMaximized: false },
    dockerK8s: { isOpen: false, isMinimized: false, isMaximized: false },
    processManager: { isOpen: false, isMinimized: false, isMaximized: false },
    fileExplorer: { isOpen: false, isMinimized: false, isMaximized: false },
    gitActivity: { isOpen: false, isMinimized: false, isMaximized: false },
    memoryMap: { isOpen: false, isMinimized: false, isMaximized: false },
    firewall: { isOpen: false, isMinimized: false, isMaximized: false },
    missionObjectives: { isOpen: false, isMinimized: false, isMaximized: false },
    cryptoTicker: { isOpen: false, isMinimized: false, isMaximized: false },
    weatherTime: { isOpen: false, isMinimized: false, isMaximized: false },
    diskActivity: { isOpen: false, isMinimized: false, isMaximized: false },
    powerMonitor: { isOpen: false, isMinimized: false, isMaximized: false },
    secureNotes: { isOpen: false, isMinimized: false, isMaximized: false },
    terminalHistory: { isOpen: false, isMinimized: false, isMaximized: false },
    activeServices: { isOpen: false, isMinimized: false, isMaximized: false },
    signalAnalyzer: { isOpen: false, isMinimized: false, isMaximized: false },
    satelliteFeedInfo: { isOpen: false, isMinimized: false, isMaximized: false }
  });

  // Floating coordinates positions state
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Active focused window tracker for click-to-front layering
  const [focusedWindow, setFocusedWindow] = useState("terminal");
  const [zIndices, setZIndices] = useState<Record<string, number>>({
    terminal: 35,
    globe: 20,
    network: 20,
    github: 20,
    logs: 20,
    cpu: 20,
    matrix: 20,
    radar: 20,
    code: 20,
    visualizer: 20,
    ai: 20,
    clock: 20,
    ascii: 20,
    warning: 20,
    finder: 20,
    threatIntel: 20,
    netTopology: 20,
    packetInspector: 20,
    sshSessions: 20,
    dockerK8s: 20,
    processManager: 20,
    fileExplorer: 20,
    gitActivity: 20,
    memoryMap: 20,
    firewall: 20,
    missionObjectives: 20,
    cryptoTicker: 20,
    weatherTime: 20,
    diskActivity: 20,
    powerMonitor: 20,
    secureNotes: 20,
    terminalHistory: 20,
    activeServices: 20,
    signalAnalyzer: 20,
    satelliteFeedInfo: 20
  });

  const focusWindow = (winId: string) => {
    setFocusedWindow(winId);
    setZIndices(prev => {
      const maxZ = Math.max(...Object.values(prev));
      return {
        ...prev,
        [winId]: maxZ + 1
      };
    });
    playClick();
  };

  // Initialize and listen to screen size
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsDesktop(w >= 1024);

      // eDEX-UI 3-Column Balanced Layout Sizing
      const sideW = Math.max(260, Math.min(360, Math.floor(w * 0.22)));
      const termW = Math.min(840, Math.max(540, w - (sideW * 2) - 40));
      const termX = Math.floor((w - termW) / 2);
      const termY = 56;
      const leftX = 16;
      const rightX = w - sideW - 16;

      setPositions({
        terminal: { x: termX, y: termY },
        
        // Left Column (Telemetry & Logs)
        logs: { x: leftX, y: 56 },
        cpu: { x: leftX, y: 312 },
        threatIntel: { x: leftX, y: 538 },
        netTopology: { x: leftX, y: 740 },
        processManager: { x: leftX, y: 740 },
        network: { x: leftX, y: 538 },
        ai: { x: leftX, y: 312 },
        powerMonitor: { x: leftX, y: 312 },
        diskActivity: { x: leftX, y: 538 },
        activeServices: { x: leftX, y: 740 },

        // Right Column (Geospatial & Feeds)
        globe: { x: rightX, y: 56 },
        satelliteFeedInfo: { x: rightX, y: 312 },
        ascii: { x: rightX, y: 410 },
        radar: { x: rightX, y: 640 },
        visualizer: { x: rightX, y: 640 },
        sshSessions: { x: rightX, y: 740 },
        firewall: { x: rightX, y: 740 },
        clock: { x: rightX, y: 640 },
        weatherTime: { x: rightX, y: 410 },

        // Center / Toggled Overlays
        fileExplorer: { x: Math.floor(w * 0.25), y: 680 },
        github: { x: Math.floor(w * 0.22), y: 150 },
        matrix: { x: Math.floor(w * 0.18), y: 620 },
        code: { x: Math.floor(w * 0.48), y: 620 },
        packetInspector: { x: Math.floor(w * 0.26), y: 312 },
        warning: { x: Math.floor(w * 0.36), y: 645 },
        dockerK8s: { x: Math.floor(w * 0.60), y: 65 },
        gitActivity: { x: Math.floor(w * 0.42), y: 65 },
        memoryMap: { x: Math.floor(w * 0.42), y: 260 },
        missionObjectives: { x: Math.floor(w * 0.12), y: 150 },
        cryptoTicker: { x: Math.floor(w * 0.16), y: 455 },
        secureNotes: { x: Math.floor(w * 0.16), y: 200 },
        terminalHistory: { x: Math.floor(w * 0.60), y: 200 },
        signalAnalyzer: { x: Math.floor(w * 0.52), y: 400 },
        finder: { x: Math.floor(w * 0.25), y: 150 }
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setSystemTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to terminal commands to dynamically open associated desktop windows
  useTerminalEvent((detail) => {
    const cmd = detail.command.toLowerCase();
    const commandToWindowMap: Record<string, string[]> = {
      github: ["gitActivity", "github"],
      projects: ["code"],
      certificates: ["threatIntel"],
      timeline: ["terminalHistory"],
      skills: ["ai"],
      system: ["cpu", "processManager"],
      admin: ["logs"],
      decrypt: ["secureNotes"],
      find: ["fileExplorer"],
      tree: ["fileExplorer"],
      network: ["netTopology", "network"],
      map: ["network"],
      help: ["missionObjectives"],
      weather: ["weatherTime"],
      services: ["activeServices"],
      power: ["powerMonitor"],
      disk: ["diskActivity"],
      radar: ["radar"],
      visualizer: ["visualizer"],
      warning: ["warning"],
      satellite: ["globe", "satelliteFeedInfo", "ascii"],
      surveillance: ["ascii"]
    };

    const windowsToOpen = commandToWindowMap[cmd];
    if (windowsToOpen) {
      setWindowStates(prev => {
        const next = { ...prev };
        let updated = false;
        windowsToOpen.forEach(winId => {
          if (next[winId] && !next[winId].isOpen) {
            next[winId] = {
              ...next[winId],
              isOpen: true,
              isMinimized: false
            };
            updated = true;
          }
        });
        return updated ? next : prev;
      });
      playBeep(600, 0.08, false);
    }
  });

  // Reset workspace tiling positions
  const resetWorkspaceLayout = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // eDEX-UI 3-Column Balanced Layout Sizing
    const sideW = Math.max(260, Math.min(360, Math.floor(w * 0.22)));
    const termW = Math.min(840, Math.max(540, w - (sideW * 2) - 40));
    const termX = Math.floor((w - termW) / 2);
    const termY = 56;
    const leftX = 16;
    const rightX = w - sideW - 16;

    setPositions({
      terminal: { x: termX, y: termY },
      
      // Left Column (Telemetry & Logs)
      logs: { x: leftX, y: 56 },
      cpu: { x: leftX, y: 312 },
      threatIntel: { x: leftX, y: 538 },
      netTopology: { x: leftX, y: 740 },
      processManager: { x: leftX, y: 740 },
      network: { x: leftX, y: 538 },
      ai: { x: leftX, y: 312 },
      powerMonitor: { x: leftX, y: 312 },
      diskActivity: { x: leftX, y: 538 },
      activeServices: { x: leftX, y: 740 },

      // Right Column (Geospatial & Feeds)
      globe: { x: rightX, y: 56 },
      satelliteFeedInfo: { x: rightX, y: 312 },
      ascii: { x: rightX, y: 410 },
      radar: { x: rightX, y: 640 },
      visualizer: { x: rightX, y: 640 },
      sshSessions: { x: rightX, y: 740 },
      firewall: { x: rightX, y: 740 },
      clock: { x: rightX, y: 640 },
      weatherTime: { x: rightX, y: 410 },

      // Center / Toggled Overlays
      fileExplorer: { x: Math.floor(w * 0.25), y: 680 },
      github: { x: Math.floor(w * 0.22), y: 150 },
      matrix: { x: Math.floor(w * 0.18), y: 620 },
      code: { x: Math.floor(w * 0.48), y: 620 },
      packetInspector: { x: Math.floor(w * 0.26), y: 312 },
      warning: { x: Math.floor(w * 0.36), y: 645 },
      dockerK8s: { x: Math.floor(w * 0.60), y: 65 },
      gitActivity: { x: Math.floor(w * 0.42), y: 65 },
      memoryMap: { x: Math.floor(w * 0.42), y: 260 },
      missionObjectives: { x: Math.floor(w * 0.12), y: 150 },
      cryptoTicker: { x: Math.floor(w * 0.16), y: 455 },
      secureNotes: { x: Math.floor(w * 0.16), y: 200 },
      terminalHistory: { x: Math.floor(w * 0.60), y: 200 },
      signalAnalyzer: { x: Math.floor(w * 0.52), y: 400 },
      finder: { x: Math.floor(w * 0.25), y: 150 }
    });

    setWindowStates(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (
          key !== "github" && 
          key !== "clock" && 
          key !== "finder" && 
          key !== "code" && 
          key !== "matrix" &&
          key !== "dockerK8s" &&
          key !== "gitActivity" &&
          key !== "memoryMap" &&
          key !== "firewall" &&
          key !== "missionObjectives" &&
          key !== "cryptoTicker" &&
          key !== "weatherTime" &&
          key !== "diskActivity" &&
          key !== "powerMonitor" &&
          key !== "secureNotes" &&
          key !== "terminalHistory" &&
          key !== "activeServices" &&
          key !== "signalAnalyzer"
        ) {
          next[key].isOpen = true;
        }
        next[key].isMinimized = false;
        next[key].isMaximized = false;
      });
      return next;
    });
    playBeep(440, 0.1, false);
  };

  // Draggable physics sandbox solver
  useEffect(() => {
    if (!isSandboxActive) return;

    interface PhysicalBody {
      id: string;
      element: HTMLElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      width: number;
      height: number;
      isDragging: boolean;
      originalStyles: {
        position: string;
        left: string;
        top: string;
        transform: string;
        transition: string;
      };
    }

    const bodies: PhysicalBody[] = [];

    const elementsToCapture = [
      { id: "terminal-window", el: document.getElementById("terminal-window") },
      { id: "finder-window", el: document.getElementById("finder-window") },
      ...[
        "globe", "network", "github", "logs", "cpu", "matrix", "radar", "code", "visualizer", "ai", "clock", "ascii", "warning",
        "threatIntel", "netTopology", "packetInspector", "sshSessions", "dockerK8s", "processManager", "fileExplorer", "gitActivity",
        "memoryMap", "firewall", "missionObjectives", "cryptoTicker", "weatherTime", "diskActivity", "powerMonitor", "secureNotes",
        "terminalHistory", "activeServices", "signalAnalyzer", "satelliteFeedInfo"
      ].map(winId => ({
        id: `window-${winId}`,
        el: document.getElementById(`window-${winId}`)
      })),
      ...Array.from(document.querySelectorAll(".desktop-shortcut")).map((el, idx) => ({
        id: `shortcut-${idx}`,
        el: el as HTMLElement
      }))
    ].filter(item => item.el !== null) as { id: string; el: HTMLElement }[];

    elementsToCapture.forEach(item => {
      const el = item.el;
      const rect = el.getBoundingClientRect();
      const originalStyles = {
        position: el.style.position,
        left: el.style.left,
        top: el.style.top,
        transform: el.style.transform,
        transition: el.style.transition
      };

      bodies.push({
        id: item.id,
        element: el,
        x: rect.left,
        y: rect.top,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 8 - 4,
        width: rect.width,
        height: rect.height,
        isDragging: false,
        originalStyles
      });

      el.style.position = "fixed";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.transition = "none";
      el.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0px)`;
    });

    let activeBody: PhysicalBody | null = null;
    const dragOffset = { x: 0, y: 0 };
    const lastPointer = { x: 0, y: 0, time: 0 };

    const handlePointerDown = (body: PhysicalBody, e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input") || target.closest("button") || target.closest(".close-box") || target.closest("a")) return;

      activeBody = body;
      body.isDragging = true;
      body.vx = 0;
      body.vy = 0;
      dragOffset.x = e.clientX - body.x;
      dragOffset.y = e.clientY - body.y;
      lastPointer.x = e.clientX;
      lastPointer.y = e.clientY;
      lastPointer.time = performance.now();

      body.element.setPointerCapture(e.pointerId);
      e.stopPropagation();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!activeBody) return;
      const now = performance.now();
      const dt = now - lastPointer.time;
      const targetX = e.clientX - dragOffset.x;
      const targetY = e.clientY - dragOffset.y;

      if (dt > 0) {
        activeBody.vx = (targetX - activeBody.x) / (dt * 0.08);
        activeBody.vy = (targetY - activeBody.y) / (dt * 0.08);
        const maxV = 35;
        activeBody.vx = Math.max(-maxV, Math.min(maxV, activeBody.vx));
        activeBody.vy = Math.max(-maxV, Math.min(maxV, activeBody.vy));
      }

      activeBody.x = targetX;
      activeBody.y = targetY;
      lastPointer.x = e.clientX;
      lastPointer.y = e.clientY;
      lastPointer.time = now;
      activeBody.element.style.transform = `translate3d(${activeBody.x}px, ${activeBody.y}px, 0px)`;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!activeBody) return;
      activeBody.isDragging = false;
      try {
        activeBody.element.releasePointerCapture(e.pointerId);
      } catch (err) {}
      activeBody = null;
    };

    const downListeners = new Map<HTMLElement, (e: PointerEvent) => void>();
    bodies.forEach(body => {
      const listener = (e: PointerEvent) => handlePointerDown(body, e);
      body.element.addEventListener("pointerdown", listener);
      downListeners.set(body.element, listener);
    });

    const onPointerMoveGlobal = (e: PointerEvent) => handlePointerMove(e);
    const onPointerUpGlobal = (e: PointerEvent) => handlePointerUp(e);

    window.addEventListener("pointermove", onPointerMoveGlobal);
    window.addEventListener("pointerup", onPointerUpGlobal);

    let animId: number;
    const gravity = 0.5;
    const friction = 0.985;
    const restitution = 0.72;

    const tick = () => {
      bodies.forEach(body => {
        if (body.isDragging) return;
        body.vy += gravity;
        body.vx *= friction;
        body.vy *= friction;
        body.x += body.vx;
        body.y += body.vy;

        const xMax = window.innerWidth - body.width;
        const yMax = window.innerHeight - body.height;

        if (body.y > yMax) {
          body.y = yMax;
          body.vy = -body.vy * restitution;
          body.vx *= 0.85;
        }
        if (body.y < 0) {
          body.y = 0;
          body.vy = -body.vy * restitution;
        }
        if (body.x < 0) {
          body.x = 0;
          body.vx = -body.vx * restitution;
        }
        if (body.x > xMax) {
          body.x = xMax;
          body.vx = -body.vx * restitution;
        }

        body.element.style.transform = `translate3d(${body.x}px, ${body.y}px, 0px)`;
      });

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMoveGlobal);
      window.removeEventListener("pointerup", onPointerUpGlobal);
      bodies.forEach(body => {
        const listener = downListeners.get(body.element);
        if (listener) body.element.removeEventListener("pointerdown", listener);
        body.element.style.position = body.originalStyles.position;
        body.element.style.left = body.originalStyles.left;
        body.element.style.top = body.originalStyles.top;
        body.element.style.transition = body.originalStyles.transition;
        body.element.style.transform = body.originalStyles.transform;
      });
    };
  }, [isSandboxActive, windowStates]);

  const updateWindowState = (winId: string, updates: Partial<WindowState>) => {
    setWindowStates(prev => ({
      ...prev,
      [winId]: { ...prev[winId], ...updates }
    }));
    playClick();
  };

  const handleStateChange = (state: { 
    userState: string; 
    secretSequenceLength: number;
    dimension: string;
    isMelting: boolean;
    isTornadoActive: boolean;
    isSandboxActive: boolean;
    theme?: string;
  }) => {
    const isUnlocked = state.secretSequenceLength > 0 || state.userState !== "guest";
    if (isUnlocked && !unlockedSecret) {
      setUnlockedSecret(true);
      playBeep(880, 0.25, false);
      setNotification({
        title: "System Notification",
        body: "Unknown application discovered and added to the Dock."
      });
      setTimeout(() => setNotification(null), 5500);
    }

    let targetDimension = dimension;
    if (state.dimension && state.dimension !== dimension) {
      setDimension(state.dimension);
      targetDimension = state.dimension;
      if (state.dimension === "1984" || state.dimension === "1995") {
        setWorkspaceTheme("white");
      }
    }
    if (state.theme && state.theme !== workspaceTheme) {
      if (targetDimension !== "1984" && targetDimension !== "1995") {
        setWorkspaceTheme(state.theme);
      }
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
  };

  const toggleWindow = (winId: string) => {
    updateWindowState(winId, { isOpen: !windowStates[winId].isOpen });
  };

  // Finder navigation states
  const [finderPath, setFinderPath] = useState<string[]>(["Macintosh HD"]);
  const [historyPaths, setHistoryPaths] = useState<string[][]>([["Macintosh HD"]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const openFolderInFinder = (path: string[]) => {
    setFinderPath(path);
    setHistoryPaths(prev => [...prev.slice(0, historyIndex + 1), path]);
    setHistoryIndex(prev => prev + 1);
    updateWindowState("finder", { isOpen: true, isMinimized: false });
  };

  const dockItems = [
    {
      src: terminalIcon,
      name: "Terminal",
      action: () => updateWindowState("terminal", { isOpen: !windowStates.terminal.isOpen }),
      isOpen: windowStates.terminal.isOpen && !windowStates.terminal.isMinimized,
      id: "terminal"
    },
    {
      src: finderIcon,
      name: "Finder",
      action: () => updateWindowState("finder", { isOpen: !windowStates.finder.isOpen }),
      isOpen: windowStates.finder.isOpen && !windowStates.finder.isMinimized,
      id: "finder"
    },
    {
      src: portfolioIcon,
      name: "Portfolio",
      action: () => openFolderInFinder(["home", "charan"]),
      isOpen: windowStates.finder.isOpen && !windowStates.finder.isMinimized && finderPath.includes("charan"),
      id: "portfolio"
    },
    ...(unlockedSecret ? [{
      src: secretIcon,
      name: "???",
      action: () => openFolderInFinder(["secret"]),
      isOpen: windowStates.finder.isOpen && !windowStates.finder.isMinimized && finderPath.includes("secret"),
      id: "secret"
    }] : []),
    {
      src: trashIcon,
      name: "Trash",
      action: () => {
        playBuzzer();
        alert("Trash partition is write-locked. Purge failed.");
      },
      isOpen: false,
      id: "trash"
    }
  ];

  // Accents strictly styled to matches: #00FF8C (green), #00FFD0 (cyan), #93FFB6 (mint), #D2FFF0 (light)
  // eDEX-UI Status Indicator Colors
  const indicatorColors: Record<string, string> = {
    cyan: "bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]",
    green: "bg-[#00ff88] shadow-[0_0_8px_#00ff88]",
    purple: "bg-[#c084fc] shadow-[0_0_8px_#c084fc]",
    amber: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
    red: "bg-red-500 shadow-[0_0_8px_#ef4444]",
    white: "bg-[#D2FFF0] shadow-[0_0_8px_#D2FFF0]"
  };

  const activeIndicator = indicatorColors[workspaceTheme] || indicatorColors.cyan;

  return (
    <div 
      ref={desktopRef}
      data-dimension={dimension}
      data-melting={isMelting}
      className={`min-h-screen w-full relative overflow-hidden select-none font-mono text-cyan-100 edex-grid-bg bg-[#020610] ${
        isTornadoActive ? "tornado-active" : ""
      }`}
    >
      {/* 1. ASCII Pikachu Fullscreen Wallpaper Background (z-0) */}
      {dimension !== "1984" && dimension !== "1995" && dimension !== "2099" && (
        <div 
          className={`absolute inset-0 pointer-events-none select-none transition-all duration-700 bg-black z-0 ${
            isGlitchingPikachu 
              ? "opacity-85 scale-105 duration-100 crt-flicker invert contrast-[250%] brightness-[80%]" 
              : "opacity-[0.14] scale-100 mix-blend-screen"
          }`}
        >
          <AsciiArt className="w-full h-full object-cover" />
        </div>
      )}

      {/* Futuristic 2099 Environment Background */}
      {dimension === "2099" && (
        <div className="absolute inset-0 pointer-events-none select-none transition-all duration-700 z-0 bg-[#050000]">
          <FutureEnvironment2099 isGlitching={isGlitchingPikachu} />
        </div>
      )}

      {/* 2. Desktop CRT scanlines overlay (z-10) */}
      <div className="scanlines z-10 pointer-events-none absolute inset-0 opacity-[0.08]" />

      {/* Ambient HUD Corner Telemetry Marks */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none text-[8px] font-mono text-cyan-500/40 hidden xl:block select-none leading-tight">
        <div>+ [00,00] // GRID: 100%</div>
        <div>SYS: SECURE_UPLINK</div>
      </div>
      <div className="absolute top-14 right-4 z-10 pointer-events-none text-[8px] font-mono text-cyan-500/40 hidden xl:block select-none text-right leading-tight">
        <div>+ [99,00] // SAT: ACTIVE</div>
        <div>LAT: 12.9716°N LON: 77.5946°E</div>
      </div>
      <div className="absolute bottom-20 left-4 z-10 pointer-events-none text-[8px] font-mono text-cyan-500/40 hidden xl:block select-none leading-tight">
        <div>+ [00,99] // BUFFER: STABLE</div>
        <div>CLEARANCE: LEVEL-5 ROOT</div>
      </div>
      <div className="absolute bottom-20 right-4 z-10 pointer-events-none text-[8px] font-mono text-cyan-500/40 hidden xl:block select-none text-right leading-tight">
        <div>+ [99,99] // OPERATOR: CHARAN</div>
        <div>ENCRYPT: AES-256-GCM</div>
      </div>

      {/* 2. Fullscreen eDEX-UI Top Status HUD Header Bar */}
      <header className="fixed top-0 inset-x-0 h-11 bg-[#020713]/90 border-b border-cyan-500/25 backdrop-blur-md z-50 flex items-center justify-between px-4 text-[10px] select-none text-cyan-300/80 font-mono">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center gap-2 font-bold tracking-widest text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_6px_#00f0ff]" />
            eDEX-UI // CHARAN-SEC v3.1
          </div>
          <span className="hidden sm:inline text-cyan-600/70">//</span>
          <span className="hidden sm:inline text-cyan-400 font-semibold tracking-wider">PING: 12ms</span>
          <span className="hidden md:inline text-cyan-600/70">//</span>
          <span className="hidden md:inline flex items-center gap-1 text-emerald-400 tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400" /> SECURE GRID
          </span>
        </div>

        {/* Middle quick toggles for all windows */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-2 py-1 select-none">
          {[
            { id: "terminal", icon: <TermIcon className="w-3.5 h-3.5" />, label: "Terminal" },
            { id: "globe", icon: <Globe className="w-3.5 h-3.5" />, label: "Globe" },
            { id: "ascii", icon: <Video className="w-3.5 h-3.5" />, label: "ASCII" },
            { id: "logs", icon: <FileText className="w-3.5 h-3.5" />, label: "Logs" },
            { id: "radar", icon: <Compass className="w-3.5 h-3.5" />, label: "Radar" },
            { id: "cpu", icon: <Cpu className="w-3.5 h-3.5" />, label: "CPU" },
            { id: "warning", icon: <ShieldAlert className="w-3.5 h-3.5" />, label: "Alerts" },
            { id: "visualizer", icon: <Music className="w-3.5 h-3.5" />, label: "Audio" },
            { id: "network", icon: <Activity className="w-3.5 h-3.5" />, label: "Network" },
            
            // Bunker Widgets Toggles
            { id: "threatIntel", icon: <ShieldAlert className="w-3.5 h-3.5" />, label: "Threat Intel" },
            { id: "netTopology", icon: <Globe className="w-3.5 h-3.5" />, label: "Net Topology" },
            { id: "packetInspector", icon: <Activity className="w-3.5 h-3.5" />, label: "Packet Insp" },
            { id: "sshSessions", icon: <TermIcon className="w-3.5 h-3.5" />, label: "SSH Sessions" },
            { id: "processManager", icon: <Cpu className="w-3.5 h-3.5" />, label: "Proc Mgr" },
            { id: "fileExplorer", icon: <Folder className="w-3.5 h-3.5" />, label: "File Explorer" },
            { id: "dockerK8s", icon: <Cpu className="w-3.5 h-3.5" />, label: "Docker/K8s" },
            { id: "gitActivity", icon: <Code className="w-3.5 h-3.5" />, label: "Git activity" },
            { id: "memoryMap", icon: <Binary className="w-3.5 h-3.5" />, label: "Memory map" },
            { id: "firewall", icon: <ShieldAlert className="w-3.5 h-3.5" />, label: "Firewall" },
            { id: "missionObjectives", icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Objectives" },
            { id: "cryptoTicker", icon: <Activity className="w-3.5 h-3.5" />, label: "Crypto Ticker" },
            { id: "weatherTime", icon: <Clock className="w-3.5 h-3.5" />, label: "Weather Time" },
            { id: "diskActivity", icon: <Folder className="w-3.5 h-3.5" />, label: "Disk Activity" },
            { id: "powerMonitor", icon: <Cpu className="w-3.5 h-3.5" />, label: "Power Monitor" },
            { id: "secureNotes", icon: <FileText className="w-3.5 h-3.5" />, label: "Secure Notes" },
            { id: "terminalHistory", icon: <TermIcon className="w-3.5 h-3.5" />, label: "Term History" },
            { id: "activeServices", icon: <Activity className="w-3.5 h-3.5" />, label: "Services" },
            { id: "signalAnalyzer", icon: <Music className="w-3.5 h-3.5" />, label: "Signal Analyzer" },
            { id: "satelliteFeedInfo", icon: <Globe className="w-3.5 h-3.5" />, label: "Satellite Info" },
            
            { id: "github", icon: <GithubIcon className="w-3.5 h-3.5" />, label: "GitHub" },
            { id: "code", icon: <Code className="w-3.5 h-3.5" />, label: "Code stream" },
            { id: "matrix", icon: <Binary className="w-3.5 h-3.5" />, label: "Matrix Rain" },
            { id: "ai", icon: <Brain className="w-3.5 h-3.5" />, label: "AI metrics" },
            { id: "clock", icon: <Clock className="w-3.5 h-3.5" />, label: "Clock" }
          ].map((item) => {
            const state = windowStates[item.id] || { isOpen: false, isMinimized: false };
            const isActive = state.isOpen && !state.isMinimized;
            return (
              <button
                key={item.id}
                onClick={() => toggleWindow(item.id)}
                className={`relative flex items-center justify-center p-1.5 rounded-xs transition-all duration-150 cursor-pointer shrink-0 border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 ${
                  isActive ? "!border-cyan-400 !bg-cyan-500/35 !text-white shadow-[0_0_8px_rgba(0,240,255,0.4)]" : "hover:text-white"
                }`}
                title={`Toggle ${item.label} Window`}
              >
                {item.icon}
                {isActive && (
                  <span className={`absolute bottom-0 w-1 h-1 rounded-full ${activeIndicator}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right HUD Controls */}
        <div className="flex items-center space-x-3 shrink-0 select-none">
          {/* Theme Selector */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xs bg-cyan-950/30 border border-cyan-500/20">
            {dimension === "1984" || dimension === "1995" ? (
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider select-none">[Theme Locked]</span>
            ) : (
              ["cyan", "green", "purple", "amber", "red", "white"].map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setWorkspaceTheme(themeName);
                    playClick();
                  }}
                  className={`w-2.5 h-2.5 rounded-full border border-white/20 hover:scale-110 active:scale-90 transition-transform cursor-pointer ${
                    themeName === "cyan" ? "bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]" :
                    themeName === "green" ? "bg-[#00ff88]" :
                    themeName === "purple" ? "bg-[#c084fc]" :
                    themeName === "amber" ? "bg-amber-400" :
                    themeName === "red" ? "bg-red-500" : "bg-[#D2FFF0]"
                  } ${workspaceTheme === themeName ? "ring-1 ring-white scale-125" : ""}`}
                  title={`${themeName} theme`}
                />
              ))
            )}
          </div>

          <span className="hidden sm:inline text-cyan-700">|</span>

          {/* Reset Workspace Tiling Button */}
          {isDesktop && (
            <button
              onClick={resetWorkspaceLayout}
              className="px-2 py-1 rounded-xs border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[9px]"
              title="Reset eDEX HUD Grid"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span className="hidden lg:inline">[RESET HUD]</span>
            </button>
          )}

          {/* Sound volume controller */}
          <button
            onClick={() => {
              toggleMute();
              playBeep(isMuted ? 880 : 440, 0.05);
            }}
            className="p-1 rounded-xs border border-cyan-500/25 hover:border-cyan-400 hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute system" : "Mute system"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          <span className="text-cyan-400 font-bold tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded-xs border border-cyan-500/20">
            [{systemTime}]
          </span>
        </div>
      </header>

      {/* Floating System notifications */}
      {notification && (
        <div className="absolute top-14 right-4 z-[9999] w-80 rounded-xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-2xl p-4 flex gap-3 animate-slide-in">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-0.5">
            <h5 className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">{notification.title}</h5>
            <p className="text-[11px] text-zinc-200 leading-normal font-sans">{notification.body}</p>
          </div>
        </div>
      )}

      {/* 3. Main Workstation Panel Workspace */}
      {isDesktop ? (
        /* Desktop Mode: Floating Draggable Windows Workspace with Centered Focus Terminal */
        <div className="absolute inset-0 pt-11 z-20 pointer-events-none">
          {/* Main Terminal (Visual Focal Point at Screen Center) */}
          {windowStates.terminal.isOpen && (
            <div
              id="terminal-window"
              className={`absolute pointer-events-auto transition-all duration-300 ${
                windowStates.terminal.isMinimized ? "window-genie-minimize" : "window-genie-restore"
              }`}
              style={{
                zIndex: zIndices.terminal,
                left: positions.terminal?.x ?? 300,
                top: positions.terminal?.y ?? 180,
              }}
              onPointerDown={() => focusWindow("terminal")}
            >
              <motion.div
                drag={!windowStates.terminal.isMaximized}
                dragControls={terminalDragControls}
                dragListener={false}
                dragMomentum={false}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                 className={`flex flex-col gap-2 overflow-hidden ${
                  dimension === "2099" ? "cyberpunk-tilt" : ""
                } ${
                  windowStates.terminal.isMaximized
                    ? "fixed inset-4 z-40 max-w-none h-[calc(100vh-2rem)]"
                    : "w-[54vw] max-w-[880px]"
                } ${isGlitchingPikachu ? "shaking-window" : ""}`}
              >
                <div className={windowStates.terminal.isMaximized ? "h-full" : "h-[420px] 2xl:h-[460px]"}>
                  <TerminalContainer
                    onClose={() => updateWindowState("terminal", { isOpen: false })}
                    onMinimize={() => updateWindowState("terminal", { isMinimized: true })}
                    onMaximize={() => updateWindowState("terminal", { isMaximized: !windowStates.terminal.isMaximized })}
                    isMinimized={windowStates.terminal.isMinimized}
                    theme={workspaceTheme}
                    setTheme={setWorkspaceTheme}
                    onSystemCrash={() => {
                      setIsGlitchingPikachu(true);
                      playBuzzer();
                    }}
                    onSystemRecovery={() => {
                      setIsGlitchingPikachu(false);
                      playBeep(440, 0.1, false);
                    }}
                    onStateChange={handleStateChange}
                    onHeaderPointerDown={(e) => terminalDragControls.start(e)}
                  />
                </div>

                {!windowStates.terminal.isMaximized && (
                  <EDexKeyboardDeck
                    themeColor={workspaceTheme}
                    className="h-[205px] 2xl:h-[225px] shadow-2xl shrink-0"
                  />
                )}
              </motion.div>
            </div>
          )}

          {/* Top Right: Satellite Coordinates (GlobePulse) */}
          <WorkspaceWindow
            id="window-globe"
            title="SATELLITE COORDINATES"
            icon={<Globe className="w-3.5 h-3.5" />}
            isOpen={windowStates.globe.isOpen}
            isMinimized={windowStates.globe.isMinimized}
            isMaximized={windowStates.globe.isMaximized}
            onClose={() => updateWindowState("globe", { isOpen: false })}
            onMinimize={() => updateWindowState("globe", { isMinimized: true })}
            onMaximize={() => updateWindowState("globe", { isMaximized: !windowStates.globe.isMaximized })}
            defaultPosition={positions.globe}
            defaultSize="w-[22vw] min-w-[260px] max-w-[360px] h-[240px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.globe}
            animateDelay={0.6}
            initialX={300}
            initialY={-300}
            onFocus={() => focusWindow("globe")}
          >
            <SatelliteWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Right: Satellite Feed Info Widget */}
          <WorkspaceWindow
            id="window-satelliteFeedInfo"
            title="Satellite Feed Metadata"
            icon={<Globe className="w-3.5 h-3.5" />}
            isOpen={windowStates.satelliteFeedInfo.isOpen}
            isMinimized={windowStates.satelliteFeedInfo.isMinimized}
            isMaximized={windowStates.satelliteFeedInfo.isMaximized}
            onClose={() => updateWindowState("satelliteFeedInfo", { isOpen: false })}
            onMinimize={() => updateWindowState("satelliteFeedInfo", { isMinimized: true })}
            onMaximize={() => updateWindowState("satelliteFeedInfo", { isMaximized: !windowStates.satelliteFeedInfo.isMaximized })}
            defaultPosition={positions.satelliteFeedInfo}
            defaultSize="w-[22vw] min-w-[260px] max-w-[360px] h-[85px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.satelliteFeedInfo}
            animateDelay={0.4}
            initialX={300}
            onFocus={() => focusWindow("satelliteFeedInfo")}
          >
            <SatelliteFeedInfoWidget />
          </WorkspaceWindow>

          {/* Right: Surveillance Feed (AsciiArt) */}
          <WorkspaceWindow
            id="window-ascii"
            title="SURVEILLANCE FEED"
            icon={<Video className="w-3.5 h-3.5" />}
            isOpen={windowStates.ascii.isOpen}
            isMinimized={windowStates.ascii.isMinimized}
            isMaximized={windowStates.ascii.isMaximized}
            onClose={() => updateWindowState("ascii", { isOpen: false })}
            onMinimize={() => updateWindowState("ascii", { isMinimized: true })}
            onMaximize={() => updateWindowState("ascii", { isMaximized: !windowStates.ascii.isMaximized })}
            defaultPosition={positions.ascii}
            defaultSize="w-[22vw] min-w-[260px] max-w-[360px] h-[240px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.ascii}
            animateDelay={1.2}
            initialX={450}
            onFocus={() => focusWindow("ascii")}
          >
            <SurveillanceWidget />
          </WorkspaceWindow>

          {/* Top Left: Live Event Logs */}
          <WorkspaceWindow
            id="window-logs"
            title="RESTRICTED LOGS"
            icon={<FileText className="w-3.5 h-3.5" />}
            isOpen={windowStates.logs.isOpen}
            isMinimized={windowStates.logs.isMinimized}
            isMaximized={windowStates.logs.isMaximized}
            onClose={() => updateWindowState("logs", { isOpen: false })}
            onMinimize={() => updateWindowState("logs", { isMinimized: true })}
            onMaximize={() => updateWindowState("logs", { isMaximized: !windowStates.logs.isMaximized })}
            defaultPosition={positions.logs}
            defaultSize="w-[22vw] min-w-[260px] max-w-[360px] h-[240px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.logs}
            animateDelay={0.3}
            initialX={-400}
            onFocus={() => focusWindow("logs")}
          >
            <LogsWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Left: System Monitor (CPU/Memory dials) */}
          <WorkspaceWindow
            id="window-cpu"
            title="System Resource Dials"
            icon={<Cpu className="w-3.5 h-3.5" />}
            isOpen={windowStates.cpu.isOpen}
            isMinimized={windowStates.cpu.isMinimized}
            isMaximized={windowStates.cpu.isMaximized}
            onClose={() => updateWindowState("cpu", { isOpen: false })}
            onMinimize={() => updateWindowState("cpu", { isMinimized: true })}
            onMaximize={() => updateWindowState("cpu", { isMaximized: !windowStates.cpu.isMaximized })}
            defaultPosition={positions.cpu}
            defaultSize="w-[22vw] min-w-[260px] max-w-[360px] h-[210px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.cpu}
            animateDelay={0.9}
            initialX={-450}
            onFocus={() => focusWindow("cpu")}
          >
            <SystemMonitorWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Bottom Left: AI Status */}
          <WorkspaceWindow
            id="window-ai"
            title="AI Coprocessor Diagnostics"
            icon={<Brain className="w-3.5 h-3.5" />}
            isOpen={windowStates.ai.isOpen}
            isMinimized={windowStates.ai.isMinimized}
            isMaximized={windowStates.ai.isMaximized}
            onClose={() => updateWindowState("ai", { isOpen: false })}
            onMinimize={() => updateWindowState("ai", { isMinimized: true })}
            onMaximize={() => updateWindowState("ai", { isMaximized: !windowStates.ai.isMaximized })}
            defaultPosition={positions.ai}
            defaultSize="w-[22vw] min-w-[260px] max-w-[360px] h-[180px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.ai}
            animateDelay={1.1}
            initialX={-300}
            initialY={300}
            onFocus={() => focusWindow("ai")}
          >
            <AIStatusWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Bottom Left overlapping: Global Network */}
          <WorkspaceWindow
            id="window-network"
            title="GLOBAL NETWORK"
            icon={<Activity className="w-3.5 h-3.5" />}
            isOpen={windowStates.network.isOpen}
            isMinimized={windowStates.network.isMinimized}
            isMaximized={windowStates.network.isMaximized}
            onClose={() => updateWindowState("network", { isOpen: false })}
            onMinimize={() => updateWindowState("network", { isMinimized: true })}
            onMaximize={() => updateWindowState("network", { isMaximized: !windowStates.network.isMaximized })}
            defaultPosition={positions.network}
            defaultSize="w-[22vw] min-w-[260px] max-w-[360px] h-[220px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.network}
            animateDelay={0.9}
            initialX={-350}
            onFocus={() => focusWindow("network")}
          >
            <GlobalNetworkWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Bottom Center: Warning Panel */}
          <WorkspaceWindow
            id="window-warning"
            title="Security Warning Level"
            icon={<ShieldAlert className="w-3.5 h-3.5" />}
            isOpen={windowStates.warning.isOpen}
            isMinimized={windowStates.warning.isMinimized}
            isMaximized={windowStates.warning.isMaximized}
            onClose={() => updateWindowState("warning", { isOpen: false })}
            onMinimize={() => updateWindowState("warning", { isMinimized: true })}
            onMaximize={() => updateWindowState("warning", { isMaximized: !windowStates.warning.isMaximized })}
            defaultPosition={positions.warning}
            defaultSize="w-[22vw] h-[85px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.warning}
            animateDelay={2.0}
            initialY={350}
            onFocus={() => focusWindow("warning")}
          >
            <WarningWidget />
          </WorkspaceWindow>

          {/* Bottom Center: Radar Scanner */}
          <WorkspaceWindow
            id="window-radar"
            title="Ping Scan Radar"
            icon={<Compass className="w-3.5 h-3.5" />}
            isOpen={windowStates.radar.isOpen}
            isMinimized={windowStates.radar.isMinimized}
            isMaximized={windowStates.radar.isMaximized}
            onClose={() => updateWindowState("radar", { isOpen: false })}
            onMinimize={() => updateWindowState("radar", { isMinimized: true })}
            onMaximize={() => updateWindowState("radar", { isMaximized: !windowStates.radar.isMaximized })}
            defaultPosition={positions.radar}
            defaultSize="w-[22vw] h-[175px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.radar}
            animateDelay={1.5}
            initialY={400}
            onFocus={() => focusWindow("radar")}
          >
            <RadarWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Bottom Right: World Clock */}
          <WorkspaceWindow
            id="window-clock"
            title="Time Sync Chronometers"
            icon={<Clock className="w-3.5 h-3.5" />}
            isOpen={windowStates.clock.isOpen}
            isMinimized={windowStates.clock.isMinimized}
            isMaximized={windowStates.clock.isMaximized}
            onClose={() => updateWindowState("clock", { isOpen: false })}
            onMinimize={() => updateWindowState("clock", { isMinimized: true })}
            onMaximize={() => updateWindowState("clock", { isMaximized: !windowStates.clock.isMaximized })}
            defaultPosition={positions.clock}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.clock}
            animateDelay={1.8}
            initialX={300}
            initialY={300}
            onFocus={() => focusWindow("clock")}
          >
            <WorldClockWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Bottom Right overlapping: Audio Spectrum */}
          <WorkspaceWindow
            id="window-visualizer"
            title="Audio Intercept Wave"
            icon={<Music className="w-3.5 h-3.5" />}
            isOpen={windowStates.visualizer.isOpen}
            isMinimized={windowStates.visualizer.isMinimized}
            isMaximized={windowStates.visualizer.isMaximized}
            onClose={() => updateWindowState("visualizer", { isOpen: false })}
            onMinimize={() => updateWindowState("visualizer", { isMinimized: true })}
            onMaximize={() => updateWindowState("visualizer", { isMaximized: !windowStates.visualizer.isMaximized })}
            defaultPosition={positions.visualizer}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.visualizer}
            animateDelay={1.6}
            initialX={350}
            initialY={300}
            onFocus={() => focusWindow("visualizer")}
          >
            <AudioSpectrumWidget />
          </WorkspaceWindow>

          {/* ==========================================
              NEW BUNKER MONITORING WINDOWS
              ========================================== */}

          {/* Threat Intelligence */}
          <WorkspaceWindow
            id="window-threatIntel"
            title="Threat Intelligence"
            icon={<ShieldAlert className="w-3.5 h-3.5" />}
            isOpen={windowStates.threatIntel.isOpen}
            isMinimized={windowStates.threatIntel.isMinimized}
            isMaximized={windowStates.threatIntel.isMaximized}
            onClose={() => updateWindowState("threatIntel", { isOpen: false })}
            onMinimize={() => updateWindowState("threatIntel", { isMinimized: true })}
            onMaximize={() => updateWindowState("threatIntel", { isMaximized: !windowStates.threatIntel.isMaximized })}
            defaultPosition={positions.threatIntel}
            defaultSize="w-[20vw] h-[150px]"
            accentColor="red"
            dimension={dimension}
            zIndex={zIndices.threatIntel}
            animateDelay={2.1}
            initialX={-400}
            onFocus={() => focusWindow("threatIntel")}
          >
            <ThreatIntelWidget />
          </WorkspaceWindow>

          {/* Network Topology */}
          <WorkspaceWindow
            id="window-netTopology"
            title="Network Topology map"
            icon={<Globe className="w-3.5 h-3.5" />}
            isOpen={windowStates.netTopology.isOpen}
            isMinimized={windowStates.netTopology.isMinimized}
            isMaximized={windowStates.netTopology.isMaximized}
            onClose={() => updateWindowState("netTopology", { isOpen: false })}
            onMinimize={() => updateWindowState("netTopology", { isMinimized: true })}
            onMaximize={() => updateWindowState("netTopology", { isMaximized: !windowStates.netTopology.isMaximized })}
            defaultPosition={positions.netTopology}
            defaultSize="w-[20vw] h-[180px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.netTopology}
            animateDelay={0.5}
            initialY={-300}
            onFocus={() => focusWindow("netTopology")}
          >
            <NetworkTopologyWidget />
          </WorkspaceWindow>

          {/* Packet Inspector */}
          <WorkspaceWindow
            id="window-packetInspector"
            title="Packet Inspector stream"
            icon={<Activity className="w-3.5 h-3.5" />}
            isOpen={windowStates.packetInspector.isOpen}
            isMinimized={windowStates.packetInspector.isMinimized}
            isMaximized={windowStates.packetInspector.isMaximized}
            onClose={() => updateWindowState("packetInspector", { isOpen: false })}
            onMinimize={() => updateWindowState("packetInspector", { isMinimized: true })}
            onMaximize={() => updateWindowState("packetInspector", { isMaximized: !windowStates.packetInspector.isMaximized })}
            defaultPosition={positions.packetInspector}
            defaultSize="w-[20vw] h-[180px]"
            accentColor="cyan"
            dimension={dimension}
            zIndex={zIndices.packetInspector}
            animateDelay={0.8}
            initialX={-300}
            onFocus={() => focusWindow("packetInspector")}
          >
            <PacketInspectorWidget />
          </WorkspaceWindow>

          {/* SSH Sessions */}
          <WorkspaceWindow
            id="window-sshSessions"
            title="Active SSH sessions"
            icon={<TermIcon className="w-3.5 h-3.5" />}
            isOpen={windowStates.sshSessions.isOpen}
            isMinimized={windowStates.sshSessions.isMinimized}
            isMaximized={windowStates.sshSessions.isMaximized}
            onClose={() => updateWindowState("sshSessions", { isOpen: false })}
            onMinimize={() => updateWindowState("sshSessions", { isMinimized: true })}
            onMaximize={() => updateWindowState("sshSessions", { isMaximized: !windowStates.sshSessions.isMaximized })}
            defaultPosition={positions.sshSessions}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.sshSessions}
            animateDelay={2.3}
            initialX={300}
            onFocus={() => focusWindow("sshSessions")}
          >
            <SshSessionsWidget />
          </WorkspaceWindow>

          {/* Docker / Kubernetes */}
          <WorkspaceWindow
            id="window-dockerK8s"
            title="Docker / K8s controller"
            icon={<Cpu className="w-3.5 h-3.5" />}
            isOpen={windowStates.dockerK8s.isOpen}
            isMinimized={windowStates.dockerK8s.isMinimized}
            isMaximized={windowStates.dockerK8s.isMaximized}
            onClose={() => updateWindowState("dockerK8s", { isOpen: false })}
            onMinimize={() => updateWindowState("dockerK8s", { isMinimized: true })}
            onMaximize={() => updateWindowState("dockerK8s", { isMaximized: !windowStates.dockerK8s.isMaximized })}
            defaultPosition={positions.dockerK8s}
            defaultSize="w-[20vw] h-[150px]"
            accentColor="cyan"
            dimension={dimension}
            zIndex={zIndices.dockerK8s}
            animateDelay={0.6}
            initialY={-300}
            onFocus={() => focusWindow("dockerK8s")}
          >
            <DockerK8sWidget />
          </WorkspaceWindow>

          {/* Process Manager */}
          <WorkspaceWindow
            id="window-processManager"
            title="Bunker Process Manager"
            icon={<Cpu className="w-3.5 h-3.5" />}
            isOpen={windowStates.processManager.isOpen}
            isMinimized={windowStates.processManager.isMinimized}
            isMaximized={windowStates.processManager.isMaximized}
            onClose={() => updateWindowState("processManager", { isOpen: false })}
            onMinimize={() => updateWindowState("processManager", { isMinimized: true })}
            onMaximize={() => updateWindowState("processManager", { isMaximized: !windowStates.processManager.isMaximized })}
            defaultPosition={positions.processManager}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.processManager}
            animateDelay={1.4}
            initialY={300}
            onFocus={() => focusWindow("processManager")}
          >
            <ProcessManagerWidget />
          </WorkspaceWindow>

          {/* File Explorer */}
          <WorkspaceWindow
            id="window-fileExplorer"
            title="FileSystem explorer"
            icon={<Folder className="w-3.5 h-3.5" />}
            isOpen={windowStates.fileExplorer.isOpen}
            isMinimized={windowStates.fileExplorer.isMinimized}
            isMaximized={windowStates.fileExplorer.isMaximized}
            onClose={() => updateWindowState("fileExplorer", { isOpen: false })}
            onMinimize={() => updateWindowState("fileExplorer", { isMinimized: true })}
            onMaximize={() => updateWindowState("fileExplorer", { isMaximized: !windowStates.fileExplorer.isMaximized })}
            defaultPosition={positions.fileExplorer}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.fileExplorer}
            animateDelay={1.6}
            initialY={300}
            onFocus={() => focusWindow("fileExplorer")}
          >
            <FileExplorerWidget />
          </WorkspaceWindow>

          {/* Git Activity */}
          <WorkspaceWindow
            id="window-gitActivity"
            title="Git repository logs"
            icon={<Code className="w-3.5 h-3.5" />}
            isOpen={windowStates.gitActivity.isOpen}
            isMinimized={windowStates.gitActivity.isMinimized}
            isMaximized={windowStates.gitActivity.isMaximized}
            onClose={() => updateWindowState("gitActivity", { isOpen: false })}
            onMinimize={() => updateWindowState("gitActivity", { isMinimized: true })}
            onMaximize={() => updateWindowState("gitActivity", { isMaximized: !windowStates.gitActivity.isMaximized })}
            defaultPosition={positions.gitActivity}
            defaultSize="w-[20vw] h-[180px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.gitActivity}
            onFocus={() => focusWindow("gitActivity")}
          >
            <GitActivityWidget />
          </WorkspaceWindow>

          {/* Memory Map */}
          <WorkspaceWindow
            id="window-memoryMap"
            title="SRAM sector registry"
            icon={<Binary className="w-3.5 h-3.5" />}
            isOpen={windowStates.memoryMap.isOpen}
            isMinimized={windowStates.memoryMap.isMinimized}
            isMaximized={windowStates.memoryMap.isMaximized}
            onClose={() => updateWindowState("memoryMap", { isOpen: false })}
            onMinimize={() => updateWindowState("memoryMap", { isMinimized: true })}
            onMaximize={() => updateWindowState("memoryMap", { isMaximized: !windowStates.memoryMap.isMaximized })}
            defaultPosition={positions.memoryMap}
            defaultSize="w-[20vw] h-[180px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.memoryMap}
            onFocus={() => focusWindow("memoryMap")}
          >
            <MemoryMapWidget />
          </WorkspaceWindow>

          {/* Firewall Status */}
          <WorkspaceWindow
            id="window-firewall"
            title="Firewall rule monitor"
            icon={<ShieldAlert className="w-3.5 h-3.5" />}
            isOpen={windowStates.firewall.isOpen}
            isMinimized={windowStates.firewall.isMinimized}
            isMaximized={windowStates.firewall.isMaximized}
            onClose={() => updateWindowState("firewall", { isOpen: false })}
            onMinimize={() => updateWindowState("firewall", { isMinimized: true })}
            onMaximize={() => updateWindowState("firewall", { isMaximized: !windowStates.firewall.isMaximized })}
            defaultPosition={positions.firewall}
            defaultSize="w-[20vw] h-[150px]"
            accentColor="amber"
            dimension={dimension}
            zIndex={zIndices.firewall}
            onFocus={() => focusWindow("firewall")}
          >
            <FirewallStatusWidget />
          </WorkspaceWindow>

          {/* Mission Objectives */}
          <WorkspaceWindow
            id="window-missionObjectives"
            title="Mission Objectives"
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            isOpen={windowStates.missionObjectives.isOpen}
            isMinimized={windowStates.missionObjectives.isMinimized}
            isMaximized={windowStates.missionObjectives.isMaximized}
            onClose={() => updateWindowState("missionObjectives", { isOpen: false })}
            onMinimize={() => updateWindowState("missionObjectives", { isMinimized: true })}
            onMaximize={() => updateWindowState("missionObjectives", { isMaximized: !windowStates.missionObjectives.isMaximized })}
            defaultPosition={positions.missionObjectives}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.missionObjectives}
            onFocus={() => focusWindow("missionObjectives")}
          >
            <MissionObjectivesWidget />
          </WorkspaceWindow>

          {/* Crypto Price Ticker */}
          <WorkspaceWindow
            id="window-cryptoTicker"
            title="Crypto Tickers"
            icon={<Activity className="w-3.5 h-3.5" />}
            isOpen={windowStates.cryptoTicker.isOpen}
            isMinimized={windowStates.cryptoTicker.isMinimized}
            isMaximized={windowStates.cryptoTicker.isMaximized}
            onClose={() => updateWindowState("cryptoTicker", { isOpen: false })}
            onMinimize={() => updateWindowState("cryptoTicker", { isMinimized: true })}
            onMaximize={() => updateWindowState("cryptoTicker", { isMaximized: !windowStates.cryptoTicker.isMaximized })}
            defaultPosition={positions.cryptoTicker}
            defaultSize="w-[20vw] h-[120px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.cryptoTicker}
            onFocus={() => focusWindow("cryptoTicker")}
          >
            <CryptoTickerWidget />
          </WorkspaceWindow>

          {/* Weather & Time */}
          <WorkspaceWindow
            id="window-weatherTime"
            title="MET Telemetry"
            icon={<Clock className="w-3.5 h-3.5" />}
            isOpen={windowStates.weatherTime.isOpen}
            isMinimized={windowStates.weatherTime.isMinimized}
            isMaximized={windowStates.weatherTime.isMaximized}
            onClose={() => updateWindowState("weatherTime", { isOpen: false })}
            onMinimize={() => updateWindowState("weatherTime", { isMinimized: true })}
            onMaximize={() => updateWindowState("weatherTime", { isMaximized: !windowStates.weatherTime.isMaximized })}
            defaultPosition={positions.weatherTime}
            defaultSize="w-[20vw] h-[120px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.weatherTime}
            onFocus={() => focusWindow("weatherTime")}
          >
            <WeatherTimeWidget />
          </WorkspaceWindow>

          {/* Disk Activity */}
          <WorkspaceWindow
            id="window-diskActivity"
            title="Disk Drive Telemetry"
            icon={<Folder className="w-3.5 h-3.5" />}
            isOpen={windowStates.diskActivity.isOpen}
            isMinimized={windowStates.diskActivity.isMinimized}
            isMaximized={windowStates.diskActivity.isMaximized}
            onClose={() => updateWindowState("diskActivity", { isOpen: false })}
            onMinimize={() => updateWindowState("diskActivity", { isMinimized: true })}
            onMaximize={() => updateWindowState("diskActivity", { isMaximized: !windowStates.diskActivity.isMaximized })}
            defaultPosition={positions.diskActivity}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.diskActivity}
            onFocus={() => focusWindow("diskActivity")}
          >
            <DiskActivityWidget />
          </WorkspaceWindow>

          {/* Power Monitor */}
          <WorkspaceWindow
            id="window-powerMonitor"
            title="Thermal Monitor"
            icon={<Cpu className="w-3.5 h-3.5" />}
            isOpen={windowStates.powerMonitor.isOpen}
            isMinimized={windowStates.powerMonitor.isMinimized}
            isMaximized={windowStates.powerMonitor.isMaximized}
            onClose={() => updateWindowState("powerMonitor", { isOpen: false })}
            onMinimize={() => updateWindowState("powerMonitor", { isMinimized: true })}
            onMaximize={() => updateWindowState("powerMonitor", { isMaximized: !windowStates.powerMonitor.isMaximized })}
            defaultPosition={positions.powerMonitor}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.powerMonitor}
            onFocus={() => focusWindow("powerMonitor")}
          >
            <PowerMonitorWidget />
          </WorkspaceWindow>

          {/* Secure Notes */}
          <WorkspaceWindow
            id="window-secureNotes"
            title="Secure Notes Pad"
            icon={<FileText className="w-3.5 h-3.5" />}
            isOpen={windowStates.secureNotes.isOpen}
            isMinimized={windowStates.secureNotes.isMinimized}
            isMaximized={windowStates.secureNotes.isMaximized}
            onClose={() => updateWindowState("secureNotes", { isOpen: false })}
            onMinimize={() => updateWindowState("secureNotes", { isMinimized: true })}
            onMaximize={() => updateWindowState("secureNotes", { isMaximized: !windowStates.secureNotes.isMaximized })}
            defaultPosition={positions.secureNotes}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.secureNotes}
            onFocus={() => focusWindow("secureNotes")}
          >
            <SecureNotesWidget />
          </WorkspaceWindow>

          {/* Terminal History */}
          <WorkspaceWindow
            id="window-terminalHistory"
            title="Shell history logs"
            icon={<TermIcon className="w-3.5 h-3.5" />}
            isOpen={windowStates.terminalHistory.isOpen}
            isMinimized={windowStates.terminalHistory.isMinimized}
            isMaximized={windowStates.terminalHistory.isMaximized}
            onClose={() => updateWindowState("terminalHistory", { isOpen: false })}
            onMinimize={() => updateWindowState("terminalHistory", { isMinimized: true })}
            onMaximize={() => updateWindowState("terminalHistory", { isMaximized: !windowStates.terminalHistory.isMaximized })}
            defaultPosition={positions.terminalHistory}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.terminalHistory}
            onFocus={() => focusWindow("terminalHistory")}
          >
            <TerminalHistoryWidget />
          </WorkspaceWindow>

          {/* Active Services */}
          <WorkspaceWindow
            id="window-activeServices"
            title="Background services"
            icon={<Activity className="w-3.5 h-3.5" />}
            isOpen={windowStates.activeServices.isOpen}
            isMinimized={windowStates.activeServices.isMinimized}
            isMaximized={windowStates.activeServices.isMaximized}
            onClose={() => updateWindowState("activeServices", { isOpen: false })}
            onMinimize={() => updateWindowState("activeServices", { isMinimized: true })}
            onMaximize={() => updateWindowState("activeServices", { isMaximized: !windowStates.activeServices.isMaximized })}
            defaultPosition={positions.activeServices}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.activeServices}
            onFocus={() => focusWindow("activeServices")}
          >
            <ActiveServicesWidget />
          </WorkspaceWindow>

          {/* Signal Analyzer */}
          <WorkspaceWindow
            id="window-signalAnalyzer"
            title="Signal wave Scope"
            icon={<Music className="w-3.5 h-3.5" />}
            isOpen={windowStates.signalAnalyzer.isOpen}
            isMinimized={windowStates.signalAnalyzer.isMinimized}
            isMaximized={windowStates.signalAnalyzer.isMaximized}
            onClose={() => updateWindowState("signalAnalyzer", { isOpen: false })}
            onMinimize={() => updateWindowState("signalAnalyzer", { isMinimized: true })}
            onMaximize={() => updateWindowState("signalAnalyzer", { isMaximized: !windowStates.signalAnalyzer.isMaximized })}
            defaultPosition={positions.signalAnalyzer}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.signalAnalyzer}
            onFocus={() => focusWindow("signalAnalyzer")}
          >
            <SignalAnalyzerWidget />
          </WorkspaceWindow>

          {/* Source Code Stream (closed by default) */}
          <WorkspaceWindow
            id="window-code"
            title="Source Core Stream"
            icon={<Code className="w-3.5 h-3.5" />}
            isOpen={windowStates.code.isOpen}
            isMinimized={windowStates.code.isMinimized}
            isMaximized={windowStates.code.isMaximized}
            onClose={() => updateWindowState("code", { isOpen: false })}
            onMinimize={() => updateWindowState("code", { isMinimized: true })}
            onMaximize={() => updateWindowState("code", { isMaximized: !windowStates.code.isMaximized })}
            defaultPosition={positions.code}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.code}
            animateDelay={1.2}
            initialY={400}
            onFocus={() => focusWindow("code")}
          >
            <CodeViewerWidget />
          </WorkspaceWindow>

          {/* Hex Scanner (closed by default) */}
          <WorkspaceWindow
            id="window-matrix"
            title="Hex Address Scanner"
            icon={<Binary className="w-3.5 h-3.5" />}
            isOpen={windowStates.matrix.isOpen}
            isMinimized={windowStates.matrix.isMinimized}
            isMaximized={windowStates.matrix.isMaximized}
            onClose={() => updateWindowState("matrix", { isOpen: false })}
            onMinimize={() => updateWindowState("matrix", { isMinimized: true })}
            onMaximize={() => updateWindowState("matrix", { isMaximized: !windowStates.matrix.isMaximized })}
            defaultPosition={positions.matrix}
            defaultSize="w-[20vw] h-[150px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.matrix}
            animateDelay={0.5}
            initialX={-400}
            onFocus={() => focusWindow("matrix")}
          >
            <MatrixScannerWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* GitHub Commit history (closed by default) */}
          <WorkspaceWindow
            id="window-github"
            title="Commit History"
            icon={<GithubIcon className="w-3.5 h-3.5" />}
            isOpen={windowStates.github.isOpen}
            isMinimized={windowStates.github.isMinimized}
            isMaximized={windowStates.github.isMaximized}
            onClose={() => updateWindowState("github", { isOpen: false })}
            onMinimize={() => updateWindowState("github", { isMinimized: true })}
            onMaximize={() => updateWindowState("github", { isMaximized: !windowStates.github.isMaximized })}
            defaultPosition={positions.github}
            defaultSize="w-[32vw] h-[240px]"
            accentColor={workspaceTheme}
            dimension={dimension}
            zIndex={zIndices.github}
            animateDelay={1.0}
            initialX={-300}
            onFocus={() => focusWindow("github")}
          >
            <GithubWidget themeColor={workspaceTheme} />
          </WorkspaceWindow>

          {/* Floating Finder Window */}
          {windowStates.finder.isOpen && (
            <WorkspaceWindow
              id="finder-window"
              title={`Finder — /${finderPath.join("/")}`}
              icon={<Folder className="w-3.5 h-3.5" />}
              isOpen={windowStates.finder.isOpen}
              isMinimized={windowStates.finder.isMinimized}
              isMaximized={windowStates.finder.isMaximized}
              onClose={() => updateWindowState("finder", { isOpen: false })}
              onMinimize={() => updateWindowState("finder", { isMinimized: true })}
              onMaximize={() => updateWindowState("finder", { isMaximized: !windowStates.finder.isMaximized })}
              defaultPosition={positions.finder}
              defaultSize="w-[50vw] h-[320px]"
              accentColor="white"
              dimension={dimension}
              zIndex={zIndices.finder}
              onFocus={() => focusWindow("finder")}
            >
              {/* Finder Internal Layout */}
              <div className="flex flex-1 min-h-0 divide-x divide-white/5">
                <aside className="w-36 bg-zinc-950/40 p-2 select-none overflow-y-auto shrink-0 flex flex-col gap-3 font-sans">
                  <div className="space-y-1">
                    <h4 className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 px-2 select-none">Locations</h4>
                    <div className="space-y-0.5 text-[11px] text-zinc-300 font-medium select-none">
                      <button 
                        onClick={() => openFolderInFinder(["Macintosh HD"])}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 cursor-pointer ${
                          finderPath.length === 1 && finderPath[0] === "Macintosh HD" ? "bg-blue-600/30 text-white" : "hover:bg-zinc-800/30"
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5 text-blue-400" />
                        Macintosh HD
                      </button>
                      <button 
                        onClick={() => openFolderInFinder(["home", "charan"])}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 cursor-pointer ${
                          finderPath.includes("charan") ? "bg-blue-600/30 text-white" : "hover:bg-zinc-800/30"
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5 text-yellow-400" />
                        charan
                      </button>
                      {unlockedSecret && (
                        <button 
                          onClick={() => openFolderInFinder(["secret"])}
                          className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 cursor-pointer ${
                            finderPath.includes("secret") ? "bg-red-950/45 text-red-300" : "hover:bg-zinc-800/30"
                          }`}
                        >
                          <Folder className="w-3.5 h-3.5 text-red-500" />
                          secret
                        </button>
                      )}
                    </div>
                  </div>
                </aside>
                <section className="flex-1 p-4 bg-zinc-900/60 overflow-y-auto select-none min-w-0 flex items-center justify-center flex-col text-zinc-500 font-sans">
                  {finderPath.includes("secret") ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ShieldAlert className="w-8 h-8 stroke-1 text-red-500 animate-pulse" />
                      <span className="text-xs font-semibold text-red-400 select-text">CLASSIFIED PARTITION WRITE LOCK</span>
                    </div>
                  ) : (
                    <>
                      <Folder className="w-8 h-8 stroke-1 opacity-20 mb-2" />
                      <span className="text-xs font-semibold">Folder is empty.</span>
                    </>
                  )}
                </section>
              </div>
            </WorkspaceWindow>
          )}
        </div>
      ) : (
        /* Mobile Mode: Scrollable Grid Layout to prevent overlaps */
        <div className="w-full min-h-screen pt-14 pb-28 px-4 overflow-y-auto relative z-20 pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {/* Mobile Quick Action Strip */}
            <div className="col-span-full edex-panel p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border border-cyan-500/25 relative">
              <span className="edex-bracket-tl" />
              <span className="edex-bracket-tr" />
              <span className="edex-bracket-bl" />
              <span className="edex-bracket-br" />
              <span className="text-[9px] font-bold text-cyan-400 shrink-0 px-1 uppercase tracking-widest flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                EXEC:
              </span>
              {[
                { label: "HELP", cmd: "help" },
                { label: "ABOUT", cmd: "about" },
                { label: "PROJECTS", cmd: "projects" },
                { label: "SKILLS", cmd: "skills" },
                { label: "EXP", cmd: "experience" },
                { label: "CONTACT", cmd: "contact" },
                { label: "CLEAR", cmd: "clear" },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("edex-command", { detail: { command: item.cmd } }));
                    }
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/40 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/30 rounded-xs transition-all shrink-0 cursor-pointer"
                >
                  [{item.label}]
                </button>
              ))}
            </div>

            {/* Terminal Widget */}
            {windowStates.terminal.isOpen && (
              <div className="h-[380px] overflow-hidden relative edex-panel border border-cyan-500/30">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <TerminalContainer
                  onClose={() => updateWindowState("terminal", { isOpen: false })}
                  theme={workspaceTheme}
                  setTheme={setWorkspaceTheme}
                  onStateChange={handleStateChange}
                />
              </div>
            )}

            {/* Globe Coordinates */}
            {windowStates.globe.isOpen && (
              <div className="h-[380px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Satellite Coordinates
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[SYS // GEO]</span>
                </div>
                <div className="flex-1 min-h-0"><SatelliteWidget themeColor={workspaceTheme} /></div>
              </div>
            )}

            {/* Surveillance Feed */}
            {windowStates.ascii.isOpen && (
              <div className="h-[300px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Surveillance Feed
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[SYS // CAM]</span>
                </div>
                <div className="flex-1 min-h-0"><SurveillanceWidget /></div>
              </div>
            )}

            {/* Logs */}
            {windowStates.logs.isOpen && (
              <div className="h-[250px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Live Event Log
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[SYS // LOGS]</span>
                </div>
                <div className="flex-1 min-h-0"><LogsWidget themeColor={workspaceTheme} /></div>
              </div>
            )}

            {/* Threat Intel */}
            {windowStates.threatIntel.isOpen && (
              <div className="h-[200px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-red-300 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    Threat Countermeasures
                  </span>
                  <span className="text-[9px] text-red-400/60">[DEF // SEC]</span>
                </div>
                <div className="flex-1 min-h-0"><ThreatIntelWidget /></div>
              </div>
            )}

            {/* Network Topology */}
            {windowStates.netTopology.isOpen && (
              <div className="h-[220px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Network Topology map
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[NET // MAP]</span>
                </div>
                <div className="flex-1 min-h-0"><NetworkTopologyWidget /></div>
              </div>
            )}

            {/* Packet Inspector */}
            {windowStates.packetInspector.isOpen && (
              <div className="h-[200px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Packet Inspector stream
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[PCAP // DUMP]</span>
                </div>
                <div className="flex-1 min-h-0"><PacketInspectorWidget /></div>
              </div>
            )}

            {/* SSH Sessions */}
            {windowStates.sshSessions.isOpen && (
              <div className="h-[180px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    SSH Sessions
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[TTY // SESS]</span>
                </div>
                <div className="flex-1 min-h-0"><SshSessionsWidget /></div>
              </div>
            )}

            {/* Process Manager */}
            {windowStates.processManager.isOpen && (
              <div className="h-[180px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Process Manager
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[PS // AUX]</span>
                </div>
                <div className="flex-1 min-h-0"><ProcessManagerWidget /></div>
              </div>
            )}

            {/* File Explorer */}
            {windowStates.fileExplorer.isOpen && (
              <div className="h-[180px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    File System Explorer
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[VFS // ROOT]</span>
                </div>
                <div className="flex-1 min-h-0"><FileExplorerWidget /></div>
              </div>
            )}

            {/* Radar */}
            {windowStates.radar.isOpen && (
              <div className="h-[200px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Ping Scan Radar
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[RADAR // SCAN]</span>
                </div>
                <div className="flex-1 min-h-0"><RadarWidget themeColor={workspaceTheme} /></div>
              </div>
            )}

            {/* CPU/Memory */}
            {windowStates.cpu.isOpen && (
              <div className="h-[250px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    System Resource Dials
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[SYS // TELEMETRY]</span>
                </div>
                <div className="flex-1 min-h-0"><SystemMonitorWidget themeColor={workspaceTheme} /></div>
              </div>
            )}

            {/* Warning Panel */}
            {windowStates.warning.isOpen && (
              <div className="h-[180px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Security Warning Level
                  </span>
                  <span className="text-[9px] text-amber-400/60">[ALERT // DEFCON]</span>
                </div>
                <div className="flex-1 min-h-0"><WarningWidget /></div>
              </div>
            )}

            {/* Audio Spectrum */}
            {windowStates.visualizer.isOpen && (
              <div className="h-[200px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Audio Intercept Wave
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[AUDIO // FFT]</span>
                </div>
                <div className="flex-1 min-h-0"><AudioSpectrumWidget /></div>
              </div>
            )}

            {/* Network */}
            {windowStates.network.isOpen && (
              <div className="h-[200px] relative edex-panel border border-cyan-500/25 overflow-hidden flex flex-col">
                <span className="edex-bracket-tl" />
                <span className="edex-bracket-tr" />
                <span className="edex-bracket-bl" />
                <span className="edex-bracket-br" />
                <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-cyan-200 font-bold uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Global Network
                  </span>
                  <span className="text-[9px] text-cyan-400/60">[NET // WAN]</span>
                </div>
                <div className="flex-1 min-h-0"><GlobalNetworkWidget themeColor={workspaceTheme} /></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Bottom macOS-style Dock (or custom dimension Taskbar) (z-30) */}
      {dimension === "1995" ? (
        /* Windows 95 Taskbar */
        <div className={`absolute bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-t-white flex items-center justify-between px-2 z-30 select-none border-b border-b-zinc-600 border-r border-r-zinc-600 transition-all duration-700 ease-in-out transform ${
          isMelting ? "translate-y-32 opacity-0" : "translate-y-0 opacity-100"
        }`}>
          <div className="flex items-center space-x-2 relative">
            <button
              onClick={() => {}}
              className="h-7 px-2 bg-[#c0c0c0] flex items-center gap-1.5 font-sans font-bold text-xs text-black border-2 border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 cursor-pointer"
            >
              Start
            </button>
            <button 
              onClick={() => updateWindowState("terminal", { isOpen: !windowStates.terminal.isOpen })}
              className={`h-7 px-3 bg-[#c0c0c0] font-sans text-xs text-black border-2 truncate max-w-[100px] flex items-center gap-1 cursor-pointer ${
                windowStates.terminal.isOpen && !windowStates.terminal.isMinimized ? "border-t-zinc-800 border-l-zinc-800 border-r-white border-b-white font-bold bg-[#dfdfdf]" : "border-t-white border-l-white border-r-zinc-800 border-b-zinc-800"
              }`}
            >
              Terminal
            </button>
          </div>
          <div className="h-7 px-3 bg-[#c0c0c0] border-2 border-t-zinc-800 border-l-zinc-800 border-r-white border-b-white flex items-center justify-center font-sans text-xs text-black">
             <span className="ml-2 font-semibold select-none">{systemTime}</span>
          </div>
        </div>
      ) : (
        /* eDEX-UI HUD Dock */
        <div className={`absolute bottom-6 left-0 right-0 flex justify-center z-30 select-none pointer-events-none transition-all duration-700 ease-in-out transform ${
          isMelting ? "translate-y-32 opacity-0" : "translate-y-0 opacity-100"
        }`}>
          <div className="relative pointer-events-auto">
            <span className="edex-bracket-tl" />
            <span className="edex-bracket-tr" />
            <span className="edex-bracket-bl" />
            <span className="edex-bracket-br" />
            <Dock className="pointer-events-auto !bg-[#030916]/85 !border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.18)] backdrop-blur-xl">
              {dockItems.map((item) => (
                <DockIcon 
                  key={item.id}
                  src={item.src}
                  name={item.name}
                  onClick={item.action}
                  className={`hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all ${
                    item.id === "secret" 
                      ? "bg-red-950/20 border-red-500/20 animate-pulse" 
                      : item.id === "trash" && isTrashBouncing 
                      ? "animate-bounce" 
                      : "!border-cyan-500/20 !bg-black/50"
                  }`}
                >
                  {item.isOpen && (
                    <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 select-none ${item.id === 'secret' ? 'bg-red-500 shadow-[0_0_6px_#ff0033]' : 'bg-cyan-400 shadow-[0_0_6px_#00f0ff]'}`} />
                  )}
                </DockIcon>
              ))}
            </Dock>
          </div>
        </div>
      )}

      {isMelting && (
        <MeltdownEffect onClose={() => setIsMelting(false)} />
      )}
    </div>
  );
}
