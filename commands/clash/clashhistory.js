// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
const { util } = require('discord.js-commando')
const moment = require('moment')

module.exports = class ClashHistoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clashhistory',
            group: 'clash',
            memberName: 'clashhistory',
            description: 'Shows recent activites in your clash.',
            examples: ['clashhistory'],
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

    run(msg, { page }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        if (this.client.clash.get(`${msg.author.id}`, "role") != "King") return msg.say('You have to be the King of this clash to view history.')
        if (msg.content.includes('--clear')) {
            msg.say('Successfully cleared your clash history!')
            let array = this.client.clash.get(`${msg.author.id}`, "deposits")
            array.forEach(thing => {
                this.client.clash.remove(`${msg.author.id}`, thing, "deposits") 
            })
            return;
        }
        
        let arr = this.client.clash.get(`${msg.author.id}`, "id")
        if (this.client.clash.get(`${msg.author.id}`, "role") != "King") return msg.say('You have to be the King of this clash to view history.')
        if (arr == "none") return msg.say('You do not own a clash.')
        let array = this.client.clash.get(`${arr}`, "deposits")
        const paginated = util.paginate(array, page, Math.floor(20));
        console.log(paginated)

        let data = paginated.items
        let embed = new RichEmbed()
            .setTitle(`${this.client.clash.get(`${arr}`, "name")} Clash History | Page ${paginated.page}`)
            .setDescription(`${data.map(mem => `**${mem.depositer}** => $${mem.deposited} => ***${moment(mem.time).format('LLLL')}***`).join('\n')}`)
            .setColor("RANDOM")
            .setFooter(`!clashhistory <page>`)
        msg.embed(embed)
    }
};