const { Command } = require('discord.js-commando');
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unequip',
			group: 'commands',
			memberName: 'unequip',
            description: 'Unequips the weapon you choose.',
            args: [
              {
                key:"weapon",
                type:"string",
                prompt:"Which weapon class is it? sword / leggings etc.",
              },
                {
                    key:"itemid",
                    type:"integer",
                    prompt:"Which weapon would you like to unequip? (item id required)"
                }
            ]
		});
	}

	run(msg, { itemid, weapon }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

    let array = this.client.equip.get(msg.author.id, weapon.toLowerCase())
    if (array === undefined) return msg.say('I could not find that weapon class!')
    
    let data = array.findIndex(obj => obj.id === itemid)
    
    if (!array[data]) return msg.say('I could not find that item of yours, maybe wrong item id?')
    msg.say(`${array[data].type} unequipped! **${array[data].name}**`)
    this.client.profile.push(msg.author.id, { id: array[data].id, name: array[data].name, damage: array[data].damage, health: array[data].health, type: array[data].type } , "weapons")

    if (array[data].type === "sword") {
    this.client.profile.math(msg.author.id, "-", array[data].damage, "damage")
        this.client.equip.delete(msg.author.id, `${array[data].type}.${data}`)
    this.client.profile.math(msg.author.id, "-", array[data].health, "health")
        return;
    } 
    if (array[data].type === "necklace") {
                this.client.profile.math(msg.author.id, "-", array[data].damage, "damage")
        this.client.equip.delete(msg.author.id, `${array[data].type}.${data}`)

      this.client.profile.math(msg.author.id, "-", array[data].health, "health")
        return;
    } 
    if (array[data].type === "leggings") {
                this.client.profile.math(msg.author.id, "-", array[data].damage, "damage")

        this.client.equip.delete(msg.author.id, `${array[data].type}.${data}`)
    this.client.profile.math(msg.author.id, "-", array[data].health, "health")
        return;
    } 
    if (array[data].type === "chestplate") {
                this.client.profile.math(msg.author.id, "-", array[data].damage, "damage")

        this.client.equip.delete(msg.author.id, `${array[data].type}.${data}`)
    this.client.profile.math(msg.author.id, "-", array[data].health, "health")
        return;
    } 
    if (array[data].type === "helmet") {
                this.client.profile.math(msg.author.id, "-", array[data].damage, "damage")
        this.client.equip.delete(msg.author.id, `${array[data].type}.${data}`)
    this.client.profile.math(msg.author.id, "-", array[data].health, "health")
        return;
    }  
    if (array[data].type === "boots") {
                this.client.profile.math(msg.author.id, "-", array[data].damage, "damage")
        this.client.equip.delete(msg.author.id, `${array[data].type}.${data}`)
    this.client.profile.math(msg.author.id, "-", array[data].health, "health")
        return;
    } 
    if (array[data].type === "shield") {
          this.client.profile.math(msg.author.id, "-", array[data].damage, "damage")
          this.client.profile.math(msg.author.id, "-", array[data].health, "health")
        this.client.equip.delete(msg.author.id, `${array[data].type}.${data}`)
        return;
    } 

   
	}
};