import { Command, FSNode } from "../types";
import { resolvePath } from "../filesystem";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { runMultiDownload, getMajorLayers } from "./portfolio";

const HELP_CATEGORY_ORDER = ["SYSTEM", "FILESYSTEM", "PORTFOLIO", "FUN", "SECRET", "OTHER"];

const inferCategory = (command: Command) => {
  if (command.category) return command.category.toUpperCase();
  const name = command.name.toLowerCase();
  const secret = new Set(["sudo", "decrypt", "unlock", "ghost", "override", "admin", "system"]);
  const profile = new Set(["who", "about", "skills", "projects", "experience", "education", "contact", "socials", "github", "linkedin", "email", "twitter", "blogs", "techstack", "certificates", "achievements", "timeline", "resume", "portfolio", "projects"]);
  const fun = new Set(["coffee", "fortune", "quote", "joke", "matrix", "pikachu", "hack"]);
  const system = new Set(["help", "clear", "history", "pwd", "date", "time", "exit", "reset", "man", "theme", "ascii", "ssh", "chmod", "nano", "vim", "dimension", "melt", "overclock", "meltdown", "tornado", "sandbox", "exitsandbox", "unsandbox", "restore"]);
  const filesystem = new Set(["ls", "cd", "cat", "echo", "tree", "find", "open", "mkdir", "touch", "rm", "download", "whoami", "neofetch", "fastfetch"]);

  if (secret.has(name)) return "SECRET";
  if (profile.has(name)) return "PORTFOLIO";
  if (fun.has(name)) return "FUN";
  if (system.has(name)) return "SYSTEM";
  if (filesystem.has(name)) return "FILESYSTEM";
  return "OTHER";
};

const formatName = (name: string) => {
  const padLength = 16;
  return name.padEnd(padLength, " ");
};

const generateHelpText = (commands: Command[]) => {
  const groups: Record<string, string[]> = {};

  commands.forEach((command) => {
    const category = inferCategory(command);
    if (!groups[category]) groups[category] = [];
    if (!groups[category].includes(command.name)) {
      groups[category].push(command.name);
    }
  });

  const lines: string[] = [
    "AVAILABLE COMMANDS",
    ""
  ];

  HELP_CATEGORY_ORDER.forEach((category) => {
    const items = groups[category];
    if (!items || items.length === 0) return;
    lines.push(`${category}:`);
    lines.push("------------------------------------------------");
    items.sort((a, b) => a.localeCompare(b));
    items.forEach((name) => {
      const command = commands.find(cmd => cmd.name === name);
      const description = command?.description?.split("\n")[0] ?? "";
      lines.push(`  ${formatName(name)} ${description}`);
    });
    if (category === "FUN") {
      lines.push("  dimension 1995  ➔ Warp to retro Windows 95 Taskbar & Start Menu");
      lines.push("  melt            ➔ Overclock processor cores and melt display");
      lines.push("  tornado         ➔ Spin the entire operating system into a vortex");
      lines.push("  sandbox         ➔ Enable gravity physics sandbox for all windows");
      lines.push("  exitsandbox     ➔ Exit from sandbox mode");
    }
    lines.push("");
  });

  return lines.join("\n");
};


export const basicCommands: Command[] = [
  {
    name: "help",
    description: "Display all available commands",
    execute: (context) => {
    return `${generateHelpText(context.registry.getCommands(true))}

  \x1b[1m\x1b[35m  _______  _______  _______  _______  _______  _______  _______  _______ 
   (  ____ \(  ___  )(  ____ \(  ____ \(  ____ \(  ___  )(  ____ \(  ____ \
   | (    \/| (   ) || (    \/| (    \/| (    \/| (   ) || (    \/| (    \/
   | (_____ | |   | || (__    | (_____ | |      | |   | || |      | (__    
   (_____  )| |   | ||  __)   (_____  )| |      | |   | || |      |  __)   
     ) || |   | || (            ) || |      | |   | || |      | (      
   /\____) || (___) || (____/\/\____) || (____/\| (___) || (____/\| (____/\
   \_______)(_______)(_______/\_______)(_______/(_______/(_______/(_______/
  \x1b[0m

  \x1b[1m\x1b[33m  sudo rm -rf /\x1b[0m

  \x1b[1m\x1b[31m⚠️ Think twice... Are you sure you want to remove the OS? 😈\x1b[0m`;
    }
  },
  {
    name: "clear",
    description: "Clear terminal viewport",
    execute: (context) => {
      context.triggerClear();
      return "";
    }
  },
  {
    name: "pwd",
    description: "Print working directory",
    execute: (context) => {
      return "/" + context.currentPath.join("/");
    }
  },
  {
    name: "ls",
    description: "List directory contents",
    execute: (context) => {
      // Find current directory node
      let curr = context.filesystem;
      for (const p of context.currentPath) {
        if (curr.type === 'directory' && curr.children[p]) {
          curr = curr.children[p];
        }
      }

      if (curr.type !== 'directory') {
        return "ls: path corruption error.";
      }

      // Collect keys
      let keys = Object.keys(curr.children);
      
      // Hiding hidden files starting with '.' unless -a or -la flag is passed
      const hasAllFlag = context.args.some(arg => arg.startsWith('-') && (arg.includes('a') || arg.includes('la')));
      if (!hasAllFlag) {
        keys = keys.filter(key => !key.startsWith('.'));
      }

      // Dynamic glitch file injection
      const isRoot = context.currentPath.length === 0;
      if (isRoot && context.commandHistoryCount >= 20) {
        // Occasionally show watching_you.txt
        const hour = new Date().getMinutes(); // rotate every minute
        if (hour % 2 === 0) {
          keys.push("watching_you.txt");
        }
      }

      if (keys.length === 0) return "";

      // Format listing: directories ending with /, files colored differently.
      const formatted = keys.map(key => {
        const node = curr.type === 'directory' ? curr.children[key] : null;
        const isDir = node && node.type === 'directory';
        
        if (key === "watching_you.txt") {
          return `\x1b[31m${key}\x1b[0m`; // Red colored text for glitched file in console markup
        }
        return isDir ? `\x1b[1;36m${key}/\x1b[0m` : `\x1b[32m${key}\x1b[0m`;
      });

      return formatted.join("    ");
    }
  },
  {
    name: "cd",
    description: "Change current directory path",
    execute: (context) => {
      const target = context.args[0] || "";
      if (!target) {
        context.setCurrentPath([]);
        return "";
      }

      // Permission check for entering /root directory
      if (target.toLowerCase().includes("root") && context.userState !== "root" && context.userState !== "charan") {
        return "bash: cd: root: Permission denied. Escalated privileges required.";
      }

      const resolved = resolvePath(context.filesystem, context.currentPath, target);
      if (resolved.error) {
        return `cd: ${target}: ${resolved.error}`;
      }

      if (resolved.node && resolved.node.type !== 'directory') {
        return `cd: ${target}: Not a directory`;
      }

      context.setCurrentPath(resolved.pathArray);
      return "";
    }
  },
  {
    name: "cat",
    description: "Read file contents",
    execute: (context) => {
      const target = context.args[0] || "";
      if (!target) {
        return "Usage: cat [filename]";
      }

      // Special check for glitch file
      if (target.toLowerCase() === "watching_you.txt" && context.commandHistoryCount >= 20) {
        context.triggerGlitchEffect();
        return `=========================================
WARNING: UNKNOWN ENTITY IS MONITORING THIS SHELL.
=========================================
IP: 127.0.0.1 (PROXY INTERCEPTED)
PORT: LOGS TRANSMITTING...
DATA BREACH CODE: 0xDEADBEEF

"I see you typing."
=========================================`;
      }

      // Guard for hidden/special files like .secret, .config, .logs
      const baseTarget = target.split('/').pop() || "";
      if (baseTarget.startsWith('.') && context.userState !== "root" && context.userState !== "charan") {
        return `cat: ${target}: Permission denied. Access restricted.`;
      }

      // Guard for final_message inside root folder
      if ((target.includes("root") || target.includes("final_message")) && 
          context.userState !== "root" && context.userState !== "charan") {
        return "cat: Permission denied. Root access required.";
      }

      const resolved = resolvePath(context.filesystem, context.currentPath, target);
      if (resolved.error) {
        return `cat: ${target}: ${resolved.error}`;
      }

      if (resolved.node && resolved.node.type === 'directory') {
        return `cat: ${target}: Is a directory. Use 'cd' to open it.`;
      }

      if (resolved.node && resolved.node.type === 'file') {
        return resolved.node.content;
      }

      return `cat: ${target}: File not found.`;
    }
  },
  {
    name: "echo",
    description: "Echo argument strings",
    execute: (context) => {
      return context.args.join(" ");
    }
  },
  {
    name: "date",
    description: "Display current date information",
    execute: () => {
      return new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  {
    name: "time",
    description: "Display system timezone time",
    execute: () => {
      return new Date().toLocaleTimeString();
    }
  },
  {
    name: "history",
    description: "Show command input history trail log",
    execute: (context) => {
      if (context.commandInputs.length === 0) return "History log empty.";
      return context.commandInputs
        .map((cmd, idx) => `  ${idx + 1}  ${cmd}`)
        .join("\n");
    }
  },
  {
    name: "man",
    description: "Format and display manual pages for commands",
    execute: (context) => {
      const target = context.args[0];
      if (!target) {
        return "What manual page do you want?\nUsage: man [command]\nTry: man projects, man secrets, man who";
      }
      
      const manualPages: Record<string, string> = {
        help: `NAME\n    help - Display all available shell commands\n\nSYNOPSIS\n    help\n\nDESCRIPTION\n    Prints the complete menu layout detailing all interactive utilities and programs registered in the active DEV-OS.`,
        who: `NAME\n    who - Display operator bio-card\n\nSYNOPSIS\n    who\n\nDESCRIPTION\n    Initiates a line-by-line render of the operator's neofetch logo alongside full offensive security specifications.`,
        about: `NAME\n    about - Display operator bio-card\n\nSYNOPSIS\n    about\n\nDESCRIPTION\n    Alias for the 'who' command. Outputs operator details.`,
        projects: `NAME\n    projects - View offensive security projects\n\nSYNOPSIS\n    projects\n\nDESCRIPTION\n    Fetches the metadata and directory layout of the security researcher's projects. Triggers multi-process downloading layers simulation.`,
        certificates: `NAME\n    certificates - View security certifications ledger\n\nSYNOPSIS\n    certificates\n\nDESCRIPTION\n    Searches and synchronizes the certificates database, printing credentials ledger status.`,
        experience: `NAME\n    experience - View professional work experience timeline\n\nSYNOPSIS\n    experience\n\nDESCRIPTION\n    Pulls SQL timeline files and outputs historical milestones and company duties.`,
        education: `NAME\n    education - List academic background\n\nSYNOPSIS\n    education\n\nDESCRIPTION\n    Accesses educational transcript data files.`,
        secrets: `NAME\n    secrets - Security override index\n\nSYNOPSIS\n    secrets\n\nDESCRIPTION\n    Displays instruction layers for security breach algorithms. Backdoor access must be unlocked sequentially.`,
        sudo: `NAME\n    sudo - Escalated root execution\n\nSYNOPSIS\n    sudo\n\nDESCRIPTION\n    Grants root privilege status. Used to override filesystem read-locks.`,
        ghost: `NAME\n    ghost - Backdoor override daemon\n\nSYNOPSIS\n    ghost\n\nDESCRIPTION\n    Simulates a signal breach in the mainframe. Third step of backdoor sequence.`,
        decrypt: `NAME\n    decrypt - System decryption tool\n\nSYNOPSIS\n    decrypt\n\nDESCRIPTION\n    Final step of backdoor override chain. decrypts secure sectors.`,
        unlock: `NAME\n    unlock - System security unlock\n\nSYNOPSIS\n    unlock\n\nDESCRIPTION\n    First step of backdoor chain. Initiates connection handshake.`,
        theme: `NAME\n    theme - Change phosphor display lens\n\nSYNOPSIS\n    theme [green|amber|matrix|blood|hacker|crt|white]\n\nDESCRIPTION\n    Configures CRT color style schemes.`,
        ls: `NAME\n    ls - List directory contents\n\nSYNOPSIS\n    ls [options]\n\nDESCRIPTION\n    Outputs files and folders inside the active path directory. Pass '-a' or '-la' to display hidden files.`,
        cd: `NAME\n    cd - Change working directory path\n\nSYNOPSIS\n    cd [path]\n\nDESCRIPTION\n    Changes the shell path position. Entering '/root' requires root access.`,
        cat: `NAME\n    cat - Read text files\n\nSYNOPSIS\n    cat [filename]\n\nDESCRIPTION\n    Prints the contents of the target text file. Reading dot-files requires root access.`,
        neofetch: `NAME\n    neofetch - Display system summary details\n\nSYNOPSIS\n    neofetch\n\nDESCRIPTION\n    Draws a responsive ASCII display card detailing user profile and skills.`,
        dimension: `NAME\n    dimension - Warp shell display dimensions across computing timelines\n\nSYNOPSIS\n    dimension [1984|1995|2026|2099]\n\nDESCRIPTION\n    Warp the visual interface layout, borders, backgrounds, and Docks into classic configurations from computing history:\n    * 1984: Apple Macintosh System 1 Flat 1-bit monochrome GUI\n    * 1995: Classic Windows 95 Desktop with Start Menu & Taskbar\n    * 2026: Modern macOS dark Pikachu glass layout\n    * 2099: Cyberpunk 3D perspective holographic overlay`,
        melt: `NAME\n    melt - Overclock system processor core thermal limits\n\nSYNOPSIS\n    melt\n\nDESCRIPTION\n    Triggers CPU overclock alarms. The terminal display liquid-collapses under gravity using a canvas physics engine, followed by a thermal overload warning BIOS reboot.`,
        overclock: `NAME\n    overclock - Overclock system processor core thermal limits\n\nSYNOPSIS\n    overclock\n\nDESCRIPTION\n    Alias for the 'melt' command. Initiates CPU core overclock and screen collapse.`,
        tornado: `NAME\n    tornado - Meteorological viewport vortex spin\n\nSYNOPSIS\n    tornado\n\nDESCRIPTION\n    Triggers a 10-second meteorological anomaly spinning the entire website UI off the screen in a vortex before restoring normal state.`,
        sandbox: `NAME\n    sandbox - Gravity physics window sandbox\n\nSYNOPSIS\n    sandbox\n\nDESCRIPTION\n    Toggles Newton 2D rigid-body gravity sandbox for OS window structures. All windows (Terminal, Finder, shortcuts) fall down and bounce off viewport bounds with realistic elastic collisions and drag inertia. Type 'exit' to snap them back to default bounds.`
      };
      
      const cmdName = target.toLowerCase();
      if (manualPages[cmdName]) {
        return `\n${manualPages[cmdName]}\n`;
      }
      
      return `No manual entry for ${target}.`;
    }
  },
  {
    name: "theme",
    description: "Change terminal theme styling",
    execute: (context) => {
      if (context.dimension === "1984" || context.dimension === "1995") {
        return `Theme configuration is write-locked in Computing Era ${context.dimension}.`;
      }
      const choice = context.args[0];
      const themes = ["green", "cyan", "purple", "amber", "red", "matrix", "blood", "hacker", "crt", "white"];
      if (!choice) {
        return `Usage: theme [name]\nAvailable themes: ${themes.join(", ")}`;
      }

      const selected = choice.toLowerCase();
      if (!themes.includes(selected)) {
        return `Unknown theme: ${choice}. Choose from: ${themes.join(", ")}`;
      }

      context.setTheme(selected);
      return `Phosphor lens configuration initialized: [${selected.toUpperCase()} Mode]`;
    }
  },
  {
    name: "dimension",
    description: "Warp terminal display dimensions across computing timelines",
    execute: (context) => {
      const choice = context.args[0];
      const dimensions = ["1984", "1995", "2026", "2099"];
      if (!choice) {
        return `Usage: dimension [year]\nAvailable dimensions: ${dimensions.join(", ")}`;
      }

      const selected = choice.toLowerCase();
      if (!dimensions.includes(selected)) {
        return `Unknown dimension: ${choice}. Choose from: ${dimensions.join(", ")}`;
      }

      if (typeof context.setDimension !== "function") {
        return "System error: setDimension not found. Please refresh your browser tab.";
      }

      context.setDimension(selected);
      return `Initializing dimension warp protocols... warping to year [${selected}]`;
    }
  },
  {
    name: "melt",
    description: "Overclock system processor cores to thermal meltdown limits",
    execute: (context) => {
      if (typeof context.triggerMeltdown !== "function") {
        return "System error: triggerMeltdown not found. Please refresh your browser tab.";
      }
      context.triggerMeltdown();
      return "CRITICAL WARNING: CPU temperature exceeded 105C. Screen lattice matrix melting...";
    }
  },
  {
    name: "overclock",
    description: "Overclock system processor cores to thermal meltdown limits",
    execute: (context) => {
      if (typeof context.triggerMeltdown !== "function") {
        return "System error: triggerMeltdown not found. Please refresh your browser tab.";
      }
      context.triggerMeltdown();
      return "CRITICAL WARNING: CPU temperature exceeded 105C. Screen lattice matrix melting...";
    }
  },
  {
    name: "meltdown",
    description: "Overclock system processor cores to thermal meltdown limits",
    execute: (context) => {
      if (typeof context.triggerMeltdown !== "function") {
        return "System error: triggerMeltdown not found. Please refresh your browser tab.";
      }
      context.triggerMeltdown();
      return "CRITICAL WARNING: CPU temperature exceeded 105C. Screen lattice matrix melting...";
    }
  },
  {
    name: "tornado",
    description: "Meteorological viewport vortex anomaly test",
    execute: (context) => {
      if (typeof context.triggerTornado !== "function") {
        return "System error: triggerTornado not found. Please refresh your browser tab.";
      }
      context.triggerTornado();
      return "ALERT: Saffir-Simpson vortex activated. UI structures rotating into gravity collapse. Hold tight...";
    }
  },
  {
    name: "sandbox",
    description: "Toggles Newtonian 2D gravity physics for all desktop windows",
    execute: (context) => {
      if (typeof context.triggerSandbox !== "function") {
        return "System error: triggerSandbox not found. Please refresh your browser tab.";
      }
      context.triggerSandbox();
      return "GRAVITY ENGINE: Local viewport space curvature inverted. Newton 2D rigid physics active. Type 'exit' to restore.";
    }
  },
  {
    name: "exitsandbox",
    description: "Restore windows from gravity sandbox",
    execute: () => {
      return "Gravity engine is already in normal state.";
    }
  },
  {
    name: "unsandbox",
    description: "Restore windows from gravity sandbox",
    execute: () => {
      return "Gravity engine is already in normal state.";
    }
  },
  {
    name: "restore",
    description: "Restore windows from gravity sandbox",
    execute: () => {
      return "Gravity engine is already in normal state.";
    }
  },
  {
    name: "ascii",
    description: "Render a random system ASCII art logo",
    execute: () => {
      const artKeys = Object.keys(PORTFOLIO_DATA.ascii) as Array<keyof typeof PORTFOLIO_DATA.ascii>;
      const randKey = artKeys[Math.floor(Math.random() * artKeys.length)];
      return PORTFOLIO_DATA.ascii[randKey];
    }
  },
  {
    name: "exit",
    description: "Terminate DEV-OS connection session",
    execute: () => {
      setTimeout(() => {
        window.close();
        window.location.href = "about:blank";
      }, 1000);
      return "Broadcasting shutdown interrupt... Goodbye, Operator.";
    }
  },
  {
    name: "reset",
    description: "Reset session cache and reboot terminal machine",
    execute: () => {
      localStorage.removeItem("chterminal_session");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return "Clearing system memory registers... Rebooting kernel.";
    }
  },
  {
    name: "nano",
    description: "Open text file in read-only visual nano editor",
    execute: (context) => {
      const target = context.args[0];
      if (!target) return "nano: No file specified.";
      if (target.startsWith('.') && context.userState !== "root" && context.userState !== "charan") {
        return "nano: Permission denied.";
      }
      const resolved = resolvePath(context.filesystem, context.currentPath, target);
      if (resolved.error) return `nano: ${target}: ${resolved.error}`;
      if (resolved.node?.type === 'directory') return `nano: ${target}: Is a directory.`;
      
      return `[ NANO EDITOR v2.9 - READ-ONLY VIEW - PRESS ENTER TO EXIT ]\n------------------------------------------------------------\n${resolved.node?.content || ""}\n------------------------------------------------------------`;
    }
  },
  {
    name: "vim",
    description: "Open text file in read-only visual vim editor",
    execute: (context) => {
      const target = context.args[0];
      if (!target) return "vim: No file specified.";
      if (target.startsWith('.') && context.userState !== "root" && context.userState !== "charan") {
        return "vim: Permission denied.";
      }
      const resolved = resolvePath(context.filesystem, context.currentPath, target);
      if (resolved.error) return `vim: ${target}: ${resolved.error}`;
      if (resolved.node?.type === 'directory') return `vim: ${target}: Is a directory.`;

      return `[ VIM v9.0 - READ-ONLY VIEW - TYPE :q TO EXIT ]\n------------------------------------------------------------\n${resolved.node?.content || ""}\n------------------------------------------------------------`;
    }
  },
  {
    name: "whoami",
    description: "Print current active user session identity",
    execute: (context) => {
      return context.userState;
    }
  },
  {
    name: "neofetch",
    description: "Display system summary details with ASCII logo",
    execute: () => {
      return [
        "      \x1b[1;36m██████\x1b[0m       OS          : Charan OS v3.1",
        "    \x1b[1;36m██████████\x1b[0m     User        : Charan BS",
        "   \x1b[1;36m███      ███\x1b[0m    Role        : Offensive Security & Penetration Testing",
        "   \x1b[1;36m███\x1b[0m             Location    : Hassan, India",
        "   \x1b[1;36m███      ███\x1b[0m    Focus       : Web App Security, Penetration Testing, Network Defense",
        "    \x1b[1;36m██████████\x1b[0m     Toolkit     : Burp Suite, Nmap, Wireshark, Metasploit, Linux",
        "      \x1b[1;36m██████\x1b[0m       Scripting   : Python, Bash, Go, Security Automation"
      ].join("\n");
    }
  },
  {
    name: "fastfetch",
    description: "Equivalent to 'neofetch'",
    execute: (context) => {
      const neofetch = basicCommands.find(c => c.name === "neofetch");
      return neofetch ? neofetch.execute(context) : "";
    }
  },
  {
    name: "chmod",
    description: "Change file mode permissions",
    execute: (context) => {
      if (context.userState !== "root" && context.userState !== "charan") {
        return [
          "➔ Permission change rejected.",
          "",
          "You tried changing permissions without having permission.",
          "That is the digital version of asking a locked door to unlock itself.",
          "",
          "The filesystem is laughing. 😂"
        ].join("\n");
      }
      return "chmod: permissions updated successfully.";
    }
  },
  {
    name: "ssh",
    description: "Secure Shell connection tool",
    execute: () => {
      return [
        "➔ Connection refused.",
        "",
        "You attempted a remote connection with zero destination details.",
        "",
        "Even the server said:",
        '"Who invited this person?" 💀',
        "",
        "Try learning where you're connecting before knocking on random doors."
      ].join("\n");
    }
  },
  {
    name: "mkdir",
    description: "Create directory folders",
    execute: () => {
      return [
        "➔ Directory creation failed.",
        "",
        "Creating folders already?",
        "",
        "Bold move.",
        "",
        "The system checked your organization skills first...",
        "",
        "[SCAN COMPLETE]",
        "Organization level: UNKNOWN",
        "Mess level: DETECTED",
        "",
        "Come back when your files aren't living in chaos.",
        "Come back when your desktop isn't a digital storage disaster."
      ].join("\n");
    }
  },
  {
    name: "touch",
    description: "Create text files",
    execute: () => {
      return [
        "➔ File creation denied.",
        "",
        "You touched the filesystem without permission.",
        "",
        "The computer equivalent of walking into someone's room and moving things around.",
        "",
        "[!] Filesystem reaction:",
        '    "Excuse me?"',
        "",
        "The OS noticed.",
        "The OS remembers."
      ].join("\n");
    }
  },
  {
    name: "rm",
    description: "Remove files and folders",
    execute: () => {
      return [
        "➔ File deletion blocked.",
        "",
        "Dangerous command detected.",
        "",
        "The terminal saved your files from you.",
        "",
        "Honestly, that was the smartest decision made here today. 💀"
      ].join("\n");
    }
  },
  {
    name: "tree",
    description: "Display directory structure recursively",
    execute: async (context) => {
      let curr = context.filesystem;
      for (const p of context.currentPath) {
        if (curr.type === 'directory' && curr.children[p]) {
          curr = curr.children[p];
        }
      }
      if (curr.type !== 'directory') return "tree: path corruption.";
      
      const printTree = (node: FSNode, prefix = "", isLast = true): string[] => {
        const result: string[] = [];
        const marker = isLast ? "└── " : "├── ";
        
        if (node.type === 'directory') {
          result.push(prefix + marker + "\x1b[1;36m" + node.name + "/\x1b[0m");
          const keys = Object.keys(node.children).filter(k => !k.startsWith('.'));
          const nextPrefix = prefix + (isLast ? "    " : "│   ");
          keys.forEach((key, index) => {
            const child = node.children[key];
            const isChildLast = index === keys.length - 1;
            result.push(...printTree(child, nextPrefix, isChildLast));
          });
        } else {
          result.push(prefix + marker + "\x1b[32m" + node.name + "\x1b[0m");
        }
        return result;
      };

      const lines: string[] = ["."];
      const keys = Object.keys(curr.children).filter(k => !k.startsWith('.'));
      keys.forEach((key, idx) => {
        const child = curr.children[key];
        const isLast = idx === keys.length - 1;
        lines.push(...printTree(child, "", isLast));
      });

      let printed = "";
      for (let i = 0; i < lines.length; i++) {
        printed += lines[i] + "\n";
        context.writeLive(printed);
        await new Promise(r => setTimeout(r, 40));
      }
      return "";
    }
  },
  {
    name: "find",
    description: "Search for files in directory hierarchy",
    execute: (context) => {
      const query = context.args[0];
      if (!query) return "Usage: find [query]";
      
      const matches: string[] = [];
      const traverse = (node: FSNode, currentPathStr: string) => {
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          matches.push(currentPathStr);
        }
        if (node.type === 'directory') {
          Object.keys(node.children).forEach(key => {
            const child = node.children[key];
            traverse(child, currentPathStr === "/" ? `/${key}` : `${currentPathStr}/${key}`);
          });
        }
      };
      
      traverse(context.filesystem, "/");
      if (matches.length === 0) return `find: '${query}': No matching files found.`;
      return matches.map(m => `  ${m}`).join("\n");
    }
  },
  {
    name: "open",
    description: "Open documents / files inside the terminal",
    execute: async (context) => {
      const target = context.args[0];
      if (!target) return "Usage: open [filename]";
      
      // Guard for hidden/special files
      const baseTarget = target.split('/').pop() || "";
      if (baseTarget.startsWith('.') && context.userState !== "root" && context.userState !== "charan") {
        return `open: ${target}: Permission denied.`;
      }

      if ((target.includes("root") || target.includes("final_message")) && 
          context.userState !== "root" && context.userState !== "charan") {
        return "open: Permission denied. Root access required.";
      }

      const resolved = resolvePath(context.filesystem, context.currentPath, target);
      if (resolved.error) {
        return `open: ${target}: ${resolved.error}`;
      }

      if (resolved.node && resolved.node.type === 'file') {
        const fileNode = resolved.node;
        if (fileNode.name.endsWith(".pdf")) {
          const tasks = getMajorLayers(fileNode.name, "Fetching document metadata");
          await runMultiDownload("Document Viewer Gateway", tasks, context);
        }
        return fileNode.content;
      }

      return `open: ${target}: File not found.`;
    }
  },
  {
    name: "download",
    description: "Download documents to host browser storage",
    execute: async (context) => {
      const target = context.args[0];
      if (!target) return "Usage: download [filename]";
      
      const baseTarget = target.split('/').pop() || "";
      if (baseTarget.startsWith('.') && context.userState !== "root" && context.userState !== "charan") {
        return `download: ${target}: Permission denied.`;
      }

      const resolved = resolvePath(context.filesystem, context.currentPath, target);
      if (resolved.error) {
        return `download: ${target}: ${resolved.error}`;
      }

      if (resolved.node && resolved.node.type === 'directory') {
        return `download: ${target}: Is a directory.`;
      }

      if (resolved.node && resolved.node.type === 'file') {
        const fileNode = resolved.node;
        const tasks = getMajorLayers(fileNode.name, "Packaging target source");
        await runMultiDownload("Host Browser Gateway", tasks, context);
        
        setTimeout(() => {
          const blob = new Blob([fileNode.content || ""], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileNode.name || "downloaded_file.txt";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 300);

        return `System download initiated for ${fileNode.name}. Check your browser download notifications.`;
      }

      return `download: ${target}: File not found.`;
    }
  }
];
