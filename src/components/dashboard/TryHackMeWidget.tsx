"use client";

import React, { useState, useMemo } from "react";
import { 
  Flame, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  Cpu, 
  Globe, 
  Filter, 
  Code, 
  Zap, 
  Lock, 
  Eye, 
  X 
} from "lucide-react";
import { PORTFOLIO_DATA, SecurityLab } from "@/data/portfolioData";

interface TryHackMeWidgetProps {
  themeColor?: string;
  onOpenOfficial?: () => void;
}

export function TryHackMeWidget({ themeColor = "red", onOpenOfficial }: TryHackMeWidgetProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState<SecurityLab | null>(null);

  const platforms = ["All", "TryHackMe", "PortSwigger", "LabEx", "Local VM"];

  const filteredLabs = useMemo(() => {
    return PORTFOLIO_DATA.securityLabs.filter(lab => {
      const matchesPlatform = activeTab === "All" || lab.platform === activeTab;
      const matchesQuery = 
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.attackVector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.techniques.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesPlatform && matchesQuery;
    });
  }, [activeTab, searchQuery]);

  const platformBadgeStyle = (platform: SecurityLab["platform"]) => {
    switch (platform) {
      case "TryHackMe":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "PortSwigger":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "LabEx":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      case "Local VM":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-white/10";
    }
  };

  const difficultyStyle = (diff: SecurityLab["difficulty"]) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
      case "Medium":
        return "bg-amber-500/15 text-amber-400 border-amber-500/25";
      case "Hard":
      case "Advanced":
        return "bg-red-500/15 text-red-400 border-red-500/25";
      default:
        return "bg-zinc-800 text-zinc-300 border-white/10";
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white font-sans overflow-hidden select-none">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-red-950/40 via-zinc-900/90 to-zinc-950 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
            <Flame className="w-5 h-5 text-red-400 fill-red-500/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                Security Labs & Solved Rooms Hub
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Operator: <span className="text-red-400 font-bold">charanbs</span> • Multi-Platform Penetration Testing Records
            </p>
          </div>
        </div>

        {/* Official Links & CTA Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={PORTFOLIO_DATA.contacts.tryhackme}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpenOfficial}
            className="group px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(225,29,72,0.35)] cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-white fill-white/30" />
            <span>Open Official TryHackMe Profile</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>

          <a
            href="https://portswigger.net/web-security"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="PortSwigger Web Security Academy"
          >
            <span>PortSwigger</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2.5 bg-zinc-900/60 border-b border-white/5 text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <Layers className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>Total Solved: <strong className="text-white font-bold">{PORTFOLIO_DATA.securityLabs.length}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Platforms: <strong className="text-white font-bold">4 Ecosystems</strong></span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Focus: <strong className="text-white font-bold">OWASP & PrivEsc</strong></span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Exploit Chains: <strong className="text-white font-bold">Full Takeovers</strong></span>
        </div>
      </div>

      {/* Search and Platform Filter Bar */}
      <div className="p-3 bg-zinc-950/70 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        {/* Platform Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {platforms.map(p => {
            const count = p === "All" 
              ? PORTFOLIO_DATA.securityLabs.length 
              : PORTFOLIO_DATA.securityLabs.filter(l => l.platform === p).length;
            const isActive = activeTab === p;
            return (
              <button
                key={p}
                onClick={() => setActiveTab(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "bg-red-600 text-white shadow-md shadow-red-950 font-semibold" 
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>{p}</span>
                <span className={`text-[10px] px-1 rounded-full font-mono ${isActive ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by vulnerability (e.g. XSS, SQLi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-8 pr-7 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/60 font-mono transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid View of Solved Rooms */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-zinc-950/40">
        {filteredLabs.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-zinc-500 font-mono gap-2">
            <ShieldAlert className="w-8 h-8 text-zinc-600" />
            <p className="text-xs">No security labs match filter &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
              className="text-[11px] text-red-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                onClick={() => setSelectedLab(lab)}
                className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-white/10 hover:border-red-500/50 rounded-xl p-3.5 flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md"
              >
                {/* Card Top: Badges & Platform */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${platformBadgeStyle(lab.platform)}`}>
                      {lab.platform}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${difficultyStyle(lab.difficulty)}`}>
                        {lab.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25">
                        <CheckCircle2 className="w-2.5 h-2.5" /> SOLVED
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-red-300 leading-snug line-clamp-1 transition-colors">
                    {lab.title}
                  </h3>

                  {/* Kill Chain / Attack Vector Snippet */}
                  <div className="bg-black/60 border border-white/5 rounded-md px-2 py-1.5 font-mono text-[10px] text-zinc-300 flex items-start gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 text-zinc-300 font-semibold">{lab.attackVector}</span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {lab.summary}
                  </p>
                </div>

                {/* Card Bottom: Techniques & Actions */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex flex-wrap gap-1">
                    {lab.techniques.slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="text-[9px] font-mono bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded"
                      >
                        #{tech}
                      </span>
                    ))}
                    {lab.techniques.length > 3 && (
                      <span className="text-[9px] font-mono text-zinc-500 px-1 py-0.5">
                        +{lab.techniques.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                    <span className="flex items-center gap-1 font-mono text-zinc-500">
                      <Lock className="w-3 h-3 text-zinc-500" /> {lab.category}
                    </span>
                    <span className="text-red-400 group-hover:text-red-300 font-semibold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Quick Look
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lab Detail / Exploit Breakdown Lightbox Modal */}
      {selectedLab && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans"
          onClick={() => setSelectedLab(null)}
        >
          <div 
            className="bg-zinc-950 border border-red-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{selectedLab.title}</h3>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
                    <span className={`px-1.5 py-0.2 rounded ${platformBadgeStyle(selectedLab.platform)}`}>
                      {selectedLab.platform}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-300">{selectedLab.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">SOLVED</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLab(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Attack Vector Box */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3.5 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Primary Exploit Vector & Kill Chain
                </div>
                <div className="text-xs font-mono text-zinc-200 font-semibold bg-black/50 p-2.5 rounded-lg border border-red-500/10">
                  {selectedLab.attackVector}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  Methodology & Assessment Breakdown
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-white/5">
                  {selectedLab.summary}
                </p>
              </div>

              {/* Techniques Learned & Tested */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  Demonstrated Techniques & Tools
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLab.techniques.map(tech => (
                    <span 
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-zinc-200 border border-white/10 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-zinc-900/90 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-zinc-500 font-mono">
                Operator: charanbs
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedLab.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {selectedLab.platform === "TryHackMe" ? "Open Official Profile" : `Open ${selectedLab.platform}`}
                </a>
                <button
                  onClick={() => setSelectedLab(null)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
