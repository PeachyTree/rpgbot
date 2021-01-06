// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command, util } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class MarketplaceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'market',
            group: 'roleplay',
            aliases: ["marketplace"],
            memberName: 'market',
            description: 'Shows market, what u can buy.',
            examples: ['market'],
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

    run(msg, { page } ) {
      if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

      this.client.marketplace.ensure(this.client.user.id, {
        items: [],
      })

      let arr = this.client.marketplace.get(`${this.client.user.id}`, "items")
      const paginated = util.paginate(arr, page, Math.floor(20));        

      let data = paginated.items
      let embed = new RichEmbed()
        .setTitle(`Market! 💹`)
        .setDescription(data.map(i => `**${i.name}**| **ID: ${i.id}**| **Price: ${i.price}**| **Damage: ${i.damage}**| **Health: ${i.health}**| **Author:** __${this.client.users.get(i.author).tag}__`).join("\n"))
        .setFooter(`To view another page, do !page <page> | To buy an item, do !buy <id>`)
        .setColor("RANDOM")
      msg.embed(embed)
  }
};