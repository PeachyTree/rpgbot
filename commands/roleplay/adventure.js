// Copyright (©) 2020 Azura Apple. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

const level5 = require('../../json/weapon5')
const mobs5 = require('../../json/mobs5')
const level10 = require('../../json/weapon10')
const mobs10 = require('../../json/mobs10')
const level16 = require('../../json/weapon16')
const mobs16 = require('../../json/mobs16')

module.exports = class AdventureCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'adventure',
            group: 'roleplay',
            memberName: 'adventure',
            description: 'Go on an adventure, earn money, shards & weapons.',
            examples: ['adventure'],
            throttling: {
              usages: 1,
              duration: 3,
            }
        });
    }

    run(msg) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        this.client.adventure.ensure(msg.author.id, {
            stage: 1
        })

        let damage = this.client.profile.get(msg.author.id, "damage")
        let health = this.client.profile.get(msg.author.id, "health")
        if (this.client.adventure.get(msg.author.id, "stage") >= 1 && this.client.adventure.get(msg.author.id, "stage") <= 4) { 
            const item = level5[Math.floor(Math.random() * level5.length)];
            const mob = mobs5[Math.floor(Math.random() * mobs5.length)];
            
            let mobhealth = mob.health
            let mobdmg = mob.damage
            while (health > 1) {
                  mobhealth = mobhealth - damage
                  health = health - mobdmg
                  if (mobhealth < 1) {
                      let random = Math.floor(Math.random() * 10)
                     if (random < 8) return noitem(msg, mob, this.client)
                     stage(msg, item, this.client, mob)
                    return;
                  } else if (health < 1) {
                      lost(msg, mobhealth, item, this.client, mob)
                    return;
                  }
            } 
        } else if(this.client.adventure.get(msg.author.id, "stage") >= 5 && this.client.adventure.get(msg.author.id, "stage") <= 15) {
            const item = level10[Math.floor(Math.random() * level10.length)];
            const mob = mobs10[Math.floor(Math.random() * mobs10.length)];
            
            let mobhealth = mob.health
            let mobdmg = mob.damage
            while (health > 1) {
                  mobhealth = mobhealth - damage
                  health = health - mobdmg
                  if (mobhealth < 1) {
                     let random = Math.floor(Math.random() * 10)
                     if (random < 8) return noitem(msg, mob, this.client)
                     stage(msg, item, this.client, mob)
                    return;
                  } else if (health < 1) {
                      lost(msg, mobhealth, item, this.client, mob)
                    return;
                  }
            } 
        } else if(this.client.adventure.get(msg.author.id, "stage") >= 16 && this.client.adventure.get(msg.author.id, "stage") <= 30) {
            const item = level16[Math.floor(Math.random() * level16.length)];
            const mob = mobs16[Math.floor(Math.random() * mobs16.length)];
            
            let mobhealth = mob.health
            let mobdmg = mob.damage
            while (health > 1) {
                mobhealth = mobhealth - damage
                health = health - mobdmg
                if (mobhealth < 1) {
                    let random = Math.floor(Math.random() * 10)
                    if (random < 8) return noitem(msg, mob, this.client)
                    stage(msg, item, this.client, mob)
                  return;
                } else if (health < 1) {
                    lost(msg, mobhealth, item, this.client, mob)
                  return;
                }
            } 
        }
    }
};

function stage(msg, weapon, client, mob) {
  if(client.boosters.get(msg.author.id, "xp") === "enabled") mob.xp = mob.xp * 2
  if (weapon.health === undefined) weapon.health = 0;
  if (weapon.damage === undefined) weapon.damage = 0;

  let embed = new RichEmbed()
    .setTitle('Adventure Win!')
    .setDescription(`Congratulations! you passed the stage **${client.adventure.get(msg.author.id, "stage")}** by killing ${mob.name}!`)
    .addField('Item Won 💎', '**' + weapon.name + '**, check it out with !inventory')
    .addField('Orbs Won 🔮', '**' + mob.orbs + '**')
    .addField('XP Won 🎆', '**' + mob.xp + '**')
    .setColor("RANDOM")
  msg.embed(embed)

  let weaponid = client.util.get(client.user.id, "weaponids")
  client.profile.push(msg.author.id, { id: weaponid + 1, name: weapon.name, health: weapon.health, damage: weapon.damage, type: weapon.type }, "weapons")
  client.util.inc(client.user.id, "weaponids")
  client.adventure.math(msg.author.id, "+", 1, "stage")
  client.profile.math(msg.author.id, "+", mob.orbs, "orbs")
  client.profile.math(msg.author.id, "+", mob.xp, "levelpoints")
}


function lost(msg, health, weapon, client, mob) {
   client.adventure.get(msg.author.id, "stage") == 1 ? '' : client.adventure.math(msg.author.id, "-", 1, "stage");
    let embed = new RichEmbed() 
      .setTitle('Adventure Lost!')
      .setDescription(`Unfortunately you lost the battle to ${mob.name}, it had \`${health}\` health left! you've ranked down to stage **${client.adventure.get(msg.author.id, "stage") - 1}**`)
      .addField('Item Lost ❌', '**' + weapon.name + '**')
      .setColor("RANDOM")
    msg.embed(embed)
}

function noitem(msg, mob, client) {
    if(client.boosters.get(msg.author.id, "xp") === "enabled") mob.xp = mob.xp * 2
    let embed = new RichEmbed()
    .setTitle('Adventure Win!')
    .setDescription(`Congratulations! you passed the stage **${client.adventure.get(msg.author.id, "stage")}** by killing ${mob.name}!`)
    .addField('Item Won 💎', 'Nothing!')
    .addField('Orbs Won 🔮', '**' + mob.orbs + '**')
    .addField('XP Won 🎆', '**' + mob.xp + '**')
    .setColor("RANDOM")
    msg.embed(embed)
    client.profile.math(msg.author.id, "+", mob.orbs, "orbs")
    client.profile.math(msg.author.id, "+", mob.xp, "levelpoints")
    client.adventure.math(msg.author.id, "+", 1, "stage")
}