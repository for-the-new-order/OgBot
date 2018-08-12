export interface HelpText {
    command: string;
    alias?: string;
    description: string;
    args?: Array<HelpArgument>;
}

export interface HelpArgument {
    syntax: string;
    description: string;
}
