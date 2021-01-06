// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'balance',
            group: 'profile',
            aliases: ["bal", "money", "cash"],
            memberName: 'balance',
            description: 'Shows your balance.',
            examples: ['balance'],
            args: [
                {
                    key:"user",
                    type:"user",
                    prompt:"Which user would you like to get the balance of?",
                    default: msg => msg.author
                }
            ]
        });
    }

    run(msg, { user }) {

        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        if (this.client.clash.get(`${user.id}`, "id") != 'none') {
            let embed = new RichEmbed()
            .setTitle(`${user.tag}'s balance`)
            .addField('Balance', `**${this.client.profile.get(`${user.id}`, "orbs")}** 🔮`)
            .addField('Guild Balance', user.id === msg.author.id ? `**${this.client.clash.get(`${user.id}`, "orbs")}** 🏦` : "[HIDDEN]")
            .setColor("RANDOM")
            return msg.embed(embed)
        } else {
            let embed = new RichEmbed()
                .setTitle(`${user.tag}'s balance`)
                .addField('Balance', `**${Math.round(this.client.profile.get(`${user.id}`, "orbs")).toLocaleString()}** 🔮`)
                .setColor("RANDOM")
            return msg.embed(embed)
        }
    
    }
};