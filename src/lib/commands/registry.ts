import { Command, CommandContext } from "../types";
import { basicCommands } from "./basic";
import { portfolioCommands } from "./portfolio";
import { funCommands } from "./fun";
import { secretCommands } from "./secrets";

export class CommandRegistry {
  private commands = new Map<string, Command>();

  public register(command: Command) {
    this.commands.set(command.name.toLowerCase(), command);
  }

  public get(name: string): Command | undefined {
    return this.commands.get(name.toLowerCase());
  }

  public getCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  public getCommandNames(includeHidden = false): string[] {
    return Array.from(this.commands.values())
      .filter(cmd => includeHidden ? true : !cmd.hidden)
      .map(cmd => cmd.name);
  }

  public execute(name: string, context: CommandContext): Promise<string> | string {
    const command = this.get(name);
    if (!command) {
      return `bash: ${name}: command not found. Type "help" for a list of commands.`;
    }
    return command.execute(context);
  }
}

export const registry = new CommandRegistry();

// Register all command packs
[...basicCommands, ...portfolioCommands, ...funCommands, ...secretCommands].forEach(cmd => {
  registry.register(cmd);
});
