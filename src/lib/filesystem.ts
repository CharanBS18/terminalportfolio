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
                'frontend.txt': {
                  type: 'file',
                  name: 'frontend.txt',
                  content: `===========================================================
FRONTEND PROFICIENCY MATRIX
===========================================================
React / Next.js    - Advanced (State management, SSR, Turbopack)
Tailwind CSS       - Advanced (Responsive UI design)
Vanilla CSS        - Advanced (Custom animation frames, Bezels)
Three.js / WebGL   - Intermediate (3D animations, product displays)
Figma / Blender    - Intermediate (UI prototyping & 3D modeling)
`
                },
                'backend.txt': {
                  type: 'file',
                  name: 'backend.txt',
                  content: `===========================================================
BACKEND & PROGRAMMING LANGUAGES MATRIX
===========================================================
Python / Flask     - Advanced (AI applications, RAG pipelines)
JavaScript / Node  - Advanced (Full-stack APIs, systems engineering)
Java / Spring Boot - Intermediate (Core object-oriented design)
SQL / Databases    - Intermediate (MySQL, SQLite, MongoDB queries)
C / C++            - Basic (Core systems logic)
`
                },
                'tools.txt': {
                  type: 'file',
                  name: 'tools.txt',
                  content: `===========================================================
ENGINEERING UTILITIES & TOOLS
===========================================================
Version Control    - Git, GitHub Actions (CI/CD workflows)
Cloud Platforms    - AWS, Google Cloud, Vercel deployments
Containers         - Docker (Isolated system packaging)
Shell Systems      - Linux bash, macOS zsh scripting
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
              children: PORTFOLIO_DATA.certifications.reduce((acc, cert) => {
                const key = cert.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.pdf';
                acc[key] = {
                  type: 'file',
                  name: key,
                  content: `===========================================================
VERIFIED CERTIFICATE DOCUMENT
===========================================================
Certificate Name: ${cert.name}
Issuer:           ${cert.issuer}
Verification Key: SHA256-${Math.random().toString(16).substring(2, 10).toUpperCase()}
Credential URL:   ${cert.ref}
`
                };
                return acc;
              }, {} as { [key: string]: FSNode })
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
// TODO: No professional work experience logged on current site.
// Dynamic details can be logged inside src/data/portfolioData.ts.
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
       ███      ███    Role        : AI & Full-Stack Developer
       ███             Location    : Hassan, India
       ███      ███    Languages   : Python, TypeScript, React, Java
        ██████████     Frameworks  : Next.js 15, Streamlit, Flask, Three.js
          ██████       GitHub      : github.com/charanbs18
                       LinkedIn    : linkedin.com/in/charanbs666

STORY:
I am an Artificial Intelligence & Machine Learning engineering student with a deep passion for building interactive products, AI-powered tools, and 3D immersive graphics interfaces. This system represents my love for game design, operating systems, and core frontend craftsmanship.

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
