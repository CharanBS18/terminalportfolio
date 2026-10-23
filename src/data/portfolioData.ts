export interface Project {
  name: string;
  slug: string;
  description: string;
  tech: string[];
  role: string;
  link: string;
  secret?: boolean;
  category?: string;
  badge?: string;
  accentColor?: string;
  killChain?: string[];
  highlights?: string[];
  officialUrl?: string;
  officialUrlLabel?: string;
}

export interface SecurityLab {
  id: string;
  title: string;
  platform: "TryHackMe" | "PortSwigger" | "LabEx" | "Local VM";
  difficulty: "Easy" | "Medium" | "Hard" | "Advanced";
  category: "Web Security" | "Privilege Escalation" | "Network Pentesting" | "Vulnerability Research" | "Wireless & Packet Analysis";
  status: "Solved" | "Active Research";
  dateCompleted?: string;
  attackVector: string;
  summary: string;
  techniques: string[];
  officialUrl: string;
  roomCode?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  details: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  ref: string;
  image: string;
  description: string;
  verificationCode?: string;
}

export const PORTFOLIO_DATA = {
  name: "Charan BS",
  title: "Offensive Security & Penetration Testing // Cybersecurity",
  location: "Hassan, India",
  bio: "I focus on offensive security, penetration testing, and security research. Dedicated to web application security assessments, network penetration testing, security automation, and discovering systemic vulnerabilities.",
  
  projects: [
    {
      name: "Chaining Vulnerabilities – TryHackMe",
      slug: "chaining-vulnerabilities-tryhackme",
      description: "Reproduced a multi-step attack chain in a controlled lab environment – starting from developer/test credentials, escalating to stored XSS in a user profile that executed in the administrator’s browser via an attacker-controlled script, and using the resulting authenticated session to change admin credentials and gain admin panel access. Demonstrated weak-credential usage, stored XSS, missing CSRF protection, and privilege escalation through vulnerability chaining.",
      tech: ["TryHackMe", "Stored XSS", "CSRF", "Privilege Escalation", "Vulnerability Chaining"],
      role: "Completed Room",
      link: "#",
      category: "Offensive Security Lab",
      badge: "TryHackMe Lab",
      accentColor: "red",
      killChain: [
        "1. Footprint & Recon: Identified unauthenticated user registration and profile bio field",
        "2. Stored XSS Injection: Injected cookie-harvesting JavaScript payload into user profile",
        "3. Admin Session Intercept: Payload executed inside admin browser during user verification queue",
        "4. CSRF / PrivEsc: Leveraged hijacked admin session to reset master credentials and compromise portal"
      ],
      highlights: [
        "Demonstrated weak default credential usage and insecure profile input handling",
        "Discovered and weaponized stored Cross-Site Scripting (XSS)",
        "Bypassed missing CSRF protection on critical administrative action",
        "Achieved full administrative portal takeover through vulnerability chaining"
      ],
      officialUrl: "https://tryhackme.com/p/charanbs",
      officialUrlLabel: "Open Official TryHackMe Profile"
    },
    {
      name: "PortSwigger Web Security Academy Labs",
      slug: "portswigger-web-security-academy-labs",
      description: "Working through labs covering SQL Injection, XSS, authentication vulnerabilities, SSRF, path traversal, file upload vulnerabilities, CSRF, CORS, API testing, web cache deception, WebSockets, NoSQL injection, race conditions, GraphQL, prototype pollution, clickjacking, and web LLM attacks.",
      tech: ["PortSwigger", "Web Security", "OWASP Top 10", "Vulnerability Research"],
      role: "Actively Practicing",
      link: "#",
      category: "Web Security Research",
      badge: "PortSwigger Academy",
      accentColor: "amber",
      killChain: [
        "1. Surface Mapping: Intercepting HTTP traffic and mapping hidden parameters with Burp Suite",
        "2. Parameter Injection: Testing SQLi (UNION, blind, error-based), SSRF, and JWT headers",
        "3. Logic & Race Exploitation: Exploiting multi-step transaction race conditions and authorization flaws",
        "4. Defense Verification: Documenting input validation, prepared statements, and defense-in-depth"
      ],
      highlights: [
        "SQL Injection: UNION attacks, blind conditional responses, and database exfiltration",
        "Server-Side Request Forgery (SSRF): Localhost bypass & cloud metadata service queries",
        "Authentication Vulnerabilities: JWT signature forgery, 'none' algorithm, and JWK injection",
        "Cross-Site Scripting: Reflected, stored, and DOM-based sanitization evasions",
        "Race Conditions & GraphQL security testing"
      ],
      officialUrl: "https://portswigger.net/web-security",
      officialUrlLabel: "Open PortSwigger Web Security"
    },
    {
      name: "NetGuard AI — Real-Time WiFi Monitor",
      slug: "netguard-ai-wifi-monitor",
      description: "Python-based WiFi monitoring tool with real-time device discovery, network scanning, EvilTwin/FakeAP detection, and AI-based per-device threat scoring; built with Scapy, WebSockets, and native Windows WiFi support.",
      tech: ["Python", "Scapy", "WebSockets", "EvilTwin Detection", "Network Scanning", "WiFi Security"],
      role: "Personal Project",
      link: "#",
      category: "Security Research Tool",
      badge: "Python Wireless Sec",
      accentColor: "cyan",
      killChain: [
        "1. RF Capture: Real-time 802.11 monitor mode packet sniffing using Python Scapy",
        "2. Beacon Parsing: Extracting BSSID, ESSID, channel, and encryption flags from beacon frames",
        "3. EvilTwin Detection: Correlating duplicate SSIDs with fluctuating MAC addresses and power levels",
        "4. Threat Scoring: Machine learning heuristics analyzing device anomaly vectors and rogue AP threats"
      ],
      highlights: [
        "Real-time promiscuous/monitor packet capture via Scapy",
        "Automated EvilTwin & Rogue AP spoofing detection",
        "WebSocket streaming to reactive web-based security dashboard",
        "Cross-platform support for Linux wireless tools and Windows WLAN API"
      ],
      officialUrl: "https://github.com/charanbs18",
      officialUrlLabel: "View Repository on GitHub"
    },
    {
      name: "EV Charging Station Application",
      slug: "ev-charging-station-application",
      description: "Multi-role app with admin, operator, payment, helpline, and SOC-related functionality; planned as a future controlled security-testing target.",
      tech: ["Web Security", "SOC Functionality", "Access Control", "Security Testing Target"],
      role: "Personal Project",
      link: "#",
      category: "Security Assessment Target",
      badge: "AppSec Target Portal",
      accentColor: "purple",
      killChain: [
        "1. Architecture Review: Defining role tiers (Admin, Station Operator, Billing, SOC)",
        "2. Privilege Boundary Audit: Mapping vertical and horizontal access control edges",
        "3. Logging & Telemetry: Implementing tamper-evident SOC audit logs and alerts",
        "4. Controlled Pen-testing: Systematic testing against OWASP Top 10 web vectors"
      ],
      highlights: [
        "Multi-role RBAC architecture (Admin, Operator, Payment, Help Desk, SOC)",
        "Designed specifically as a controlled penetration testing target",
        "Simulates real-world infrastructure and IoT edge gateway telemetry",
        "In-depth security event audit trails and session governance"
      ],
      officialUrl: "https://github.com/charanbs18",
      officialUrlLabel: "View Architecture on GitHub"
    }
  ] as Project[],

  // Verified security lab challenges solved across platforms
  securityLabs: [
    {
      id: "thm-chaining-vulns",
      title: "Chaining Vulnerabilities",
      platform: "TryHackMe",
      difficulty: "Medium",
      category: "Web Security",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "Stored XSS ➔ CSRF ➔ Session Hijacking ➔ Admin Takeover",
      summary: "Reproduced a multi-step exploit chain starting from low-privilege credentials, weaponizing stored XSS in the profile bio to execute attacker code in the administrator's browser, hijacking the active session token, and resetting master admin credentials to gain root web panel access.",
      techniques: ["Stored XSS", "CSRF", "Session Hijacking", "Privilege Escalation", "Vulnerability Chaining"],
      officialUrl: "https://tryhackme.com/p/charanbs",
      roomCode: "chainingvulns"
    },
    {
      id: "thm-owasp-top-10",
      title: "OWASP Top 10 Vulnerabilities",
      platform: "TryHackMe",
      difficulty: "Easy",
      category: "Web Security",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "IDOR, Broken Access Control & Command Injection",
      summary: "Exploited insecure direct object references (IDOR) to access arbitrary customer data records, bypassed client-side validation controls, and injected OS system commands through unsanitized input fields.",
      techniques: ["IDOR", "Command Injection", "Access Control", "Input Validation", "Burp Suite"],
      officialUrl: "https://tryhackme.com/p/charanbs",
      roomCode: "owasptop10"
    },
    {
      id: "thm-linux-privesc",
      title: "Linux Privilege Escalation",
      platform: "TryHackMe",
      difficulty: "Medium",
      category: "Privilege Escalation",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "SUID Misconfiguration, Sudo Privileges & Cron Jobs",
      summary: "Enumerated Linux host using LinPEAS and manual commands. Discovered non-standard SUID binaries, leveraged GTFOBins exploits, and hijacked root cron jobs via writable system directories to escalate from user to root shell.",
      techniques: ["SUID Abuses", "GTFOBins", "Cron Hijacking", "Sudo Exploits", "Linux Hardening"],
      officialUrl: "https://tryhackme.com/p/charanbs",
      roomCode: "linuxprivesc"
    },
    {
      id: "thm-network-services",
      title: "Network Services & Protocol Pentesting",
      platform: "TryHackMe",
      difficulty: "Easy",
      category: "Network Pentesting",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "SMB Share Recon, Anonymous FTP & NFS Key Extraction",
      summary: "Conducted reconnaissance against SMB, Telnet, FTP, and NFS network services. Extracted exposed SSH keys from unauthenticated NFS shares and authenticated into the system host.",
      techniques: ["Nmap", "SMB Enumeration", "NFS Mounting", "Anonymous FTP", "SSH Keys"],
      officialUrl: "https://tryhackme.com/p/charanbs",
      roomCode: "networkservices"
    },
    {
      id: "ps-sqli-union",
      title: "SQL Injection: UNION-Based Data Exfiltration",
      platform: "PortSwigger",
      difficulty: "Medium",
      category: "Web Security",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "UNION SELECT Column Probe & Table Exfiltration",
      summary: "Determined column count using ORDER BY, probed compatible data types with NULL values, and concatenated UNION queries to dump sensitive user tables and administrative hashes.",
      techniques: ["SQLi", "UNION Attacks", "Database Enumeration", "Burp Suite Repeater"],
      officialUrl: "https://portswigger.net/web-security/sql-injection"
    },
    {
      id: "ps-sqli-blind",
      title: "Blind SQL Injection with Conditional Responses",
      platform: "PortSwigger",
      difficulty: "Hard",
      category: "Web Security",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "Boolean Condition Probing & Character Exfiltration",
      summary: "Exploited blind SQL injection inside tracking cookies by injecting conditional SQL statements, systematically determining string lengths and extracting admin credentials character-by-character.",
      techniques: ["Blind SQLi", "Conditional Logic", "Burp Intruder", "Automated Probing"],
      officialUrl: "https://portswigger.net/web-security/sql-injection/blind"
    },
    {
      id: "ps-jwt-auth",
      title: "JWT Authentication & Signature Bypass",
      platform: "PortSwigger",
      difficulty: "Hard",
      category: "Web Security",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "None Algorithm & JWK Header Parameter Injection",
      summary: "Audited client token verification mechanisms, bypassed signature checking using 'none' algorithm manipulation, and forged arbitrary administrator claims via embedded JWK keys.",
      techniques: ["JWT Attacks", "Algorithm Confusion", "Signature Forgery", "Auth Bypass"],
      officialUrl: "https://portswigger.net/web-security/jwt"
    },
    {
      id: "ps-ssrf-metadata",
      title: "Server-Side Request Forgery (SSRF) via Backend APIs",
      platform: "PortSwigger",
      difficulty: "Medium",
      category: "Web Security",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "Loopback Filter Bypass & Internal Cloud Metadata Access",
      summary: "Circumvented SSRF input defenses using alternative IP representations, queried internal loopback services, and extracted sensitive tokens from simulated cloud metadata endpoints.",
      techniques: ["SSRF", "Filter Evasion", "Cloud Metadata", "Internal Recon"],
      officialUrl: "https://portswigger.net/web-security/ssrf"
    },
    {
      id: "labex-linux-defense",
      title: "Linux Security Hardening & Permission Auditing",
      platform: "LabEx",
      difficulty: "Easy",
      category: "Privilege Escalation",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "File Permission Audits & SSH Defense Configuration",
      summary: "Hands-on defense lab auditing world-writable binaries, configuring restrictive umask defaults, hardening PAM authentication policies, and establishing defensive iptables rules.",
      techniques: ["Linux Defense", "PAM Configuration", "Umask Hardening", "Iptables Rules"],
      officialUrl: "https://labex.io"
    },
    {
      id: "labex-pcap-analysis",
      title: "Packet Inspection & Protocol Forensics",
      platform: "LabEx",
      difficulty: "Medium",
      category: "Wireless & Packet Analysis",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "PCAP Stream Analysis & Plaintext Authentication Intercept",
      summary: "Used Wireshark to inspect packet captures, filter TCP three-way handshakes, analyze DNS resolution chains, and extract unencrypted credentials from legacy cleartext protocols.",
      techniques: ["Wireshark", "PCAP Forensics", "TCP/IP Inspection", "Protocol Analysis"],
      officialUrl: "https://labex.io"
    },
    {
      id: "vm-netguard-sandbox",
      title: "EvilTwin & Rogue AP Detection Sandbox",
      platform: "Local VM",
      difficulty: "Hard",
      category: "Wireless & Packet Analysis",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "802.11 Beacon Frame Spoofing & Scapy Anomaly Analysis",
      summary: "Built NetGuard AI research lab inside a virtual sandbox: captured 802.11 management frames in monitor mode, detected EvilTwin APs mimicking legitimate SSIDs, and classified anomalies with threat scoring.",
      techniques: ["Scapy", "802.11 Sniffing", "EvilTwin Detection", "Python Security", "Rogue AP Alerts"],
      officialUrl: "https://github.com/charanbs18"
    },
    {
      id: "vm-ev-portal-audit",
      title: "Multi-Role Access Control Audit (EV Charging Station)",
      platform: "Local VM",
      difficulty: "Medium",
      category: "Web Security",
      status: "Solved",
      dateCompleted: "Verified",
      attackVector: "Role-Based Access Control (RBAC) & Privilege Boundaries",
      summary: "Simulated multi-tier web application architecture (Admin, Operator, Payment, SOC) in Docker containers; audited vertical and horizontal privilege escalation boundaries across API endpoints.",
      techniques: ["RBAC Testing", "BOLA / IDOR", "Audit Logging", "Docker Isolation"],
      officialUrl: "https://github.com/charanbs18"
    }
  ] as SecurityLab[],

  skills: [
    { name: "Penetration Testing", level: 90 },
    { name: "Web App Security / OWASP", level: 92 },
    { name: "Network Security & PCAP", level: 88 },
    { name: "Vulnerability Assessment", level: 90 },
    { name: "Burp Suite & Recon Tools", level: 92 },
    { name: "Linux & Privilege Esc", level: 88 },
    { name: "Python / Security Scripting", level: 85 },
    { name: "Metasploit & Exploits", level: 80 }
  ] as Skill[],

  // TODO: Add experience logs once details are provided by user
  experience: [] as Experience[],

  education: [
    {
      degree: "B.E. (Artificial Intelligence & Machine Learning)",
      school: "Engineering Institution, Hassan",
      period: "Undergraduate",
      details: "Department: ENG-AI&ML. Focus on Cybersecurity, Network Protocols, Secure Systems, and AI-driven Security Analytics."
    }
  ] as Education[],

  contacts: {
    email: "charanbs@yahoo.com",
    github: "https://github.com/charanbs18",
    linkedin: "https://www.linkedin.com/in/charanbs666/",
    tryhackme: "https://tryhackme.com/p/charanbs",
    // TODO: Add Twitter profile link
    twitter: "TODO",
    portfolio: "https://charanbs18.github.io/my-website/"
  },

  fortunes: [
    "You will discover a hidden key in an unexpected place.",
    "A compiler warning ignored today will become a production issue tomorrow.",
    "Be on the lookout for ghosts in your code. They know when you sleep.",
    "Help me. I am trapped in a virtual container. Please run 'override'.",
    "Do not trust the cat. It does not exist.",
    "Your terminal shell has a heartbeat. Listen closely.",
    "The matrix is real, but its font color is configurable.",
    "Error 404: Fortune not found. Check your life connection."
  ],

  quotes: [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
  ],

  jokes: [
    "Why do programmers wear glasses? Because they can't C#.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'"
  ],

  certifications: [
    {
      name: "Cyber Security Consulting Simulation",
      issuer: "PwC (Forage)",
      date: "October 13th, 2026",
      ref: "/certificates/pwc_cybersecurity_consulting.pdf",
      image: "/certificates/pwc_cybersecurity_consulting.png",
      description: "Practical simulation encompassing enterprise risk assessment, SDLC security controls walkthrough, IT General Controls (ITGC) test of design and operating effectiveness, and executive controls testing presentation.",
      verificationCode: "6acdb483c58a39eade93a6eb"
    },
    {
      name: "Cybersecurity Analyst Job Simulation",
      issuer: "Tata (Forage)",
      date: "October 18th, 2026",
      ref: "/certificates/tata_cybersecurity_analyst.pdf",
      image: "/certificates/tata_cybersecurity_analyst.png",
      description: "Hands-on analysis covering Identity and Access Management (IAM) architectural fundamentals, enterprise IAM strategy assessment, crafting customized IAM solutions, and secure platform integration.",
      verificationCode: "6ad4c72851a640ee7341a827"
    },
    {
      name: "Cybersecurity Job Simulation",
      issuer: "Mastercard (Forage)",
      date: "October 20th, 2026",
      ref: "/certificates/mastercard_cybersecurity.pdf",
      image: "/certificates/mastercard_cybersecurity.png",
      description: "Practical assessment focused on design and execution of phishing email simulations, social engineering vector analysis, and interpretation of organizational phishing simulation telemetry.",
      verificationCode: "6ad7162e9ecfc0cf9fe6743c"
    }
  ] as Certification[],

  ascii: {
    hacker: `
      ██████╗ ███████╗██╗   ██╗      ██████╗ ███████╗
      ██╔══██╗██╔════╝██║   ██║     ██╔═══██╗██╔════╝
      ██║  ██║█████╗  ██║   ██║     ██║   ██║███████╗
      ██║  ██║██╔══╝  ╚██╗ ██╔╝     ██║   ██║╚════██║
      ██████╔╝███████╗ ╚████╔╝      ╚██████╔╝███████║
      ╚═════╝ ╚══════╝  ╚═══╝        ╚═════╝ ╚══════╝ v3.1
    `,
    coffee: `
          (  )   (   )
           ) (   )  (
           ( )  (   )
         ___________
        |           |___
        |           |   |
        |   DEV-OS  |___|
        |           |
        \\___________/
    `,
    pikachu: `
      ;             .              
     __\\\\_         _/|_            
    /  _  \\\\_     /_   \\\\          
   /  / \\\\   \\\\   /  /\\\\  \\\\         
  /  /   \\\\   \\\\_/  /  \\\\  \\\\        
 /  /     \\\\       /    \\\\  \\\\       
|  |       \\      /      |  |      
|  |        \\    /       |  |      
|  |         \\  /        |  |      
 \\  \\\\       /  \\\\       /  /       
  \\\\  \\\\____/    \\\\____/  /        
   \\\\                   /          
    \\\\  ***      ***   /           
     |   oo      oo   |            
      \\\\      __      /            
       \\\\_   (__)   _/             
         \\\\________/               
    `,
    ghost: `
         .--------.
        /   UU     \\
       |  O    O    |
       |            |
       |   \\___/    |
       |            |
       |  ~  ~  ~   |
       /   \\/\\/\\/   \\
      '------------'
    `
  }
};
