export interface CommandHelpDescriptor {
    command: string;
    alias?: string;
    description: string;
    subcommands?: Array<CommandHelpDescriptor>;
    options?: Array<CommandOptionHelpDescriptor>;
    isOptional?: boolean;
}

export interface CommandOptionHelpDescriptor {
    command: string;
    alias?: string;
    description: string;
    options?: Array<CommandOptionHelpDescriptor>;
}
