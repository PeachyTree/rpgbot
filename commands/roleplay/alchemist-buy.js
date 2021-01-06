// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
let spells = require('../../json/alchemist.json')

module.exports = class AlchemistBuyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'alchemist-buy',
            group: 'roleplay',
            memberName: 'alchemist-buy',
            description: 'Buy an item from the alchemist.',
            examples: ['alchemist-buy <item>'],
            args: [
                {
                    key:"spell",
                    type:"string",
                    prompt:"Which item would you like to buy?",
                }
            ]
        });
    }

    async run(msg, { spell }) {
        
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')
        let data = spells.findIndex(obj => obj.name === spell.toLowerCase())       
        if (data < 0) return msg.say('I could not find that spell!') 
        if (this.client.profile.get(msg.author.id, "orbs") < spell[data].price) return msg.say(`You need ${spells[data].price} to buy this spell!`)
        msg.say(`Are you sure about buying **${spells[data].name}** for **${spells[data].price}** orbs?`)

        const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
            max: 1,
            time: 30000,
        })
        
        if (!msgs.size) return msg.say(`Time's up! you forgot to answer withing 30 seconds.`)
        if (msgs.first().content !== "yes") return msg.say('Cancelled purchase.')

        if (spells[data].health === undefined) spells[data].health = 0;
        if (spells[data].damage === undefined) spells[data].damage = 0;
        if (spells[data].mark === undefined) spells[data].mark = 'None';
        msg.say('Successfully bought **' + spells[data].name + '** !')
     
        this.client.util.math(this.client.user.id, "+", 1, "weaponids")
        let weaponid = this.client.util.get(this.client.user.id, "weaponids");
        this.client.profile.push(msg.author.id, { id: weaponid, name: spells[data].name, damage: spells[data].damage, health: spells[data].health, message: spells[data].message, description: spells[data].description, type: spells[data].type, mark: spells[data].mark }, "items")
        this.client.profile.math(msg.author.id, "-", spells[data].price, "orbs")
        this.client.util.math(this.client.user.id, "+", 1, "weaponids")
    }
};