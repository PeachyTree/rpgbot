// Copyright (©) 2020-2021 Shin#0484. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');

module.exports = class EquipPetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'equip-pet',
			group: 'profile',
			memberName: 'equip-pet',
            aliases: ["pet-equip"],
            description: 'Equips the pet you choose.',
            args: [
                {
                    key:"itemid",
                    type:"integer",
                    prompt:"Which pet would you like to equip? (pet id required)"
                }
            ]
		});
	}

	run(msg, { itemid }) {
        
    if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

    let array = this.client.profile.get(msg.author.id, "pets")
    let data = array.findIndex(obj => obj.id === itemid)
    if (!array[data]) return msg.say('I could not find that item of yours, maybe wrong item id?')
    if (this.client.equip.get(msg.author.id, array[data].thing)[0] != undefined) {
        this.client.profile.push(msg.author.id, this.client.equip.get(msg.author.id, "pet")[0], "pets")
        this.client.equip.delete(msg.author.id, `pet.0`)
    }

    msg.say(`Equipped pet ${array[data].name}!`)
    this.client.equip.push(msg.author.id, array[data], "pet")
    this.client.profile.delete(msg.author.id, `pets.${data}`)
   
	}
};