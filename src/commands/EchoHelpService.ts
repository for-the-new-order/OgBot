import { HelpText } from './HelpText';
import { Message } from 'discord.js';

export class EchoHelpService {
    constructor(private indent = 2) {}
    public async echo(help: HelpText, whisper: boolean, message: Message) {
        const json = JSON.stringify(help, null, this.indent);
        // Split the output when needed
        const threshold = 1900;
        const blockCount = Math.ceil(json.length / threshold);
        for (let i = 0; i < blockCount; i++) {
            const block = json.substring(i * threshold, (i + 1) * threshold);
            await this.send(block, whisper, message);
        }
    }

    private async send(json: string, whisper: boolean, message: Message) {
        const chatToSend = `\`\`\`json\n${json}\n\`\`\``;
        if (whisper) {
            await message.author.createDM().then(c => {
                c.send(chatToSend);
            });
        } else {
            await message.reply(chatToSend);
        }
    }
}
