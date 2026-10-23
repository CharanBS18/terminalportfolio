"use client";

import dynamic from "next/dynamic";

const DesktopContainer = dynamic(
  () => import("@/components/Desktop/DesktopContainer").then((mod) => mod.DesktopContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center font-mono text-white gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
          INITIALIZING eDEX-UI TERMINAL SYSTEM...
        </span>
      </div>
    ),
  }
);

export default function Home() {
  return <DesktopContainer />;
}
