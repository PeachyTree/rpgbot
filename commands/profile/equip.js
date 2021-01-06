// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');

module.exports = class EquipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'equip',
			group: 'profile',
			memberName: 'equip',
            description: 'Equips the weapon you choose.',
            args: [
                {
                    key:"itemid",
                    type:"integer",
                    prompt:"Which weapon would you like to equip? (item id required)"
                }
            ]
		});
	}

	run(msg, { itemid }) {
        
    if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

    let array = this.client.profile.get(msg.author.id, "weapons")
    let data = array.findIndex(obj => obj.id === itemid)
    if (!array[data]) return msg.say('I could not find that item of yours, maybe wrong item id?')
    if (this.client.equip.get(msg.author.id, array[data].type)[0] != undefined) return msg.say('You already have a ' + array[data].type + ' type equipped, unequip it before.')
    if (array[data].type == "bow" && this.client.profile.get(msg.author.id, "character").type !== "bow") return msg.say('You need to be **Archer** to equip a bow!') 
    if (array[data].type == "sword" && this.client.profile.get(msg.author.id, "character").type !== "sword") return msg.say('You need to be **Knight, Assassin or Thief** to equip a sword!')
    if (array[data].type == "staff" && this.client.profile.get(msg.author.id, "character").type !== "staff") return msg.say('You need to be **Mage** to equip a bow!') 


    this.client.profile.math(msg.author.id, "+", array[data].damage, "damage")
    this.client.profile.math(msg.author.id, "+", array[data].health, "health")
    this.client.profile.delete(msg.author.id, `weapons.${data}`)
    msg.say(`${array[data].type} equipped! **${array[data].name}**`)
    if (array[data].type === "sword") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "sword")
    if (array[data].type === "boots") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "boots")
    if (array[data].type === "necklace") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "necklace")
    if (array[data].type === "leggings") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "leggings")
    if (array[data].type === "chestplate") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "chestplate")
    if (array[data].type === "helmet") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "helmet")
    if (array[data].type === "bow") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "bow")
    if (array[data].type === "shield") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "shield")
    if (array[data].type === "staff") this.client.equip.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type }, "staff")
   
	}
};