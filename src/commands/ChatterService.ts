import { Message } from 'discord.js';

export const defaultChatterOptions = {
    indent: 2,
    threshold: 1900,
    splitMessages: true,
    mergeWith(obj: any): ChatterServiceOptions {
        return Object.assign({}, this, obj);
    }
};

export class ChatterService {
    constructor(private options: ChatterServiceOptions = defaultChatterOptions) {}

    public async send(objectToSend: any, whisper: boolean, message: Message) {
        const json = JSON.stringify(objectToSend, null, this.options.indent);
        if (this.options.splitMessages) {
            // Split the output when needed
            const blockCount = Math.ceil(json.length / this.options.threshold);
            for (let i = 0; i < blockCount; i++) {
                const block = json.substring(i * this.options.threshold, (i + 1) * this.options.threshold);
                await this.sendToDiscord(block, whisper, message);
            }
        } else {
            // Just send the message (probably from the web UI)
            await this.sendToDiscord(json, whisper, message);
        }
    }
    private async sendToDiscord(json: string, whisper: boolean, message: Message) {
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

export interface ChatterServiceOptions {
    indent: number;
    threshold: number;
    splitMessages: boolean;
}
