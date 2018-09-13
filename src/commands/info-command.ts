import { ChatCommandBase } from "./ChatCommandBase";
import { Message, TextChannel } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { HelpText } from './HelpText';

export class InfoCommand extends ChatCommandBase {
    protected supportedCommands: string[] = ["info"];
    public async handle(message: Message, commandArgs: CommandArgs) {
        if (commandArgs.args.length === 0) {
            await message.reply("You must specify the message type(s).");
            return Promise.reject();
        }
        for (let i = 0; i < commandArgs.args.length; i++) {
            const element = commandArgs.args[i];
            switch (element) {
                case "channel":
                    await this.sendChannelInfo(message);
                    break;
                case "author":
                    await this.sendAuthorInfo(message);
                    break;
                case "guild":
                    await this.sendGuildInfo(message);
                    break;
                default:
                    await message.reply(`Unknown info type: **${element}**. Supported types: \`channel\`, \`author\` and \`guild\`.`);
                    break;
            }
        }
    }
    public help(): HelpText {
        return {
            command: this.supportedCommands[0],
            description: "Get some information.",
            options: [{
                syntax: "[information types]",
                description: "The type of information that you want (channel, author, guild). You can pass more than one by separating types by a space, ex.: `!og info channel guild`"
            }]
            // ,
            // args: [{
            //     syntax: "-purge",
            //     description: "By using this switch, you will delete and recrete the channel. This is useful to purse older than 14 days messages."
            // }]
        };
    }
    private sendGuildInfo(message: Message): Promise<Message | Message[]> {
        return message.channel.send(`Guild (Server): **${message.guild.name}** (ID: ${message.guild.id})`);
    }

    private sendChannelInfo(message: Message): Promise<Message | Message[]> {
        var channel = message.channel as TextChannel;
        return message.channel.send(`Channel: **${channel.name}** (ID: ${channel.id})`);
    }

    private sendAuthorInfo(message: Message): Promise<Message | Message[]> {
        return message.channel.send(`Author: **${message.author}** (ID: ${message.author.id})`);
    }
}

