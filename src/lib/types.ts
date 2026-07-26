export interface FileNode {
  type: 'file';
  name: string;
  content: string;
}

export interface DirectoryNode {
  type: 'directory';
  name: string;
  children: { [key: string]: FSNode };
}

export type FSNode = FileNode | DirectoryNode;

export interface HistoryItem {
  id: string;
  command?: string;
  output: string;
  dir?: string;
  timestamp: string;
  isGlitch?: boolean;
  userState?: "guest" | "visitor" | "developer" | "root" | "charan";
  type?: "text" | "neofetch" | "pikachu";
}

export interface CommandRegistryInterface {
  getCommands: (includeHidden?: boolean) => Command[];
  getCommandNames: (includeHidden?: boolean) => string[];
}

export interface CommandContext {
  args: string[];
  currentPath: string[];
  filesystem: FSNode;
  setCurrentPath: (path: string[]) => void;
  triggerMatrix: () => void;
  triggerClear: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  commandHistoryCount: number;
  triggerGlitchEffect: () => void;
  updateSecretSequence: (cmd: string) => void;
  secretSequence: string[];
  triggerSecretEnding: () => void;
  userState: "guest" | "visitor" | "developer" | "root" | "charan";
  setUserState: (state: "guest" | "visitor" | "developer" | "root" | "charan") => void;
  writeLive: (text: string) => void;
  commandInputs: string[];
  registry: CommandRegistryInterface;
  dimension: string;
  setDimension: (dimension: string) => void;
  triggerMeltdown: () => void;
  isMelting: boolean;
  triggerTornado: () => void;
  isTornadoActive: boolean;
  triggerSandbox: () => void;
  isSandboxActive: boolean;
}

export interface Command {
  name: string;
  description: string;
  execute: (context: CommandContext) => Promise<string> | string;
  hidden?: boolean;
  category?: string;
}
