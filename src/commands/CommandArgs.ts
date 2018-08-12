export class CommandArgs {
    constructor(
        public trigger: string,
        public command: string,
        public args: Array<string>
    ) {}

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
}
