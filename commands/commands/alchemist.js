const { Command, util } = require('discord.js-commando');
const items = require('../../json/alchemist.json')
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'alchemist',
            group: 'commands',
            memberName: 'alchemist',
            description: 'Buy potions / spells from an alchemist.',
            examples: ['alchemist buy <name>'],
            args: [
                {
                    type:"integer",
                    key:"page",
                    prompt:"Which page would you like to view?",
                    default: 1
                }
            ]
        });
    }

    run(msg, { page }) {

        
     let data =  util.paginate(items, page, Math.floor(5))
        
     
        let embed = new RichEmbed()
        .setTitle('Alchemist Shop! ✨')
        .setDescription(data.items.map(i => `Name: **${i.name}**\nDescription: ***${i.description}***\n\n`))
        .setColor("RANDOM")
        .setFooter('Use !spell buy <spell>')
        msg.embed(embed)

    }
};