const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'collect',
            group: 'commands',
            memberName: 'collect',
            description: 'Collect money from your workers.',
            examples: ['collect']
        });
    }

    run(msg) {
                if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let slaves = this.client.profile.get(msg.author.id, "workers")
        if (!slaves.length) return msg.say('You have no workers.')
        var user = this.client.profile.get(msg.author.id);
        if ((user.lastCollected + 60000) > Date.now()) return msg.say(`You must wait ${(((user.lastCollected + 60000) - Date.now()) / 1000).toFixed(0)}s before using this command again!`);
        var earned = (Number(user.workers.map(i => i.level * 2 / 1.33).reduce((a, b) => a + b, 0).toFixed(2))) * ((Date.now() / 1000 / 60).toFixed(0) - (user.lastCollected / 1000 / 60).toFixed(0));
      if (isNaN(earned)) earned = 0;
        this.client.profile.math(`${msg.author.id}`, "+", earned, "orbs")
        this.client.profile.set(`${msg.author.id}`, Date.now(), "lastCollected")
       
         let embed =  new RichEmbed()
            .setTitle(`Income! 📬`)
            .setDescription(`You've successfully collected \`${earned} 🔮\` from your worker(s)!`)
            .setColor("RANDOM")
       msg.embed(embed)
    }
};