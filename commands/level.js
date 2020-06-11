const { Command } = require('discord.js-commando');
const { Canvas } = require('canvas-constructor');
const { RichEmbed } = require('discord.js');
module.exports = class levelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'level',
            group: 'commands',
            memberName: 'level',
            description: 'Shows your current level.',
            examples: ['level'],
            args: [
                {
                    key:"user",
                    type:"user",
                    prompt:"Which user would you like to get the level of?",
                    default: msg => msg.author
                }
            ]
        });
    }

    run(msg, { user }) {
              if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

      const xpForLevel = level => Math.ceil(level*level*100);
      const calcLevel = xp => Math.floor(0.1*Math.sqrt(xp));
      // So if you have 523 xp/points, you are level:
      const curLevel = calcLevel(this.client.profile.get(`${user.id}`, "levelpoints")) // 2
      // Points needed for currentLevel + 1;
      const pointsNeeded = xpForLevel(curLevel + 1);
      // So how many points are left?
      let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Level: **` + this.client.profile.get(`${user.id}`, "level") + '**' + '\n' + `XP: ${this.client.profile.get(`${user.id}`, "levelpoints")}/${pointsNeeded} (${pointsNeeded - this.client.profile.get(`${user.id}`, "levelpoints")} needed)`)
      
      msg.channel.send(embed)
    }
}