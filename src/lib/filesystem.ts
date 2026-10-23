import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { FSNode } from "./types";

export const initialFilesystem: FSNode = {
  type: 'directory',
  name: 'root',
  children: {
    'home': {
      type: 'directory',
      name: 'home',
      children: {
        'charan': {
          type: 'directory',
          name: 'charan',
          children: {
            'documents': {
              type: 'directory',
              name: 'documents',
              children: {}
            },
            'downloads': {
              type: 'directory',
              name: 'downloads',
              children: {}
            },
            'pictures': {
              type: 'directory',
              name: 'pictures',
              children: {}
            },
            'about.txt': {
              type: 'file',
              name: 'about.txt',
              content: `===========================================================
IDENTITY LOG: ABOUT ${PORTFOLIO_DATA.name.toUpperCase()}
===========================================================
Subject Name:  ${PORTFOLIO_DATA.name}
Role:          ${PORTFOLIO_DATA.title}
Geo-Location:  ${PORTFOLIO_DATA.location}

ABOUT ME:
${PORTFOLIO_DATA.bio}
`
            },
            'profile.txt': {
              type: 'file',
              name: 'profile.txt',
              content: `===========================================================
USER PROFILE SUMMARY
===========================================================
Name:        ${PORTFOLIO_DATA.name}
Title:       ${PORTFOLIO_DATA.title}
Department:  ENG-AI&ML (Artificial Intelligence & Machine Learning)
Location:    Hassan, India
DOB:         20.12.2004
Email:       ${PORTFOLIO_DATA.contacts.email}
GitHub:      ${PORTFOLIO_DATA.contacts.github}
LinkedIn:    ${PORTFOLIO_DATA.contacts.linkedin}
`
            },
            'skills': {
              type: 'directory',
              name: 'skills',
              children: {
                'web_security.txt': {
                  type: 'file',
                  name: 'web_security.txt',
                  content: `===========================================================
WEB APPLICATION SECURITY MATRIX
===========================================================
OWASP Top 10       - Advanced (SQLi, XSS, CSRF, IDOR, SSRF)
Burp Suite Pro     - Advanced (Target mapping, Repeater, Intruder, Extender)
OWASP ZAP          - Intermediate (Automated vulnerability scanning)
Authentication     - Advanced (JWT attacks, session hijacking, OAuth flaws)
API Security       - Intermediate (REST/GraphQL endpoint testing)
`
                },
                'network_security.txt': {
                  type: 'file',
                  name: 'network_security.txt',
                  content: `===========================================================
NETWORK & SYSTEM SECURITY MATRIX
===========================================================
Recon & Discovery  - Advanced (Nmap, Masscan, DNS enumeration)
Traffic Analysis   - Advanced (Wireshark, tcpdump, PCAP forensics)
Exploitation       - Intermediate (Metasploit framework, custom exploits)
Privilege Esc      - Intermediate (Linux/Windows enumeration & escalation)
Wireless Security  - Basic (WPA2 handshakes, Aircrack-ng suite)
`
                },
                'tools.txt': {
                  type: 'file',
                  name: 'tools.txt',
                  content: `===========================================================
OFFENSIVE SECURITY UTILITIES & AUTOMATION
===========================================================
Scripting & Tools  - Python, Bash, Go (Custom scanners, payload scripts)
OS Environments    - Kali Linux, Parrot Security OS, Ubuntu Server
Containers & Labs  - Docker (Vulnerable lab setups, CTF sandboxes)
Version Control    - Git, GitHub (Security tooling repository management)
`
                }
              }
            },
            'projects': {
              type: 'directory',
              name: 'projects',
              children: PORTFOLIO_DATA.projects.reduce((acc, proj) => {
                acc[proj.slug + '.txt'] = {
                  type: 'file',
                  name: proj.slug + '.txt',
                  content: `===========================================================
PROJECT: ${proj.name.toUpperCase()}
===========================================================
Role:        ${proj.role}
Stack:       ${proj.tech.join(" // ")}
Repository:  ${proj.link}

DESCRIPTION:
${proj.description}
`
                };
                return acc;
              }, {} as { [key: string]: FSNode })
            },
            'certificates': {
              type: 'directory',
              name: 'certificates',
              children: PORTFOLIO_DATA.certifications.length > 0 
                ? PORTFOLIO_DATA.certifications.reduce((acc, cert) => {
                    const baseKey = cert.ref.split('/').pop() || `${cert.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
                    const imgKey = cert.image.split('/').pop() || baseKey.replace('.pdf', '.png');
                    acc[baseKey] = {
                      type: 'file',
                      name: baseKey,
                      content: `===========================================================
VERIFIED CERTIFICATE DOCUMENT
===========================================================
Certificate Name:  ${cert.name}
Issuer:            ${cert.issuer}
Issued Date:       ${cert.date}
Verification Code: ${cert.verificationCode || 'VERIFIED-LEDGER'}
Scope / Topics:    ${cert.description}
PDF Document:      ${cert.ref}
Image Preview:     ${cert.image}
===========================================================
`
                    };
                    acc[imgKey] = {
                      type: 'file',
                      name: imgKey,
                      content: `[IMAGE ASSET] ${cert.image}\nCertificate: ${cert.name} (${cert.issuer})\nView this certificate in Finder: Finder > charan > certificates\nPreview image URL: ${cert.image}`
                    };
                    return acc;
                  }, {} as { [key: string]: FSNode })
                : {}
            },
            'experience': {
              type: 'directory',
              name: 'experience',
              children: {
                'timeline.txt': {
                  type: 'file',
                  name: 'timeline.txt',
                  content: `===========================================================
EXPERIENCE RECORD TIMELINE
===========================================================
No professional work experience logged.
`
                }
              }
            },
            'resume.pdf': {
              type: 'file',
              name: 'resume.pdf',
              content: `===========================================================
CURRICULUM VITAE DOCUMENT
===========================================================
Access status: OMITTED.
Operator choice: "Resume not included."
`
            },
            'contact.txt': {
              type: 'file',
              name: 'contact.txt',
              content: `===========================================================
CONTACT INDEX CARD
===========================================================
Compose Mail: ${PORTFOLIO_DATA.contacts.email}
LinkedIn:     ${PORTFOLIO_DATA.contacts.linkedin}
GitHub:       ${PORTFOLIO_DATA.contacts.github}
Portfolio:    ${PORTFOLIO_DATA.contacts.portfolio}
`
            }
          }
        }
      }
    },
    'secret': {
      type: 'directory',
      name: 'secret',
      children: {
        'instructions.txt': {
          type: 'file',
          name: 'instructions.txt',
          content: `WARNING: BACKDOOR DECRYPTION NODE DETECTED.
A backdoor override code sequence is active:
  1. unlock
  2. sudo
  3. ghost
  4. decrypt
  5. who
`
        }
      }
    },
    'root': {
      type: 'directory',
      name: 'root',
      children: {
        'final_message.txt': {
          type: 'file',
          name: 'final_message.txt',
          content: `===========================================================
You found the person behind this system.
===========================================================
          ██████       OS          : Charan OS v3.1
        ██████████     User        : Charan BS
       ███      ███    Role        : Offensive Security & Penetration Testing
       ███             Location    : Hassan, India
       ███      ███    Toolkit     : Burp Suite, Nmap, Wireshark, Metasploit
        ██████████     Scripting   : Python, Bash, Go, Linux
          ██████       GitHub      : github.com/charanbs18
                       LinkedIn    : linkedin.com/in/charanbs666

STORY:
I am an Artificial Intelligence & Machine Learning engineering student with a dedicated focus on Offensive Security, Penetration Testing, and Vulnerability Research. This workstation reflects my commitment to security discovery, systems auditing, and ethical hacking.

PORTFOLIO LINK:
${PORTFOLIO_DATA.contacts.portfolio}
===========================================================
Thank you for playing and exploring the terminal shell!
System override confirmed. Operator credentials granted.
`
        }
      }
    },
    'var': {
      type: 'directory',
      name: 'var',
      children: {
        'log': {
          type: 'directory',
          name: 'log',
          children: {
            'system.log': {
              type: 'file',
              name: 'system.log',
              content: `[INFO] DEV-OS Kernel boot parameters initialized.\n[INFO] Mounting virtual disk nodes (SHA256 verified).\n[INFO] Loading audio keyboard-click driver.\n[INFO] Starting shell console session listener on node-7.\n`
            },
            'access.log': {
              type: 'file',
              name: 'access.log',
              content: `[INFO] Connection established: Host visitor node-7 accepted.\n[WARN] Security challenge triggered: Guest shell access restricted.\n[WARN] Unauthorized path resolution request: '/root/final_message.txt' - Gate lock active.\n`
            },
            'terminal.log': {
              type: 'file',
              name: 'terminal.log',
              content: `[INFO] Session opened for user 'guest'\n[INFO] Command executed: ls\n[INFO] Command executed: cd projects\n[INFO] Command executed: cat readme.txt\n`
            },
            'unknown.log': {
              type: 'file',
              name: 'unknown.log',
              content: `[ALERT] Unknown process daemon running at PID 666.\n[ALERT] Port breach warning: Unresolved signal trace detected.\n[ALERT] System monitoring override active. Connection loop hijacked.\n`
            }
          }
        }
      }
    },
    '.config': {
      type: 'file',
      name: '.config',
      content: `shell_color = green\nscanlines = true\nglow = 0.8\nsound_effects = true\n`
    },
    '.cache': {
      type: 'file',
      name: '.cache',
      content: `[SYS CACHE BLOCK: 0x3F89A // INTEGRITY VERIFIED]\n`
    },
    '.logs': {
      type: 'file',
      name: '.logs',
      content: `[LOG] guest logged in from node-7\n[LOG] system diagnostics ok\n[LOG] WARNING: unauthorised access attempt at root\n`
    },
    '.secret': {
      type: 'file',
      name: '.secret',
      content: `[SECRET BACKDOOR DATA]\nOverride code: unlock -> sudo -> ghost -> decrypt -> who\n`
    }
  }
};

export function resolvePath(
  root: FSNode,
  currentPath: string[],
  pathStr: string
): { node: FSNode | null; pathArray: string[]; error?: string } {
  const parts = pathStr.split('/').filter(Boolean);
  const workingPath = pathStr.startsWith('/') ? [] : [...currentPath];

  if (pathStr.startsWith('/')) {
    // Absolute path
  }

  let curr: FSNode = root;
  // First, travel to the current working path if relative
  for (const segment of workingPath) {
    if (curr.type === 'directory' && curr.children[segment]) {
      curr = curr.children[segment];
    } else {
      return { node: null, pathArray: [], error: `Path resolution failure on initial path.` };
    }
  }

  // Parse path segments
  for (const part of parts) {
    if (part === '.') {
      continue;
    }
    if (part === '..') {
      if (workingPath.length > 0) {
        workingPath.pop();
        // Traverse again from root to resolve node correctly
        curr = root;
        for (const segment of workingPath) {
          if (curr.type === 'directory' && curr.children[segment]) {
            curr = curr.children[segment];
          }
        }
      }
      continue;
    }

    if (curr.type !== 'directory') {
      return { node: null, pathArray: [], error: `Not a directory: ${part}` };
    }

    if (!curr.children[part]) {
      return { node: null, pathArray: [], error: `No such file or directory: ${part}` };
    }

    curr = curr.children[part];
    workingPath.push(part);
  }

  return { node: curr, pathArray: workingPath };
}
