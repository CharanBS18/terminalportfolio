import { Command } from "../types";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export const funCommands: Command[] = [
  {
    name: "coffee",
    description: "Dispense virtual system caffeine",
    execute: async (context) => {
      const ascii = PORTFOLIO_DATA.ascii.coffee;
      let currentOutput = ascii + "\n";
      
      const steps = [
        { text: "Dispensing freshly brewed digital caffeine...", delay: 600 },
        { text: "[▓░░░░░░░░░] Warming virtual coffee engine...", delay: 800 },
        { text: "", delay: 0 },
        { text: "Heating thermal cup...", delay: 600 },
        { text: "[▓▓▓▓░░░░░░] Optimizing caffeine algorithms...", delay: 800 },
        { text: "", delay: 0 },
        { text: "Grinding encrypted coffee beans...", delay: 600 },
        { text: "[▓▓▓▓▓▓▓░░░] Extracting maximum productivity...", delay: 800 },
        { text: "", delay: 0 },
        { text: "Adding double-shot espresso...", delay: 500 },
        { text: "Injecting motivation modules...", delay: 800 },
        { text: "", delay: 0 },
        { text: "Adding a dash of dark-matter cream...", delay: 500 },
        { text: "Balancing flavor across the universe...", delay: 1000 },
        { text: "", delay: 0 },
        { text: "☕ Coffee successfully generated.", delay: 600 },
        { text: "", delay: 0 },
        { text: "System status:", delay: 300 },
        { text: "✓ Energy restored", delay: 300 },
        { text: "✓ Debugging confidence increased", delay: 300 },
        { text: "✓ Coding mode activated", delay: 800 },
        { text: "", delay: 0 },
        { text: "Enjoy your coffee, Operator.", delay: 600 },
        { text: "Now go write something legendary.", delay: 0 }
      ];

      for (const step of steps) {
        currentOutput += step.text + "\n";
        context.writeLive(currentOutput);
        if (step.delay > 0) {
          await new Promise(r => setTimeout(r, step.delay));
        }
      }
      return "";
    }
  },
  {
    name: "fortune",
    description: "Read a cookie fortune",
    execute: async (context) => {
      const list = PORTFOLIO_DATA.fortunes;
      const rand = list[Math.floor(Math.random() * list.length)];
      const cookieText = `Fortune Cookie: "${rand}"`;
      
      if (rand === "Be on the lookout for ghosts in your code. They know when you sleep.") {
        context.writeLive(cookieText + "\n");
        await new Promise(r => setTimeout(r, 1200));
        
        const ascii = `██████╗  ██████╗ ███╗   ██╗████████╗
██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝
██║  ██║██║   ██║██╔██╗ ██║   ██║
██║  ██║██║   ██║██║╚██╗██║   ██║
██████╔╝╚██████╔╝██║ ╚████║   ██║
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝

        DON'T LOOK BACK

      it's already behind you`;

        context.writeLive(cookieText + "\n\n" + ascii + "\n");
        await new Promise(r => setTimeout(r, 2200));

        context.writeLive(cookieText + "\n\n" + ascii + "\n\n....\njust kidding\n.......\n");
        return "";
      }

      return cookieText;
    }
  },
  {
    name: "quote",
    description: "Print a piece of programming wisdom",
    execute: () => {
      const list = PORTFOLIO_DATA.quotes;
      const rand = list[Math.floor(Math.random() * list.length)];
      return `"${rand.text}"\n  -- ${rand.author}`;
    }
  },
  {
    name: "joke",
    description: "Retrieve a humorous joke line",
    execute: () => {
      const list = PORTFOLIO_DATA.jokes;
      const rand = list[Math.floor(Math.random() * list.length)];
      return rand;
    }
  },
  {
    name: "pikachu",
    description: "Draw the mascot terminal Pikachu",
    execute: () => {
      return PORTFOLIO_DATA.ascii.pikachu;
    }
  },
  {
    name: "matrix",
    description: "Initialize the falling matrix rain",
    execute: (context) => {
      // Ensure terminal theme is set to matrix so the rain renders correctly,
      // then trigger the matrix overlay. This restores the original behavior
      // when the effect was accidentally decoupled from the command.
      try {
        context.setTheme?.("matrix");
      } catch {
        // noop - preserve original behavior if setTheme is not available
      }

      context.triggerMatrix();
      return "Matrix rain code sequence initialized. Press 'Esc' or type a command to terminate.";
    }
  },
  {
    name: "hack",
    description: "Initiate system penetration emulation",
    execute: async (context) => {
      context.writeLive("Connecting...\n");
      await new Promise(r => setTimeout(r, 600));
      context.writeLive("Connecting...\nBypassing firewall...\n");
      await new Promise(r => setTimeout(r, 700));
      context.writeLive("Connecting...\nBypassing firewall...\nAccess denied.\n");
      await new Promise(r => setTimeout(r, 900));
      context.writeLive("Connecting...\nBypassing firewall...\nAccess denied.\n\nJust kidding.\nPortfolio secured.\n");
      return "";
    }
  }
];
