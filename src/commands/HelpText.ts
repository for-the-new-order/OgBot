export interface HelpText {
    command: string;
    description: string;
    args?: Array<HelpArgument>;
}

export interface HelpArgument {
    syntax: string;
    description: string;
}
