// Copyright (©) 2020 Azura Apple. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');

module.exports = class BuyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'buy',
            group: 'roleplay',        
            memberName: 'buy',
            aliases: ["purchase"],
            description: 'buy an item from the marketplace.',
            examples: ['buy'],
            args: [
                {
                    key:"item",
                    type:"integer",
                    prompt:"Which item would you like to buy? give me the ID."
                }
            ]
        });
    }

    async run(msg, { item } ) {

        let arr = this.client.marketplace.get(this.client.user.id, "items")
        let data = arr.findIndex(obj => obj.id === item)
        if (!data.length) return msg.say('I could not find an item with that ID!')
        console.log(data)
      
        if (this.client.profile.get(msg.author.id, "orbs") < arr[data].price) return msg.say('You need **' + this.client.profile.get(msg.author.id, "orbs") - arr[data].price + '** orbs more to buy this.')
        msg.say(`Are you sure about buying **${arr[data].name}** with the ID of **${arr[data].id}** for **${arr[data].price}** Orbs? (**Yes or **No**)`)
        const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
            max: 1,
            time: 30000,
        })

        if (!msgs.size) return msg.say('You did not respond withing 30 seconds, cancelled purchase.')
        if (msgs.first().content !== "yes") return msg.say('Cancelled purchase.')
        if (arr[data].health === undefined) arr[data].health = 0;
        if (arr[data].damage === undefined) arr[data].damage = 0;
        msg.say(`You bought **${arr[data].name}**, it has been transfered to ur inventory!`)

        this.client.profile.math(arr[data].author, "+", arr[data].price, "orbs")
        this.client.profile.push(msg.author.id, { id: arr[data].id, name: arr[data].name, damage: arr[data].damage, health: arr[data].health, type: arr[data].type})
        this.client.profile.math(msg.author.id, "-", arr[data].price, "orbs")
        this.client.marketplace.delete(this.client.user.id, `items.${arr[data]}`)
    }
};