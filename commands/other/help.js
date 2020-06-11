const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['commands', 'command-list'],
			group: 'other',
			memberName: 'help',
			description: 'Displays a list of available commands, or detailed information for a specific command.',
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'command',
					default: ''
				}
			]
		});
	}

	async run(msg, { command }) {
		if (!command) {
			const embed = new RichEmbed()
				.setTitle('Command List')
				.setColor("RANDOM")
				.setFooter(`${this.client.registry.commands.size} Commands`);
			for (const group of this.client.registry.groups.values()) {
				embed.addField(
					`${group.name}`,
					group.commands.map(cmd => `\`${cmd.name}\``).join(', ') || 'None'
				);
			}
			try {
				const msgs = [];
				msgs.push(await msg.channel.send({ embed }));
				return msgs;
			} catch (err) {
				return msg.reply('Failed to send help.');
			}
        }
        let embed = new RichEmbed()
        .setTitle(`Command Info for ${command.name} ${command.guildOnly ? '(Usable only in servers)' : ''}`)
        .setColor("RANDOM")
        .setDescription(`**Aliases:** ${command.aliases.join(', ') || 'None'}\n**Usage:** ${msg.anyUsage(`${command.name} ${command.format || ''}`)}\n**Description:** ${command.description}${command.details ? `\n${command.details}` : ''}`)
		return msg.embed(embed)
	}
}