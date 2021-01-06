// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { util } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class InventoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inventory',
            group: 'profile',
            aliases: ["i", "inv", "backpack"],
            memberName: 'inventory',
            description: 'Shows your inventory.',
            examples: ['inventory'],
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

        let arr = this.client.profile.get(`${msg.author.id}`, "weapons")
        const paginated = util.paginate(arr, page, Math.floor(20));        


        let data = paginated.items
        if (data.health === undefined) data.health = 0;
        if (data.damage === undefined) data.damage = 0;
        let embed = new RichEmbed()
            .setTitle(`${msg.author.tag}'s Inventory! 🎒 | Page ${paginated.page}`)
            .setDescription(`${data.map(i => `**${i.name}** ***=>*** **Damage: ${i.damage}** ***=>*** **Health: ${i.health}** ***=>*** **ID: ${i.id}** ***=>*** **Type: ${i.type}**`).join("\n")}`)
            .setFooter(`To view another page do !inventory <page>`)
            .setColor("RANDOM")
        msg.embed(embed)
    }
};