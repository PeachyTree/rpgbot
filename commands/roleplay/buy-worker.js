// Copyright (©) 2020 Azura Apple. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');

module.exports = class BuyWorkerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'buy-worker',
            group: 'roleplay',
            memberName: 'buy-worker',
            description: 'Buy a worker.',
            examples: ['buy-worker']
        });
    }

    run(msg) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let x = this.client.profile.get(`${msg.author.id}`, "workers")
        let price;
        
        if (x.length >= 0 && x.length <= 1) { 
            price = 50000
            if (this.client.profile.get(`${msg.author.id}`, "orbs") < price) return msg.say('You do not have enough orbs to buy this. you need **' + price + '$**')
            this.client.profile.push(msg.author.id, {number: x.length + 1, level: 1}, "workers");
            this.client.profile.math(`${msg.author.id}`, "-", price, "orbs")
            msg.say(`**${msg.author.tag}**, you successfully bought \`1\` worker!`)
            return;
        } else if(x.length >= 2 && x.length <= 3)  {
            price = 1000000
            if (this.client.profile.get(`${msg.author.id}`, "orbs") < price) return msg.say('You do not have enough orbs to buy this. you need **' + price + '$**')
            this.client.profile.push(msg.author.id, {number: x.length + 1, level: 1}, "workers");
            this.client.profile.math(`${msg.author.id}`, "-", price, "orbs")
            msg.say(`**${msg.author.tag}**, you successfully bought \`1\` worker!`)
            return;
        } else if (x.length >= 4 && x.length <= 6) {
            price = 3000000
            if (this.client.profile.get(`${msg.author.id}`, "orbs") < price) return msg.say('You do not have enough orbs to buy this. you need **' + price + '$**')
            this.client.profile.push(msg.author.id, {number: x.length + 1, level: 1}, "workers");
            this.client.profile.math(`${msg.author.id}`, "-", price, "orbs")
            msg.say(`**${msg.author.tag}**, you successfully bought \`1\` worker!`)
            return;
        }
    }
};