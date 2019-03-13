import { CommandHelpDescriptor } from './HelpText';
import { Message } from 'discord.js';
import { ChatterService } from './ChatterService';

export class EchoHelpService {
    constructor(private sendChatService: ChatterService) {}
    public async echo(help: CommandHelpDescriptor, whisper: boolean, message: Message) {
        this.sendChatService.send(help, whisper, message);
    }
}
