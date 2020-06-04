const { Command, util } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pets',
            group: 'commands',
            memberName: 'pets',
            description: 'Shows your pet storage.',
            examples: ['pets'],
            args: [
                {
                    type:"integer",
                    key:"page",
                    prompt:"Which page would you like to view?",
                    default: 1,
                }
            ]
        });
    }

    run(msg, { page }) {

        let arr = this.client.profile.get(msg.author.id, "pets")
        let data = util.paginate(arr, page, 6)

        let embed = new RichEmbed()
        .setAuthor(`${msg.author.tag} pets | Page ${page}`, msg.author.displayAvatarURL)
        .setColor("RANDOM")
        .setFooter('to view another page do !pets <page>')

        for (var i = 0; i < data.items.length; i++) {
            embed.addField(`${data.items[i].name}`, `Damage: ${data.items[i].damage}\nType: ${data.items[i].type}\nPreview: [here](${data.items[i].img})\nID: ${data.items[i].id}`,true)
        }

        msg.embed(embed)
    }
};