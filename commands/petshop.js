const { Command, util } = require('discord.js-commando');
const pets = require('../../json/pets')
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'petshop',
            group: 'commands',
            memberName: 'petshop',
            aliases: ["pet-shop"],
            description: 'Shows the pet shop.',
            examples: ['petshop'],
            args: [
                {
                    key:"page",
                    type:"integer",
                    prompt:"Which page would you like to view?",
                    default: 1,
                }
            ]
        });
    }

    run(msg, { page }) {
        

      let data = util.paginate(pets, page, Math.floor(6))

      let embed = new RichEmbed()
      .setTitle('Pet Shop | Page ' + page)
      .setColor("RANDOM")
      .setFooter(`To view another page do: !petshop <page> | to buy do !petbuy <pet>`)
      for (var i = 0; i < data.items.length; i++) {
          embed.addField(`${data.items[i].name}`, `Damage: ${data.items[i].damage}\nType: ${data.items[i].type}\nPrice: ${data.items[i].price} 💰\nPreview: [here](${data.items[i].img})`,true)
      }

      msg.embed(embed)
 

    }
};