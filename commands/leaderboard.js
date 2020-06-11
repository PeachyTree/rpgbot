const { Command, util } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            group: 'commands',
            memberName: 'leaderboard',
            description: 'Shows the leaderboard of what you specify.',
            examples: ['leaderboard <type> || !leaderboard money'],
            args: [
                {
                    type:"string",
                    prompt:"Which leaderboard type would you like to view?",
                    key:"leaderboard",
                    default:"orbs",
                },
                {
                    type:"integer",
                    key:"page",
                    prompt:"Which page would you like to view?",
                    default: 1,
                }
            ]
        });
    }

    run(msg, { leaderboard, page }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        if (leaderboard == "orbs") { 
       let thing = 1;
        let data = this.client.profile.array()
        let d = data.sort((a, b) => b.orbs - a.orbs) 
        const paginated = util.paginate(d, page, Math.floor(10))
        console.log(paginated)
        let embed = new RichEmbed()
        .setTitle(`Orbs Leaderboard 🔮`)
        .setColor("RANDOM")
        .setDescription(paginated.items.map(user => 
        
            this.client.users.get(user.id) ? `${thing++}. ` + `${this.client.users.get(user.id).tag} - **${user.orbs}** 🔮` : this.client.profile.delete(`${user.id}`)).join("\n"))
            .setFooter(`Your rank: ${(this.client.profile.array().sort((a, b) => b.orbs - a.orbs).map(i => i.id).indexOf(msg.author.id)) + 1}/${this.client.profile.array().length} with ${this.client.profile.get(msg.author.id).orbs} 🔮 | Use !leaderboard <type> <page> to view another page!`)
        
  
            msg.embed(embed)
            return;
        } else if(leaderboard == "level") {
           levellb(msg, this.client, page)
          return;
        } else if(leaderboard == "elo") {
                elolb(msg, this.client, page)
                return;
        }

        
    }
};



function levellb(msg, client, page) {
    let thing = 1;
    let data = client.profile.array()
    let d = data.sort((a, b) => b.level - a.level) 
    const paginated = util.paginate(d, page, Math.floor(10))
    console.log(paginated)
    let embed = new RichEmbed()
    .setTitle(`Level Leaderboard ✨`)
    .setColor("RANDOM")
    .setDescription(paginated.items.map(user => 
    
        client.users.get(user.id) ? `${thing++}. ` + `${client.users.get(user.id).tag} - **${user.level}** ✨` : client.profile.delete(`${user.id}`)).join("\n"))
        .setFooter(`Your rank: ${(client.profile.array().sort((a, b) => b.level - a.level).map(i => i.id).indexOf(msg.author.id)) + 1}/${client.profile.array().length} with level ${client.profile.get(msg.author.id).level} ✨ | Use !leaderboard <type> <page> to view another page!`)
    

        msg.embed(embed)
} 

function elolb(msg, client, page) {
    let thing = 1;
    let data = client.profile.array()
    let d = data.sort((a, b) => b.elo - a.elo) 
    const paginated = util.paginate(d, page, Math.floor(10))
    console.log(paginated)
    let embed = new RichEmbed()
    .setTitle(`Elo Leaderboard 📨`)
    .setColor("RANDOM")
    .setDescription(paginated.items.map(user => 
    
        client.users.get(user.id) ? `${thing++}. ` + `${client.users.get(user.id).tag} - **${user.elo}** 🔷` : client.profile.delete(`${user.id}`)).join("\n"))
        .setFooter(`Your rank: ${(client.profile.array().sort((a, b) => b.elo - a.elo).map(i => i.id).indexOf(msg.author.id)) + 1}/${client.profile.array().length} with ${client.profile.get(msg.author.id).elo} 🔷 | Use !leaderboard <type> <page> to view another page!`)
    

        msg.embed(embed)
}