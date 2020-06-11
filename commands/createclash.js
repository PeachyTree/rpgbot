const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'createclash',
            group: 'commands',
            aliases: ["makeclash", "create-clash", "clashcreate", "clash-create"],
            memberName: 'createclash',
            description: 'Creates your clash, which you can invite people too for boosts.',
            examples: ['createclash'],
            args: [
                {
                    key:"guildname",
                    prompt:"What should the name of your clash be?",
                    type:"string",
                    validate: guildname => {
                        if (guildname.length < 60) return true;
                        return 'Clash name can not exceed more than 60 characters.'
                    }
                }
            ]
        });
    }

    run(msg, { guildname }) {
            if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

      let arr = this.client.util.get(this.client.user.id, "guildnames")
        if (arr.includes(guildname)) return msg.say(`The clash name **` + guildname + '** has already been taken!')
        if (this.client.profile.get(`${msg.author.id}`, "level") < 5) {
            return msg.channel.send({embed: {
                color: 0xff0000,
                description: "You have to reach level `5` before you can create a clash."
            }
          })
        }
        if (this.client.clash.get(`${msg.author.id}`, "id") != "none") {
           return msg.channel.send({embed: {
                color: 0xff0000,
                description: "You're already in a clash, leave it before you can create a new one.."
            }
          })
        }

        if (this.client.profile.get(`${msg.author.id}`, "orbs") < 10000) {
           return msg.channel.send({embed: {
                color: 0xff0000,
                description: "You need atleast `10000` orbs to create a clash."
            }
          })
        }

        this.client.clash.ensure(`${msg.author.id}`, {
            name: "none",
            members: 0,
            id: msg.author.id,
            role: 'none',
            memberids: [],
      })

      this.client.clash.set(`${msg.author.id}`, msg.author.id, "id")
      this.client.clash.push(`${msg.author.id}`, msg.author.id, "memberids")
      this.client.clash.set(`${msg.author.id}`, "King", "role")
      this.client.clash.set(`${msg.author.id}`, guildname, "name")
      this.client.clash.math(`${msg.author.id}`, "+", 1, "members")
      this.client.profile.math(`${msg.author.id}`, "-", 10000, "orbs")
      this.client.util.push(this.client.user.id, guildname, "guildnames")

      return msg.say('Successfully created your clash! Check it with **!clash**.')
      
    

    }
};