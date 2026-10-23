import { useState, useCallback, useEffect } from "react";
import { HistoryItem, CommandContext } from "@/lib/types";
import { initialFilesystem } from "@/lib/filesystem";
import { registry } from "@/lib/commands/registry";
import { useAudio } from "./useAudio";
import { useGlitch } from "./useGlitch";

interface UseTerminalOptions {
  onSystemCrash?: () => void;
  onSystemRecovery?: () => void;
  initialDimension?: string;
}

export function useTerminal(options?: UseTerminalOptions) {
  const {
    isMuted,
    toggleMute,
    playClick,
    playBeep,
    playBuzzer,
    playDiskAccess
  } = useAudio();

  const {
    isGlitched,
    glitchType,
    glitchPrompt,
    triggerGlitchEffect
  } = useGlitch(playBuzzer);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandInputs, setCommandInputs] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState<string[]>(["home", "charan"]);
  const [theme, setTheme] = useState("cyan");
  const [dimension, setDimension] = useState(options?.initialDimension || "edex");
  const [isMelting, setIsMelting] = useState(false);
  const [isTornadoActive, setIsTornadoActive] = useState(false);
  const [isSandboxActive, setIsSandboxActive] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isSecretEndingActive, setIsSecretEndingActive] = useState(false);
  const [secretSequence, setSecretSequence] = useState<string[]>([]);
  const [tempInputVal, setTempInputVal] = useState("");
  
  // Interactive Story Mode User Progression State
  const [userState, setUserState] = useState<"guest" | "visitor" | "developer" | "root" | "charan">("guest");

  const [isExecuting, setIsExecuting] = useState(false);
  const [systemFailureActive, setSystemFailureActive] = useState(false);

  const filesystem = initialFilesystem;
  const getPromptPath = (path: string[]) => {
    if (path.length >= 2 && path[0] === "home" && path[1] === "charan") {
      const sub = path.slice(2);
      return sub.length === 0 ? "~" : "~/" + sub.join("/");
    }
    return "/" + path.join("/");
  };

  const commandHistoryCount = commandInputs.length;

  const updateSecretSequence = useCallback((cmd: string) => {
    setSecretSequence((prev) => {
      const sequence = ["unlock", "sudo", "ghost", "decrypt"];
      const nextIdx = prev.length;
      
      if (sequence[nextIdx] === cmd) {
        const nextSeq = [...prev, cmd];
        playBeep(600, 0.08, false);
        return nextSeq;
      }
      
      if (cmd === "unlock") {
        return ["unlock"];
      }
      return [];
    });
  }, [playBeep]);

  const triggerSecretEnding = useCallback(() => {
    setIsSecretEndingActive(true);
  }, []);

  const triggerMatrix = useCallback(() => {
    setIsMatrixActive(true);
  }, []);

  const triggerMeltdown = useCallback(() => {
    setIsMelting(true);
    setTimeout(() => {
      setIsMelting(false);
    }, 9300); // 4.5s melt + 3.6s cooldown + 1.2s stability hold
  }, []);

  const triggerTornado = useCallback(() => {
    setIsTornadoActive(true);
    setTimeout(() => {
      setIsTornadoActive(false);
    }, 10000);
  }, []);

  const triggerSandbox = useCallback(() => {
    setIsSandboxActive(prev => !prev);
  }, []);

  const triggerClear = useCallback(() => {
    setHistory([]);
  }, []);

  const [isGhostTyping, setIsGhostTyping] = useState(false);

  const triggerGhostTyping = useCallback(async () => {
    setIsGhostTyping(true);
    playBuzzer();

    const ghostId = Math.random().toString(36).substring(2, 9);
    setHistory(prev => [
      ...prev,
      {
        id: ghostId,
        command: "...",
        output: "...",
        dir: getPromptPath(currentPath),
        timestamp: new Date().toLocaleTimeString(),
        isGlitch: true,
        userState
      }
    ]);

    await new Promise(r => setTimeout(r, 1200));
    playClick();
    setHistory(prev => prev.map(item => {
      if (item.id === ghostId) {
        return { ...item, output: "...\nhello?" };
      }
      return item;
    }));

    await new Promise(r => setTimeout(r, 1500));
    playClick();
    setHistory(prev => prev.map(item => {
      if (item.id === ghostId) {
        return { ...item, output: "...\nhello?\n..." };
      }
      return item;
    }));

    await new Promise(r => setTimeout(r, 1200));
    setIsGhostTyping(false);
  }, [playBuzzer, playClick, currentPath, userState]);

  const handleAutocomplete = useCallback(() => {
    if (!input.trim()) return;

    playClick();

    const parts = input.split(/\s+/);
    if (parts.length === 1) {
      const token = parts[0].toLowerCase();
      const allCmds = registry.getCommandNames(false);
      const matches = allCmds.filter(c => c.startsWith(token));

      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        setHistory(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            command: input,
            output: matches.join("    "),
            dir: getPromptPath(currentPath),
            timestamp: new Date().toLocaleTimeString(),
            userState
          }
        ]);
      }
    } else if (parts.length === 2) {
      const commandName = parts[0];
      const token = parts[1];

      let curr = filesystem;
      for (const p of currentPath) {
        if (curr.type === 'directory' && curr.children[p]) {
          curr = curr.children[p];
        }
      }

      if (curr.type === 'directory') {
        const items = Object.keys(curr.children);
        const matches = items.filter(item => item.toLowerCase().startsWith(token.toLowerCase()));

        if (matches.length === 1) {
          setInput(`${commandName} ${matches[0]}`);
        } else if (matches.length > 1) {
          setHistory(prev => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              command: input,
              output: matches.join("    "),
              dir: getPromptPath(currentPath),
              timestamp: new Date().toLocaleTimeString(),
              userState
            }
          ]);
        }
      }
    }
  }, [input, currentPath, filesystem, playClick, userState]);

  const executeCommand = useCallback(async (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) {
      setHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          command: "",
          output: "",
          dir: getPromptPath(currentPath),
          timestamp: new Date().toLocaleTimeString(),
          userState
        }
      ]);
      return;
    }

    setCommandInputs(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const normalizedCommand = trimmed.toLowerCase();
    const destructiveCommands = [
      "sudo rm",
      "sudo rm -rf /",
      "sudo rm -rf *",
      "rm -rf /",
      "format c:",
      "format c:",
      "delete system",
      "remove os",
      "sudo shutdown",
      "destroy"
    ];
    
    if (destructiveCommands.includes(normalizedCommand)) {
      const historyId = Math.random().toString(36).substring(2, 9);
      setHistory(prev => [
        ...prev,
        {
          id: historyId,
          command: trimmed,
          output: "",
          dir: getPromptPath(currentPath),
          timestamp: new Date().toLocaleTimeString(),
          userState
        }
      ]);
      
      const writeLive = (text: string) => {
        setHistory(prev => prev.map(item => {
          if (item.id === historyId) {
            return { ...item, output: text };
          }
          return item;
        }));
      };

      setIsExecuting(true);
      options?.onSystemCrash?.();
      const previousTheme = theme;
      setTheme("matrix");
      setSystemFailureActive(true);
      triggerGlitchEffect(10000);
      setInput("");

      let text = "WARNING:\n\n";
      text += "Root deletion command detected.\n\n";
      text += "Removing system files...\n";
      writeLive(text);
      await new Promise(r => setTimeout(r, 1000));

      text += "\n";
      writeLive(text);
      await new Promise(r => setTimeout(r, 600));

      const filesToDelete = [
        { path: "/system/kernel" },
        { path: "/system/drivers/display.sys" },
        { path: "/terminal/service/shell" },
        { path: "/filesystem/database/records" },
        { path: "/var/log/system.log" },
        { path: "/etc/security/keys" },
        { path: "/bin/sh" },
        { path: "/usr/bin/node" },
        { path: "/home/charan/about.txt" },
        { path: "/user/profile/settings.json" }
      ];

      for (const file of filesToDelete) {
        let pct = 0;
        while (pct <= 100) {
          const filled = Math.round((pct / 100) * 16);
          const empty = 16 - filled;
          const bar = "█".repeat(filled) + "░".repeat(empty);
          writeLive(text + `\n${file.path}\n${bar} ${pct}%\n`);
          pct += 20;
          await new Promise(r => setTimeout(r, 120));
        }
        text += `\n${file.path}\n████████████████ 100%\n`;
        writeLive(text);
        await new Promise(r => setTimeout(r, 200));
      }

      text += "\n";
      writeLive(text);
      await new Promise(r => setTimeout(r, 1000));

      // Build suspense before recovery
      writeLive(text + "\n...\n");
      await new Promise(r => setTimeout(r, 1200));

      writeLive(text + "\n...\n...\n");
      await new Promise(r => setTimeout(r, 1200));

      writeLive(text + "\n...\n...\nSYSTEM RECOVERY INITIATED\n\nJust kidding.\nYour data is safe.\nRestoring DEV-OS...\n");
      await new Promise(r => setTimeout(r, 2200));

      await new Promise(r => setTimeout(r, 1000));
      options?.onSystemRecovery?.();
      setIsMatrixActive(false);
      setTheme(previousTheme);
      setSystemFailureActive(false);
      setIsExecuting(false);
      return;
    }

    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    playDiskAccess();

    // Intercept exit command to restore gravity sandbox
    if ((commandName === "exit" || commandName === "exitsandbox" || commandName === "unsandbox" || commandName === "restore") && isSandboxActive) {
      setIsSandboxActive(false);
      setInput("");
      setHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          command: trimmed,
          output: "GRAVITY ENGINE: Newtonian space coordinates restored. Snapping windows back to layout.",
          dir: getPromptPath(currentPath),
          timestamp: new Date().toLocaleTimeString(),
          userState
        }
      ]);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("terminalCommand", {
            detail: {
              command: "restore",
              args: [],
              timestamp: new Date().toLocaleTimeString(),
              output: "gravity off"
            }
          })
        );
      }
      return;
    }

    // Check secret ending trigger (unlock -> sudo -> ghost -> decrypt -> who)
    if (commandName === "who" && secretSequence.length === 4) {
      setIsSecretEndingActive(true);
      setInput("");
      return;
    }

    // Allocate a unique history node for dynamic live streaming
    const historyId = Math.random().toString(36).substring(2, 9);
    
    let itemType: "text" | "neofetch" | "pikachu" = "text";
    if (["who", "neofetch", "fastfetch"].includes(commandName)) {
      itemType = "neofetch";
    } else if (commandName === "pikachu") {
      itemType = "pikachu";
    }

    setHistory(prev => [
      ...prev,
      {
        id: historyId,
        command: trimmed,
        output: "",
        dir: getPromptPath(currentPath),
        timestamp: new Date().toLocaleTimeString(),
        isGlitch: isGlitched,
        userState,
        type: itemType
      }
    ]);

    // Live writer callback to edit this history item's output dynamically
    const writeLive = (text: string) => {
      setHistory(prev => prev.map(item => {
        if (item.id === historyId) {
          return { ...item, output: text };
        }
        return item;
      }));
    };

    // Prepare context
    const context: CommandContext = {
      args,
      currentPath,
      filesystem,
      setCurrentPath,
      triggerMatrix,
      triggerClear,
      theme,
      setTheme,
      commandHistoryCount: commandHistoryCount + 1,
      triggerGlitchEffect,
      updateSecretSequence,
      secretSequence,
      triggerSecretEnding,
      userState,
      setUserState,
      writeLive,
      commandInputs: [...commandInputs, trimmed],
      registry,
      dimension,
      setDimension,
      triggerMeltdown,
      isMelting,
      triggerTornado,
      isTornadoActive,
      triggerSandbox,
      isSandboxActive
    };

    let resultOutput = "";
    setIsExecuting(true);
    try {
      resultOutput = await registry.execute(commandName, context);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      resultOutput = `system: execution failure - ${errMsg}`;
    } finally {
      // Handled inside the animation loop below
    }

    // Save final output (preserving live updates if command returns empty) with word-by-word typing animation
    if (resultOutput !== "") {
      const words = resultOutput.split(/(\s+)/);
      let currentText = "";
      let wordIndex = 0;
      const speed = Math.max(5, Math.min(25, Math.floor(4000 / words.length)));

      const intervalId = setInterval(() => {
        if (wordIndex < words.length) {
          currentText += words[wordIndex];
          setHistory(prev => prev.map(item => {
            if (item.id === historyId) {
              return { ...item, output: currentText };
            }
            return item;
          }));
          wordIndex++;
        } else {
          clearInterval(intervalId);
          setIsExecuting(false);
        }
      }, speed);
    } else {
      setIsExecuting(false);
    }

    setInput("");

    // Identity progression transitions
    setUserState(current => {
      if (current === "guest") {
        if (["who", "about", "neofetch", "fastfetch"].includes(commandName) || 
            (commandName === "cat" && args[0]?.includes("about")) ||
            (commandName === "cat" && args[0]?.includes("contact"))) {
          return "visitor";
        }
      }
      if (current === "guest" || current === "visitor") {
        if (commandName === "projects" || 
            (commandName === "cat" && args[0]?.includes("projects")) ||
            (commandName === "cd" && args[0]?.includes("projects"))) {
          return "developer";
        }
      }
      if (current === "guest" || current === "visitor" || current === "developer") {
        if (["unlock", "sudo", "ghost", "decrypt"].includes(commandName) || secretSequence.length > 0) {
          return "root";
        }
      }
      if (current === "root" || current === "developer") {
        if (commandName === "cat" && args[0]?.includes("final_message")) {
          return "charan";
        }
      }
      return current;
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("terminalCommand", {
          detail: {
            command: commandName,
            args,
            timestamp: new Date().toLocaleTimeString(),
            output: resultOutput
          }
        })
      );
    }

    // Spooky and glitch check logic
    if (commandHistoryCount + 1 >= 20) {
      const roll = Math.random();
      if (roll < 0.08) {
        triggerGlitchEffect(300 + Math.random() * 700);
      } else if (roll < 0.16) {
        triggerGhostTyping();
      }
    }
  }, [
    currentPath,
    filesystem,
    theme,
    commandHistoryCount,
    secretSequence,
    triggerGlitchEffect,
    updateSecretSequence,
    triggerSecretEnding,
    triggerMatrix,
    triggerClear,
    isGlitched,
    playDiskAccess,
    userState,
    triggerGhostTyping,
    commandInputs,
    options,
    dimension,
    isMelting,
    triggerMeltdown,
    triggerTornado,
    isTornadoActive,
    triggerSandbox,
    isSandboxActive
  ]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isBooting || isMatrixActive || isSecretEndingActive || isExecuting) {
      if ((isMatrixActive || isSecretEndingActive) && e.key === "Escape") {
        setIsMatrixActive(false);
        setIsSecretEndingActive(false);
        playBeep(440, 0.1, false);
      }
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      playClick();
    }

    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleAutocomplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandInputs.length === 0) return;
      
      const isFirstPress = historyIndex === -1;
      const nextIndex = isFirstPress ? commandInputs.length - 1 : Math.max(0, historyIndex - 1);
      
      if (isFirstPress) {
        setTempInputVal(input);
      }

      setHistoryIndex(nextIndex);
      setInput(commandInputs[nextIndex]);
      playClick();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandInputs.length) {
        setHistoryIndex(-1);
        setInput(tempInputVal);
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandInputs[nextIndex]);
      }
      playClick();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      triggerClear();
    }
  }, [
    input,
    commandInputs,
    historyIndex,
    tempInputVal,
    isBooting,
    isMatrixActive,
    isSecretEndingActive,
    executeCommand,
    handleAutocomplete,
    triggerClear,
    playClick,
    playBeep,
    isExecuting
  ]);

  // Load session from localStorage on mount
  useEffect(() => {
    if (options?.initialDimension && options.initialDimension !== dimension) {
      setDimension(options.initialDimension);
    }
  }, [options?.initialDimension]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("chterminal_session") : null;
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.theme) {
          setTimeout(() => setTheme(data.theme), 0);
        }
        if (data.dimension && !options?.initialDimension) {
          setTimeout(() => setDimension(data.dimension), 0);
        }
        setIsBooting(false);
      } catch {
        // Ignore and boot normally
      }
    }
  }, [setTheme, setDimension, options?.initialDimension]);

  // Save session to localStorage when states update
  useEffect(() => {
    if (isBooting) return;
    const data = {
      theme,
      dimension
    };
    localStorage.setItem("chterminal_session", JSON.stringify(data));
  }, [theme, dimension, isBooting]);

  // Listen to virtual keyboard and quick command events
  useEffect(() => {
    const handleEdexCommand = (e: Event) => {
      const customEvent = e as CustomEvent<{ command: string }>;
      if (customEvent.detail?.command) {
        executeCommand(customEvent.detail.command);
      }
    };

    const handleEdexKey = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      if (customEvent.detail?.key) {
        const k = customEvent.detail.key;
        if (k === "BACKSPACE") {
          setInput(prev => prev.slice(0, -1));
          playClick();
        } else if (k === "ENTER") {
          const syntheticEvent = {
            key: "Enter",
            preventDefault: () => {}
          } as unknown as React.KeyboardEvent<HTMLInputElement>;
          handleKeyDown(syntheticEvent);
        } else if (k === "TAB") {
          handleAutocomplete();
        } else if (k === "ArrowUp") {
          const syntheticEvent = {
            key: "ArrowUp",
            preventDefault: () => {}
          } as unknown as React.KeyboardEvent<HTMLInputElement>;
          handleKeyDown(syntheticEvent);
        } else if (k === "ArrowDown") {
          const syntheticEvent = {
            key: "ArrowDown",
            preventDefault: () => {}
          } as unknown as React.KeyboardEvent<HTMLInputElement>;
          handleKeyDown(syntheticEvent);
        } else if (k.length === 1) {
          setInput(prev => prev + k);
          playClick();
        }
      }
    };

    window.addEventListener("edex-command", handleEdexCommand);
    window.addEventListener("edex-key", handleEdexKey);
    return () => {
      window.removeEventListener("edex-command", handleEdexCommand);
      window.removeEventListener("edex-key", handleEdexKey);
    };
  }, [executeCommand, handleKeyDown, handleAutocomplete, playClick]);

  return {
    input,
    setInput,
    history,
    currentPath,
    theme,
    setTheme,
    isBooting,
    setIsBooting,
    isMatrixActive,
    setIsMatrixActive,
    isSecretEndingActive,
    setIsSecretEndingActive,
    handleKeyDown,
    executeCommand,
    commandHistoryCount,
    isMuted,
    toggleMute,
    isGlitched,
    glitchType,
    glitchPrompt,
    triggerGlitchEffect,
    playClick,
    playBeep,
    userState,
    setUserState,
    isGhostTyping,
    isExecuting,
    triggerClear,
    secretSequence,
    dimension,
    setDimension,
    isMelting,
    setIsMelting,
    isTornadoActive,
    isSandboxActive
  };
}
