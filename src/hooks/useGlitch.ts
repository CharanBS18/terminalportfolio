import { useState, useCallback } from "react";

export type GlitchType = "flicker" | "static" | "invert" | "none";

export function useGlitch(playBuzzer: () => void) {
  const [isGlitched, setIsGlitched] = useState(false);
  const [glitchType, setGlitchType] = useState<GlitchType>("none");
  const [glitchPrompt, setGlitchPrompt] = useState(false);

  const triggerGlitchEffect = useCallback((duration = 500) => {
    setIsGlitched(true);
    setGlitchPrompt(true);
    playBuzzer();

    // Select a random visual glitch style
    const types: GlitchType[] = ["flicker", "static", "invert"];
    const randType = types[Math.floor(Math.random() * types.length)];
    setGlitchType(randType);

    setTimeout(() => {
      setIsGlitched(false);
      setGlitchType("none");
      setGlitchPrompt(false);
    }, duration);
  }, [playBuzzer]);

  const checkGlitchOnCommand = useCallback((count: number) => {
    if (count < 20) return;

    // After 20 commands, 8% chance to trigger visual/audio distortion
    const roll = Math.random();
    if (roll < 0.08) {
      const duration = 200 + Math.random() * 800;
      triggerGlitchEffect(duration);
    }
  }, [triggerGlitchEffect]);

  return {
    isGlitched,
    glitchType,
    glitchPrompt,
    triggerGlitchEffect,
    checkGlitchOnCommand
  };
}
