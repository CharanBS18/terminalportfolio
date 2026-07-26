"use client";

import { useEffect, useRef, useState, useCallback } from "react";
// @ts-ignore
import createGlobe from "cobe";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

interface PulseMarker {
  id: string;
  location: [number, number];
  delay: number;
}

interface GlobePulseProps {
  markers?: PulseMarker[];
  className?: string;
  speed?: number;
  themeColor?: string;
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-london", location: [51.5074, -0.1278], delay: 0 },
  { id: "pulse-ny", location: [40.7128, -74.006], delay: 0.5 },
  { id: "pulse-tokyo", location: [35.6895, 139.6917], delay: 1 },
  { id: "pulse-sydney", location: [-33.8688, 151.2093], delay: 1.5 },
];

export function GlobePulse({
  markers: propMarkers,
  className = "",
  speed = 0.003,
  themeColor = "green",
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const [activeMarkers, setActiveMarkers] = useState<PulseMarker[]>(defaultMarkers);
  const [telemetry, setTelemetry] = useState({
    lat: 35.6895,
    lng: 139.6917,
    signal: 98,
    satellite: "ORION-12",
    status: "TRACKING",
  });

  const themeColors: Record<string, string> = {
    green: "#00FF8C",
    cyan: "#00FFD0",
    purple: "#a855f7",
    amber: "#f59e0b",
    red: "#ef4444",
    white: "#ffffff"
  };
  const color = themeColors[themeColor] || "#00FF8C";

  const themeRGBs: Record<string, { base: [number, number, number], marker: [number, number, number], glow: [number, number, number] }> = {
    green: { base: [0.02, 0.2, 0.1], marker: [0.0, 1.0, 0.55], glow: [0.02, 0.08, 0.04] },
    cyan: { base: [0.02, 0.15, 0.2], marker: [0.0, 0.8, 1.0], glow: [0.02, 0.06, 0.08] },
    purple: { base: [0.15, 0.02, 0.2], marker: [0.8, 0.2, 1.0], glow: [0.06, 0.02, 0.08] },
    amber: { base: [0.2, 0.12, 0.02], marker: [1.0, 0.62, 0.0], glow: [0.08, 0.05, 0.01] },
    red: { base: [0.2, 0.02, 0.02], marker: [1.0, 0.15, 0.15], glow: [0.08, 0.01, 0.01] },
    white: { base: [0.15, 0.15, 0.15], marker: [1.0, 1.0, 1.0], glow: [0.08, 0.08, 0.08] }
  };
  const colors = themeRGBs[themeColor] || themeRGBs.green;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  // Terminal event updates
  useTerminalEvent((detail: { command: string }) => {
    const { command } = detail;
    let targetLat = 35.6895;
    let targetLng = 139.6917;
    let satName = "ORION-12";
    let statusText = "TRACKING";
    let newMarkers = [...defaultMarkers];

    if (command === "about") {
      targetLat = 12.9716;
      targetLng = 77.5946;
      satName = "SECURE-IND-GW";
      statusText = "LOCKED";
      newMarkers = [
        ...defaultMarkers,
        { id: "pulse-blr", location: [12.9716, 77.5946], delay: 0 },
      ];
    } else if (command === "certificates") {
      targetLat = 37.7749;
      targetLng = -122.4194;
      satName = "US-WEST-DECOY";
      statusText = "LOCKED";
      newMarkers = [
        ...defaultMarkers,
        { id: "pulse-sf", location: [37.7749, -122.4194], delay: 0.2 },
      ];
    } else if (command === "skills") {
      targetLat = 51.5074;
      targetLng = -0.1278;
      satName = "EU-NEXUS-01";
      statusText = "LOCKED";
    } else if (command === "hack") {
      targetLat = 0.0;
      targetLng = 0.0;
      satName = "UNKNOWN_NODE";
      statusText = "COMPROMISED";
    }

    setTelemetry({
      lat: targetLat,
      lng: targetLng,
      signal: command === "hack" ? 4 : 99,
      satellite: satName,
      status: statusText,
    });
    setActiveMarkers(newMarkers);
  });

  // Fluctuating values for coordinates slightly to feel "alive"
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        if (prev.status === "COMPROMISED") return prev;
        const dLat = (Math.random() - 0.5) * 0.005;
        const dLng = (Math.random() - 0.5) * 0.005;
        return {
          ...prev,
          lat: parseFloat((prev.lat + dLat).toFixed(4)),
          lng: parseFloat((prev.lng + dLng).toFixed(4)),
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const markers = propMarkers || activeMarkers;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: colors.base,
        markerColor: colors.marker,
        glowColor: colors.glow,
        markerElevation: 0.02,
        markers: markers.map((m) => ({ location: m.location, size: 0.04, id: m.id })),
        arcs: [],
        arcColor: colors.marker,
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.85,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  return (
    <div 
      className={`w-full h-full flex flex-col font-mono text-[9px] select-none bg-black/40 ${className}`}
      style={{ color }}
    >
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scaleX(0.3) scaleY(0.3); opacity: 0.8; }
          100% { transform: scaleX(1.5) scaleY(1.5); opacity: 0; }
        }
      `}</style>

      {/* Globe aspect-square wrapper */}
      <div className="flex-1 min-h-0 flex items-center justify-center relative p-1.5 overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          style={{
            width: "140px",
            height: "140px",
            cursor: "grab",
            opacity: 0,
            transition: "opacity 1.2s ease",
            borderRadius: "50%",
            touchAction: "none",
          }}
        />
        {markers.map((m) => (
          <div
            key={m.id}
            style={{
              position: "absolute",
              // @ts-ignore
              positionAnchor: `--cobe-${m.id}`,
              bottom: "anchor(center)",
              left: "anchor(center)",
              translate: "-50% 50%",
              width: 24,
              height: 24,
              display: "none", // Anchor positioning is fallback, hide if unsupported
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none" as const,
              opacity: `var(--cobe-visible-${m.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
              transition: "opacity 0.4s, filter 0.4s",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                border: `1.5px solid ${color}`,
                borderRadius: "50%",
                opacity: 0,
                animation: `pulse-expand 2s ease-out infinite ${m.delay}s`,
              }}
            />
            <span
              style={{
                width: 6,
                height: 6,
                background: color,
                borderRadius: "50%",
                boxShadow: `0 0 0 2px #111, 0 0 0 4px ${color}`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Telemetry Readout Grid */}
      <div 
        className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t pt-2 text-[8.5px] bg-black/50 p-2.5 rounded-b-lg font-mono"
        style={{ borderColor: `${color}25` }}
      >
        <div className="flex justify-between border-b pb-0.5" style={{ borderColor: `${color}10` }}>
          <span className="opacity-50">LAT:</span>
          <span className="font-extrabold text-[#D2FFF0]">{telemetry.lat}</span>
        </div>
        <div className="flex justify-between border-b pb-0.5" style={{ borderColor: `${color}10` }}>
          <span className="opacity-50">LONG:</span>
          <span className="font-extrabold text-[#D2FFF0]">{telemetry.lng}</span>
        </div>
        <div className="flex justify-between border-b pb-0.5" style={{ borderColor: `${color}10` }}>
          <span className="opacity-50">SIGNAL:</span>
          <span className="font-extrabold text-[#D2FFF0]">{telemetry.signal}%</span>
        </div>
        <div className="flex justify-between border-b pb-0.5" style={{ borderColor: `${color}10` }}>
          <span className="opacity-50">SAT:</span>
          <span className="font-extrabold text-[#D2FFF0]">{telemetry.satellite}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="opacity-50">SYS_STATUS:</span>
          <span className="font-extrabold text-[#D2FFF0] animate-pulse">{telemetry.status}</span>
        </div>
      </div>
    </div>
  );
}
