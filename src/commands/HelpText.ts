export interface HelpText {
    command: string;
    alias?: string;
    description: string;
    args?: Array<HelpArgument>;
    options?: Array<HelpArgument>;
}

export interface HelpArgument {
    syntax: string;
    alias?: string;
    description: string;
    options?: Array<HelpArgument>;
}
