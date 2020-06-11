// Copyright (©) 2020 Azura Apple. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');

module.exports = class ClashKickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clashkick',
            group: 'clash',
            memberName: 'clashkick',
            description: 'Kick a member of your clash.',
            examples: ['clashkick'],
            args: [
                {
                    key:"user",
                    prompt:"Which user would you like to kick, mention or give me the ID of the user.",
                    type:"user"
                }
            ]
        });
    }

   async run(msg, { user }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

     
        if (this.client.clash.get(`${user.id}`, "id") == "none") {
            return msg.say(msg.author.tag + ', Either you are not the king of this clash, or this user is not in your clash.')
        }
        
        if (this.client.clash.get(`${user.id}`, "id") != `${msg.author.id}`) {
            return msg.say(msg.author.tag + ', Either you are not the king of this clash, or this user is not in your clash.')
        }
     
        if (this.client.clash.get(`${msg.author.id}`, "role") != "King") {
            return msg.say(msg.author.tag + ', Either you are not the king of this clash, or this user is not in your clash.')
        }
     
        msg.say('Are you sure about kicking **' + user.tag + '**? respond with `yes` or `no`')
        const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 30000
        });

        if (!msgs.size) return msg.say(`30 seconds passed, **${msg.author.tag}** did not respond with yes or no.`);
		if (msgs.first().content !== "yes") return msg.say(`${msg.author} \👍`);
        msg.say(`${user.tag} was kicked from the **${this.client.clash.get(`${msg.author.id}`, "name")}** clash.`)
        this.client.clash.delete(`${user.id}`)
        this.client.clash.remove(`${msg.author.id}`, `${user.id}`, "memberids")
        this.client.clash.math(`${msg.author.id}`, "-", 1, "members")
    }
};