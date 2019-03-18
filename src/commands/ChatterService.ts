import { Message } from 'discord.js';
import { strEnum } from '../utilities/strEnum';
import * as yaml from 'js-yaml';

export class ChatterService {
    constructor(private options: ChatterServiceOptions = defaultChatterOptions) {}

    public async send(objectToSend: any, whisper: boolean, message: Message) {
        const outputText =
            this.options.outputType == OutputType.JSON
                ? JSON.stringify(objectToSend, null, this.options.indent)
                : yaml.safeDump(objectToSend, { noRefs: true, noCompatMode: true });
        if (this.options.splitMessages) {
            // Split the output when needed
            const blockCount = Math.ceil(outputText.length / this.options.threshold);
            for (let i = 0; i < blockCount; i++) {
                const block = outputText.substring(i * this.options.threshold, (i + 1) * this.options.threshold);
                await this.sendToDiscord(block, whisper, message);
            }
        } else {
            // Just send the message (probably from the web UI)
            await this.sendToDiscord(outputText, whisper, message);
        }
    }
    private async sendToDiscord(outputText: string, whisper: boolean, message: Message) {
        const chatToSend = `\`\`\`${this.options.outputType.toLowerCase()}\n${outputText}\n\`\`\``;
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
    outputType: OutputType;
}

export const OutputType = strEnum(['JSON', 'YAML']);
export type OutputType = keyof typeof OutputType;

export const defaultChatterOptions = {
    indent: 2,
    threshold: 1900,
    splitMessages: true,
    outputType: OutputType.JSON,
    mergeWith(obj: any): ChatterServiceOptions {
        return Object.assign({}, this, obj);
    }
};
