import { Message } from 'discord.js';
import * as yaml from 'js-yaml';

export class ChatterService {
    public get options(): ChatterServiceOptions {
        return this.defaultOptions.clone();
    }

    constructor(private defaultOptions: ChatterServiceOptions = new ChatterServiceOptions()) {}

    public async send(objectToSend: any, whisper: boolean, message: Message, sendOptions: ChatterServiceOptions = null) {
        const options = Object.assign({}, this.defaultOptions, sendOptions);
        const outputText =
            options.outputType == OutputType.JSON
                ? JSON.stringify(objectToSend, null, options.indent)
                : yaml.safeDump(objectToSend, { noRefs: true, noCompatMode: true, skipInvalid: true });

        if (options.splitMessages) {
            // Split the output when needed
            const blockCount = Math.ceil(outputText.length / options.threshold);
            for (let i = 0; i < blockCount; i++) {
                const block = outputText.substring(i * options.threshold, (i + 1) * options.threshold);
                await this.sendToDiscord(block, whisper, message, options);
            }
        } else {
            // Just send the message (probably from the web UI)
            await this.sendToDiscord(outputText, whisper, message, options);
        }
    }
    private async sendToDiscord(outputText: string, whisper: boolean, message: Message, options: ChatterServiceOptions) {
        const chatToSend = `\`\`\`${options.outputType.toLowerCase()}\n${outputText}\n\`\`\``;
        if (whisper) {
            await message.author.createDM().then(c => {
                c.send(chatToSend);
            });
        } else {
            await message.reply(chatToSend);
        }
    }
}

export class ChatterServiceOptions {
    indent: number = 2;
    threshold: number = 1900;
    splitMessages: boolean = true;
    outputType: OutputType = OutputType.JSON;

    mergeWith(obj: any): ChatterServiceOptions {
        return Object.assign(new ChatterServiceOptions(), this, obj);
    }

    clone(): ChatterServiceOptions {
        return Object.assign(new ChatterServiceOptions(), this);
    }
}

export enum OutputType {
    JSON = 'JSON',
    YAML = 'YAML'
}
