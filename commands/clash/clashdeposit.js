// Copyright (©) 2020 Azura Apple. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');

module.exports = class ClashDepositCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clash-deposit',
            group: 'roleplay',
            aliases: ["cdep", "cdeposit", "clashdep", "clashdeposit"],
            memberName: 'clash-deposit',
            description: 'Deposit orbs into your clash balance.',
            examples: ['clash-deposit'],
            throttling: {
                usages: 1,
                duration: 10,
            },
            args: [
                {
                    type:"integer",
                    key:"amount",
                    prompt:"How much would you like to deposit?",
                    }
            ]
        });
    }

    run(msg, { amount }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        if(msg.content.includes('-')) return msg.say('Negative values can not be deposited.')
        if (this.client.clash.get(`${msg.author.id}`, "id") == "none") return msg.say(`${msg.author}, you are not in a clash.`)
        if (this.client.profile.get(`${msg.author.id}`, "orbs") < amount) return msg.say(`${msg.author}, you are trying to deposit more orbs than you've got.`)

        let id = this.client.clash.get(`${msg.author.id}`, "id")

        this.client.clash.math(`${id}`, "+", amount, "orbs")
        this.client.profile.math(`${msg.author.id}`, "-", amount, "orbs")
        this.client.clash.push(`${id}`, { depositer: msg.author.tag, deposited: amount, time: Date.now() }, "deposits")
        msg.say(`${msg.author}, you successfully deposited **${amount}** 🔮 to your clash.`)  
    }
};