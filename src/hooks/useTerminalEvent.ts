import { useEffect } from "react";

export interface TerminalCommandDetail {
  command: string;
  args: string[];
  timestamp: string;
  output: string;
}

export function useTerminalEvent(callback: (detail: TerminalCommandDetail) => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<TerminalCommandDetail>;
      if (customEvent.detail) {
        callback(customEvent.detail);
      }
    };
    window.addEventListener("terminalCommand", handler);
    return () => {
      window.removeEventListener("terminalCommand", handler);
    };
  }, [callback]);
}
