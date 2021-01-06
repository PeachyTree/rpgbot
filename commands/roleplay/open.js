// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')

module.exports = class OpenCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'open',
            group: 'roleplay',
            memberName: 'open',
            description: 'Open a crate and get rewards.',
            examples: ['open'],
            args: [
                {
                    key:"crate",
                    type:"string",
                    prompt:"Which crate would you like to open?",
                }
            ]
        });
    }

    run(msg, { crate }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let arr = this.client.profile.get(msg.author.id, "items")
        let data = arr.findIndex(obj => obj.type === crate.toLowerCase())
        console.log(data)  
        
        if (data === undefined) return msg.say(`You do not own any of these crates.`)

        let embed = new RichEmbed()
            .setTitle(`Unlocking ${crate} 🌀`)
            .setDescription('***...***')
            .setColor("RANDOM")
        let items = arr[data].rewards[Math.floor(Math.random() * arr[data].rewards.length)]

        msg.embed(embed).then(message => {
            setTimeout(() => {
            let embed2 = new RichEmbed()
            .setTitle(`Unlocked ${items.type} 🌀`)
            .setDescription(`**Name:** ${items.name}\n**Damage:** ${items.damage}\n**Health:** ${items.health}\n**Type:** ${items.type}`)
            .setColor("RANDOM")
            message.edit(embed2)
          }, 5000);
        })

        if (items.health === undefined) items.health = 0;
        if (items.damage === undefined) items.damage = 0;

        let weaponid = this.client.util.get(this.client.user.id, "weaponids")

        this.client.profile.push(msg.author.id, { id: weaponid + 1, name: items.name, health: items.health, damage: items.damage, type: items.type }, "weapons")
        this.client.util.math(msg.author.id, "+", 1, "weaponids")
        this.client.profile.delete(msg.author.id, `items.${arr[data]}`)
    }
};