const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clash',
            group: 'commands',
            memberName: 'clash',
            description: 'Shows your clash stats.',
            examples: ['clash'],
        });
    }

    run(msg) {
            if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let get = this.client.clash.get(`${msg.author.id}`, "id")
        if (get == "none") return msg.say('You are not a part of a clash.')
        let info = this.client.clash.get(`${get}`)
        console.log(get)
        let embed = new RichEmbed()
        .setTitle(`${info.name} 🏆`)
        .setColor("RANDOM")
        .addField('Clash Member Count 💹', info.members,true)
        .addField('Members 👱',`${info.memberids.length > 10 ? "Too many members, can't be displayed. use `!guildmembers`." : info.memberids.map(id => this.client.users.get(id).tag + ' - ' + this.client.clash.get(`${id}`, "role") + ' - Level: **' + this.client.profile.get(`${id}`, "level") + '**' + `(${this.client.profile.get(id, "character").class})`).join("\n")}`,true)
        .addField('Guild Balance 🏦', `**${info.orbs}** 🔮`)
        msg.embed(embed)
    }
};
