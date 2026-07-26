import { useRef, useState } from "react";

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dev_os_mute") === "true";
    }
    return false;
  });
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleMute = () => {
    const nextVal = !isMuted;
    setIsMuted(nextVal);
    localStorage.setItem("dev_os_mute", String(nextVal));
  };

  const getAudioContext = (): AudioContext | null => {
    if (isMuted) return null;
    if (typeof window === "undefined") return null;

    if (!audioCtxRef.current) {
      // Browser compatibility
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  };

  // Synthesizes a mechanical keyboard click
  const playClick = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // High pitch, rapid decay
    osc.type = "sine";
    // Slightly randomize pitch for realism
    const pitch = 1100 + Math.random() * 300;
    osc.frequency.setValueAtTime(pitch, time);
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.03);

    gain.gain.setValueAtTime(0.012, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.04);
  };

  // Synthesizes a system retro beep
  const playBeep = (freq = 880, duration = 0.15, isRetro = true) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isRetro ? "square" : "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.03, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  };

  // Synthesizes a static glitch buzz
  const playBuzzer = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, time);
    // Add jitter
    osc.frequency.linearRampToValueAtTime(140, time + 0.1);
    osc.frequency.linearRampToValueAtTime(70, time + 0.2);
    osc.frequency.linearRampToValueAtTime(110, time + 0.3);

    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.35);
  };

  // Synthesizes rapid disk clicks
  const playDiskAccess = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const clickCount = 4 + Math.floor(Math.random() * 4);
    let delay = 0;

    for (let i = 0; i < clickCount; i++) {
      setTimeout(() => {
        const time = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(300 + Math.random() * 100, time);
        gain.gain.setValueAtTime(0.02, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.015);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.025);
      }, delay);
      
      delay += 30 + Math.random() * 40;
    }
  };

  return {
    isMuted,
    toggleMute,
    playClick,
    playBeep,
    playBuzzer,
    playDiskAccess
  };
}
