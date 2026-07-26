"use client";

import { AsciiArt } from "../ui/sa7bi";

export function AsciiArtDemo() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AsciiArt className="h-full w-full" />
    </div>
  );
}

export { AsciiArtDemo as SurveillanceWidget };
export default AsciiArtDemo;
