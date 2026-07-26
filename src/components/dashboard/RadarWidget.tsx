"use client";

import React, { useEffect, useRef } from "react";

interface Target {
  x: number;
  y: number;
  r: number;
  opacity: number;
  label: string;
}

export function RadarWidget({ themeColor = "cyan" }: { themeColor?: string }) {
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
      canvas.width = rect.width;
      canvas.height = rect.height;
      width = canvas.width;
      height = canvas.height;
    };

    resize();
    window.addEventListener("resize", resize);

    // Radar scan parameters
    let sweepAngle = 0;
    const sweepSpeedRef = { current: 0.02 };

    // Fixed mock targets on the radar screen
    const targets: Target[] = [
      { x: 0.3, y: -0.4, r: 4, opacity: 0, label: "NODE-7" },
      { x: -0.6, y: 0.2, r: 3, opacity: 0, label: "PROXY-X" },
      { x: 0.5, y: 0.6, r: 5, opacity: 0, label: "INTRUDER" },
      { x: -0.2, y: -0.7, r: 4, opacity: 0, label: "SAT-LINK" }
    ];

    const handleCommand = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { command } = customEvent.detail;
      
      // Accelerate scan
      sweepSpeedRef.current = 0.095;
      setTimeout(() => {
        sweepSpeedRef.current = 0.02;
      }, 3500);

      // Add temporary blips
      if (command === "certificates") {
        targets.push({ x: 0.1, y: 0.5, r: 5, opacity: 1, label: "CERT_VERIFIED" });
      } else if (command === "skills") {
        targets.push({ x: -0.4, y: -0.4, r: 4, opacity: 1, label: "CALIBRATING" });
      } else if (command === "hack") {
        targets.push(
          { x: 0.2, y: 0.2, r: 6, opacity: 1, label: "BREACH_WARN" },
          { x: -0.2, y: 0.6, r: 5, opacity: 1, label: "ALERT_NODE" }
        );
      }
    };

    window.addEventListener("terminalCommand", handleCommand);

    const themeColors: Record<string, { stroke: string; fill: string; target: string }> = {
      green: { stroke: "rgba(0, 255, 140, 0.3)", fill: "rgba(0, 255, 140, 0.02)", target: "#00FF8C" },
      cyan: { stroke: "rgba(0, 255, 208, 0.3)", fill: "rgba(0, 255, 208, 0.02)", target: "#00FFD0" },
      purple: { stroke: "rgba(147, 255, 182, 0.3)", fill: "rgba(147, 255, 182, 0.02)", target: "#93FFB6" },
      amber: { stroke: "rgba(245, 158, 11, 0.3)", fill: "rgba(245, 158, 11, 0.02)", target: "#F59E0B" },
      red: { stroke: "rgba(239, 68, 68, 0.35)", fill: "rgba(239, 68, 68, 0.02)", target: "#EF4444" },
      white: { stroke: "rgba(210, 255, 240, 0.25)", fill: "rgba(210, 255, 240, 0.02)", target: "#D2FFF0" }
    };

    const colors = themeColors[themeColor] || themeColors.cyan;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.44;

      // Draw radar background circles
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 0.5;

      // Concentric circles
      for (let r = 0.25; r <= 1.0; r += 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Draw sweeping beam line
      sweepAngle += sweepSpeedRef.current;
      if (sweepAngle >= Math.PI * 2) sweepAngle = 0;

      const beamX = cx + Math.cos(sweepAngle) * radius;
      const beamY = cy + Math.sin(sweepAngle) * radius;

      // Draw sweep tail gradient (fade out clockwise)
      const tailSegments = 45;
      for (let i = 0; i < tailSegments; i++) {
        const angle = sweepAngle - (i * 0.015);
        const alpha = (1 - i / tailSegments) * 0.18;
        const segmentX = cx + Math.cos(angle) * radius;
        const segmentY = cy + Math.sin(angle) * radius;

        ctx.strokeStyle = `rgba(${themeColor === 'green' ? '16, 185, 129' : themeColor === 'purple' ? '217, 70, 239' : themeColor === 'amber' ? '245, 158, 11' : themeColor === 'red' ? '239, 68, 68' : themeColor === 'white' ? '255, 255, 255' : '6, 182, 212'}, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(segmentX, segmentY);
        ctx.stroke();
      }

      // Sweep line header
      ctx.strokeStyle = colors.target;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(beamX, beamY);
      ctx.stroke();

      // Draw targets
      targets.forEach((target) => {
        // Compute target coordinate relative to center
        const tx = cx + target.x * radius;
        const ty = cy + target.y * radius;

        // Compute angle of target relative to center
        let targetAngle = Math.atan2(target.y, target.x);
        if (targetAngle < 0) targetAngle += Math.PI * 2;

        // Calculate angular distance
        const angleDiff = Math.abs(sweepAngle - targetAngle);

        // If sweep line crosses, light up
        if (angleDiff < 0.05) {
          target.opacity = 1.0;
        } else {
          // Decays slowly over time
          target.opacity = Math.max(0, target.opacity - 0.006);
        }

        if (target.opacity > 0) {
          // Target point
          ctx.beginPath();
          ctx.arc(tx, ty, target.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${themeColor === 'green' ? '52, 211, 153' : themeColor === 'purple' ? '244, 114, 182' : themeColor === 'amber' ? '251, 191, 36' : themeColor === 'red' ? '248, 113, 113' : themeColor === 'white' ? '255, 255, 255' : '34, 211, 238'}, ${target.opacity})`;
          ctx.fill();

          // Blip pulse rings
          const ringRad = target.r + (1 - target.opacity) * 12;
          ctx.beginPath();
          ctx.arc(tx, ty, ringRad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${themeColor === 'green' ? '16, 185, 129' : themeColor === 'purple' ? '217, 70, 239' : themeColor === 'amber' ? '245, 158, 11' : themeColor === 'red' ? '239, 68, 68' : themeColor === 'white' ? '255, 255, 255' : '6, 182, 212'}, ${target.opacity * 0.3})`;
          ctx.stroke();

          // Text label
          ctx.fillStyle = `rgba(255, 255, 255, ${target.opacity * 0.75})`;
          ctx.font = "8px monospace";
          ctx.fillText(target.label, tx + 6, ty + 2);
        }
      });

      // Overlay static CRT line scanner
      ctx.fillStyle = colors.fill;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("terminalCommand", handleCommand);
      cancelAnimationFrame(animationId);
    };
  }, [themeColor]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-zinc-950/20">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* HUD Info Labels */}
      <div className="absolute top-2 left-3 font-mono text-[8px] text-zinc-500 uppercase tracking-widest pointer-events-none select-none">
        Radar Target Scanner // Range: 50KM
      </div>
      <div className="absolute bottom-2 right-3 font-mono text-[8px] text-zinc-500 uppercase pointer-events-none select-none">
        Sweep: ACTIVE // Azm: SCANNING
      </div>
    </div>
  );
}
