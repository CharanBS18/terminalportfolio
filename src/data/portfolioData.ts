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
      link: "#"
    },
    {
      name: "PortSwigger Web Security Academy Labs",
      slug: "portswigger-web-security-academy-labs",
      description: "Working through labs covering SQL Injection, XSS, authentication vulnerabilities, SSRF, path traversal, file upload vulnerabilities, CSRF, CORS, API testing, web cache deception, WebSockets, NoSQL injection, race conditions, GraphQL, prototype pollution, clickjacking, and web LLM attacks.",
      tech: ["PortSwigger", "Web Security", "OWASP Top 10", "Vulnerability Research"],
      role: "Actively Practicing",
      link: "#"
    },
    {
      name: "EV Charging Station Application",
      slug: "ev-charging-station-application",
      description: "Multi-role app with admin, operator, payment, helpline, and SOC-related functionality; planned as a future controlled security-testing target.",
      tech: ["Web Security", "SOC Functionality", "Access Control", "Security Testing Target"],
      role: "Personal Project",
      link: "#"
    },
    {
      name: "NetGuard AI — Real-Time WiFi Monitor",
      slug: "netguard-ai-wifi-monitor",
      description: "Python-based WiFi monitoring tool with real-time device discovery, network scanning, EvilTwin/FakeAP detection, and AI-based per-device threat scoring; built with Scapy, WebSockets, and native Windows WiFi support.",
      tech: ["Python", "Scapy", "WebSockets", "EvilTwin Detection", "Network Scanning", "WiFi Security"],
      role: "Personal Project",
      link: "#"
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
      school: "Engineering Institution, Hassan",
      period: "Undergraduate",
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
