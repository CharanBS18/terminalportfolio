"use client";

import { AsciiArt } from "@/components/ui/choso-ascii";

export function AsciiArtDemo() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AsciiArt className="h-full w-full" />
    </div>
  );
}

export { AsciiArtDemo as SurveillanceWidget };
export default AsciiArtDemo;

