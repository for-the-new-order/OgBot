export class CommandArgs {
    constructor(public trigger: string, public command: string, public args: Array<string>) {}

    public findArgumentValue(name: string): string {
        if (!this.argumentExists(name)) {
            return null;
        }
        const seedArgIndex = this.findArgumentIndex(name);
        return this.args[seedArgIndex + 1];
    }
    public argumentExists(name: string): boolean {
        return this.findArgumentIndex(name) > -1;
    }
    public findArgumentIndex(name: string): number {
        const seedArgIndex = this.args.indexOf('-' + name);
        return seedArgIndex;
    }
    public convertToSubCommand(): CommandArgs {
        if (this.args.length === 0) {
            return null;
        }
        const trigger = this.args[0].toLowerCase();
        if (trigger.startsWith('-')) {
            return null;
        }
        let command = this.args.length > 1 ? this.args[1].toLowerCase() : '';
        let sliceIndex = 2;

        // Avoid splitted options
        if (command.startsWith('-')) {
            sliceIndex = 1;
            command = '';
        }
        const args = this.args.slice(sliceIndex);
        return new CommandArgs(trigger, command, args);
    }
}
