const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clashinvite',
            group: 'commands',
            memberName: 'clashinvite',
            description: 'Invite people to ur clash.',
            examples: ['clashinvite <user>'],
            args: [
                {
                    type:"user",
                    prompt:"Which user would you like to invite?",
                    key:"user"
                }
            ]
        });
    }

    async run(msg, { user }) {
              if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

       this.client.clash.ensure(`${user.id}`, {
            name: "none",
            members: 0,
            id: "none",
            role: 'none',
            memberids: [],
  })

        if (this.client.clash.get(`${msg.author.id}`, "role") != "King") {
            return msg.say(`You're not the King of your clash, only kings may invite people.`) 
        }
        if (this.client.clash.get(`${user.id}`, "id") == this.client.clash.get(`${msg.author.id}`, "id")) {
            return msg.say(`**${user.tag}** is already with your clash! To kick him, use \`!kick ${user.tag}\``)
        }

        if (this.client.clash.get(`${user.id}`, "id") != "none") {
            return msg.say(`**${user.tag}** is already with another clash! Tell him to leave before joining yours.`)
        }
      
        let embed = new RichEmbed()
        .setTitle(`Invited to Clash`)
        .setDescription(`${user.tag} respond to this message with **yes** or **no**.`)
        .setColor("RANDOM")
        msg.embed(embed)

        const msgs = await msg.channel.awaitMessages(res => res.author.id === user.id, {
			max: 1,
			time: 30000
        });


        if (!msgs.size) return msg.say(`30 seconds passed, **${user.tag}** did not respond with yes or no.`);
	    	if (msgs.first().content !== "yes") return msg.reply(`**${user.tag}** has declined your invitation.`);
        if (msgs.first().content == "yes") {
              msg.say(`**${user.tag}** has successfully joined the clash ${this.client.clash.get(`${msg.author.id}`, "name")}!`)
        this.client.clash.set(`${user.id}`, msg.author.id, "id")
        this.client.clash.push(`${msg.author.id}`, user.id, "memberids")
        this.client.clash.set(`${user.id}`, "Member", "role")
        this.client.clash.set(`${user.id}`, this.client.clash.get(`${msg.author.id}`, "name"), "name")
        this.client.clash.math(`${msg.author.id}`, "+", 1, "members")
        }
    

    }

};