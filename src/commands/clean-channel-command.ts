import { ChatCommandBase } from './ChatCommandBase';
import { Message, TextChannel } from 'discord.js';
import { CommandArgs } from './CommandArgs';
import { CommandHelpDescriptor } from './HelpText';

export class CleanChannelCommand extends ChatCommandBase {
    protected supportedCommands: string[] = ['clean'];

    public async handle(message: Message, commandArgs: CommandArgs) {
        if (commandArgs.args.length === 0) {
            await message.reply('You must specify the current channel ID.');
            return;
        }
        const channel = message.channel as TextChannel;
        const expectedChannelId = commandArgs.args[0];
        if (channel.id !== expectedChannelId) {
            await message.reply('The specified channel ID is not the same as the current channel ID.');
            return;
        }

        // Recreate the channel
        if (commandArgs.argumentExists('purge')) {
            var permissionOverwrites = channel.permissionOverwrites.array();
            var newChannel = (await message.guild.createChannel(channel.name, 'text', permissionOverwrites)) as TextChannel;
            await newChannel.setParent(channel.parent);
            await newChannel.setPosition(channel.position);
            await channel.delete('OgBot Chat Purge');
            await newChannel.send(`Channel ${newChannel.id} created to replace deleted channel ${channel.id}.`);
            return;
        }

        // Delete all messages that are less than 14 days old
        var fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        do {
            var messages = await channel.fetchMessages();
            var deletableMessages = messages.filter(x => x.deletable && x.createdAt > fourteenDaysAgo);
            await channel.bulkDelete(deletableMessages);
        } while (deletableMessages.size > 0);
    }

    public help(): CommandHelpDescriptor {
        return {
            command: this.supportedCommands[0],
            description: 'Delete all messages of the specified channel (14 days old max). Use with caution.',
            options: [
                {
                    command: '[Channel ID]',
                    description: 'The channel ID that you are in and that you want to clean.'
                }
            ],
            subcommands: [
                {
                    command: '-purge',
                    description:
                        'By using this switch, you will delete and recrete the channel. This is useful to purse older than 14 days messages.'
                }
            ]
        };
    }
}
