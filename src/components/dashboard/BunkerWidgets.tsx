"use client";

import React, { useEffect, useState, useRef } from "react";
import { ShieldAlert, Terminal, CheckCircle2, Circle } from "lucide-react";
import { useTerminalEvent } from "@/hooks/useTerminalEvent";

// ==========================================
// 1. THREAT INTELLIGENCE WIDGET
// ==========================================
export function ThreatIntelWidget() {
  const [cves, setCves] = useState([
    { id: "CVE-2026-4011", cvss: 9.8, severity: "CRITICAL", status: "BLOCKED" },
    { id: "CVE-2026-3199", cvss: 8.2, severity: "HIGH", status: "MONITORED" },
    { id: "CVE-2026-2184", cvss: 5.4, severity: "MEDIUM", status: "PATCHED" },
    { id: "CVE-2026-1045", cvss: 9.1, severity: "CRITICAL", status: "MITIGATING" }
  ]);

  const [downloadingCert, setDownloadingCert] = useState(false);
  const [progress, setProgress] = useState(0);

  useTerminalEvent((detail) => {
    if (detail.command === "hack") {
      setCves([
        { id: "ALERT-BREACH", cvss: 10.0, severity: "CRITICAL", status: "ATTACK" },
        { id: "ALERT-SCAN", cvss: 9.9, severity: "CRITICAL", status: "ACTIVE" },
        { id: "CVE-2026-9999", cvss: 9.8, severity: "CRITICAL", status: "ISOLATING" },
        { id: "CVE-2026-1045", cvss: 9.1, severity: "CRITICAL", status: "MITIGATING" }
      ]);
    } else if (detail.command === "clear") {
      setCves([
        { id: "CVE-2026-4011", cvss: 9.8, severity: "CRITICAL", status: "BLOCKED" },
        { id: "CVE-2026-3199", cvss: 8.2, severity: "HIGH", status: "MONITORED" },
        { id: "CVE-2026-2184", cvss: 5.4, severity: "MEDIUM", status: "PATCHED" },
        { id: "CVE-2026-1045", cvss: 9.1, severity: "CRITICAL", status: "MITIGATING" }
      ]);
      setDownloadingCert(false);
    } else if (detail.command === "certificates") {
      setDownloadingCert(true);
      setProgress(0);
    }
  });

  useEffect(() => {
    if (!downloadingCert) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingCert(false);
          }, 3500);
          return 100;
        }
        return p + 4;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [downloadingCert]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (downloadingCert) return;
      setCves(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        const randCvss = parseFloat((5 + Math.random() * 5).toFixed(1));
        const severity = randCvss > 8.5 ? "CRITICAL" : randCvss > 7.0 ? "HIGH" : "MEDIUM";
        const statuses = ["BLOCKED", "MONITORED", "PATCHED", "MITIGATING"];
        next[idx] = {
          id: `CVE-2026-${Math.floor(1000 + Math.random() * 8000)}`,
          cvss: randCvss,
          severity,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        };
        return next;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [downloadingCert]);

  if (downloadingCert) {
    return (
      <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-2 bg-black/40">
        <div className="flex justify-between items-center border-b border-[#00FF8C]/25 pb-1">
          <span>SECURE DOWNLOAD MANAGER</span>
          <span className="text-[#00FF8C] animate-pulse font-bold">STATUS: IN_PROGRESS</span>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-3">
          <div className="text-[#D2FFF0]">DOWNLOADING: certificates.zip</div>
          <div className="w-full bg-zinc-900 border border-[#00FF8C]/30 h-4 rounded overflow-hidden relative">
            <div 
              className="bg-[#00FF8C] h-full transition-all duration-100 ease-out" 
              style={{ width: `${progress}%` }} 
            />
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-zinc-100 mix-blend-difference">
              {progress}%
            </div>
          </div>
          <div className="text-xs text-zinc-400">
            {progress < 100 ? "Fetching SSL root certificates from bunker uplink..." : "✓ Installation complete. Mainframe trust store updated."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-2 bg-black/40">
      <div className="flex justify-between items-center border-b border-[#00FF8C]/25 pb-1">
        <span>ACTIVE COUNTERMEASURES</span>
        <span className="text-red-500 animate-pulse font-bold">THREAT LEVEL: SEVERE</span>
      </div>
      <div className="flex-1 overflow-auto space-y-1.5 scrollbar-none">
        {cves.map((cve, i) => (
          <div key={i} className="flex items-center justify-between border border-[#00FF8C]/10 p-1 bg-black/30 rounded">
            <span className="text-[#D2FFF0]">{cve.id}</span>
            <span className={`px-1 rounded text-[8px] ${
              cve.severity === "CRITICAL" ? "bg-red-950 text-red-400 border border-red-500/30" :
              cve.severity === "HIGH" ? "bg-amber-950 text-amber-400 border border-amber-500/30" :
              "bg-zinc-800 text-zinc-400"
            }`}>{cve.severity} ({cve.cvss})</span>
            <span className="opacity-75">{cve.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. NETWORK TOPOLOGY WIDGET
// ==========================================
export function NetworkTopologyWidget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(1.0);

  useTerminalEvent((detail) => {
    if (["projects", "github", "hack", "contact", "about"].includes(detail.command)) {
      speedRef.current = 4.5;
      setTimeout(() => { speedRef.current = 1.0; }, 3000);
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = canvas.width;
    let h = canvas.height;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      w = canvas.width;
      h = canvas.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = [
      { id: "router", x: 0.5, y: 0.2, label: "GW-01", r: 5 },
      { id: "db", x: 0.2, y: 0.6, label: "DB-SECURE", r: 4 },
      { id: "app", x: 0.5, y: 0.5, label: "CORE-API", r: 4 },
      { id: "node1", x: 0.8, y: 0.5, label: "NODE-7", r: 4 },
      { id: "client1", x: 0.35, y: 0.8, label: "CLIENT-A", r: 3 },
      { id: "client2", x: 0.65, y: 0.8, label: "CLIENT-B", r: 3 }
    ];

    const links = [
      { from: "router", to: "app" },
      { from: "app", to: "db" },
      { from: "app", to: "node1" },
      { from: "app", to: "client1" },
      { from: "app", to: "client2" }
    ];

    let pulseOffset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pulseOffset += 0.05 * speedRef.current;

      ctx.strokeStyle = "rgba(0, 255, 208, 0.15)";
      ctx.lineWidth = 1;
      links.forEach(link => {
        const fromNode = nodes.find(n => n.id === link.from)!;
        const toNode = nodes.find(n => n.id === link.to)!;
        const fx = fromNode.x * w;
        const fy = fromNode.y * h;
        const tx = toNode.x * w;
        const ty = toNode.y * h;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        const dx = tx - fx;
        const dy = ty - fy;
        const t = (pulseOffset % 1);
        const px = fx + dx * t;
        const py = fy + dy * t;
        ctx.fillStyle = "#00FFD0";
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      nodes.forEach(node => {
        const nx = node.x * w;
        const ny = node.y * h;

        ctx.strokeStyle = "rgba(0, 255, 140, 0.25)";
        ctx.beginPath();
        ctx.arc(nx, ny, node.r + Math.sin(pulseOffset * 2) * 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#00FF8C";
        ctx.beginPath();
        ctx.arc(nx, ny, node.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#D2FFF0";
        ctx.font = "8px monospace";
        ctx.fillText(node.label, nx + 6, ny + 3);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-black/40">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// ==========================================
// 3. PACKET INSPECTOR WIDGET
// ==========================================
export function PacketInspectorWidget() {
  const [packets, setPackets] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useTerminalEvent((detail) => {
    const { command, timestamp } = detail;
    if (command === "certificates") {
      setPackets(prev => [
        ...prev,
        `[${timestamp}] GET /api/certificates - 200 OK`,
        `[${timestamp}] TX: certificates.zip // 2.1MB`
      ]);
    } else if (command === "contact") {
      setPackets(prev => [
        ...prev,
        `[${timestamp}] POST /api/handshake - 101 SWITCHING`,
        `[${timestamp}] SECURE TUNNEL UPLINK COMPLETED`
      ]);
    } else if (command === "hack") {
      setPackets(prev => [
        ...prev,
        `[${timestamp}] WAN SCAN: PORT 22, 80, 443, 8080`,
        `[${timestamp}] WARNING: SYSTEM SANDBOX INTERFACED`
      ]);
    } else if (command === "clear") {
      setPackets([]);
    }
  });

  useEffect(() => {
    const protocols = ["TCP", "UDP", "ICMP", "HTTP/2", "SSH"];
    const ips = ["192.168.1.104", "10.0.0.12", "198.51.100.45", "10.9.1.5", "172.16.2.22"];
    const ports = [22, 80, 443, 8080, 50224];

    const interval = setInterval(() => {
      const srcIp = ips[Math.floor(Math.random() * ips.length)];
      const destIp = ips[Math.floor(Math.random() * ips.length)];
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const port = ports[Math.floor(Math.random() * ports.length)];
      const len = Math.floor(64 + Math.random() * 1400);
      const log = `[IN] ${srcIp}:${port} -> ${destIp} | ${proto} | LEN: ${len}`;

      setPackets(prev => [...prev.slice(-30), log]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [packets]);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[8px] text-[#00FFD0] select-none bg-black/40">
      <div className="border-b border-[#00FFD0]/20 pb-1 uppercase tracking-wider text-zinc-400 font-bold">
        Packet Ingestion Stream
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-0.5 pt-1.5 scrollbar-none">
        {packets.map((p, i) => (
          <div key={i} className="whitespace-nowrap hover:bg-[#00FF8C]/5 px-1 py-0.5 rounded transition-colors duration-150">
            {p}
          </div>
        ))}
        {packets.length === 0 && <span className="opacity-50">Awaiting stream...</span>}
      </div>
    </div>
  );
}

// ==========================================
// 4. SSH SESSIONS WIDGET
// ==========================================
export function SshSessionsWidget() {
  const [sessions, setSessions] = useState([
    { id: "SESS-01", user: "operator@bunker-b", host: "10.9.12.3", uptime: "04:12:45", ping: "12ms" },
    { id: "SESS-02", user: "root@sec-gateway", host: "172.16.8.1", uptime: "00:45:12", ping: "24ms" }
  ]);

  useTerminalEvent((detail) => {
    if (detail.command === "sudo" || detail.command === "hack") {
      setSessions(prev => {
        if (prev.find(s => s.id === "ROOT-SES")) return prev;
        return [
          { id: "ROOT-SES", user: "root@bunker-core", host: "127.0.0.1", uptime: "00:00:01", ping: "1ms" },
          ...prev
        ];
      });
      setTimeout(() => {
        setSessions(prev => prev.filter(s => s.id !== "ROOT-SES"));
      }, 4000);
    }
  });

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-2 bg-black/40">
      <div className="border-b border-[#00FF8C]/25 pb-1 uppercase tracking-wider text-[#D2FFF0] font-bold">
        SECURE SHELL CONNS
      </div>
      <div className="flex-1 space-y-1.5 overflow-auto scrollbar-none">
        {sessions.map((s, i) => (
          <div key={i} className="flex justify-between border border-[#00FF8C]/15 p-1 rounded bg-black/30">
            <div>
              <div className="font-bold text-[#D2FFF0]">{s.user}</div>
              <div className="opacity-60 text-[8px]">{s.host}</div>
            </div>
            <div className="text-right">
              <div>{s.uptime}</div>
              <div className="text-[#00FFD0] text-[8px]">Latency: {s.ping}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. DOCKER / KUBERNETES MONITOR WIDGET
// ==========================================
export function DockerK8sWidget() {
  const [containers, setContainers] = useState([
    { name: "nginx-ingress-547df", status: "Running", health: "Healthy", restarts: 0 },
    { name: "postgres-db-0", status: "Running", health: "Healthy", restarts: 0 },
    { name: "redis-cache", status: "Running", health: "Healthy", restarts: 0 },
    { name: "api-server-v2", status: "Running", health: "Healthy", restarts: 1 }
  ]);

  useTerminalEvent((detail) => {
    if (detail.command === "projects" || detail.command === "hack") {
      setContainers(prev => prev.map(c => {
        if (c.name === "api-server-v2") {
          return { ...c, status: "ROLLOUT", restarts: c.restarts + 1 };
        }
        return c;
      }));
      setTimeout(() => {
        setContainers(prev => prev.map(c => {
          if (c.name === "api-server-v2") {
            return { ...c, status: "Running" };
          }
          return c;
        }));
      }, 3500);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setContainers(prev => prev.map(c => {
        if (Math.random() < 0.05) {
          return { ...c, restarts: c.restarts + 1 };
        }
        return c;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[8px] text-[#00FF8C] select-none gap-1 bg-black/40">
      <div className="border-b border-[#00FF8C]/25 pb-1 text-[#D2FFF0] font-extrabold uppercase">
        CONTAINER CONTROLLER
      </div>
      <div className="flex-1 overflow-auto space-y-1.5 scrollbar-none pt-1">
        {containers.map((c, i) => (
          <div key={i} className="flex justify-between items-center border border-[#00FF8C]/10 p-1 rounded bg-black/30 text-[8px]">
            <div className="font-bold text-[#D2FFF0] truncate max-w-[120px]">{c.name}</div>
            <div className="flex gap-2 items-center">
              <span className="text-[#00FFD0]">{c.status}</span>
              <span className="opacity-75">Res: {c.restarts}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. PROCESS MANAGER WIDGET
// ==========================================
export function ProcessManagerWidget() {
  const [processes, setProcesses] = useState([
    { pid: 1, name: "systemd", cpu: 0.1, mem: 0.2, status: "SLEEP" },
    { pid: 442, name: "terminal_shell", cpu: 2.4, mem: 1.4, status: "RUN" },
    { pid: 910, name: "node_server", cpu: 12.8, mem: 4.8, status: "RUN" },
    { pid: 1045, name: "canvas_thread", cpu: 18.2, mem: 2.1, status: "RUN" }
  ]);

  useTerminalEvent((detail) => {
    if (["projects", "hack", "sudo"].includes(detail.command)) {
      setProcesses(prev => prev.map(p => {
        if (p.pid === 1) return p;
        return {
          ...p,
          cpu: parseFloat((85 + Math.random() * 12).toFixed(1)),
          mem: parseFloat((8.5 + Math.random() * 1.5).toFixed(1))
        };
      }));
      setTimeout(() => {
        setProcesses([
          { pid: 1, name: "systemd", cpu: 0.1, mem: 0.2, status: "SLEEP" },
          { pid: 442, name: "terminal_shell", cpu: 2.4, mem: 1.4, status: "RUN" },
          { pid: 910, name: "node_server", cpu: 12.8, mem: 4.8, status: "RUN" },
          { pid: 1045, name: "canvas_thread", cpu: 18.2, mem: 2.1, status: "RUN" }
        ]);
      }, 3500);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => {
        if (p.pid === 1) return p;
        const delta = (Math.random() - 0.5) * 4;
        return {
          ...p,
          cpu: parseFloat(Math.max(1, Math.min(60, p.cpu + delta)).toFixed(1)),
          mem: parseFloat(Math.max(0.5, Math.min(10, p.mem + (Math.random() - 0.5) * 0.2)).toFixed(1))
        };
      }));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none bg-black/40">
      <div className="grid grid-cols-5 text-[#D2FFF0] border-b border-[#00FF8C]/25 pb-1 font-bold">
        <span>PID</span>
        <span className="col-span-2">NAME</span>
        <span>CPU</span>
        <span>MEM</span>
      </div>
      <div className="flex-1 overflow-auto space-y-1.5 scrollbar-none pt-1.5">
        {processes.map((p, i) => (
          <div key={i} className="grid grid-cols-5 hover:bg-[#00FF8C]/5 p-0.5 rounded">
            <span>{p.pid}</span>
            <span className="col-span-2 text-[#D2FFF0] truncate">{p.name}</span>
            <span>{p.cpu}%</span>
            <span>{p.mem}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. FILE EXPLORER WIDGET
// ==========================================
export function FileExplorerWidget() {
  const [selectedFile, setSelectedFile] = useState("portfolio.ts");
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  useTerminalEvent((detail) => {
    const { command } = detail;
    if (command === "certificates") {
      setExpandedFolder("Documents");
      setSelectedFile("AWS.pdf");
    } else if (command === "about") {
      setExpandedFolder("home");
      setSelectedFile("about.json");
    } else if (command === "projects") {
      setExpandedFolder("home");
      setSelectedFile("portfolio.ts");
    }
  });

  const files = expandedFolder === "Documents" ? [
    { name: "/home/charan", isDir: true },
    { name: "  -> portfolio.ts", isFile: true },
    { name: "  -> credentials.sec", isFile: true },
    { name: "/Documents/Certificates", isDir: true },
    { name: "  -> AWS.pdf", isFile: true },
    { name: "  -> Azure.pdf", isFile: true },
    { name: "  -> Kubernetes.pdf", isFile: true },
    { name: "/etc/firewall", isDir: true },
    { name: "  -> filter.rules", isFile: true }
  ] : [
    { name: "/home/charan", isDir: true },
    { name: "  -> portfolio.ts", isFile: true },
    { name: "  -> credentials.sec", isFile: true },
    { name: "/etc/firewall", isDir: true },
    { name: "  -> filter.rules", isFile: true },
    { name: "/var/logs/security", isDir: true }
  ];

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-1 text-[#D2FFF0] font-extrabold uppercase mb-1">
        Bunker File System
      </div>
      <div className="flex-1 overflow-auto space-y-1 scrollbar-none">
        {files.map((f, i) => {
          const isSelected = f.isFile && selectedFile === f.name.trim().replace("-> ", "");
          return (
            <div 
              key={i} 
              onClick={() => f.isFile && setSelectedFile(f.name.trim().replace("-> ", ""))}
              className={`px-1 py-0.5 rounded cursor-pointer transition-colors duration-150 ${
                isSelected ? "bg-[#00FF8C]/20 text-[#D2FFF0]" : "hover:bg-[#00FF8C]/5"
              }`}
            >
              {f.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 8. GIT ACTIVITY WIDGET
// ==========================================
export function GitActivityWidget() {
  const [gitStatus, setGitStatus] = useState("SYNCED");
  const [commits, setCommits] = useState([
    { hash: "7a8f902", msg: "feat: secure shell key exchange", date: "2m ago" },
    { hash: "f9b8c34", msg: "fix: memory leak in socket buffers", date: "15m ago" },
    { hash: "bc1829e", msg: "audit: apply firewall rules configuration", date: "1h ago" }
  ]);

  useTerminalEvent((detail) => {
    if (detail.command === "projects" || detail.command === "github") {
      setGitStatus("SYNCING...");
      setCommits(prev => [
        { hash: Math.random().toString(16).substring(2, 9), msg: "feat: rebuild dependency tree module", date: "Just now" },
        ...prev
      ]);
      setTimeout(() => {
        setGitStatus("SYNCED");
      }, 3000);
    }
  });

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-2 bg-black/40">
      <div className="border-b border-[#00FF8C]/25 pb-1 flex justify-between items-center text-[#D2FFF0] font-bold">
        <span>BRANCH: master</span>
        <span className="text-[#00FFD0]">{gitStatus}</span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-auto scrollbar-none">
        {commits.map((c, i) => (
          <div key={i} className="border border-[#00FF8C]/15 p-1 rounded bg-black/30">
            <div className="flex justify-between items-center text-[8px] opacity-75">
              <span>{c.hash}</span>
              <span>{c.date}</span>
            </div>
            <div className="text-[#D2FFF0] mt-0.5 truncate">{c.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 9. MEMORY MAP WIDGET
// ==========================================
export function MemoryMapWidget() {
  const [blocks, setBlocks] = useState<number[]>([]);
  const [frenzy, setFrenzy] = useState(false);

  useTerminalEvent((detail) => {
    if (["skills", "projects", "hack", "sudo"].includes(detail.command)) {
      setFrenzy(true);
      setTimeout(() => {
        setFrenzy(false);
      }, 3500);
    }
  });

  useEffect(() => {
    const initial = Array.from({ length: 64 }, () => Math.floor(Math.random() * 3));
    setBlocks(initial);

    const interval = setInterval(() => {
      setBlocks(prev => {
        const next = [...prev];
        const loopCount = frenzy ? 12 : 3;
        for (let i = 0; i < loopCount; i++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = Math.floor(Math.random() * 3);
        }
        return next;
      });
    }, frenzy ? 350 : 3000);
    return () => clearInterval(interval);
  }, [frenzy]);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[8px] text-[#00FF8C] select-none gap-2 bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-1 text-[#D2FFF0] uppercase font-bold">
        SRAM Allocation Registry
      </div>
      <div className="flex-1 grid grid-cols-8 gap-1 p-1 bg-black/30 border border-[#00FF8C]/15 rounded">
        {blocks.map((val, i) => (
          <div 
            key={i} 
            className={`w-full aspect-square rounded-[1px] transition-all duration-300 ${
              val === 0 ? "bg-[#00FF8C]/20" :
              val === 1 ? "bg-[#00FF8C]" :
              "bg-amber-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 10. FIREWALL STATUS WIDGET
// ==========================================
export function FirewallStatusWidget() {
  const [firewalls, setFirewalls] = useState([
    { rule: "OUTBOUND IP BLOCK", status: "ACTIVE" },
    { rule: "REJECT SYNC SCANS", status: "ACTIVE" },
    { rule: "IPS PACKET LIMITER", status: "MONITOR" }
  ]);

  useTerminalEvent((detail) => {
    if (detail.command === "hack") {
      setFirewalls([
        { rule: "OUTBOUND IP BLOCK", status: "BREACH_ALERT" },
        { rule: "REJECT SYNC SCANS", status: "SANDBOX_LOCKED" },
        { rule: "IPS PACKET LIMITER", status: "OVERLOAD" }
      ]);
      setTimeout(() => {
        setFirewalls([
          { rule: "OUTBOUND IP BLOCK", status: "ACTIVE" },
          { rule: "REJECT SYNC SCANS", status: "ACTIVE" },
          { rule: "IPS PACKET LIMITER", status: "MONITOR" }
        ]);
      }, 4000);
    }
  });

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-2 bg-black/40">
      <div className="border-b border-[#00FF8C]/25 pb-1 flex justify-between items-center text-[#D2FFF0] font-bold">
        <span>SECURITY FIREWALL</span>
        <span className="text-[#00FFD0]">PORTS AUDITED</span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-auto scrollbar-none">
        {firewalls.map((f, i) => (
          <div key={i} className="flex justify-between border border-[#00FF8C]/15 p-1 rounded bg-black/30">
            <span>{f.rule}</span>
            <span className="text-[#00FFD0]">{f.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. MISSION OBJECTIVES WIDGET
// ==========================================
export function MissionObjectivesWidget() {
  const [objectives, setObjectives] = useState([
    { name: "Inspect Operator Kernel (About)", status: "PENDING", cmd: "about" },
    { name: "Sync Satellite Files (Projects)", status: "PENDING", cmd: "projects" },
    { name: "Deploy Countermeasures (Skills)", status: "PENDING", cmd: "skills" },
    { name: "Analyze Core Gateway (Experience)", status: "PENDING", cmd: "experience" },
    { name: "Establish Secure Uplink (Contact)", status: "PENDING", cmd: "contact" }
  ]);

  useTerminalEvent((detail) => {
    setObjectives(prev => prev.map(obj => {
      if (obj.cmd === detail.command) {
        return { ...obj, status: "COMPLETED" };
      }
      return obj;
    }));
  });

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-2 bg-black/40">
      <div className="border-b border-[#00FF8C]/25 pb-1 text-[#D2FFF0] font-bold uppercase">
        Mission Objectives
      </div>
      <div className="flex-1 space-y-1.5 overflow-auto scrollbar-none">
        {objectives.map((o, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8.5px]">
            {o.status === "COMPLETED" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF8C] shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            )}
            <span className={o.status === "COMPLETED" ? "text-zinc-200 line-through opacity-65" : "text-[#D2FFF0]"}>
              {o.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 12. CRYPTO PRICE TICKER WIDGET
// ==========================================
export function CryptoTickerWidget() {
  const [prices, setPrices] = useState({
    btc: 64230,
    eth: 3450,
    sol: 182.4,
    xmr: 164.8
  });

  useTerminalEvent((detail) => {
    if (detail.command === "hack") {
      setPrices({
        btc: 0,
        eth: 0,
        sol: 0,
        xmr: 999999
      });
      setTimeout(() => {
        setPrices({
          btc: 64230,
          eth: 3450,
          sol: 182.4,
          xmr: 164.8
        });
      }, 3500);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        btc: Math.floor(prev.btc + (Math.random() - 0.5) * 150),
        eth: Math.floor(prev.eth + (Math.random() - 0.5) * 15),
        sol: parseFloat((prev.sol + (Math.random() - 0.5) * 1).toFixed(2)),
        xmr: parseFloat((prev.xmr + (Math.random() - 0.5) * 0.8).toFixed(2))
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-1 bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-0.5 text-[#D2FFF0] font-bold uppercase text-center tracking-wider">
        Crypto Asset Ticker
      </div>
      <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1 pt-1 font-bold text-[8.5px]">
        <div className="flex justify-between border-b border-[#00FF8C]/5 pb-0.5">
          <span>BTC:</span>
          <span className="text-[#D2FFF0]">${prices.btc}</span>
        </div>
        <div className="flex justify-between border-b border-[#00FF8C]/5 pb-0.5">
          <span>ETH:</span>
          <span className="text-[#D2FFF0]">${prices.eth}</span>
        </div>
        <div className="flex justify-between">
          <span>SOL:</span>
          <span className="text-[#D2FFF0]">${prices.sol}</span>
        </div>
        <div className="flex justify-between">
          <span>XMR:</span>
          <span className="text-[#D2FFF0]">${prices.xmr}</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 13. WEATHER & TIME WIDGET
// ==========================================
export function WeatherTimeWidget() {
  const [times, setTimes] = useState({ utc: "", local: "" });
  const [diagnosticMsg, setDiagnosticMsg] = useState("");

  useTerminalEvent((detail) => {
    if (detail.command === "neofetch" || detail.command === "fastfetch") {
      setDiagnosticMsg("MET SYNC ACTIVE");
      setTimeout(() => {
        setDiagnosticMsg("");
      }, 3000);
    }
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimes({
        utc: now.toISOString().split("T")[1].slice(0, 8),
        local: now.toLocaleTimeString([], { hour12: false })
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-1.5 bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-0.5 text-[#D2FFF0] uppercase font-bold text-center tracking-wider">
        MET TELEMETRY
      </div>
      <div className="space-y-1 text-[8.5px]">
        <div className="flex justify-between">
          <span>UTC TIME:</span>
          <span className="text-[#D2FFF0]">{times.utc}</span>
        </div>
        <div className="flex justify-between">
          <span>LOCAL:</span>
          <span className="text-[#D2FFF0]">{times.local}</span>
        </div>
        <div className="flex justify-between border-t border-[#00FF8C]/10 pt-1">
          <span>WEATHER:</span>
          <span className="text-[#D2FFF0]">BUNKER // 14°C RAIN</span>
        </div>
        {diagnosticMsg && (
          <div className="text-[7.5px] text-[#00FFD0] text-center border-t border-[#00FFD0]/20 pt-1 animate-pulse">
            {diagnosticMsg}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 14. DISK ACTIVITY WIDGET
// ==========================================
export function DiskActivityWidget() {
  const [io, setIo] = useState({ read: 12.4, write: 4.8 });

  useTerminalEvent((detail) => {
    if (["projects", "certificates", "decrypt"].includes(detail.command)) {
      setIo({ read: 94.2, write: 82.5 });
      setTimeout(() => {
        setIo({ read: 8.5, write: 1.2 });
      }, 3500);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIo(prev => {
        if (prev.read > 80) return prev;
        return {
          read: parseFloat((5 + Math.random() * 20).toFixed(1)),
          write: parseFloat((1 + Math.random() * 10).toFixed(1))
        };
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-1 bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-0.5 text-[#D2FFF0] uppercase font-bold text-center">
        DISK I/O DRIVES
      </div>
      <div className="space-y-1.5 pt-1 text-[8.5px]">
        <div className="flex justify-between">
          <span>READ RATE:</span>
          <span className="text-[#D2FFF0]">{io.read} MB/s</span>
        </div>
        <div className="flex justify-between">
          <span>WRITE RATE:</span>
          <span className="text-[#D2FFF0]">{io.write} MB/s</span>
        </div>
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-[#00FF8C] transition-all duration-500" style={{ width: `${Math.min(100, io.read * 1.1)}%` }} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 15. POWER MONITOR WIDGET
// ==========================================
export function PowerMonitorWidget() {
  const [power, setPower] = useState({ temp: 52, fan: 3200, watt: 45 });

  useTerminalEvent((detail) => {
    if (["projects", "hack", "sudo"].includes(detail.command)) {
      setPower({ temp: 74, fan: 5600, watt: 125 });
      setTimeout(() => {
        setPower({ temp: 54, fan: 3400, watt: 48 });
      }, 3500);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPower(prev => {
        if (prev.temp > 70) return prev;
        return {
          temp: Math.floor(48 + Math.random() * 8),
          fan: Math.floor(3000 + Math.random() * 400),
          watt: Math.floor(40 + Math.random() * 12)
        };
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-1.5 bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-0.5 text-[#D2FFF0] uppercase font-bold text-center">
        THERMAL MONITOR
      </div>
      <div className="space-y-1 text-[8.5px]">
        <div className="flex justify-between">
          <span>CPU TEMP:</span>
          <span className="text-[#D2FFF0]">{power.temp}°C</span>
        </div>
        <div className="flex justify-between">
          <span>COOLING FAN:</span>
          <span className="text-[#D2FFF0]">{power.fan} RPM</span>
        </div>
        <div className="flex justify-between">
          <span>WATTAGE:</span>
          <span className="text-[#D2FFF0]">{power.watt}W</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 16. SECURE NOTES WIDGET
// ==========================================
export function SecureNotesWidget() {
  const [noteContent, setNoteContent] = useState([
    "* ROTATE Access keys by 0800 hrs.",
    "* Patch SSH port vulnerabilities immediately.",
    "* Decrypted signal telemetry confirms bunker signature is undetected."
  ]);

  useTerminalEvent((detail) => {
    if (detail.command === "decrypt" || detail.command === "unlock") {
      setNoteContent([
        "DECRYPTED UPLINK LOG:",
        "CRITICAL // CHARAN IS ONLINE",
        "ACCESS HIERARCHY GRANTED",
        "MEMO: Sandbox gravity mode command triggers Newtonian layouts."
      ]);
      setTimeout(() => {
        setNoteContent([
          "* ROTATE Access keys by 0800 hrs.",
          "* Patch SSH port vulnerabilities immediately.",
          "* Decrypted signal telemetry confirms bunker signature is undetected."
        ]);
      }, 5000);
    }
  });

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9.5px] text-[#00FF8C] select-text bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-1 text-[#D2FFF0] font-bold uppercase mb-1 select-none">
        Secure Notes / Ops Memo
      </div>
      <div className="flex-1 overflow-auto space-y-1.5 leading-normal scrollbar-none font-bold">
        {noteContent.map((note, idx) => (
          <p key={idx} className={`border-l-2 pl-1.5 text-zinc-300 ${
            note.startsWith("DECRYPTED") || note.startsWith("CRITICAL") ? "border-amber-500" : "border-[#00FF8C]"
          }`}>
            {note}
          </p>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 17. TERMINAL HISTORY WIDGET
// ==========================================
export function TerminalHistoryWidget() {
  const [history, setHistory] = useState([
    { cmd: "nmap -sS -O 192.168.1.1", time: "18:42:01" },
    { cmd: "ssh-keygen -t ed25519 -C \"key\"", time: "18:45:10" },
    { cmd: "docker compose up -d --build", time: "18:50:33" },
    { cmd: "grep -ri \"anomaly\" /var/logs", time: "19:04:12" }
  ]);

  useTerminalEvent((detail) => {
    const { command, args, timestamp } = detail;
    const fullCmd = [command, ...args].join(" ");
    setHistory(prev => [
      { cmd: fullCmd, time: timestamp },
      ...prev.slice(0, 15)
    ]);
  });

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[8.5px] text-[#00FF8C] select-none bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-0.5 text-[#D2FFF0] uppercase font-bold tracking-wider mb-1">
        Local Command History
      </div>
      <div className="flex-1 overflow-auto space-y-1 scrollbar-none">
        {history.map((h, i) => (
          <div key={i} className="flex justify-between items-center text-[#D2FFF0]/90">
            <span className="font-bold truncate max-w-[130px]">{h.cmd}</span>
            <span className="opacity-60 text-[7.5px]">{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 18. ACTIVE SERVICES WIDGET
// ==========================================
export function ActiveServicesWidget() {
  const [services, setServices] = useState([
    { name: "Nginx web server", active: true },
    { name: "PostgreSQL Database", active: true },
    { name: "Redis Cache Store", active: true },
    { name: "Docker daemon", active: true },
    { name: "Secure Shell Service", active: false }
  ]);

  useTerminalEvent((detail) => {
    if (detail.command === "hack" || detail.command === "sudo") {
      setServices(prev => prev.map(s => {
        if (s.name === "Secure Shell Service") {
          return { ...s, active: true };
        }
        return s;
      }));
      setTimeout(() => {
        setServices(prev => prev.map(s => {
          if (s.name === "Secure Shell Service") {
            return { ...s, active: false };
          }
          return s;
        }));
      }, 4000);
    }
  });

  return (
    <div className="w-full h-full p-2.5 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-1 bg-black/40">
      <div className="border-b border-[#00FF8C]/25 pb-1 text-[#D2FFF0] font-bold uppercase mb-1">
        Active Background Services
      </div>
      <div className="flex-1 overflow-auto space-y-1.5 scrollbar-none">
        {services.map((s, i) => (
          <div key={i} className="flex justify-between items-center text-[8.5px]">
            <span className="text-[#D2FFF0] truncate max-w-[120px]">{s.name}</span>
            <span className={`px-1 py-0.5 rounded text-[7.5px] font-extrabold ${
              s.active ? "bg-emerald-950 text-[#00FF8C] border border-[#00FF8C]/20" : "bg-red-950 text-red-500 border border-red-500/20"
            }`}>{s.active ? "ONLINE" : "OFFLINE"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 19. SIGNAL ANALYZER WIDGET
// ==========================================
export function SignalAnalyzerWidget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const amplitudeRef = useRef(1.0);

  useTerminalEvent((detail) => {
    if (detail.command === "contact" || detail.command === "hack") {
      amplitudeRef.current = 4.5;
      setTimeout(() => {
        amplitudeRef.current = 1.0;
      }, 3000);
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = canvas.width;
    let h = canvas.height;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      w = canvas.width;
      h = canvas.height;
    };
    resize();
    window.addEventListener("resize", resize);

    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cy = h / 2;
      offset += 0.08;

      ctx.strokeStyle = "rgba(0, 255, 208, 0.1)";
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      ctx.strokeStyle = "#00FFD0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const sin = Math.sin(x * 0.08 + offset) * 8 * amplitudeRef.current;
        const cos = Math.cos(x * 0.04 - offset * 1.2) * 4 * amplitudeRef.current;
        const y = cy + (sin + cos) * Math.sin((x / w) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-black/40">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// ==========================================
// 20. SATELLITE FEED INFO WIDGET
// ==========================================
export function SatelliteFeedInfoWidget() {
  const [meta, setMeta] = useState({
    alt: 35786,
    speed: 3.07,
    heading: 142.4
  });

  useTerminalEvent((detail) => {
    if (detail.command === "about" || detail.command === "certificates") {
      setMeta({
        alt: 32410,
        speed: 7.82,
        heading: 285.4
      });
      setTimeout(() => {
        setMeta({
          alt: 35786,
          speed: 3.07,
          heading: 142.4
        });
      }, 4000);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMeta(prev => {
        if (prev.speed > 6.0) return prev;
        return {
          alt: Math.floor(prev.alt + (Math.random() - 0.5) * 12),
          speed: parseFloat((prev.speed + (Math.random() - 0.5) * 0.02).toFixed(2)),
          heading: parseFloat((prev.heading + (Math.random() - 0.5) * 0.5).toFixed(1))
        };
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-2 flex flex-col font-mono text-[9px] text-[#00FF8C] select-none gap-1 bg-black/40">
      <div className="border-b border-[#00FF8C]/20 pb-0.5 text-[#D2FFF0] uppercase font-bold text-center">
        ORION-12 ORBIT METADATA
      </div>
      <div className="space-y-1.5 pt-1 text-[8.5px]">
        <div className="flex justify-between">
          <span>ALTITUDE:</span>
          <span className="text-[#D2FFF0]">{meta.alt} km</span>
        </div>
        <div className="flex justify-between">
          <span>SPEED:</span>
          <span className="text-[#D2FFF0]">{meta.speed} km/s</span>
        </div>
        <div className="flex justify-between">
          <span>HEADING:</span>
          <span className="text-[#D2FFF0]">{meta.heading}°</span>
        </div>
      </div>
    </div>
  );
}
export default ThreatIntelWidget;
