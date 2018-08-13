export interface HelpText {
    command: string;
    alias?: string;
    description: string;
    args?: Array<HelpArgument>;
    options?: Array<HelpOption>;
}

export interface HelpArgument {
    syntax: string;
    alias?: string;
    description: string;
    options?: Array<HelpOption>;
}

export interface HelpOption {
    syntax: string;
    alias?: string;
    description: string;
}
