"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

interface Pin {
  lat: number;
  lng: number;
  label: string;
}

const defaultPins: Pin[] = [
  { lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 51.5074, lng: -0.1278, label: "London" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney" },
];

export function EDexNetworkPanel({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [trafficHistory, setTrafficHistory] = useState<number[]>(Array(40).fill(0));
  const [outMb, setOutMb] = useState(38.8);
  const [inMb, setInMb] = useState(552.0);
  const [ping, setPing] = useState(17);

  // Periodic waveform generation
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step += 0.2;
      setTrafficHistory((prev) => {
        const next = [...prev.slice(1)];
        // Generate technical EEG/telemetry-like spikes and waves
        const base = Math.sin(step) * 25;
        const noise = (Math.random() - 0.5) * 15;
        const spike = Math.random() > 0.85 ? (Math.random() > 0.5 ? 45 : -45) : 0;
        const val = Math.max(-50, Math.min(50, base + noise + spike));
        next.push(val);
        return next;
      });

      setOutMb((prev) => parseFloat((prev + Math.random() * 0.1).toFixed(1)));
      setInMb((prev) => parseFloat((prev + Math.random() * 0.4).toFixed(1)));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // React to terminal commands
  useTerminalEvent((detail) => {
    const cmd = (detail.command || "").toLowerCase();
    if (["projects", "skills", "certificates", "hack", "sudo", "github"].includes(cmd)) {
      setPing(8);
      setTrafficHistory((prev) => prev.map(() => (Math.random() - 0.5) * 90));
      setTimeout(() => setPing(17), 3000);
    }
  });

  // Canvas 3D Vector Globe (pure black background, white dots)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angleY = 0;
    let angleX = 0.25;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    resize();
    window.addEventListener("resize", resize);

    // Convert lat/lng to 3D sphere coordinates
    const latLngTo3D = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return {
        x: -(r * Math.sin(phi) * Math.sin(theta)),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.cos(theta),
      };
    };

    const rotateY = (x: number, z: number, theta: number) => ({
      x: x * Math.cos(theta) - z * Math.sin(theta),
      z: x * Math.sin(theta) + z * Math.cos(theta),
    });

    const rotateX = (y: number, z: number, theta: number) => ({
      y: y * Math.cos(theta) - z * Math.sin(theta),
      z: y * Math.sin(theta) + z * Math.cos(theta),
    });

    // Generate latitude/longitude ring points
    const spherePoints: { x: number; y: number; z: number }[] = [];
    const radius = 62;
    for (let lat = -75; lat <= 75; lat += 20) {
      for (let lng = 0; lng < 360; lng += 15) {
        spherePoints.push(latLngTo3D(lat, lng, radius));
      }
    }

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      angleY += 0.007;

      // Draw faint wireframe sphere circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Render sphere dots
      spherePoints.forEach((p) => {
        const rY = rotateY(p.x, p.z, angleY);
        const rX = rotateX(p.y, rY.z, angleX);
        if (rX.z > 0) {
          const alpha = Math.max(0.08, rX.z / radius);
          ctx.beginPath();
          ctx.arc(cx + rY.x, cy + rX.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.fill();
        }
      });

      // Render pins and flight arcs
      const projPins = defaultPins.map((p) => {
        const pt = latLngTo3D(p.lat, p.lng, radius);
        const rY = rotateY(pt.x, pt.z, angleY);
        const rX = rotateX(pt.y, rY.z, angleX);
        return { x: cx + rY.x, y: cy + rX.y, z: rX.z, label: p.label };
      });

      // Arcs connecting Bengaluru to other hubs
      const p0 = projPins[0];
      for (let i = 1; i < projPins.length; i++) {
        const pTarget = projPins[i];
        if (p0.z > -10 || pTarget.z > -10) {
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          const midX = (p0.x + pTarget.x) / 2;
          const midY = (p0.y + pTarget.y) / 2 - 15;
          ctx.quadraticCurveTo(midX, midY, pTarget.x, pTarget.y);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw pin dots
      projPins.forEach((pin, idx) => {
        if (pin.z > 0) {
          ctx.beginPath();
          ctx.arc(pin.x, pin.y, idx === 0 ? 3 : 2, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();

          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.font = "8px monospace";
          ctx.fillText(pin.label, pin.x + 4, pin.y + 2);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Build SVG path for technical waveform line chart
  const points = trafficHistory
    .map((val, idx) => {
      const x = (idx / (trafficHistory.length - 1)) * 100;
      // Map -50..+50 to 80..20 in SVG viewBox 0..100
      const y = 50 - (val / 50) * 40;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className={`edex-panel select-none overflow-hidden flex flex-col font-mono text-zinc-300 ${className}`}>
      {/* Corner Brackets */}
      <span className="edex-bracket-tl" />
      <span className="edex-bracket-tr" />
      <span className="edex-bracket-bl" />
      <span className="edex-bracket-br" />

      {/* Header bar matching eDEX-UI */}
      <div className="bg-[#0e0e13] border-b border-white/10 px-3 py-1 flex items-center justify-between text-[10px] text-zinc-400 font-bold tracking-wider shrink-0 uppercase">
        <span>PANEL</span>
        <span>NETWORK</span>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-3 flex flex-col justify-between gap-3 min-h-0 overflow-y-auto edex-scrollbar text-[10px]">
        {/* Section 1: Network Status */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-zinc-400">
            <span>NETWORK STATUS</span>
            <span className="text-[8px] text-zinc-500 font-normal">Interface: en0</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[9px] uppercase">
            <div>
              <div className="text-[8px] text-zinc-500">STATE</div>
              <div className="text-emerald-400 font-bold">ONLINE</div>
            </div>
            <div>
              <div className="text-[8px] text-zinc-500">IPv4</div>
              <div className="text-zinc-200 font-bold">192.168.1.102</div>
            </div>
            <div>
              <div className="text-[8px] text-zinc-500">PING</div>
              <div className="text-zinc-200 font-bold">{ping}ms</div>
            </div>
          </div>
        </div>

        {/* Section 2: World View & 3D Globe */}
        <div className="border-t border-white/5 pt-2 flex-1 flex flex-col min-h-[160px]">
          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-zinc-400">
            <span>WORLD VIEW</span>
            <span className="text-[8px] text-zinc-500 font-normal">GLOBAL NETWORK MAP</span>
          </div>

          <div className="flex justify-between text-[8px] text-zinc-500 uppercase mt-0.5">
            <span>ENDPOINT LAT/LON</span>
            <span className="text-zinc-300 font-bold">12.9716, 77.5946</span>
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center my-1 bg-black">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Section 3: Network Traffic Waveform Chart */}
        <div className="border-t border-white/5 pt-2 space-y-1 shrink-0">
          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-zinc-400">
            <span>NETWORK TRAFFIC</span>
            <span className="text-[8px] text-zinc-500 font-normal">UP / DOWN, MB/S</span>
          </div>

          <div className="flex justify-between text-[8px] text-zinc-500 uppercase">
            <span>TOTAL</span>
            <span className="text-zinc-300 font-bold">
              {outMb} MB OUT, {inMb} MB IN
            </span>
          </div>

          {/* Waveform SVG Chart */}
          <div className="h-20 w-full relative bg-black border border-white/10 mt-1 p-1">
            {/* Y Axis Reference Labels */}
            <div className="absolute top-1 right-1 text-[7px] text-zinc-600 font-mono pointer-events-none">
              +0.05
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-1 text-[7px] text-zinc-600 font-mono pointer-events-none">
              0.00
            </div>
            <div className="absolute bottom-1 right-1 text-[7px] text-zinc-600 font-mono pointer-events-none">
              -0.05
            </div>

            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Center Zero Line */}
              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeDasharray="2,2"
                strokeWidth="0.75"
              />
              {/* Upper & Lower grid lines */}
              <line
                x1="0"
                y1="15"
                x2="100"
                y2="15"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="85"
                x2="100"
                y2="85"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="0.5"
              />

              {/* Technical Waveform Stroke */}
              <polyline
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
