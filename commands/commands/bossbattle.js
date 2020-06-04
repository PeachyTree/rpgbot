const { Command } = require('discord.js-commando');
const bosses = require('../../json/bosses')
const { RichEmbed } = require('discord.js')
module.exports = class BossBattle extends Command {
    constructor(client) {
        super(client, {
            name: 'bossbattle',
            group: 'commands',
            memberName: 'bossbattle',
            description: 'Battle the bosses.',
            examples: ['bossbattle'],
            args: [
              {
                key:"boss",
                prompt:"Which boss would you like to challenge?",
                type:"string"
              }
            ]
        });
        this.battle = new Set()
    }

  async run(msg, { boss }) {
            if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')
        if (this.battle.has(msg.channel.id)) return msg.say('Only one battle may occur per channel! to prevent spam.')
       this.battle.add(msg.channel.id)

        let mob = bosses.find(obj => obj.name === boss.toLowerCase()) 
        if (!mob) return msg.say('I could not find that boss! check which ones exist with `!bosses`')
        if (this.client.profile.get(msg.author.id, "level") < mob.level) return msg.say('To battle this boss you have to be level  ')
        let bossattack = mob.attacks[Math.floor(Math.random() * mob.attacks.length)]
        let mobhealth = mob.health; // mob health

        let myhealth = this.client.profile.get(msg.author.id, "health"); // users health
        let mydmg = this.client.profile.get(msg.author.id, "damage")
                

        while(myhealth > 1) {
          let random3 = Math.floor(Math.random() * 10)
          if (random3 < 7) {
            console.log(myhealth)
            attack(msg, mob, bossattack.attack, bossattack.damage)
            myhealth -= bossattack.damage 
          } else if(random3 == 7) {
            heavy(msg, mob, mob.heavy[0].attack, mob.heavy[0].damage)
            myhealth -= mob.heavy[0].damage
          } else if(random3 > 7) {
            miss(msg, mob, bossattack.attack)
          }
         // msg.channel.send({embed: {
          //  color: 0xf71800,
          //  description: `${mob.name} used \`${bossattack.attack}\`! it hit you with `
         // }})
          
          if (myhealth < 1) {
                lost(msg, mob, mobhealth)
                this.battle.delete(msg.channel.id)
                return;
          } else if(mobhealth < 1) {
              win(msg, mob, mob.xp, mob.orbs, this.client)
              this.battle.delete(msg.channel.id)
              return;
          }
            msg.channel.send({embed: {
                color: 0xf71800,
                description: `What do you choose to do? either [attack, heal, run, heavy]\nYour Health: **${myhealth} HP** ‍  ‍  ‍ Mob Health: **${mobhealth}**`
              }})
          
            const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
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
            if (msgs.first().content == "attack") {
                let random = Math.floor(Math.random() * 6)
                if (random < 3) { 
                 msg.channel.send({embed: {
                    color: 0xf71800,
                    description: `Attacked ${mob.name} but the attack has missed!`
                  }})
                continue;
                } else if(random > 3) {           
                   msg.channel.send({embed: {
                    color: 0xf71800,
                    description: `Attacked ${mob.name}, dealing ${mydmg} damage!`
                  }})
                   mobhealth -= mydmg
                  continue;
                }
            } else if(msgs.first().content == "run") {
                   run(msg)
                   this.battle.delete(msg.channel.id)
                   return;
            } else if(msgs.first().content == "heal") {
              let arr = this.client.profile.get(msg.author.id, "items")
              let potion = arr.findIndex(obj => obj.name == "Health Potion")
              if (!arr[potion]) {
                msg.say('You do not have any health potions!')
                continue;
              }
              msg.say(`Applied ${arr[potion].type} health potion! +${arr[potion].health} health.`)
              myhealth += arr[potion].health
              this.client.profile.delete(msg.author.id, `items.${potion}`)
              continue;
            } else if(msgs.first().content == "heavy") {
              let randomfirst = Math.floor(Math.random() * 5) + 1;
              let randomize = Math.floor(Math.random(randomfirst) * this.client.profile.get(msg.author.id, "damage"))

              console.log(randomize)
              let ifhit = Math.floor(Math.random() * 6) + 1
              if (ifhit < 4) {
                usermiss(msg, mob.name)
                continue;
              } else if(ifhit > 4) {
                userheavy(msg, mob.name, randomize)
                mobhealth -= randomize
                continue;
              }
            }

        }
    }
};


function win(msg, boss, xp, orbs, client) {
  let embed = new RichEmbed()
  .setTitle(`${boss.name} was defeated!`)
  .addField(`Orbs Won 🔮`, '**' + orbs + '**')
  .addField('XP Won 🎆', '**' + xp + '**')
  .addField('Weapon Won 💠', boss.weapon)
  .setColor("RANDOM")
  msg.embed(embed)
  let weaponid = client.util.get(client.user.id, "weaponids")
  client.profile.push(msg.author.id, { id: weaponid + 1, name: boss.weapon, health: 0, damage: boss.damage, type: boss.type }, "weapons")
  client.util.inc(client.user.id, "weaponids")
  client.profile.math(msg.author.id, "+", xp, "orbs")
  client.profile.math(msg.author.id, "+", orbs, "levelpoints")
}

function run(msg) {
msg.channel.send('You ran from the battle!')
}

function attack(msg, boss, attack, dmg) {
  msg.channel.send({embed: {
    color: 0xf71800,
    description: `${boss.name} used \`${attack}\`! it dealt **${dmg}**.`
  }})
}
function userheavy(msg, boss, dmg) {
  msg.channel.send({embed: {
    color: 0xf71800,
    description: `You hit ${boss} with a heavy! it deals **${dmg}** damage!`
  }})
}
function heavy(msg, boss, heavy, dmg) {
  msg.channel.send({embed: {
    color: 0xf71800,
    description: `${boss.name} hits you with \`${heavy}[heavy]\`! it dealt **${dmg}**`
  }})
}

function miss(msg, boss, attack) {
  msg.channel.send({embed: {
    color: 0xf71800,
    description: `${boss.name} hits you with \`${attack}\`! but it missed. `
  }})
}

function usermiss(msg, boss) {
  msg.channel.send({embed: {
    color: 0xf71800,
    description: `You used your heavy attack against ${boss}! but it missed. `
  }})
}

function lost(msg, boss, health) {
   let embed = new RichEmbed() 
   .setTitle('Boss Battle Lost!')
   .setDescription(`You lost the boss battle to ${boss.name} with **${health}** HP left, level up and earn more weapons to beat it and try again later.`)
   .setColor("RANDOM")
   msg.embed(embed)
}