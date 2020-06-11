const { Command } = require('discord.js-commando');
const level = require('../../json/mobs5')

module.exports = class ReplyCommand extends Command {
  constructor(client) {
      super(client, {
          name: 'start',
          group: 'commands',
          memberName: 'start',
          description: 'Start your adventure.',
          examples: ['start'],
          args: [
              {
                  type:"string",
                  oneOf: ["mage", "assassin", "knight", "archer", "thief"],
                  key:"character",
                  prompt:"Which class would you like to play as?\nClasses: **Mage**, **Assassin**, **Knight**, **Archer**, **Thief**",
              }
          ]
      });
  }

  run(msg, { character }) {
    if (this.client.profile.get(msg.author.id, "started") != "no") return msg.say('You have already started your adventure.')
    if (character.toLowerCase() == "mage") this.client.profile.set(msg.author.id, { class: "Mage", type:"staff", ultimate:"blink", message:"Blinks behind the opponent and deals 560 damage", damage: 560}, "character")
    if (character.toLowerCase() == "thief") this.client.profile.set(msg.author.id, { class: "Thief", type:"sword", ultimate:"stolen", message:"Uses stolen! sneaks up on the enemy and stabs him in the back! dealing 570 damage", damage: 570}, "character")
    if (character.toLowerCase() == "assassin") this.client.profile.set(msg.author.id, { class: "Assassin", type:"sword", ultimate:"blind", message:"Uses blind! throws smoke bombs at the enemy and comes up behind dealing 530 damage", damage: 530}, "character")
    if (character.toLowerCase() == "knight") this.client.profile.set(msg.author.id, { class:"Knight", type:"sword", ultimate:"torment", message:"Uses Torment! making 8 cuts in each part of the enemies body! dealing 620 damage.", damage: 620 }, "character")
    if (character.toLowerCase() == "archer") this.client.profile.set(msg.author.id, { class:"Archer", type:"bow", ultimate:"rapidfire", message: "Uses Rapid Fire! Fires 200 arrows in 3 seconds dealing 580 damage", damage: 580}, "character")

    let weaponid = this.client.util.get(this.client.user.id, "weaponids")
    this.client.util.math(this.client.user.id, "+", 1, "weaponids")
    let weapon;
    weapon = weaponid + 1;
    msg.channel.send('Successfully started your adventure, you have been given a weapon. Equip it with !equip <itemid>, to get the item id do !inventory')
    if (character.toLowerCase() == "mage") {
        mage(msg, this.client, weaponid, weapon)
    } else if(character.toLowerCase == "archer") {
        archer(msg, this.client, weaponid, weapon)
    } else if(character.toLowerCase() == "knight") {
        knight(msg, this.client, weaponid, weapon)
    } else if(character.toLowerCase() == "assassin") {
        assassin(msg, this.client, weaponid, weapon)
    } else if(character.toLowerCase() == "thief") {
        thief(msg, this.client, weaponid, weapon)
    }
    this.client.util.math(this.client.user.id, "+", 3, "weaponids")
    this.client.profile.set(msg.author.id, "yes", "started")
  }
};


function mage(msg, client, weaponid, weapon) {
    client.profile.push(msg.author.id, { id: weaponid, name:"Dreambender", health: 35, damage: 5, type: "staff"}, "weapons")
    client.profile.push(msg.author.id, { id: weapon, name: "Frozen Shield", health: 200, damage: 0, type: "shield" }, "weapons")
}

function archer(msg, client, weaponid, weapon) {
    client.profile.push(msg.author.id, { id: weaponid, name:"Valkyrie Bow", health: 0, damage: 9, type: "bow"}, "weapons")
    client.profile.push(msg.author.id, { id: weapon, name: "Frozen Shield", health: 200, damage: 0, type: "shield" }, "weapons")
} 

function knight(msg, client, weaponid, weapon) {
    client.profile.push(msg.author.id, { id: weaponid, name:"Grieving Blade", health: 0, damage: 10, type: "sword"}, "weapons")
    client.profile.push(msg.author.id, { id: weapon, name: "Frozen Shield", health: 200, damage: 0, type: "shield" }, "weapons")
}
function thief(msg, client, weaponid, weapon) {
    client.profile.push(msg.author.id, { id: weaponid, name:"Grieving Blade", health: 0, damage: 23, type: "sword"}, "weapons")
    client.profile.push(msg.author.id, { id: weapon, name: "Frozen Shield", health: 120, damage: 0, type: "shield"}, "weapons")
}
function assassin(msg, client, weaponid, weapon) {
    client.profile.push(msg.author.id, { id: weaponid, name:"Grieving Blade", health: 0, damage: 10, type: "sword"}, "weapons")
    client.profile.push(msg.author.id, { id: weapon, name: "Cloak of Faded Worlds", health: 230, damage: 0, type: "shield" }, "weapons")
}