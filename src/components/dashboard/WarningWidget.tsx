"use client";

import React, { useEffect, useState } from "react";

interface AlertState {
  title: string;
  msg: string;
  colorClass: string;
  level: string;
}

const states: AlertState[] = [
  {
    title: "SECURITY LEVEL",
    msg: "██████████ HIGH // LEVEL-5 RESTRICTED",
    colorClass: "text-red-500 border-red-500/25 bg-red-950/15 shadow-[0_0_8px_rgba(239,68,68,0.1)]",
    level: "HIGH"
  },
  {
    title: "WARNING",
    msg: "UNKNOWN SIGNATURE DETECTED ON NODE-7",
    colorClass: "text-amber-500 border-amber-500/25 bg-amber-950/15 shadow-[0_0_8px_rgba(245,158,11,0.1)] animate-pulse",
    level: "ANOMALY"
  },
  {
    title: "SYSTEM AUDIT",
    msg: "NO ANOMALIES DETECTED // OPERATOR ONLINE",
    colorClass: "text-[#00FF8C] border-[#00FF8C]/20 bg-[#00FF8C]/5",
    level: "STABLE"
  }
];

export function WarningWidget() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % states.length);
    }, 4500 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const active = states[index];

  return (
    <div className={`w-full h-full flex flex-col font-mono text-[10px] select-none p-3 gap-2.5 transition-all duration-500 border rounded-lg ${active.colorClass}`}>
      {/* Alert Header */}
      <div className="flex justify-between items-center border-b border-current pb-1.5 uppercase font-black tracking-widest shrink-0 leading-none">
        <span>{active.title}</span>
        <span>STATUS: {active.level}</span>
      </div>

      {/* Alert message body */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-2">
        <p className="font-extrabold tracking-wider leading-relaxed text-[11px] whitespace-pre-wrap select-text">
          {active.msg}
        </p>
      </div>

      {/* Alert Footer */}
      <div className="flex justify-between text-[7.5px] opacity-70 tracking-widest uppercase shrink-0 select-none">
        <span>Audit Ref: SEC-042</span>
        <span>Terminal Ref: BUNKER-B</span>
      </div>
    </div>
  );
}
export default WarningWidget;
