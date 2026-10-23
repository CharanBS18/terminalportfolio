import { Command } from "../types";

export const secretCommands: Command[] = [
  {
    name: "unlock",
    description: "Unlock core systems",
    hidden: true,
    execute: (context) => {
      context.updateSecretSequence("unlock");
      return [
        "[OK] ROOT ACCESS UNLOCKED. Systems security shield offline.",
        "Next phase required: escalation of authority (sudo)."
      ].join("\n");
    }
  },
  {
    name: "sudo",
    description: "Escalate privilege authority / execute escalated commands",
    hidden: true,
    execute: async (context) => {
      const cmdStr = context.args.join(" ").trim();
      
      if (cmdStr === "rm -rf /") {
        return [
          "WARNING:",
          "Root deletion request detected.",
          "System protection enabled.",
          "Nice try."
        ].join("\n");
      }

      if (cmdStr === "make me coffee") {
        context.writeLive("Initializing coffee module...\n");
        await new Promise(r => setTimeout(r, 600));
        
        context.writeLive("Initializing coffee module...\nGrinding beans...\n");
        await new Promise(r => setTimeout(r, 600));
        
        let pct = 0;
        while (pct <= 100) {
          const filled = Math.round((pct / 100) * 20);
          const empty = 20 - filled;
          const bar = "█".repeat(filled) + "░".repeat(empty);
          context.writeLive(`Initializing coffee module...\nGrinding beans...\n\n[${bar}] ${pct}%\n`);
          pct += 10;
          await new Promise(r => setTimeout(r, 120));
        }
        
        await new Promise(r => setTimeout(r, 400));
        context.writeLive(`Initializing coffee module...\nGrinding beans...\n\n[████████████████████] 100%\n\nCoffee ready. ☕\n`);
        return "";
      }

      if (context.args.length > 0) {
        return `sudo: ${context.args[0]}: escalated permission command execution denied.`;
      }

      context.updateSecretSequence("sudo");
      return [
        "===========================================================",
        "\x1b[1;32m[OK] PRIVILEGE ESCALATION CONFIRMED: ROOT USER VERIFIED.\x1b[0m",
        "===========================================================",
        "Root execution level established.",
        "",
        "\x1b[1;33mNext phase required: deploy stealth exploit module (hack) or (ghost).\x1b[0m",
        "==========================================================="
      ].join("\n");
    }
  },
  {
    name: "hack",
    description: "Deploy offensive penetration exploit module",
    hidden: true,
    execute: (context) => {
      context.updateSecretSequence("hack");
      return [
        "===========================================================",
        "\x1b[1;32m[OK] EXPLOIT MODULE ACTIVATED: Target enclave breached.\x1b[0m",
        "===========================================================",
        "Memory perimeter penetrated. Quarantine enclosure bypassed.",
        "",
        "\x1b[1;33mNext phase required: filesystem decryption (decrypt).\x1b[0m",
        "==========================================================="
      ].join("\n");
    }
  },
  {
    name: "ghost",
    description: "Activate visibility cloak",
    hidden: true,
    execute: (context) => {
      context.updateSecretSequence("ghost");
      return [
        "===========================================================",
        "\x1b[1;32m[OK] GHOST MODULE ACTIVATED. System visibility hidden.\x1b[0m",
        "===========================================================",
        "Memory perimeter penetrated. Quarantine enclosure bypassed.",
        "",
        "\x1b[1;33mNext phase required: filesystem decryption (decrypt).\x1b[0m",
        "==========================================================="
      ].join("\n");
    }
  },
  {
    name: "decrypt",
    description: "Decrypt filesystem archives",
    hidden: true,
    execute: (context) => {
      context.updateSecretSequence("decrypt");
      return [
        "===========================================================",
        "\x1b[1;32m[OK] DECRYPT DEPLOYED: ROOT DATA SECTORS CLEARED.\x1b[0m",
        "===========================================================",
        "Administrator soul archive successfully reconstituted.",
        "",
        "\x1b[1;33mFinal phase: Query who you found (who).\x1b[0m",
        "==========================================================="
      ].join("\n");
    }
  },
  {
    name: "admin",
    description: "Access admin logs",
    hidden: true,
    execute: () => {
      return [
        "➔ Access denied. Administrator logs are protected.",
        "",
        'Nice attempt. Did you really think typing "admin" makes you the boss? 😭',
        "",
        "The terminal has seen thousands of visitors...",
        "You are the first one to try confidence as a password."
      ].join("\n");
    }
  },
  {
    name: "system",
    description: "Get core kernel version status",
    hidden: true,
    execute: () => {
      return "DEV-OS Kernel version 3.1.0-alpha-retro. Memory status: OK. Network status: OFFLINE.";
    }
  },
  {
    name: "override",
    description: "Initiate security override protocol to search for the admin",
    hidden: false,
    execute: (context) => {
      context.updateSecretSequence("override");
      return [
        "===========================================================",
        "\x1b[1;32m[OK] SECURITY OVERRIDE INITIATED: Quarantine shield offline.\x1b[0m",
        "===========================================================",
        "Operator defensive enclave located at memory sector 0x7FFF_88AC.",
        "",
        "\x1b[1;33mNext phase required: escalation of authority (sudo).\x1b[0m",
        "==========================================================="
      ].join("\n");
    }
  }
];
