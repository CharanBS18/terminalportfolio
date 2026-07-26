"use client";

import React, { useEffect, useRef, useState } from "react";

const codeSnippets = [
  `import { NextRequest, NextResponse } from "next/server";`,
  `import { securityAudit } from "@/lib/security";`,
  `import { db } from "@/lib/db";`,
  ``,
  `export async function POST(req: NextRequest) {`,
  `  const session = await getSession(req);`,
  `  if (!session || session.role !== "root") {`,
  `    return NextResponse.json({ error: "Access Denied" }, { status: 403 });`,
  `  }`,
  ``,
  `  try {`,
  `    const payload = await req.json();`,
  `    const signature = req.headers.get("x-cyber-sig");`,
  `    `,
  `    const verified = await securityAudit.verifySignature(payload, signature);`,
  `    if (!verified) {`,
  `      await logSecurityIncursion(req, session.user);`,
  `      return NextResponse.json({ status: "breached", code: 401 });`,
  `    }`,
  `    `,
  `    const result = await db.executeTransaction(async (tx) => {`,
  `      const ports = await tx.scanOpenSockets();`,
  `      return tx.firewall.blockPorts(ports.filter(p => p.risk === "high"));`,
  `    });`,
  `    `,
  `    return NextResponse.json({ status: "secured", transactions: result });`,
  `  } catch (err) {`,
  `    console.error("FATAL: Kernel security subsystem leak:", err);`,
  `    return NextResponse.json({ error: "Kernel Failure" }, { status: 500 });`,
  `  }`,
  `}`,
  ``,
  `// Quantum Encryption algorithm placeholder`,
  `function decryptAESGCM256(cipherText: Buffer, key: Buffer, iv: Buffer): string {`,
  `  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);`,
  `  let decrypted = decipher.update(cipherText, "hex", "utf8");`,
  `  decrypted += decipher.final("utf8");`,
  `  return decrypted;`,
  `}`,
  ``,
  `// Socket packet analyzer`,
  `export class PacketAnalyzer {`,
  `  private socket: Socket;`,
  `  private buffer: Buffer[] = [];`,
  `  `,
  `  constructor(socket: Socket) {`,
  `    this.socket = socket;`,
  `    this.socket.on("data", (chunk) => this.onPacketReceived(chunk));`,
  `  }`,
  `  `,
  `  private onPacketReceived(chunk: Buffer) {`,
  `    this.buffer.push(chunk);`,
  `    if (this.buffer.length > 100) {`,
  `      this.flushToSecurityIndex();`,
  `    }`,
  `  }`,
  `}`
];

export function CodeViewerWidget() {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Generate initial code block
    const initial = codeSnippets.slice(0, 20);
    setLines(initial);

    let snippetIndex = 20;

    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev];
        const line = codeSnippets[snippetIndex % codeSnippets.length];
        next.push(line);
        snippetIndex++;

        // Keep last 45 lines to avoid memory buildup
        if (next.length > 45) next.shift();
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Apply basic regex highlighting to words
  const highlightLine = (text: string) => {
    if (!text.trim()) return <span>&nbsp;</span>;

    // Highlight comments
    if (text.trim().startsWith("//") || text.trim().startsWith("/*")) {
      return <span className="text-zinc-500 italic select-text">{text}</span>;
    }

    const words = text.split(/(\s+)/);

    return words.map((word, idx) => {
      if (["import", "from", "export", "async", "await", "function", "const", "let", "class", "private", "constructor", "return", "try", "catch", "if", "throw", "new"].includes(word.trim())) {
        return <span key={idx} className="text-fuchsia-400 font-bold select-text">{word}</span>;
      }
      if (["string", "number", "boolean", "Buffer", "Socket", "NextRequest", "NextResponse"].includes(word.trim())) {
        return <span key={idx} className="text-cyan-400 select-text">{word}</span>;
      }
      if (word.trim().startsWith('"') || word.trim().startsWith("'") || word.trim().startsWith("`")) {
        return <span key={idx} className="text-emerald-400 select-text">{word}</span>;
      }
      return <span key={idx} className="text-zinc-300 select-text">{word}</span>;
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full font-mono text-[9px] select-text p-3 bg-[#050508]/65 overflow-y-auto leading-relaxed scrollbar-none"
    >
      <div className="flex flex-col">
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre flex hover:bg-white/5 px-1 rounded transition-colors duration-75">
            <span className="w-6 text-zinc-600 select-none border-r border-white/5 mr-3 text-right">
              {idx + 1}
            </span>
            <span className="flex-1 font-semibold">{highlightLine(line)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
