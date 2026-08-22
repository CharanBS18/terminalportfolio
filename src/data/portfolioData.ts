export interface Project {
  name: string;
  slug: string;
  description: string;
  tech: string[];
  role: string;
  link: string;
  secret?: boolean;
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

export const PORTFOLIO_DATA = {
  name: "Charan BS",
  title: "Offensive Security & Penetration Testing // Cybersecurity",
  location: "Hassan, India",
  bio: "I focus on offensive security, penetration testing, and security research. Dedicated to web application security assessments, network penetration testing, security automation, and discovering systemic vulnerabilities.",
  
  projects: [
    {
      name: "Automated Recon & Vulnerability Suite",
      slug: "vuln-recon-suite",
      description: "A modular reconnaissance and vulnerability assessment toolkit designed for automated target enumeration, port discovery, HTTP service fingerprinting, and security misconfiguration detection.",
      tech: ["Python", "Bash", "Nmap Scripting", "AsyncIO", "Socket Programming"],
      role: "Security Researcher",
      link: "https://github.com/charanbs18/recon-automation-toolkit"
    },
    {
      name: "Web Application Security Testing Lab",
      slug: "web-pentest-lab",
      description: "An interactive penetration testing environment focused on identifying and reproducing OWASP Top 10 vulnerabilities including SQL Injection, Cross-Site Scripting (XSS), IDOR, and broken authentication mechanisms.",
      tech: ["Burp Suite", "OWASP ZAP", "Python", "Docker", "SQLMap"],
      role: "Security Tester",
      link: "https://github.com/charanbs18/web-pentest-lab"
    },
    {
      name: "Network Traffic & Packet Analyzer",
      slug: "network-packet-analyzer",
      description: "A lightweight raw socket packet sniffer and security telemetry analyzer built to capture, inspect, and dissect TCP/UDP streams for anomalous payloads and protocol abuse.",
      tech: ["Go", "Wireshark", "PCAP Analysis", "Raw Sockets", "TCP/IP"],
      role: "Security Analyst",
      link: "https://github.com/charanbs18/packet-sniffer-go"
    },
    {
      name: "Offensive Security Research & CTF Labs",
      slug: "ctf-exploit-lab",
      description: "A curated repository of capture-the-flag challenge writeups, custom privilege escalation scripts, payload generation techniques, and binary vulnerability analysis notes.",
      tech: ["Linux", "Metasploit", "GDB", "Bash Scripting", "Privilege Escalation"],
      role: "Security Researcher",
      link: "https://github.com/charanbs18/security-research-ctf"
    },
    {
      name: "Secret Project █████",
      slug: "secret-project",
      description: "SYSTEM ERROR: ENCRYPTED PROFILE. SECURE ACCESS OVERRIDE INITIATED. UNLOCK THE CONSOLE VIA SECURITY GATE PROTOCOLS.",
      tech: ["???", "???"],
      role: "Anomalous Subject",
      link: "#",
      secret: true
    }
  ] as Project[],

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
      // TODO: Add exact engineering college name in Hassan
      school: "Hassan Engineering College (TODO)",
      // TODO: Add actual academic period dates
      period: "TODO",
      details: "Department: ENG-AI&ML. Focus on Cybersecurity, Network Protocols, Secure Systems, and AI-driven Security Analytics."
    }
  ] as Education[],

  contacts: {
    email: "charanbs@yahoo.com",
    github: "https://github.com/charanbs18",
    linkedin: "https://www.linkedin.com/in/charanbs666/",
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

  certifications: [] as Array<{ name: string; issuer: string; ref: string }>,

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
