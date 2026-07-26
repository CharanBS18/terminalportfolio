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
  title: "AI & Full-Stack Developer // ENG-AI&ML",
  location: "Hassan, India",
  bio: "I build AI-powered web products with clear interfaces. Focused on AI/ML applications, data-aware tools, full-stack prototypes, and interactive frontends that feel polished enough to show to real users.",
  
  projects: [
    {
      name: "Plant Health RAG",
      slug: "plant-health-rag",
      description: "A Streamlit-based Retrieval-Augmented Generation (RAG) plant diagnosis application. Resolves the issue of scattered botanical disease information by consolidating domain-aware botanical records into retrieval-backed chat responses.",
      tech: ["Python", "Streamlit", "RAG", "LLM APIs", "Data Retrieval"],
      role: "Developer",
      link: "https://planthealthrag-fsggg4j6desaboqkfomqeb.streamlit.app"
    },
    {
      name: "Lumina Volt EV Finder",
      slug: "lumina-volt-ev",
      description: "A spatial charging-station finder interface resolving flat user experiences in EV mapping tools. Integrates premium WebGL 3D paths, sleek overlays, and smooth coordinate-mapping interactions.",
      tech: ["Three.js", "WebGL", "TypeScript", "Tailwind CSS", "Framer Motion"],
      role: "Creative UI Developer",
      link: "https://charanbs18.github.io/EV-project-PPT/"
    },
    {
      name: "Cinematic 3D Car",
      slug: "cinematic-3d-car",
      description: "Scroll-driven interactive 3D product showcase demonstrating high-fidelity rendering control, optimized render loops, and micro-interaction timings.",
      tech: ["Three.js", "Vite", "React Three Fiber", "Tailwind CSS"],
      role: "Motion Engineer",
      link: "https://charanbs18.github.io/carwebsite/"
    },
    {
      name: "Cinematic Drone Showcase",
      slug: "cinematic-drone-showcase",
      description: "Interactive 3D product showcase driven by scroll pathing animations and responsive interface controls for hardware demos.",
      tech: ["Three.js", "WebGL", "Vite", "Scroll Controls"],
      role: "3D Developer",
      link: "https://charanbs18.github.io/drone-website/"
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
    { name: "React / Frontend", level: 92 },
    { name: "Three.js / 3D UI", level: 85 },
    { name: "Python / Flask", level: 90 },
    { name: "AI / ML / RAG", level: 90 },
    { name: "Node.js / Express", level: 88 },
    { name: "Java / Systems", level: 75 },
    { name: "SQL / MySQL / MongoDB", level: 85 },
    { name: "Figma / Blender", level: 80 }
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
      details: "Department: ENG-AI&ML. Focus on AI systems, data architectures, and full-stack development."
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
    { name: "AWS Certification", issuer: "Amazon Web Services", ref: "AWS certificate.pdf" },
    { name: "Cybersecurity Simulation", issuer: "Security Job Simulation", ref: "Cyber Job Simulation certificate.pdf" },
    { name: "Data Analysis", issuer: "Data & Analytics", ref: "Data analysis certifcate.pdf" },
    { name: "Vista Certificate", issuer: "Professional Course Completion", ref: "Vista Certificate" },
    { name: "Data Labeling", issuer: "Forge Machine Learning", ref: "forge data labeling certificate.pdf" }
  ],

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
