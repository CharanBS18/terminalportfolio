"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface NetworkWidgetProps {
  themeColor?: string;
  className?: string;
}

export function NetworkWidget({ themeColor = "cyan", className = "" }: NetworkWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bandwidthHistory, setBandwidthHistory] = useState<number[]>(Array(30).fill(25));
  const [trafficRate, setTrafficRate] = useState(5.4);
  const packetStormRef = useRef(false);

  useTerminalEvent((detail: { command: string }) => {
    const { command } = detail;
    if (["certificates", "projects", "contact", "github", "about", "hack"].includes(command)) {
      setBandwidthHistory((prev) => {
        const next = [...prev.slice(1)];
        next.push(95);
        return next;
      });
      setTrafficRate(22.8);
      packetStormRef.current = true;
      setTimeout(() => {
        setTrafficRate(4.8);
        packetStormRef.current = false;
      }, 3000);
    } else if (command === "clear") {
      setBandwidthHistory(Array(30).fill(10));
      setTrafficRate(1.2);
    }
  });

  // Bandwidth update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidthHistory((prev) => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        // Random walk with boundaries
        const fluctuation = (Math.random() - 0.5) * 8;
        const newVal = Math.max(10, Math.min(90, last + fluctuation));
        if (!packetStormRef.current) {
          setTrafficRate(parseFloat((newVal / 10 + 2.5).toFixed(1)));
        }
        next.push(newVal);
        return next;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Nodes connection network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width;
    let height = canvas.height;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      width = canvas.width;
      height = canvas.height;
    };

    resize();
    window.addEventListener("resize", resize);

    const themeColors: Record<string, { primary: string; secondary: string; glow: string }> = {
      green: { primary: "16, 185, 129", secondary: "52, 211, 153", glow: "#10b981" },
      cyan: { primary: "6, 182, 212", secondary: "34, 211, 238", glow: "#06b6d4" },
      purple: { primary: "217, 70, 239", secondary: "244, 114, 182", glow: "#d946ef" },
      amber: { primary: "245, 158, 11", secondary: "251, 191, 36", glow: "#f59e0b" },
      red: { primary: "239, 68, 68", secondary: "248, 113, 113", glow: "#ef4444" },
      white: { primary: "255, 255, 255", secondary: "228, 228, 231", glow: "#ffffff" }
    };

    const colorScheme = themeColors[themeColor] || themeColors.cyan;

    const nodes: Node[] = [];
    const nodeCount = 18;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5
      });
    }

    let packets: { x: number; y: number; tx: number; ty: number; progress: number; speed: number }[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.25;
            ctx.strokeStyle = `rgba(${colorScheme.primary}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Spawn packet particles on line occasionally
            const prob = packetStormRef.current ? 0.08 : 0.002;
            const maxPackets = packetStormRef.current ? 40 : 15;
            if (Math.random() < prob && packets.length < maxPackets) {
              packets.push({
                x: n1.x,
                y: n1.y,
                tx: n2.x,
                ty: n2.y,
                progress: 0,
                speed: 0.01 + Math.random() * 0.015
              });
            }
          }
        }
      }

      // Draw packets moving
      packets.forEach((p, index) => {
        const speed = p.speed * (packetStormRef.current ? 3.0 : 1.0);
        p.progress += speed;
        p.x = p.x + (p.tx - p.x) * p.progress;
        p.y = p.y + (p.ty - p.y) * p.progress;

        ctx.fillStyle = colorScheme.glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        if (p.progress >= 1) {
          packets.splice(index, 1);
        }
      });

      // Draw and update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.fillStyle = `rgba(${colorScheme.primary}, 0.75)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node glow outer ring
        if (Math.random() < 0.05) {
          ctx.strokeStyle = `rgba(${colorScheme.secondary}, 0.15)`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [themeColor]);

  // Construct SVG path for bandwidth graph
  const points = bandwidthHistory.map((val, idx) => {
    const x = (idx / 29) * 100; // 0 to 100%
    const y = 100 - val;       // 100 to 0 (origin top-left)
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <div className={`edex-panel select-none overflow-hidden flex flex-col font-mono text-zinc-300 ${className}`}>
      {/* Corner Brackets */}
      <span className="edex-bracket-tl" />
      <span className="edex-bracket-tr" />
      <span className="edex-bracket-bl" />
      <span className="edex-bracket-br" />

      {/* Header telemetry strip */}
      <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1 flex items-center justify-between text-[10px] shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_4px_#00f0ff]" />
          <span className="font-bold tracking-widest text-cyan-200 uppercase">
            [ NETWORK_TELEMETRY // TRAFFIC_IO ]
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[9px] text-cyan-400/80">
          <span>{trafficRate} MB/s</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400 font-bold">14ms PING</span>
        </div>
      </div>

      {/* Node Canvas Viewport */}
      <div className="flex-1 relative min-h-0 bg-[#070709]/40 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-1.5 left-2 text-[8px] text-cyan-400/70 uppercase tracking-widest pointer-events-none bg-black/60 px-1 py-0.2 border border-cyan-500/20 rounded-xs">
          ETH0: 192.168.1.102 // GATEWAY: 192.168.1.1
        </div>
      </div>

      {/* Bandwidth Monitor Graph */}
      <div className="h-[75px] p-2 flex flex-col shrink-0 bg-black/50 border-t border-cyan-500/15">
        <div className="flex justify-between items-center text-[8px] text-zinc-400 mb-1 uppercase font-bold">
          <span className="text-cyan-300">IO BANDWIDTH SPECTRUM</span>
          <span className="text-cyan-200 font-mono">RX: {(trafficRate * 0.75).toFixed(1)}M / TX: {(trafficRate * 0.25).toFixed(1)}M</span>
        </div>

        <div className="flex-1 min-h-0 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`net-glow-${themeColor}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid helper lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(0,240,255,0.08)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,240,255,0.08)" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(0,240,255,0.08)" strokeWidth="0.5" />

            {/* Filled area */}
            <polygon
              points={fillPoints}
              fill={`url(#net-glow-${themeColor})`}
            />

            {/* Plot stroke line */}
            <polyline
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.5"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Open Listening Ports Footer */}
      <div className="bg-[#030914] border-t border-cyan-500/15 px-2.5 py-1 flex items-center justify-between text-[8px] text-zinc-400 shrink-0">
        <span className="text-zinc-500">PORTS:</span>
        <div className="flex items-center gap-1.5 font-mono text-[7px]">
          <span className="px-1 py-0.2 rounded-xs bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">3000:HTTP</span>
          <span className="px-1 py-0.2 rounded-xs bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">22:SSH</span>
          <span className="px-1 py-0.2 rounded-xs bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">443:TLS</span>
        </div>
        <span className="text-emerald-400 font-bold">1000M/FDX</span>
      </div>
    </div>
  );
}
