"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAudio } from "@/hooks/useAudio";

interface MeltdownEffectProps {
  onClose: () => void;
}

export function MeltdownEffect({ onClose }: MeltdownEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"melting" | "warning">("melting");
  const [temperature, setTemperature] = useState(109);
  const { playBuzzer, playBeep } = useAudio();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Temperature cooldown counter effect
  useEffect(() => {
    if (phase !== "warning") return;
    const interval = setInterval(() => {
      setTemperature(prev => {
        if (prev <= 85) {
          clearInterval(interval);
          // Wait 1.2 seconds after core stabilizes, then trigger recovery!
          setTimeout(() => {
            onClose();
          }, 1200);
          return 85;
        }
        return prev - 1;
      });
    }, 150); // 150ms per degree * 24 steps = 3.6s cooldown
    return () => clearInterval(interval);
  }, [phase, onClose]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Audio alarm trigger
    playBuzzer();
    const alarmInterval = setInterval(() => {
      playBeep(988, 0.15, false);
    }, 800);

    // Physics elements array
    interface TextDrip {
      text: string;
      x: number;
      y: number;
      speed: number;
      gravity: number;
      color: string;
      font: string;
      delay: number;
    }

    const drips: TextDrip[] = [];

    // Capture exact text lines and positions currently inside the terminal
    const scrollbar = document.querySelector(".terminal-scrollbar");
    if (scrollbar) {
      const walk = (node: Element) => {
        if (node.children.length === 0) {
          if (node.textContent && node.textContent.trim()) {
            const rect = node.getBoundingClientRect();
            const style = window.getComputedStyle(node);
            drips.push({
              text: node.textContent,
              x: rect.left,
              y: rect.top + 12, // adjust for baseline
              speed: 0,
              gravity: 0.2 + Math.random() * 0.35,
              color: style.color || "#00ff41",
              font: style.font || "14px monospace",
              delay: Math.random() * 20
            });
          }
        } else {
          Array.from(node.children).forEach(walk);
        }
      };
      walk(scrollbar);
    }

    // Fallback if terminal was empty
    if (drips.length === 0) {
      const snippets = [
        "SYSTEM EXCEPTION", "CPU OVERHEAT 109C", "CORE REGISTERS DETACHED",
        "rm -rf /system/kernel", "0x7F82A0: SEGV", "FATAL CORE FAULT"
      ];
      for (let i = 0; i < 40; i++) {
        drips.push({
          text: snippets[Math.floor(Math.random() * snippets.length)],
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0,
          gravity: 0.2 + Math.random() * 0.35,
          color: "#00ff41",
          font: "14px monospace",
          delay: Math.random() * 25
        });
      }
    }

    let animationId: number;

    const draw = () => {
      // Draw trails
      ctx.fillStyle = "rgba(9, 12, 5, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drips.length; i++) {
        const drip = drips[i];
        if (drip.delay > 0) {
          drip.delay--;
          // Draw at static position initially to feel like it snaps and then drops
          ctx.fillStyle = drip.color;
          ctx.font = drip.font;
          ctx.fillText(drip.text, drip.x, drip.y);
          continue;
        }

        // Apply gravity physics
        drip.speed += drip.gravity;
        drip.y += drip.speed;

        ctx.fillStyle = drip.color;
        ctx.font = drip.font;
        ctx.fillText(drip.text, drip.x, drip.y);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Transition to BIOS warning screen after 4.5 seconds
    const phaseTimer = setTimeout(() => {
      setPhase("warning");
      cancelAnimationFrame(animationId);
      playBuzzer();
    }, 4500);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(alarmInterval);
      clearTimeout(phaseTimer);
      cancelAnimationFrame(animationId);
    };
  }, [mounted, playBuzzer, playBeep]);

  if (!mounted) return null;

  const overlay = (
    <div className="fixed inset-0 bg-[#090c05] z-[99999] flex flex-col items-center justify-center font-mono select-none overflow-hidden">
      {phase === "melting" ? (
        <canvas ref={canvasRef} className="w-full h-full block" />
      ) : (
        <div className="text-red-500 w-full max-w-2xl px-6 space-y-6 animate-pulse select-text text-left">
          <div className="border border-red-500 bg-red-950/20 p-4 rounded text-center font-bold tracking-widest text-lg drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            ⚠️ SYSTEM THERMAL OVERLOAD ⚠️
          </div>

          <div className="space-y-2 text-sm leading-relaxed font-semibold">
            <p>CRITICAL TEMPERATURE EXCEEDED: <span className="text-white font-bold">{temperature}°C</span> (MAX LIMIT: 85°C)</p>
            <p className="text-zinc-500 mt-2">--------------------------------------------------</p>
            <p>0x7F82A0: CORE_PANIC: Instruction pointer corrupted.</p>
            <p>0x7F82C4: THERMAL_THROTTLING_FAILED: Fan spindle lock detected.</p>
            <p>
              {temperature > 85 ? (
                <span className="text-yellow-500 animate-pulse">EMERGENCY FLUID DUMP TRIGGERED... COOLING CORES DOWN...</span>
              ) : (
                <span className="text-green-500 font-bold">COOLDOWN COMPLETED. CORE TEMPERATURE STABILIZED AT 85°C.</span>
              )}
            </p>
            <p className="text-zinc-500 mt-2">--------------------------------------------------</p>
          </div>

          <div className="flex justify-center items-center gap-2 pt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping mr-2" />
            <span className="text-xs uppercase tracking-wider text-red-400">Rebooting DEV-OS in recovery mode...</span>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
