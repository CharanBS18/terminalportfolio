"use client";

import React from "react";

export function AsciiArtWidget() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
      <video
        className="w-full h-full object-cover select-none pointer-events-none"
        src="https://assets.21st.dev/ascii-recipes/videos/user_39720J8FZrHCoGeL23ljF4x20L3/ffa79616-dc73-4587-93ba-ff3f8ff354ef.mp4"
        poster="https://assets.21st.dev/ascii-recipes/thumbnails/user_39720J8FZrHCoGeL23ljF4x20L3/9b9bf5f4-272f-415d-bbb6-436ffba39927.webp"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Terminal Pikachu — animated ASCII art"
      />
      {/* Overlay CRT grid lines */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/30" />
      <div className="absolute top-2 left-3 font-mono text-[8px] text-zinc-500 uppercase tracking-widest pointer-events-none select-none">
        ASCII PIC VECTOR FEED // 30 FPS
      </div>
    </div>
  );
}
