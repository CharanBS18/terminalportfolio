"use client";

import React, { useEffect, useRef, useState } from "react";

export function AudioSpectrumWidget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [comms, setComms] = useState({
    freq: 154.25,
    squelch: "ON",
    channel: "SEC-BUNKER"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setComms(prev => ({
        ...prev,
        freq: parseFloat((154.2 + Math.random() * 0.1).toFixed(3))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
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

    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cy = height / 2;
      offset += 0.08;

      // Draw horizontal center grid line
      ctx.strokeStyle = "rgba(0, 255, 140, 0.1)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      // Oscilloscope wave path drawing
      ctx.strokeStyle = "#00FF8C";
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#00FF8C";
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        // Multi-frequency wave formula simulating voice packets / radio static
        const sin1 = Math.sin(x * 0.05 + offset) * 12;
        const sin2 = Math.cos(x * 0.02 - offset * 1.5) * 6;
        const noise = (Math.random() - 0.5) * 2;
        
        // Taper amplitude at margins (left/right ends)
        const taper = Math.sin((x / width) * Math.PI);
        const y = cy + (sin1 + sin2 + noise) * taper;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Vertical marker grids
      ctx.strokeStyle = "rgba(0, 255, 140, 0.05)";
      for (let x = 20; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col font-mono text-[9px] select-none p-3 gap-2.5 bg-zinc-950/20 text-[#00FF8C]">
      {/* Wave Scope */}
      <div className="flex-1 min-h-0 bg-[#050505]/65 border border-[#00FF8C]/15 rounded-lg overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-2 left-3 text-[8px] text-zinc-500 uppercase tracking-widest pointer-events-none">
          RF Audio Intercept // Decibel: -18.2 dB
        </div>
      </div>

      {/* Military Telemetry */}
      <div className="flex justify-between items-center text-[9px] tracking-wider uppercase bg-black/40 p-2 rounded border border-[#00FF8C]/15 text-[#D2FFF0]">
        <div>FREQ: {comms.freq} MHz</div>
        <div>SQUELCH: {comms.squelch}</div>
        <div>CHAN: {comms.channel}</div>
      </div>
    </div>
  );
}
export default AudioSpectrumWidget;
