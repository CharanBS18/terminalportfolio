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
        "[OK] PRIVILEGE ESCALATION CONFIRMED: ROOT USER VERIFIED.",
        "Next phase required: interface projection (ghost)."
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
        "[OK] GHOST MODULE ACTIVATED. System visibility hidden.",
        "Next phase required: filesystem decryption (decrypt)."
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
        "[OK] DECRYPT DEPLOYED: ROOT DATA SECTORS CLEARED.",
        "Final phase: Query who you found (who)."
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
    description: "Attempt override sequence",
    hidden: true,
    execute: () => {
      return "System override protocol requires full local verification. Decrypt the terminal. Start with 'unlock'.";
    }
  }
];
