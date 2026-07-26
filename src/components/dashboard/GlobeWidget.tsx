"use client";

import React, { useEffect, useRef } from "react";

interface Pin {
  lat: number;
  lng: number;
  label: string;
  glow?: boolean;
}

interface Connection {
  from: number; // Index of pin
  to: number;   // Index of pin
}

const defaultPins: Pin[] = [
  { lat: 37.7749, lng: -122.4194, label: "San Francisco", glow: true },
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 51.5074, lng: -0.1278, label: "London", glow: true },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo", glow: true },
  { lat: 12.9716, lng: 77.5946, label: "Bengaluru", glow: true },
  { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
  { lat: 30.0444, lng: 31.2357, label: "Cairo" }
];

const defaultConnections: Connection[] = [
  { from: 4, to: 3 }, // Bengaluru -> Tokyo
  { from: 4, to: 2 }, // Bengaluru -> London
  { from: 2, to: 1 }, // London -> New York
  { from: 1, to: 0 }, // New York -> SF
  { from: 0, to: 3 }, // SF -> Tokyo
  { from: 4, to: 5 }, // Bengaluru -> Sydney
  { from: 1, to: 6 }, // New York -> São Paulo
  { from: 6, to: 7 }  // São Paulo -> Cairo
];

export function GlobeWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      width = canvas.width;
      height = canvas.height;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    // Globe parameters
    let angleX = 0.3; // Tilt
    let angleY = 0;   // Rotation angle

    // Get color values based on theme name
    const colors: Record<string, { primary: string; secondary: string; dot: string }> = {
      green: { primary: "rgba(16, 185, 129, 0.4)", secondary: "rgba(16, 185, 129, 0.08)", dot: "#34d399" },
      cyan: { primary: "rgba(6, 182, 212, 0.4)", secondary: "rgba(6, 182, 212, 0.08)", dot: "#22d3ee" },
      purple: { primary: "rgba(217, 70, 239, 0.4)", secondary: "rgba(217, 70, 239, 0.08)", dot: "#f472b6" },
      amber: { primary: "rgba(245, 158, 11, 0.4)", secondary: "rgba(245, 158, 11, 0.08)", dot: "#fbbf24" },
      red: { primary: "rgba(239, 68, 68, 0.4)", secondary: "rgba(239, 68, 68, 0.08)", dot: "#f87171" },
      white: { primary: "rgba(255, 255, 255, 0.3)", secondary: "rgba(255, 255, 255, 0.05)", dot: "#ffffff" }
    };

    const themeColors = colors[themeColor] || colors.cyan;

    // Convert lat/lng to 3D sphere coordinates
    const latLngTo3D = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      return {
        x: -(radius * Math.sin(phi) * Math.sin(theta)),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.cos(theta)
      };
    };

    // Rotate 3D point around Y and X axes
    const rotateY = (x: number, z: number, theta: number) => {
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      return {
        x: x * cos - z * sin,
        z: x * sin + z * cos
      };
    };

    const rotateX = (y: number, z: number, theta: number) => {
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      return {
        y: y * cos - z * sin,
        z: y * sin + z * cos
      };
    };

    // Draw frame
    let time = 0;
    const render = () => {
      time += 0.05;
      angleY += 0.005; // speed of rotation

      const rect = canvas.getBoundingClientRect();
      const drawW = rect.width;
      const drawH = rect.height;
      const cx = drawW / 2;
      const cy = drawH / 2;
      const radius = Math.min(drawW, drawH) * 0.45;

      ctx.clearRect(0, 0, drawW, drawH);

      // Draw outer atmosphere glow circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = themeColors.primary;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = themeColors.secondary;
      ctx.fill();

      // 1. Draw Grid lines (Latitude and Longitude circles)
      const latSteps = 7;
      const lngSteps = 12;

      // Draw latitude circles
      for (let i = 1; i < latSteps; i++) {
        const phi = (i / latSteps) * Math.PI;
        const r = radius * Math.sin(phi);
        const y3d = radius * Math.cos(phi);

        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 50; j++) {
          const theta = (j / 50) * Math.PI * 2;
          const x3d = r * Math.cos(theta);
          const z3d = r * Math.sin(theta);

          // Apply rotation
          const rY = rotateY(x3d, z3d, angleY);
          const rX = rotateX(y3d, rY.z, angleX);

          // Only draw points on the front hemisphere (z > 0)
          if (rX.z > -20) {
            if (first) {
              ctx.moveTo(cx + rY.x, cy + rX.y);
              first = false;
            } else {
              ctx.lineTo(cx + rY.x, cy + rX.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw longitude arcs
      for (let i = 0; i < lngSteps; i++) {
        const theta = (i / lngSteps) * Math.PI * 2;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 50; j++) {
          const phi = (j / 50) * Math.PI;
          const x3d = radius * Math.sin(phi) * Math.cos(theta);
          const y3d = radius * Math.cos(phi);
          const z3d = radius * Math.sin(phi) * Math.sin(theta);

          const rY = rotateY(x3d, z3d, angleY);
          const rX = rotateX(y3d, rY.z, angleX);

          if (rX.z > -20) {
            if (first) {
              ctx.moveTo(cx + rY.x, cy + rX.y);
              first = false;
            } else {
              ctx.lineTo(cx + rY.x, cy + rX.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // 2. Project Pins
      const projectedPins = defaultPins.map((pin) => {
        const pos = latLngTo3D(pin.lat, pin.lng, radius);
        const rY = rotateY(pos.x, pos.z, angleY);
        const rX = rotateX(pos.y, rY.z, angleX);
        return {
          x: cx + rY.x,
          y: cy + rX.y,
          z: rX.z,
          label: pin.label,
          glow: pin.glow
        };
      });

      // 3. Draw connections
      defaultConnections.forEach((conn) => {
        const p1 = projectedPins[conn.from];
        const p2 = projectedPins[conn.to];

        // Draw line if both points are partially on the front hemisphere
        if (p1.z > 0 || p2.z > 0) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);

          // Draw bezier curve for a "flight path/connection arc" look
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2 - Math.abs(p1.x - p2.x) * 0.15; // bend height
          ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);

          ctx.strokeStyle = p1.z > 0 && p2.z > 0 ? themeColors.primary : "rgba(255, 255, 255, 0.06)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw packet animation along path
          if (p1.z > 0 && p2.z > 0) {
            const t = (time * 0.1) % 1;
            // Quadratic bezier calculation
            const px = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
            const py = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = themeColors.dot;
            ctx.shadowBlur = 8;
            ctx.shadowColor = themeColors.dot;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          }
        }
      });

      // 4. Draw Pin dots & Labels
      projectedPins.forEach((pin) => {
        if (pin.z > 0) {
          // Drawing pin dot
          ctx.beginPath();
          ctx.arc(pin.x, pin.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = themeColors.dot;
          ctx.fill();

          // Ring animation for glowing pins
          if (pin.glow) {
            const ringRadius = 3 + (time % 8);
            const ringOpacity = 1 - (time % 8) / 8;
            ctx.beginPath();
            ctx.arc(pin.x, pin.y, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${themeColor === 'green' ? '16, 185, 129' : themeColor === 'purple' ? '217, 70, 239' : themeColor === 'amber' ? '245, 158, 11' : themeColor === 'red' ? '239, 68, 68' : themeColor === 'white' ? '255, 255, 255' : '6, 182, 212'}, ${ringOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Label
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.font = "8px monospace";
          ctx.fillText(pin.label, pin.x + 6, pin.y + 2);
        }
      });

      // Overlay cyber hud scanning grids on top of the globe
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 0.5;
      for (let y = 10; y < drawH; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(drawW, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [themeColor]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-zinc-950/20">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      {/* HUD Info Overlays */}
      <div className="absolute top-2 left-3 font-mono text-[8px] text-zinc-500 uppercase tracking-widest pointer-events-none select-none">
        Sat Link [Active] // NOD_C: 8
      </div>
      <div className="absolute bottom-2 right-3 font-mono text-[8px] text-zinc-500 uppercase pointer-events-none select-none">
        Dec: +37.7749° // Ra: 12h 45m
      </div>
    </div>
  );
}
