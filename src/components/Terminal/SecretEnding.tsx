"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";

interface SecretEndingProps {
  onClose: () => void;
}

export function SecretEnding({ onClose }: SecretEndingProps) {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState("decrypting"); // decrypting -> typing -> complete
  const { playClick, playBeep, playDiskAccess } = useAudio();

  useEffect(() => {
    // Stage 1: Decryption loading bar
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("completed");
          playBeep(980, 0.4, false);
          return 100;
        }
        
        // Random clicks during decryptions
        if (Math.random() > 0.4) {
          playClick();
        }
        if (prev % 25 === 0) {
          playDiskAccess();
        }

        return prev + Math.floor(Math.random() * 6) + 2;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [playBeep, playClick, playDiskAccess]);

  const asciiCard = `
  +-----------------------------------------------------------+
  |              S Y S T E M   D E C R Y P T E D              |
  +-----------------------------------------------------------+
       __  __  _   _  _      ___   ____  _  __
      /  |/  |/ | / /| |    /   \\ /  _/ / |/ /
     / /|_/ //  |/ // /__  / /_/ // _/  /    / 
    /_/  /_//_/|___//____//_/ /_//___/ /_/|_/  
                                              v3.1
  +-----------------------------------------------------------+
  |  IDENTITY UNLOCKED: Charan B.S.                           |
  |  ROLE:              Security Researcher & Pentester       |
  |  STATUS:            Offensive Security Specialist         |
  +-----------------------------------------------------------+
  `;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 font-mono select-none overflow-y-auto">
      <div className="max-w-xl w-full p-6 border-2 border-red-500/50 bg-red-950/10 rounded shadow-[0_0_30px_rgba(239,68,68,0.3)] space-y-4">
        {phase === "decrypting" ? (
          <div className="space-y-3">
            <div className="text-red-500 font-bold animate-pulse text-sm">
              ▲ CRITICAL SECURITY OVERRIDE IN PROGRESS ▲
            </div>
            <div className="text-xs text-red-400">
              DECRYPTING SYSTEM SOUL ARCHIVES...
            </div>
            
            {/* Progress bar */}
            <div className="h-6 w-full bg-red-950/30 border border-red-500/30 relative flex items-center justify-center">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-red-600/40 transition-all duration-75"
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
              <span className="z-10 text-xs text-white font-bold">
                {Math.min(percent, 100)}%
              </span>
            </div>
            
            <div className="text-[10px] text-red-500/60 font-mono text-center">
              sectors loaded: {Math.floor(percent * 8.9)} / 890 // integrity: verified
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
            <pre className="text-red-500 text-[10px] leading-tight select-text overflow-x-auto whitespace-pre">
              {asciiCard}
            </pre>

            <div className="space-y-3 text-sm text-red-200 select-text leading-relaxed">
              <p className="text-white font-semibold text-lg text-center animate-pulse">
                &quot;You finally found me.&quot;
              </p>
              <p>
                I am <span className="text-red-400 font-bold">Charan B.S.</span>, an Offensive Security Specialist, Penetration Tester, and Cybersecurity Researcher based in Hassan, India.
              </p>
              <p>
                Thank you for taking the time to explore this retro shell portfolio. You&apos;ve breached the security parameters and demonstrated excellent terminal navigation skills.
              </p>
              <p className="text-xs text-red-500/80 italic text-center mt-2">
                Encryption core has reset. Operator session closing.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-red-600/30 border border-red-500 hover:bg-red-600/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] text-red-200 rounded text-xs transition-all duration-200 uppercase cursor-pointer"
              >
                Retract Connection (Esc)
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
