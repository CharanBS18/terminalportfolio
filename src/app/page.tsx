"use client";

import dynamic from "next/dynamic";

const DesktopContainer = dynamic(
  () => import("@/components/Desktop/DesktopContainer").then((mod) => mod.DesktopContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-[#020610] flex flex-col items-center justify-center font-mono text-cyan-400 gap-4">
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_#00f0ff]" />
        <span className="text-xs uppercase tracking-widest animate-pulse font-bold">
          INITIALIZING eDEX-UI TERMINAL SYSTEM...
        </span>
      </div>
    ),
  }
);

export default function Home() {
  return <DesktopContainer />;
}
