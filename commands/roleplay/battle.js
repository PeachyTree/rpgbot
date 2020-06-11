// Copyright (©) 2020 Azura Apple. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
const { BATTLE_CHANNEL } = process.env;

module.exports = class BattleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'battle',
            group: 'roleplay',
            memberName: 'battle',
            description: 'Battle other users.',
            examples: ['battle'],
            args: [
                {
                    type:"user",
                    key:"user",
                    prompt:"Which user would you like to battle?",
                }
            ]
        });
      this.battle = new Set()
    }

    async run(msg, { user }) {

      if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')
      if (user.id == msg.author.id) return msg.say('You can not duel yourself.')
      if (this.battle.has(msg.channel.id)) return msg.say('Only one battle may occur per channel! to prevent spam.')
      this.battle.add(msg.channel.id)
      msg.say(`${user} do you accept the challenge from ${msg.author}? (you have 30 seconds to respond with **yes**)`)
      const acceptance = await msg.channel.awaitMessages(res => res.author.id === user.id, {
          max: 1,
          time: 30000,
      })

      if (!acceptance.size) return msg.say('They were too scared to fight you!')

    if (acceptance.first().content !== "yes") {
    msg.say(`${user} was too scared to fight you! ${msg.author}`)
      this.battle.delete(msg.channel.id)
      return;
    }
    
    this.client.channels.get(BATTLE_CHANNEL).send(`Battle Started: **${msg.author.tag} vs ${user.tag}**`)
    let opponentturn = false;
    let authorsturn = true;


    let opponenthealth = this.client.profile.get(user.id, "health")
    let authorshealth = this.client.profile.get(msg.author.id, "health")
    let author;

    while(authorshealth > 1 && opponenthealth > 1) {

      if (opponentturn == false) author = msg.author.id; 
      if (authorsturn == false) author = user.id;

      if (authorshealth < 1) {
        win(msg, this.client, authorshealth, opponenthealth, user.id, msg.author.id)
        this.battle.delete(msg.channel.id)
        this.client.channels.get(BATTLE_CHANNEL).send(`Battle Ended: **${msg.author.tag} vs ${user.tag}**\nWinner: **$user.tag}**`)
        return;

      } else if(opponenthealth < 1) {
        this.client.channels.get(BATTLE_CHANNEL).send(`Battle Ended: **${msg.author.tag} vs ${user.tag}**\nWinner: **${msg.author.tag}**`)
        win(msg, this.client, opponenthealth, authorshealth, msg.author.id, user.id)
        this.battle.delete(msg.channel.id)
        return;
      }
    
      setTimeout(() => {
        let spell = this.client.equip.get(author, "spell")[0]
        if (spell === undefined) spell = ''
        let options = [this.client.profile.get(author, "character").ultimate, "attack", "heal", "heavy", "run", spell] 

        msg.channel.send({embed: {
            color: 0xf71800,
            description: `${this.client.users.get(author).tag}, What do you choose to do? either [${options.map(i => i)}]\n\n${msg.author.tag}: **${authorshealth} HP** ‍  ‍  ‍ ${user.tag}: **${opponenthealth}** HP`
          }})
        }, 500);

        const msgs = await msg.channel.awaitMessages(res => res.author.id === author, {
            max: 1,
            time: 60000
        });

        if(!msgs.size) {
          await msg.channel.send({embed: {
            color: 0xf71800,
            description: 'Times up! you forgot to pick an option.'
          }})
          continue;
        }

        if (msgs.first().content.toLowerCase() == "attack") {
          if (opponentturn == false) {
            let damage = this.client.profile.get(author, "damage")
            let formula = Math.floor(Math.random(damage / 2) * damage) 
            authorattack(msg, this.client, author, user.id, formula)
            if (this.client.equip.get(msg.author.id, "pet").length > 0) {
              petattack(msg, this.client, msg.author.id)
              let petdamage = this.client.equip.get(msg.author.id, "pet")[0].damage
              if (petdamage > opponenthealth) petdamage = Math.abs(petdamage, opponenthealth)
              opponenthealth -= petdamage
            }
            if (formula > authorshealth) formula = Math.abs(formula, authorshealth)
            opponenthealth -= formula
          if (opponentturn == false) opponentturn = true;
          if (authorsturn == true) authorsturn = false;
          continue;
        } else if(authorsturn == false) {
          let damage = this.client.profile.get(author, "damage")
          let formula = Math.floor(Math.random(damage / 2) * damage) 
          authorattack(msg, this.client, author, msg.author.id, formula)
          if (this.client.equip.get(msg.author.id, "pet").length > 0) {
            petattack(msg, this.client, author)
            let petdamage = this.client.equip.get(author, "pet")[0].damage
            if (petdamage > opponenthealth) petdamage = Math.abs(petdamage, opponenthealth)
            authorshealth -= petdamage
          }
          if (formula > authorshealth) formula = Math.abs(formula, authorshealth)
          authorshealth -= formula
          if (opponentturn == true) opponentturn = false;
          if (authorsturn == false) authorsturn = true;
          continue;
        }
        } else if(msgs.first().content.toLowerCase() == this.client.profile.get(author, "character").ultimate) {
            if (opponentturn == false) {
              let random6 = Math.floor(Math.random() * 10)
              if (random6 < 8) {
                ultmiss(msg, this.client, author)
                if (opponentturn == false) opponentturn = true;
                if (authorsturn == true) authorsturn = false;
                continue;
              } 
                let damage = this.client.profile.get(msg.author.id, "character").damage
                ultimate(msg, this.client, author)
                if (this.client.equip.get(msg.author.id, "pet").length > 0) {
                  petattack(msg, this.client, author)
                  let petdamage = this.client.equip.get(author, "pet")[0].damage
                  if (petdamage > opponenthealth) petdamage = Math.abs(petdamage, opponenthealth)
                  opponenthealth -= petdamage
                }
                if (damage > opponenthealth) damage = Math.abs(damage, opponenthealth)
                opponenthealth -= damage
                if (opponentturn == true) opponentturn = false;
                if (authorsturn == false) authorsturn = true;
                continue;
            } else if(authorsturn == false) {
              let random6 = Math.floor(Math.random() * 10)
              if (random6 < 8) {
                ultmiss(msg, this.client, author)
                if (opponentturn == true) opponentturn = false;
                if (authorsturn == false) authorsturn = true;
                continue; 
            }
                if (this.client.equip.get(user.id, "pet").length > 0) {
                  petattack(msg, this.client, author)
                  let petdamage = this.client.equip.get(author, "pet")[0].damage
                  if (petdamage > opponenthealth) petdamage = Math.abs(petdamage, opponenthealth)
                  authorshealth -= petdamage
                }

                let damage = this.client.profile.get(user.id, "character").damage
                ultimate(msg, this.client, author)
                if (damage > authorshealth) damage = Math.abs(damage, authorshealth)
                authorshealth -= damage
                if (opponentturn == true) opponentturn = false;
                if (authorsturn == false) authorsturn = true;
                continue;
              } 
            } else if(msgs.first().content.toLowerCase() == "heal") {
              let array = this.client.profile.get(author, "items")
              let data = array.findIndex(obj => obj.name === "health potion")
              if (data < 0) {
                msg.say(`(${this.client.users.get(author).tag})` + 'You do not have any health potions!')
                continue;
              }

              let embed1 = new RichEmbed()
              .setDescription(`${this.client.users.get(author).username} uses a health potion! +${array[data].health} HP`)
              .setColor(0xf71800)
              msg.embed(embed1)
              if (opponentturn == false) {
                authorshealth += array[data].health
                this.client.profile.delete(msg.author.id, `items.${data}`)
                if (opponentturn == false) opponentturn = true;
                if (authorsturn == true) authorsturn = false;
                continue;
              } else if(authorsturn == false) {
                opponenthealth += array[data].health
                this.client.profile.delete(user.id, `items.${data}`)
                if (opponentturn == false) opponentturn = true;
                if (authorsturn == true) authorsturn = false;
                continue;
              }

            } else if(msgs.first().content == "run") {
                let random = Math.floor(Math.random() * 10)

                if (random < 5) {
                    if (opponentturn == false) {
                        msg.say(`${msg.author.tag} escaped!`)
                        return;
                    } else if (authorsturn == false) {
                        msg.say(`${user.tag} escaped!`)
                        return;
                    }
                } else if(random > 5) {
                    if (opponentturn == false) {
                        if (opponentturn == false) opponentturn = true;
                        if (authorsturn == true) authorsturn = false;
                        msg.say(`${msg.author.tag} failed his escape attempt!`)
                        continue;
                    } else if (authorsturn == false) {
                        if (opponentturn == true) opponentturn = false;
                        if (authorsturn == false) authorsturn = true;
                        msg.say(`${user.tag} failed his escape attempt!`)
                        continue;
                    }
                }
            }
        }

    }
};


function win(msg, client, winnerhealth, winner, loser) {
    let formula = client.profile.get(loser, "elo")
    let formula2 = Math.floor(formula * 1 / 8)
    if (formula == 1) formula2 = 0
    let embed = new RichEmbed()
    .setTitle(`Battle Won!`)
    .setDescription(`${client.users.get(winner).username} you defeated ${client.users.get(loser).username} with **${winnerhealth}** HP left! Good Game.`)
    .addField(`${client.users.get(winner).username} Elo Change`, `${client.profile.get(winner, "elo")}\n📥\n${client.profile.get(winner, "elo") + formula2}`)
    .addField(`${client.users.get(loser).username} Elo Change`, `${client.profile.get(loser, "elo")}\n📤\n${client.profile.get(loser, "elo") - formula2}`)
    .addField(`${client.users.get(winner).username} Orbs Taken From ${client.users.get(loser).username}`, client.profile.get(loser, "orbs") / 4 + ' 🔮')
    .setColor(0xf71800)
    msg.embed(embed)
    client.profile.math(winner, "+", formula2, "elo")
    client.profile.math(loser, "-", formula2, "elo")
    client.profile.math(winner, "+", client.profile.get(loser, "orbs") / 4, "orbs")
    client.profile.math(loser, "-", client.profile.get(loser, "orbs") / 4, "orbs")
}

function authorattack(msg, client, author, opponent, damage) {
    let embed = new RichEmbed()
    .setDescription(`${client.users.get(author).username} you attack ${client.users.get(opponent).username}! it deals **${damage}** damage`)
    .setColor(0xf71800)
    msg.embed(embed)

}   

function ultimate(msg, client, author) {
    let ultmessage = client.profile.get(author, "character").message
    let embed = new RichEmbed()
    .setDescription(`${client.users.get(author).username} ${ultmessage}`)
    .setColor("RANDOM")
    msg.embed(embed)
}

function ultmiss(msg, client, author) {
    let embed = new RichEmbed()
    .setDescription(`${client.users.get(author).username} used ${client.profile.get(author,"character").ultimate} but it missed!`)
    .setColor("RANDOM")
    msg.embed(embed)
}

function petattack(msg, client, author) {
  let embed = new RichEmbed()
  .setDescription(`${client.users.get(author).username}'s ${client.equip.get(author, "pet")[0].name} attacks which deals ${client.equip.get(author, "pet")[0].damage} damage.`)
  .setColor("RANDOM")
  msg.embed(embed)
}