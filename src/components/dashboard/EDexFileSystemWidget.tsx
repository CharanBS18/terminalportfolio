"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Folder, FileText, ChevronRight, HardDrive, CornerUpLeft, Home } from "lucide-react";
import { initialFilesystem } from "@/lib/filesystem";
import { FSNode, DirectoryNode, FileNode } from "@/lib/types";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";
import { useAudio } from "@/hooks/useAudio";

interface EDexFileSystemWidgetProps {
  themeColor?: string;
  onExecuteCommand?: (cmd: string) => void;
  className?: string;
}

export function EDexFileSystemWidget({
  themeColor = "cyan",
  onExecuteCommand,
  className = "",
}: EDexFileSystemWidgetProps) {
  // Current path segments relative to root (e.g. ['home', 'charan'])
  const [currentPath, setCurrentPath] = useState<string[]>(["home", "charan"]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { playClick, playBeep } = useAudio();

  // Helper to resolve directory node from path
  const resolveNode = useCallback((path: string[]): DirectoryNode | null => {
    let curr: FSNode = initialFilesystem;
    for (const segment of path) {
      if (curr.type !== "directory" || !curr.children[segment]) {
        return null;
      }
      curr = curr.children[segment];
    }
    return curr.type === "directory" ? curr : null;
  }, []);

  // Listen to terminal commands to sync path (e.g. if user types `cd skills` or `cd ..`)
  useTerminalEvent((detail) => {
    const cmd = (detail.command || "").trim();
    if (cmd.startsWith("cd ")) {
      const target = cmd.slice(3).trim();
      if (target === ".." || target === "../") {
        setCurrentPath((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
      } else if (target === "~" || target === "/home/charan") {
        setCurrentPath(["home", "charan"]);
      } else if (target === "/" || target === "root") {
        setCurrentPath([]);
      } else {
        // Check if directory exists in current folder
        const cleanTarget = target.replace(/\/$/, "");
        setCurrentPath((prev) => {
          const testPath = [...prev, cleanTarget];
          const node = resolveNode(testPath);
          return node ? testPath : prev;
        });
      }
    }
  });

  const currentNode = resolveNode(currentPath) || (initialFilesystem as DirectoryNode);

  const dispatchCommand = useCallback(
    (cmd: string) => {
      playClick();
      if (onExecuteCommand) {
        onExecuteCommand(cmd);
      } else if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("edex-command", {
            detail: { command: cmd },
          })
        );
      }
    },
    [onExecuteCommand, playClick]
  );

  const navigateTo = (newPath: string[]) => {
    playBeep(660, 0.05);
    setCurrentPath(newPath);
    setSelectedItem(null);
  };

  const handleItemClick = (name: string, node: FSNode) => {
    setSelectedItem(name);
    if (node.type === "directory") {
      playClick();
      const newPath = [...currentPath, name];
      setCurrentPath(newPath);
      dispatchCommand(`cd ${name}`);
    } else {
      playClick();
      dispatchCommand(`cat ${name}`);
    }
  };

  const handleGoUp = () => {
    if (currentPath.length > 0) {
      playBeep(440, 0.05);
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      dispatchCommand("cd ..");
    }
  };

  const handleGoHome = () => {
    playBeep(520, 0.05);
    setCurrentPath(["home", "charan"]);
    dispatchCommand("cd ~");
  };

  // Convert children to sorted list (directories first, then files)
  const items = Object.entries(currentNode.children || {}).sort((a, b) => {
    if (a[1].type === b[1].type) return a[0].localeCompare(b[0]);
    return a[1].type === "directory" ? -1 : 1;
  });

  return (
    <div className={`edex-panel select-none overflow-hidden flex flex-col font-mono text-zinc-300 ${className}`}>
      {/* Corner Brackets */}
      <span className="edex-bracket-tl" />
      <span className="edex-bracket-tr" />
      <span className="edex-bracket-bl" />
      <span className="edex-bracket-br" />

      {/* Header telemetry strip */}
      <div className="bg-[#040e1f]/95 border-b border-cyan-500/20 px-3 py-1 flex items-center justify-between text-[10px] shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_4px_#00f0ff]" />
          <span className="font-bold tracking-widest text-cyan-200 uppercase">
            [ FILESYSTEM // VFS_EXPLORER ]
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[9px] text-cyan-400/80">
          <span className="text-zinc-500">{items.length} NODES</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400 font-bold">MOUNTED</span>
        </div>
      </div>

      {/* Quick Nav & Breadcrumb bar */}
      <div className="bg-black/50 border-b border-cyan-500/15 px-2 py-1 flex items-center justify-between gap-1 text-[9px] shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto edex-scrollbar py-0.5 max-w-[70%]">
          <button
            onClick={() => navigateTo([])}
            className={`px-1 rounded-xs transition-colors cursor-pointer ${
              currentPath.length === 0
                ? "bg-cyan-500/30 text-cyan-200 font-bold"
                : "text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            }`}
            title="Root"
          >
            /
          </button>
          {currentPath.map((seg, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-2.5 h-2.5 text-cyan-500/40 shrink-0" />
              <button
                onClick={() => navigateTo(currentPath.slice(0, idx + 1))}
                className={`px-1 rounded-xs transition-colors cursor-pointer truncate max-w-[80px] ${
                  idx === currentPath.length - 1
                    ? "bg-cyan-500/30 text-cyan-200 font-bold"
                    : "text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                {seg}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleGoUp}
            disabled={currentPath.length === 0}
            className="px-1.5 py-0.5 rounded-xs border border-cyan-500/20 text-cyan-400/80 hover:text-cyan-100 hover:border-cyan-400 hover:bg-cyan-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-0.5 text-[8px]"
            title="Go up one directory"
          >
            <CornerUpLeft className="w-2.5 h-2.5" /> UP
          </button>
          <button
            onClick={handleGoHome}
            className="px-1.5 py-0.5 rounded-xs border border-cyan-500/20 text-cyan-400/80 hover:text-cyan-100 hover:border-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer flex items-center gap-0.5 text-[8px]"
            title="Go to ~"
          >
            <Home className="w-2.5 h-2.5" /> ~
          </button>
        </div>
      </div>

      {/* Storage Disk Capacity Bar */}
      <div className="px-2.5 py-1 bg-[#020713]/80 border-b border-cyan-500/10 flex items-center justify-between text-[8px] text-zinc-400 shrink-0">
        <span className="flex items-center gap-1 text-cyan-400">
          <HardDrive className="w-2.5 h-2.5" /> /dev/vfs0
        </span>
        <div className="flex items-center gap-2">
          <span>42.8 GB / 512 GB</span>
          <div className="w-16 h-1.5 bg-zinc-900 rounded-xs overflow-hidden border border-cyan-500/20">
            <div className="w-[8.3%] h-full bg-cyan-400" />
          </div>
          <span className="text-cyan-300 font-bold">8.3%</span>
        </div>
      </div>

      {/* File & Folder Grid/List */}
      <div className="flex-1 overflow-y-auto p-2 edex-scrollbar min-h-0 space-y-1">
        {items.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-[10px] italic">
            [ EMPTY DIRECTORY ]
          </div>
        ) : (
          items.map(([name, node]) => {
            const isDir = node.type === "directory";
            const isSelected = selectedItem === name;
            const childCount = isDir ? Object.keys((node as DirectoryNode).children || {}).length : null;
            const fileSize = !isDir ? `${Math.max(1, Math.round(((node as FileNode).content?.length || 100) / 1024 * 10) / 10)} KB` : `${childCount} items`;

            return (
              <div
                key={name}
                onClick={() => handleItemClick(name, node)}
                className={`group flex items-center justify-between px-2 py-1.5 rounded-xs border transition-all cursor-pointer text-[9px] ${
                  isSelected
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-100 shadow-[0_0_8px_rgba(0,240,255,0.25)]"
                    : "bg-black/30 border-cyan-500/15 text-zinc-300 hover:bg-cyan-500/10 hover:border-cyan-400/40 hover:text-cyan-200"
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {isDir ? (
                    <Folder className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                  )}
                  <span className="font-bold truncate tracking-wide">
                    {name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[8px] text-zinc-500 shrink-0 font-mono">
                  <span>{fileSize}</span>
                  <span className={`px-1 py-0.2 rounded-xs text-[7px] uppercase border ${
                    isDir
                      ? "border-cyan-500/30 text-cyan-400 bg-cyan-950/40"
                      : "border-emerald-500/30 text-emerald-400 bg-emerald-950/40"
                  }`}>
                    {isDir ? "DIR" : "FILE"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="bg-[#030914] border-t border-cyan-500/15 px-2.5 py-1 flex items-center justify-between text-[8px] text-zinc-500 shrink-0">
        <span>CLICK TO CD / CAT</span>
        <span className="text-cyan-400/80">VFS_SYNC: ACTIVE</span>
      </div>
    </div>
  );
}
