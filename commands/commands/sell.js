const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
  constructor(client) {
      super(client, {
          name: 'sell',
          group: 'commands',
          memberName: 'sell',
          description: 'Put an item up on market.',
          examples: ['sell <itemid>'],
          args: [
              {
                  key:"itemid",
                  prompt:"Which item would you like to sell, (itemID required)",
                  type:"integer",
              },
              {
                  key:"price",
                  prompt:"What should the price of this item be?",
                  type:"integer",
              }
          ]
      });
  }

  run(msg, { itemid, price }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

    if (msg.content.includes('-')) return msg.say('Negative values may not be used.')
    let array = this.client.profile.get(msg.author.id, "weapons")
    let data = array.findIndex(obj => obj.id === itemid)
    console.log(data)
    console.log(array[data])
    if (!array[data]) return msg.say('I could not find that item of yours, maybe wrong item id?')
    msg.say(`Item **${array[data].name}** was put up on market with the price of ${price} orbs!`)
    this.client.marketplace.push(this.client.user.id, { id: array[data].id, name: array[data].name, price: price, damage: array[data].damage, health: array[data].health, author: msg.author.id, type: array[data].type}, "items")
        this.client.profile.delete(msg.author.id, `weapons.${data}`)

  }
};