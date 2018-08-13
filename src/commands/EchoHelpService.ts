import { HelpText } from './HelpText';
import { Message } from 'discord.js';

export class EchoHelpService {
    constructor(private indent = 2) {}
    public echo(help: HelpText, whisper: boolean, message: Message) {
        const json = JSON.stringify(help, null, this.indent);
        // Split the output when needed
        const threshold = 1980;
        const blockCount = Math.ceil(json.length / threshold);
        for (let i = 0; i < blockCount; i++) {
            const block = json.substr(i * threshold, (i + 1) * threshold);
            this.send(block, whisper, message);
        }
    }

    private send(json: string, whisper: boolean, message: Message) {
        const chatToSend = `\`\`\`json\n${json}\n\`\`\``;
        if (whisper) {
            message.author.createDM().then(c => {
                c.send(chatToSend);
            });
        } else {
            message.reply(chatToSend);
        }
    }
}
