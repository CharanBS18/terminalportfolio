"use client";

import React, { useState, useCallback } from "react";
import { initialFilesystem } from "@/lib/filesystem";
import { FSNode, DirectoryNode, FileNode } from "@/lib/types";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";
import { useAudio } from "@/hooks/useAudio";
import { Folder, HardDrive, CornerUpLeft, FileText, Code2, FileCode } from "lucide-react";

interface EDexFilesystemPanelProps {
  onExecuteCommand?: (cmd: string) => void;
  className?: string;
}

export function EDexFilesystemPanel({
  onExecuteCommand,
  className = "",
}: EDexFilesystemPanelProps) {
  const [currentPath, setCurrentPath] = useState<string[]>(["home", "charan"]);
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

  const handleFolderClick = (name: string) => {
    playBeep(660, 0.04);
    const newPath = [...currentPath, name];
    setCurrentPath(newPath);
    dispatchCommand(`cd ${name}`);
  };

  const handleFileClick = (name: string) => {
    playClick();
    dispatchCommand(`cat ${name}`);
  };

  const handleGoUp = () => {
    if (currentPath.length > 0) {
      playBeep(440, 0.04);
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      dispatchCommand("cd ..");
    }
  };

  const handleShowDisks = () => {
    playBeep(520, 0.04);
    setCurrentPath([]);
    dispatchCommand("cd /");
  };

  // Convert children to sorted list (directories first, then files)
  const items = Object.entries(currentNode.children || {}).sort((a, b) => {
    if (a[1].type === b[1].type) return a[0].localeCompare(b[0]);
    return a[1].type === "directory" ? -1 : 1;
  });

  const displayPath = currentPath.length === 0 ? "/" : `/${currentPath.join("/")}`;

  return (
    <div className={`edex-panel select-none overflow-hidden flex flex-col font-mono text-zinc-300 ${className}`}>
      {/* Corner Brackets */}
      <span className="edex-bracket-tl" />
      <span className="edex-bracket-tr" />
      <span className="edex-bracket-bl" />
      <span className="edex-bracket-br" />

      {/* Header bar matching eDEX-UI */}
      <div className="bg-[#0e0e13] border-b border-white/10 px-3 py-1 flex items-center justify-between text-[10px] text-zinc-400 font-bold tracking-wider shrink-0 uppercase">
        <span>FILESYSTEM</span>
        <span className="text-[9px] text-zinc-500 font-mono lowercase truncate max-w-[65%]">
          dotfiles hidden - {displayPath}
        </span>
      </div>

      {/* Grid of File & Folder Icons */}
      <div className="flex-1 p-2.5 overflow-y-auto edex-scrollbar grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-6 gap-2 content-start min-h-0">
        {/* Action: Show Disks */}
        <button
          onClick={handleShowDisks}
          className="flex flex-col items-center justify-center p-1.5 rounded-xs hover:bg-white/10 text-zinc-400 hover:text-white transition-colors group cursor-pointer"
          title="Show disks (Root)"
        >
          <div className="w-8 h-8 flex items-center justify-center mb-1 text-zinc-300 group-hover:scale-105 transition-transform">
            <HardDrive className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="text-[8px] font-mono text-center truncate w-full">
            Show disks
          </span>
        </button>

        {/* Action: Go up */}
        <button
          onClick={handleGoUp}
          disabled={currentPath.length === 0}
          className="flex flex-col items-center justify-center p-1.5 rounded-xs hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors group cursor-pointer"
          title="Go up"
        >
          <div className="w-8 h-8 flex items-center justify-center mb-1 text-zinc-300 group-hover:scale-105 transition-transform">
            <CornerUpLeft className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="text-[8px] font-mono text-center truncate w-full">
            Go up
          </span>
        </button>

        {/* Dynamic Nodes from InitialFilesystem */}
        {items.map(([name, node]) => {
          const isDir = node.type === "directory";
          const isJson = name.endsWith(".json") || name.endsWith(".ts");

          return (
            <button
              key={name}
              onClick={() => (isDir ? handleFolderClick(name) : handleFileClick(name))}
              className="flex flex-col items-center justify-center p-1.5 rounded-xs hover:bg-white/10 text-zinc-400 hover:text-white transition-colors group cursor-pointer"
              title={name}
            >
              <div className="w-8 h-8 flex items-center justify-center mb-1 text-zinc-300 group-hover:scale-105 transition-transform">
                {isDir ? (
                  <Folder className="w-6 h-6 stroke-[1.5] fill-zinc-800 text-zinc-200" />
                ) : isJson ? (
                  <FileCode className="w-6 h-6 stroke-[1.5] text-zinc-300" />
                ) : (
                  <FileText className="w-6 h-6 stroke-[1.5] text-zinc-400" />
                )}
              </div>
              <span className="text-[8px] font-mono text-center truncate w-full">
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="bg-[#0e0e13] border-t border-white/10 px-3 py-1 flex items-center justify-between text-[9px] text-zinc-500 font-mono shrink-0">
        <span>Mount {displayPath} used 71%</span>
        <span className="text-zinc-600">eDEX-FS v2.2</span>
      </div>
    </div>
  );
}
