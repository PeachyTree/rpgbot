// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');

module.exports = class UpgradeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'upgrade',
            group: 'profile',
            memberName: 'upgrade',
            description: 'Upgrade your workers!',
            examples: ['upgrade'],
            args: [
                {
                    key:"id",
                    prompt:"Which worker would you like to upgrade? (id)",
                    type:"integer",
                }
            ]
        });
    }

    run(msg, { id }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let array = this.client.profile.get(msg.author.id, "workers")
        let data = array.find(obj => obj.number == id) 
        if (!data) return msg.say('I could not find any worker by that ID.')

        let result = id - 1
        this.client.profile.inc(msg.author.id, `workers.${result}.level`)

        msg.say('Successfully upgraded worker with the ID of ' + id + '!')
        return;
    }
};