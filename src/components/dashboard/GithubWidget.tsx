"use client";

import React, { useEffect, useState } from "react";
import { GitCommit, Star, GitBranch } from "lucide-react";

interface Commit {
  repo: string;
  hash: string;
  message: string;
  time: string;
}

interface Repo {
  name: string;
  lang: string;
  stars: number;
  forks: number;
}

const repos: Repo[] = [
  { name: "chterminal", lang: "TypeScript", stars: 142, forks: 24 },
  { name: "neural-sandbox", lang: "Python", stars: 98, forks: 15 },
  { name: "packet-sniffer-go", lang: "Go", stars: 210, forks: 45 },
  { name: "cyber-hud", lang: "React", stars: 64, forks: 8 }
];

const commitMessages = [
  "refactor: optimize rendering pipeline",
  "fix: buffer overflow in socket listener",
  "feat: add quantum firewall module",
  "docs: update API key rotation guide",
  "chore: bump framer-motion version",
  "security: patch zero-day remote exploit"
];

export function GithubWidget({ themeColor = "cyan" }: { themeColor?: string }) {
  const [commits, setCommits] = useState<Commit[]>([
    { repo: "chterminal", hash: "aef93b2", message: "initial cyber workstation commit", time: "2 min ago" },
    { repo: "packet-sniffer-go", hash: "9f32d81", message: "impl raw packet parser socket reader", time: "12 min ago" },
    { repo: "neural-sandbox", hash: "bc418a0", message: "train model on user activity signatures", time: "1 hr ago" }
  ]);

  // Live commits trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setCommits((prev) => {
        const next = [...prev];
        const randomRepo = repos[Math.floor(Math.random() * repos.length)].name;
        const randomMsg = commitMessages[Math.floor(Math.random() * commitMessages.length)];
        const hash = Math.random().toString(16).substring(2, 9);
        
        next.unshift({
          repo: randomRepo,
          hash,
          message: randomMsg,
          time: "Just now"
        });

        // Cap at 4 items
        if (next.length > 4) next.pop();
        return next.map((c, i) => i === 0 ? c : { ...c, time: i === 1 ? "1 min ago" : i === 2 ? "5 min ago" : "15 min ago" });
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Generate dynamic heatmap blocks
  // 52 columns x 7 rows
  const [heatmap, setHeatmap] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial matrix intensities (0 to 4)
    const initial = Array(52 * 7).fill(0).map(() => Math.floor(Math.random() * 5));
    setHeatmap(initial);

    // Minor updates to simulate new activity
    const interval = setInterval(() => {
      setHeatmap((prev) => {
        const next = [...prev];
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = Math.max(0, Math.min(4, next[idx] + (Math.random() > 0.5 ? 1 : -1)));
        }
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Style map for contribution cell levels based on theme color
  const getCellColor = (level: number) => {
    if (level === 0) return "bg-zinc-900/40 border border-white/5";

    const colors: Record<string, string[]> = {
      green: [
        "bg-emerald-950/40 border border-emerald-900/25",
        "bg-emerald-900/50 border border-emerald-800/35",
        "bg-emerald-700/60 border border-emerald-600/45 shadow-[0_0_4px_rgba(16,185,129,0.2)]",
        "bg-emerald-500/80 border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"
      ],
      cyan: [
        "bg-cyan-950/40 border border-cyan-900/25",
        "bg-cyan-900/50 border border-cyan-800/35",
        "bg-cyan-700/60 border border-cyan-600/45 shadow-[0_0_4px_rgba(6,182,212,0.2)]",
        "bg-cyan-500/80 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-pulse"
      ],
      purple: [
        "bg-fuchsia-950/40 border border-fuchsia-900/25",
        "bg-fuchsia-900/50 border border-fuchsia-800/35",
        "bg-fuchsia-700/60 border border-fuchsia-600/45 shadow-[0_0_4px_rgba(217,70,239,0.2)]",
        "bg-fuchsia-500/80 border border-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.4)] animate-pulse"
      ],
      amber: [
        "bg-amber-950/40 border border-amber-900/25",
        "bg-amber-900/50 border border-amber-800/35",
        "bg-amber-700/60 border border-amber-600/45 shadow-[0_0_4px_rgba(245,158,11,0.2)]",
        "bg-amber-500/80 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-pulse"
      ],
      red: [
        "bg-red-950/40 border border-red-900/25",
        "bg-red-900/50 border border-red-800/35",
        "bg-red-700/60 border border-red-600/45 shadow-[0_0_4px_rgba(239,68,68,0.2)]",
        "bg-red-500/80 border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse"
      ],
      white: [
        "bg-zinc-800/40 border border-zinc-700/25",
        "bg-zinc-700/50 border border-zinc-600/35",
        "bg-zinc-500/60 border border-zinc-400/45 shadow-[0_0_4px_rgba(255,255,255,0.1)]",
        "bg-white border border-zinc-200 shadow-[0_0_8px_rgba(255,255,255,0.2)] animate-pulse"
      ]
    };

    const scheme = colors[themeColor] || colors.cyan;
    return scheme[level - 1] || scheme[0];
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-[10px] select-none p-3 gap-3 bg-zinc-950/20">
      {/* 1. Heatmap Container */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-zinc-500 text-[9px] uppercase tracking-widest">
          <span>Git Activity Heatmap [52 Weeks]</span>
          <span className="flex gap-1 items-center">
            Less <span className="w-2 h-2 rounded bg-zinc-900" />
            <span className="w-2 h-2 rounded bg-cyan-900/50" />
            <span className="w-2 h-2 rounded bg-cyan-500/80" /> More
          </span>
        </div>

        {/* Heatmap Grid Wrapper */}
        <div className="w-full overflow-x-auto select-none py-1 flex items-center scrollbar-none">
          <div className="grid grid-flow-col grid-rows-7 gap-[2px] shrink-0 mx-auto">
            {heatmap.map((level, idx) => (
              <div
                key={idx}
                className={`w-[6px] h-[6px] rounded-[1px] transition-colors duration-500 ${getCellColor(level)}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Horizontal divider */}
      <div className="h-[1px] bg-white/5" />

      {/* 3. Repo Info & Commits */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left Column: Repository Lists */}
        <div className="flex flex-col gap-1.5">
          <span className="text-zinc-500 text-[8px] uppercase tracking-wider">Repositories [Total: 14]</span>
          <div className="flex-1 flex flex-col gap-1 bg-black/35 border border-white/5 rounded p-2 overflow-y-auto">
            {repos.map((repo, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0 hover:bg-white/5 px-1 rounded transition-colors">
                <span className="font-bold text-zinc-300 flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-zinc-500" /> {repo.name}
                </span>
                <div className="flex items-center gap-3 text-zinc-500 text-[9px]">
                  <span className="text-[8px] bg-white/5 px-1 rounded">{repo.lang}</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 text-yellow-500/80" /> {repo.stars}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Commits Feed */}
        <div className="flex flex-col gap-1.5">
          <span className="text-zinc-500 text-[8px] uppercase tracking-wider">Live Repository Commit Feed</span>
          <div className="flex-1 flex flex-col gap-1.5 bg-black/35 border border-white/5 rounded p-2 overflow-y-auto">
            {commits.map((commit, idx) => (
              <div key={idx} className="flex flex-col border-l border-zinc-700 pl-2 text-[9px] leading-tight">
                <div className="flex justify-between items-center text-zinc-500 text-[8px]">
                  <span className={`font-semibold ${themeColor === 'white' ? 'text-white' : `text-${themeColor}-400`}`}>
                    {commit.repo} @ {commit.hash}
                  </span>
                  <span>{commit.time}</span>
                </div>
                <p className="text-zinc-300 truncate mt-0.5">{commit.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
