"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MatrixRainProps {
  onClose: () => void;
}

export function MatrixRain({ onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark that document is available for portal mounting
    setTimeout(() => setMounted(true), 0);
  }, []);

  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Clear coordinates on mouse leave
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Matrix characters (mix of Japanese, alphanumeric, and hacking symbols)
    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ*+-<>[]{}@#$%&";
    const charArr = chars.split("");

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);

    // Initial drops y-coordinates
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // stagger start
    }

    let animationId: number;

    const draw = () => {
      // Semi-transparent black background to create tail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        let drawX = i * fontSize;
        let drawY = drops[i] * fontSize;

        // Calculate forcefield deflection from mouse
        const dx = drawX - mouseRef.current.x;
        const dy = drawY - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 130;

        if (dist < forceRadius && dist > 0) {
          const force = (forceRadius - dist) / forceRadius; // 0 (outer limit) to 1 (cursor center)
          const angle = Math.atan2(dy, dx);
          // Push coordinates outward
          drawX += Math.cos(angle) * force * 50;
          drawY += Math.sin(angle) * force * 50;
        }

        // Render high glow on the head character of the drop stream
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#00ff66";
        } else {
          ctx.fillStyle = "#00ff66";
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, drawX, drawY);

        // Reset drop to top once it hits screen bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Close rain on keypress or click
    const handleKeyDown = () => {
      onClose();
    };

    const handleClick = () => {
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (canvas) {
        canvas.removeEventListener("click", handleClick);
      }
      cancelAnimationFrame(animationId);
    };
  }, [mounted, onClose]);

  const overlay = (
    <div className="fixed inset-0 bg-black z-50 cursor-pointer overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-4 right-4 text-xs font-mono text-[#00ff66] animate-pulse bg-black/60 px-3 py-1.5 rounded border border-[#00ff66]/30 pointer-events-none select-none">
        PRESS ESC OR CLICK ANYWHERE TO RETRACT
      </div>
    </div>
  );

  if (mounted && typeof document !== "undefined") {
    return createPortal(overlay, document.body);
  }

  return null;
}
