import { Command, CommandContext } from "../types";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

// Helper to draw static progress bars for skills
function drawProgressBar(level: number, size = 20): string {
  const filledCount = Math.round((level / 100) * size);
  const emptyCount = size - filledCount;
  const bar = "█".repeat(filledCount) + "░".repeat(emptyCount);
  return `${bar} ${level}%`;
}

// Generate a detailed list of 18 installation/download tasks
export function getMajorLayers(primaryName: string, primaryLabel: string): Array<{ name: string; label: string }> {
  return [
    { name: primaryName, label: primaryLabel },
    { name: "dependencies.json", label: "Resolving metadata dependencies" },
    { name: "package_index.db", label: "Fetching registry descriptors" },
    { name: "assets_stream.bin", label: "Downloading asset layers" },
    { name: "fonts_pack.tar.gz", label: "Downloading typography font files" },
    { name: "vectors_index.yaml", label: "Resolving styling vectors" },
    { name: "crypt_check.md5", label: "Verifying package integrity checksum" },
    { name: "modules_bundler.js", label: "Installing runtime sub-modules" },
    { name: "compiler_source.ts", label: "Compiling UI components" },
    { name: "db_instance.sql", label: "Bootstrapping relational database" },
    { name: "files_indexer.cache", label: "Caching system index records" },
    { name: "static_preview.html", label: "Generating webpage preview layers" },
    { name: "image_resizer.bin", label: "Optimizing resolution layers" },
    { name: "sec_scanner.audit", label: "Auditing modules for security bugs" },
    { name: "vulnerability.db", label: "Querying CVE threat vulnerability index" },
    { name: "buffer_mount.log", label: "Writing final transfer log frames" },
    { name: "fs_mount_gate.sys", label: "Mounting secure virtual partitions" },
    { name: "sync_cache.idx", label: "Synchronizing system indexes" }
  ];
}

// Reusable Multi-Process Concurrent Downloader Simulator (18-step Docker/npm simulator)
export async function runMultiDownload(
  title: string,
  tasks: Array<{ name: string; label: string }>,
  context: CommandContext
) {
  const progressList = tasks.map((t, idx) => ({
    ...t,
    progress: 0,
    speed: 4 + Math.random() * 10,
    paused: false,
    pauseTicks: 0,
    failed: false,
    retryCount: 0,
    retryTicks: 0,
    // Task 5 and Task 12 will trigger connection retry issues to make it feel extremely realistic
    triggerFail: idx === 4 || idx === 11
  }));

  const getTimestamp = () => {
    const d = new Date();
    return `[${d.toTimeString().split(' ')[0]}]`;
  };

  let completed = false;

  while (!completed) {
    let allDone = true;
    let text = `${getTimestamp()} \x1b[1;36m[INFO]\x1b[0m Establishing secure network link with ${title}...\n`;
    text += `${getTimestamp()} \x1b[1;32m[OK]\x1b[0m Stream socket active. Fetching layers concurrently:\n`;

    for (let i = 0; i < progressList.length; i++) {
      const task = progressList[i];

      // Connection timeout failure triggers
      if (task.triggerFail && task.progress > 40 && task.progress < 55 && task.retryCount === 0) {
        task.failed = true;
        task.retryCount = 1;
        task.retryTicks = 8; // pause for 8 steps to show retry attempts
      }

      if (task.failed) {
        task.retryTicks--;
        if (task.retryTicks <= 0) {
          task.failed = false;
        }
      } else {
        // Random network jitters
        if (!task.paused && Math.random() < 0.05 && task.progress > 15 && task.progress < 85) {
          task.paused = true;
          task.pauseTicks = 1 + Math.floor(Math.random() * 2);
        }

        if (task.paused) {
          task.pauseTicks--;
          if (task.pauseTicks <= 0) {
            task.paused = false;
          }
        } else if (task.progress < 100) {
          task.progress = Math.min(100, task.progress + Math.floor(task.speed));
        }
      }

      if (task.progress < 100 || task.failed) {
        allDone = false;
      }

      const barSize = 15;
      const filled = Math.round((task.progress / 100) * barSize);
      const empty = barSize - filled;
      const bar = "█".repeat(filled) + "░".repeat(empty);

      let statusIndicator = "";
      let statusDetail = "";

      if (task.progress === 100) {
        statusIndicator = "\x1b[32m[OK]\x1b[0m";
      } else if (task.failed) {
        statusIndicator = "\x1b[31m[FAIL]\x1b[0m";
        if (task.retryTicks > 5) {
          statusDetail = " \x1b[31m(Connection timeout. Retrying Attempt 1/3...)\x1b[0m";
        } else if (task.retryTicks > 2) {
          statusDetail = " \x1b[33m(Socket error. Retrying Attempt 2/3...)\x1b[0m";
        } else {
          statusDetail = " \x1b[32m(Network link recovered. Resuming stream...)\x1b[0m";
        }
      } else if (task.paused) {
        statusIndicator = "\x1b[31m[HOLD]\x1b[0m";
      } else {
        statusIndicator = "\x1b[33m[LOAD]\x1b[0m";
      }

      text += `\n ${statusIndicator} [Layer ${i + 1}/${progressList.length}] - ${task.label}: ${task.name}${statusDetail}\n`;
      text += `   [${bar}] ${task.progress}%\n`;
    }

    context.writeLive(text);

    if (allDone) {
      completed = true;
    } else {
      // Faster refresh ticks to make it feel animated and responsive
      await new Promise(r => setTimeout(r, 90));
    }
  }

  // Draw final completed block
  let text = `${getTimestamp()} \x1b[1;36m[INFO]\x1b[0m Establishing secure network link with ${title}...\n`;
  text += `${getTimestamp()} \x1b[1;32m[OK]\x1b[0m Stream socket active. Fetching layers concurrently:\n`;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const bar = "█".repeat(15);
    text += `\n \x1b[32m[OK]\x1b[0m [Layer ${i + 1}/${tasks.length}] - ${task.label}: ${task.name}\n`;
    text += `   [${bar}] 100%\n`;
  }
  text += `\n===========================================================\n`;
  text += `\x1b[1;32mDOWNLOAD COMPLETE\x1b[0m\n`;
  text += `All system data packets verified successfully.\n`;
  text += `Opening secure index channels...\n`;
  text += `===========================================================\n\n`;
  context.writeLive(text);
  await new Promise(r => setTimeout(r, 200));
}

export const portfolioCommands: Command[] = [
  {
    name: "who",
    description: "Display biographical identity details with ASCII logo",
    execute: async (context) => {
      // Check if admin is currently locked in stealth quarantine
      if (context.userState !== "charan" && context.userState !== "root") {
        const lockedStory = [
          "===========================================================",
          "\x1b[1;31m[!] CLASSIFIED ARCHIVE: OPERATOR IDENTITY LOCKED\x1b[0m",
          "===========================================================",
          "Access Denied: Operator telemetry is locked in quarantine.",
          "",
          "SECURITY INCIDENT REPORT:",
          "  The system administrator (\"Charan B.S.\") detected an unauthorized",
          "  reconnaissance trace across this network node. To safeguard core",
          "  infrastructure, he initiated an emergency defensive lockdown and",
          "  vanished into an encrypted stealth quarantine partition.",
          "",
          "STATUS TELEMETRY:",
          "  Identity Matrix : \x1b[1;33m[LOCKED / ENCRYPTED]\x1b[0m",
          "  Target Subject  : Charan B.S. (Offensive Security Specialist)",
          "  Last Known Grid : Sector 0x7F - Hassan Subnet",
          "  Security State  : Active Stealth Isolation",
          "",
          "MISSION DIRECTIVE:",
          "  The administrator is hidden deep inside the system perimeter.",
          "  To breach the quarantine locks and search for him, run:",
          "",
          "      \x1b[1;32moverride\x1b[0m",
          "",
          "  Can you crack the security parameters and find him?",
          "==========================================================="
        ];
        
        let currentText = "";
        for (let i = 0; i < lockedStory.length; i++) {
          currentText += lockedStory[i] + "\n";
          context.writeLive(currentText);
          await new Promise(r => setTimeout(r, 35));
        }
        return "";
      }

      // Unlocked state (after running override or as root)
      const neofetchLines = [
        "===========================================================",
        "\x1b[1;32m[✓] OPERATOR IDENTITY UNLOCKED: CHARAN B.S. (ONLINE)\x1b[0m",
        "===========================================================",
        "      \x1b[1;36m██████\x1b[0m       OS          : Charan OS v3.1",
        "    \x1b[1;36m██████████\x1b[0m     User        : Charan BS",
        "   \x1b[1;36m███      ███\x1b[0m    Role        : Offensive Security & Penetration Testing",
        "   \x1b[1;36m███\x1b[0m             Location    : Hassan, India",
        "   \x1b[1;36m███      ███\x1b[0m    Focus       : Web App Security, Penetration Testing, Network Defense",
        "    \x1b[1;36m██████████\x1b[0m     Toolkit     : Burp Suite, Nmap, Wireshark, Metasploit, Linux",
        "      \x1b[1;36m██████\x1b[0m       Scripting   : Python, Bash, Go, Security Automation",
        "==========================================================="
      ];
      
      let currentText = "";
      for (let i = 0; i < neofetchLines.length; i++) {
        currentText += neofetchLines[i] + "\n";
        context.writeLive(currentText);
        await new Promise(r => setTimeout(r, 60));
      }
      return "";
    }
  },
  {
    name: "about",
    description: "Display biographical details card",
    execute: async (context) => {
      const whoCommand = portfolioCommands.find(cmd => cmd.name === "who");
      if (whoCommand) {
        return whoCommand.execute(context);
      }
      return "";
    }
  },
  {
    name: "skills",
    description: "Print interactive progress charts of technical skills",
    execute: () => {
      const header = [
        "===========================================================",
        "OFFENSIVE SECURITY SKILLS MATRIX",
        "==========================================================="
      ];
      
      const bars = PORTFOLIO_DATA.skills.map(skill => {
        const paddedName = skill.name.padEnd(25, " ");
        const bar = drawProgressBar(skill.level, 25);
        return `  ${paddedName} [${bar}]`;
      });

      return [...header, ...bars, "==========================================================="].join("\n");
    }
  },
  {
    name: "projects",
    description: "Access and list offensive security projects",
    execute: async (context) => {
      const tasks = getMajorLayers("projects_metadata.json", "Downloading security research projects");
      await runMultiDownload("Projects Repository", tasks, context);

      let output = "PROJECT DIRECTORY TREE:\nprojects/\n";
      PORTFOLIO_DATA.projects.forEach(p => {
        output += `├── ${p.slug}.txt\n`;
      });
      output += "\nTip: Type 'cat projects/[project-slug].txt' to inspect details.\n";
      return output;
    }
  },
  {
    name: "experience",
    description: "Print professional work experience timeline",
    execute: async (context) => {
      const tasks = getMajorLayers("timeline_records.sql", "Downloading experience history");
      await runMultiDownload("Experience Database", tasks, context);

      let output = "===========================================================\n";
      if (PORTFOLIO_DATA.experience.length === 0) {
        output += "No professional experience logged.\n";
      } else {
        PORTFOLIO_DATA.experience.forEach(exp => {
          output += `[${exp.period}] - ${exp.role}\n  Company: ${exp.company}\n  Logs:\n${exp.description.map(d => `    * ${d}`).join("\n")}\n\n`;
        });
      }
      output += "===========================================================";
      return output;
    }
  },
  {
    name: "education",
    description: "List academic history logs",
    execute: async (context) => {
      const tasks = getMajorLayers("academic_records.db", "Downloading transcripts index");
      await runMultiDownload("Academic Records Gateway", tasks, context);

      let output = "===========================================================\n";
      PORTFOLIO_DATA.education.forEach(edu => {
        output += `[${edu.period}] - ${edu.degree}\n  Institution: ${edu.school}\n  Details: ${edu.details}\n\n`;
      });
      output += "===========================================================";
      return output;
    }
  },
  {
    name: "contact",
    description: "View social connection links",
    execute: () => {
      return [
        "===========================================================",
        "CONTACT ARCHIVES",
        "===========================================================",
        `  Email:      ${PORTFOLIO_DATA.contacts.email}`,
        `  LinkedIn:   ${PORTFOLIO_DATA.contacts.linkedin}`,
        `  GitHub:     ${PORTFOLIO_DATA.contacts.github}`,
        `  TryHackMe:  ${PORTFOLIO_DATA.contacts.tryhackme}`,
        `  Portfolio:  ${PORTFOLIO_DATA.contacts.portfolio}`,
        "-----------------------------------------------------------",
        "Tip: Type the platform name directly (e.g. 'tryhackme', 'github') to open link or desktop window.",
        "==========================================================="
      ].join("\n");
    }
  },
  {
    name: "socials",
    description: "Format social links into a terminal grid table",
    execute: () => {
      return [
        "+------------+---------------------------------------------+",
        "| Network    | Address / Link                              |",
        "+------------+---------------------------------------------+",
        `| Email      | ${PORTFOLIO_DATA.contacts.email.padEnd(43, " ")} |`,
        `| LinkedIn   | ${PORTFOLIO_DATA.contacts.linkedin.padEnd(43, " ")} |`,
        `| GitHub     | ${PORTFOLIO_DATA.contacts.github.padEnd(43, " ")} |`,
        `| TryHackMe  | ${PORTFOLIO_DATA.contacts.tryhackme.padEnd(43, " ")} |`,
        "+------------+---------------------------------------------+",
        "Tip: Type 'tryhackme' to open the interactive Security Labs Hub."
      ].join("\n");
    }
  },
  {
    name: "tryhackme",
    description: "Open TryHackMe & Security Labs Hub displaying all solved rooms",
    execute: async (context) => {
      const banner = [
        "===========================================================",
        "\x1b[1;31m[⚡] TRYHACKME & OFFENSIVE SECURITY LABS HUB\x1b[0m",
        "===========================================================",
        `Operator:         charanbs (@charanbs)`,
        `Official Profile: ${PORTFOLIO_DATA.contacts.tryhackme}`,
        `Platforms:        TryHackMe, PortSwigger Web Security, LabEx.io, Local VMs`,
        `Status:           Online // 12+ Rooms & Exploits Audited`,
        "",
        "FEATURED ATTACK CHAINS & LABS:",
        "  * Chaining Vulnerabilities (TryHackMe) -> Stored XSS to Admin Takeover",
        "  * SQLi UNION & Blind Exploits (PortSwigger) -> DB Credential Exfiltration",
        "  * Linux Privilege Escalation (TryHackMe) -> SUID / GTFOBins Root Shell",
        "  * JWT Auth & Signature Bypass (PortSwigger) -> Admin Claim Forgery",
        "  * NetGuard AI Wireless Sandbox (Local VM) -> EvilTwin & Beacon Sniffing",
        "",
        "\x1b[1;32m[✓] Launching interactive Security Labs window on your desktop...\x1b[0m",
        "==========================================================="
      ];

      let text = "";
      for (let i = 0; i < banner.length; i++) {
        text += banner[i] + "\n";
        context.writeLive(text);
        await new Promise(r => setTimeout(r, 25));
      }
      return "";
    }
  },
  {
    name: "thm",
    description: "Alias for tryhackme command",
    execute: async (context) => {
      const cmd = portfolioCommands.find(c => c.name === "tryhackme");
      if (cmd) return cmd.execute(context);
      return "";
    }
  },
  {
    name: "labs",
    description: "Alias for tryhackme security labs command",
    execute: async (context) => {
      const cmd = portfolioCommands.find(c => c.name === "tryhackme");
      if (cmd) return cmd.execute(context);
      return "";
    }
  },
  {
    name: "portswigger",
    description: "View PortSwigger Web Security Academy research labs",
    execute: async (context) => {
      const cmd = portfolioCommands.find(c => c.name === "tryhackme");
      if (cmd) return cmd.execute(context);
      return "";
    }
  },
  {
    name: "github",
    description: "Access profile GitHub repository",
    execute: () => {
      window.open(PORTFOLIO_DATA.contacts.github, "_blank");
      return "Establishing handshake with github.com... Redirecting.";
    }
  },
  {
    name: "linkedin",
    description: "Access professional LinkedIn profile",
    execute: () => {
      window.open(PORTFOLIO_DATA.contacts.linkedin, "_blank");
      return "Establishing handshake with linkedin.com... Redirecting.";
    }
  },
  {
    name: "email",
    description: "Compose email correspondence",
    execute: () => {
      window.open(`mailto:${PORTFOLIO_DATA.contacts.email}`, "_self");
      return `Initializing local mail gateway to ${PORTFOLIO_DATA.contacts.email}...`;
    }
  },
  {
    name: "twitter",
    description: "Access Twitter/X channel",
    execute: () => {
      if (PORTFOLIO_DATA.contacts.twitter === "TODO") {
        return "Twitter / X profile link is currently not configured.";
      }
      window.open(PORTFOLIO_DATA.contacts.twitter, "_blank");
      return "Establishing handshake with twitter.com... Redirecting.";
    }
  },
  {
    name: "blogs",
    description: "Browse written security research articles",
    execute: () => {
      return "Access denied: HTTP 503 Service Unavailable. Security write-ups database sector in write-lock state.";
    }
  },
  {
    name: "techstack",
    description: "Review core security testing and analysis toolkit",
    execute: () => {
      return [
        "===========================================================",
        "PREFERRED SECURITY ASSESSMENT & RESEARCH TOOLKIT",
        "===========================================================",
        "Testing & Recon:  Burp Suite, Nmap, Wireshark, OWASP ZAP, Metasploit",
        "Vulnerability:   OWASP Top 10, SQLMap, Nikto, Gobuster, Hydra",
        "Languages:        Python, Bash, Go, JavaScript, C, SQL",
        "Environments:     Kali Linux, Parrot Security OS, Ubuntu Server, Docker Labs",
        "Protocols & Sys:  TCP/IP, HTTP/S, DNS, SSH, Linux PrivEsc, Active Directory Basics",
        "==========================================================="
      ].join("\n");
    }
  },
  {
    name: "certificates",
    description: "Print systems security credentials and certifications status",
    execute: async (context) => {
      const tasks = getMajorLayers("credentials_ledger.db", "Synchronizing certificates ledger");
      await runMultiDownload("Certifications Hub", tasks, context);

      let output = "===========================================================\n";
      output += "VERIFIED CYBERSECURITY CERTIFICATIONS LEDGER\n";
      output += "===========================================================\n";
      PORTFOLIO_DATA.certifications.forEach((cert, index) => {
        output += `[CREDENTIAL ${String(index + 1).padStart(2, "0")}] - ${cert.name}\n`;
        output += `  Issuer:       ${cert.issuer}\n`;
        output += `  Completed:    ${cert.date}\n`;
        if (cert.verificationCode) {
          output += `  Verification: ${cert.verificationCode}\n`;
        }
        output += `  Focus:        ${cert.description}\n`;
        output += `  Document:     ${cert.ref}\n\n`;
      });
      output += "-----------------------------------------------------------\n";
      output += "📁 You can inspect and view the certificate images in Finder:\n";
      output += "   finder/charan/certificates\n";
      output += "-----------------------------------------------------------\n";
      output += "Tip: Click the Finder icon on the Dock or type 'open certificates/[filename].pdf'.\n";
      output += "===========================================================";
      return output;
    }
  },
  {
    name: "achievements",
    description: "List security research milestones and achievements",
    execute: async (context) => {
      const tasks = getMajorLayers("commendations_ledger.csv", "Downloading security achievements");
      await runMultiDownload("Honors & Milestones Node", tasks, context);

      let output = "===========================================================\n";
      output += "- Conducted vulnerability assessments across simulated enterprise architectures\n";
      output += "- Researched automated web enumeration and recon workflows\n";
      output += "- Solved complex CTF and penetration testing lab challenges\n";
      output += "===========================================================";
      return output;
    }
  },
  {
    name: "timeline",
    description: "Unified historical timeline (academic & security research combined)",
    execute: () => {
      return [
        "===========================================================",
        "INTEGRATED CHRONOLOGICAL TIMELINE",
        "===========================================================",
        "  [2004]         DOB         20.12.2004",
        "  [Department]   ENG-AI&ML   Artificial Intelligence & Machine Learning",
        "  [Projects]     Recon Automation, Web Pentest Lab, Packet Analyzer",
        "==========================================================="
      ].join("\n");
    }
  }
];
