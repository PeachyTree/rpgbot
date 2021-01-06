// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { util } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class ItemsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'items',
            group: 'profile',
            memberName: 'items',
            description: 'Shows your items.',
            examples: ['items'],
            args: [
                {
                    key:"page",
                    type:"integer",
                    prompt:"Which page would you like to view?",
                    default: 1
                }
            ]
        });
    }

    run(msg, { page }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let arr = this.client.profile.get(`${msg.author.id}`, "items")
        const paginated = util.paginate(arr, page, Math.floor(5));        

      
        let embed = new RichEmbed()
            .setAuthor(msg.author.tag + ' Items', msg.author.displayAvatarURL)
            .setDescription(paginated.items.map(i => `ID: ${i.id} Name: ${i.name}\nDescription: ${i.description}\nDamage: ${i.damage} / Health: ${i.health}`).join("\n"))
            .setColor("RANDOM")
        msg.embed(embed)
    }
}; 