const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'workers',
            group: 'commands',
            memberName: 'workers',
            description: 'Shows your workers..',
            examples: ['workers']
        });
    }

    run(msg) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let embed = new RichEmbed()
        .setTitle(`${msg.author.tag}'s workers!`)
        .setDescription(`${this.client.profile.get(msg.author.id).workers.map(i => `ID => **${i.number}** - Level <= **${i.level}** - Earnings <= **$${(i.level * 2 / 1.33).toFixed(2)}**\n`).join("\n")}`)
        .setColor("RANDOM")
        .setFooter(`!upgrade <id>`)
        msg.embed(embed)
    }
};