"use client";

import React, { useEffect, useState } from "react";
import { Cpu, Server, Activity, ShieldCheck, Radio } from "lucide-react";

export function FutureEnvironment2099({ isGlitching = false }: { isGlitching?: boolean }) {
  const [timeText, setTimeText] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "SYS_INIT: SECURE LINK SOLVED",
    "CYBERNETIC_INTEGRITY: 100% OK",
    "NEURAL_INTERCEPT: PORTFOLIO_LOCK",
    "AI_CORE: NEURON-v9.4 ACTIVE",
    "ROBOTICS_LINK: STANDBY"
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeText(now.toISOString().replace("T", "  ").slice(0, -1));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logPool = [
      "SYNAPSE_BURST: LEVEL 3 RESOLVED",
      "GRAVITY_SANDBOX: PHYSICS_SOLVER_READY",
      "ATMOSPHERE_DENSITY: SECURE",
      "VORTEX_RAD: 0.00 RAD/S",
      "AI_DIAGNOSTIC: NEURAL NETWORKS CONVERGED",
      "DEFENSE_GRID: SHIELD MAX LEVEL",
      "MEMORY_SECTOR: BUFFER OVERFLOW PREVENTED",
      "PORT_WARP: DIMENSION_2099_ENFORCED",
      "ROBOTICS_LINK: DRONE_04 FEEDING TELEMETRY"
    ];

    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev];
        next.shift();
        next.push(logPool[Math.floor(Math.random() * logPool.length)]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full h-full text-cyan-400 font-mono select-none overflow-hidden transition-all duration-300 ${
      isGlitching ? "brightness-150 contrast-200 blur-[1px]" : "opacity-55"
    }`}>
      {/* Glowing Grid Background with perspective */}
      <div className="absolute inset-0 bg-[#02050a]">
        <div className="absolute inset-0 opacity-15"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0, 240, 255, 0.25) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 240, 255, 0.25) 1px, transparent 1px)
               `,
               backgroundSize: "40px 40px",
               transform: "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(0)",
               transformOrigin: "top center",
               height: "200%"
             }}
        />
      </div>

      {/* Cybernetic HUD Interface elements */}
      {/* 1. Large Holographic Radar / Tech Ring (Center-Right) */}
      <div className="absolute top-[45%] right-[15%] -translate-y-1/2 w-[400px] h-[400px] flex items-center justify-center opacity-70 pointer-events-none scale-75 md:scale-100">
        {/* Animated Concentric Circles */}
        <div className="absolute inset-0 border-2 border-dashed border-cyan-500/25 rounded-full animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-8 border border-fuchsia-500/30 rounded-full" />
        <div className="absolute inset-16 border-2 border-cyan-400/20 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
        <div className="absolute inset-28 border border-dashed border-fuchsia-400/40 rounded-full" />
        
        {/* Scope crosshairs */}
        <div className="absolute w-full h-[1px] bg-cyan-500/25" />
        <div className="absolute h-full w-[1px] bg-cyan-500/25" />
        
        {/* Glowing Node Points */}
        <div className="absolute top-24 left-1/3 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff] animate-ping" />
        <div className="absolute bottom-28 right-24 w-1.5 h-1.5 bg-fuchsia-400 rounded-full shadow-[0_0_6px_#d946ef]" />
        <div className="absolute top-36 right-32 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />

        <div className="text-center text-[10px] uppercase font-bold text-cyan-400/70 select-none">
          <div>NEURAL SCANNER</div>
          <div className="text-[12px] text-fuchsia-400 font-mono tracking-widest mt-1">SYS: STEADY</div>
        </div>
      </div>

      {/* 2. Advanced Robotics / AI Schematics (Bottom Left) */}
      <div className="absolute bottom-8 left-8 w-[320px] bg-black/60 border border-cyan-500/30 backdrop-blur-md rounded-lg p-4 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
          <span className="text-xs font-bold flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-4 h-4 animate-pulse text-fuchsia-400" /> ROBOTIC SCHEMA v4.0
          </span>
          <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-bold">
            LINKED
          </span>
        </div>

        {/* Minimal Robotic Arm Vector Graphic SVG */}
        <div className="h-28 w-full flex items-center justify-center bg-cyan-950/20 border border-cyan-900/40 rounded p-2 relative overflow-hidden">
          <svg className="w-full h-full text-cyan-400/80" viewBox="0 0 100 50">
            {/* Cybernetic schematics lines */}
            <path d="M10 40 L35 30 L60 38 L90 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="40" r="3" fill="currentColor" />
            <circle cx="35" cy="30" r="3.5" fill="currentColor" />
            <circle cx="60" cy="38" r="3" fill="currentColor" />
            <circle cx="90" cy="20" r="4.5" className="animate-pulse text-fuchsia-400" fill="currentColor" />
            
            {/* Diagnostic target crosshair */}
            <circle cx="90" cy="20" r="7" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" className="animate-spin" />
            
            {/* Grid background lines inside widget */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeWidth="0.1" strokeDasharray="3" />
            <line x1="50" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.1" strokeDasharray="3" />
          </svg>
          <div className="absolute top-1 right-2 text-[8px] text-cyan-400/50">ROBOTICS UNIT 09</div>
        </div>

        {/* Diagnostic info list */}
        <div className="grid grid-cols-2 gap-2 text-[9px] text-cyan-400/80">
          <div className="bg-cyan-500/5 p-1 rounded border border-cyan-900/20">
            <span className="text-cyan-400/50">MOTORS:</span> ONLINE
          </div>
          <div className="bg-cyan-500/5 p-1 rounded border border-cyan-900/20">
            <span className="text-cyan-400/50">JOINT_X:</span> 145.2°
          </div>
          <div className="bg-cyan-500/5 p-1 rounded border border-cyan-900/20">
            <span className="text-cyan-400/50">TORQUE:</span> NOMINAL
          </div>
          <div className="bg-cyan-500/5 p-1 rounded border border-cyan-900/20">
            <span className="text-cyan-400/50">HYD_PSI:</span> 3,420
          </div>
        </div>
      </div>

      {/* 3. AI Core Diagnostic logs (Top Right) */}
      <div className="absolute top-8 right-8 w-[340px] bg-black/60 border border-fuchsia-500/30 backdrop-blur-md rounded-lg p-4 shadow-[0_0_20px_rgba(217,70,239,0.15)] flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-fuchsia-500/30 pb-2">
          <span className="text-xs font-bold flex items-center gap-1.5 text-fuchsia-400">
            <Server className="w-4 h-4 text-cyan-400" /> AI ENGINE FEED
          </span>
          <span className="text-[9px] text-cyan-400/60 font-semibold">{timeText}</span>
        </div>

        {/* Real-time cycling logs */}
        <div className="flex flex-col gap-1 text-[9px] text-cyan-400/90 h-[100px] overflow-hidden">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-1.5 border-l-2 border-fuchsia-500 pl-1.5">
              <span className="text-cyan-400/50">{`[0${idx + 1}]`}</span>
              <span className="truncate">{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Futuristic Architecture outline (Center Background Vector) */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[250px] opacity-15 pointer-events-none select-none">
        <svg className="w-full h-full text-cyan-400" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* Cyberpunk high-tech tower silhouettes and grids */}
          <polygon points="10,100 20,40 30,40 40,100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <polygon points="35,100 50,15 65,15 80,100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <polygon points="75,100 85,50 95,50 105,100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <polygon points="100,100 120,5 140,5 160,100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <polygon points="150,100 165,35 180,35 195,100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          
          {/* Horizontal deck lines */}
          <line x1="0" y1="95" x2="200" y2="95" stroke="currentColor" strokeWidth="0.5" />
          <line x1="0" y1="90" x2="200" y2="90" stroke="currentColor" strokeWidth="0.25" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* 5. Glowing Central Grid Ring & AI Telemetry Stats Widget */}
      <div className="absolute top-[28%] left-[20%] flex flex-col gap-2 opacity-80 border-l border-cyan-500/30 pl-4 py-2">
        <div className="text-[10px] text-cyan-400/60 uppercase">SYSTEM FEED</div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-fuchsia-400 animate-pulse" />
          <span className="text-sm font-bold text-fuchsia-400">SIGNAL SYNC ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-cyan-300">FIREWALL LEVEL 9</span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-300">NET_LINK: SECURE</span>
        </div>
      </div>

      {/* Futuristic scanning laser line */}
      <div className="absolute left-0 w-full h-[2px] bg-fuchsia-500/40 shadow-[0_0_10px_#d946ef] animate-[scan_6s_linear_infinite]" />

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
