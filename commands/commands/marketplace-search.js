const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'marketplace-search',
            group: 'commands',
            memberName: 'marketplace-search',
            aliases: ["market-search", "marketsearch"],
            description: 'Searches marketplace for your item.',
            examples: ['marketplace-search'],
            args: [
                {
                    key:"item",
                    prompt:"Which item would you like to search for?",
                    type:"string",
                }
            ]
        });
    }

    run(msg, { item }) {
       let arr = this.client.marketplace.get(`${this.client.user.id}`, "items");
       let sorted = arr.filter(i => i.name.startsWith(item));
       console.log(sorted);
       let embed = new RichEmbed()
       .setTitle(`Market! 💹`)
       .setDescription(sorted.map(i => `**${i.name}**| **ID: ${i.id}**| **Price: ${i.price}**| **Damage: ${i.damage}**| **Health: ${i.health}**| **Author:** __${this.client.users.get(i.author).tag}__`).join("\n"))
       .setFooter(`To view another page, do !page <page> | To buy an item, do !buy <id>`)
       .setColor("RANDOM")
       msg.embed(embed);
    }
};