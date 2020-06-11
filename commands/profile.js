const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'commands',
            memberName: 'profile',
            aliases: ["p", "prof"],
            description: 'profile',
            examples: ['profile [user]'],
            args: [
                {
                    type:"user",
                    key:"user",
                    prompt:"Which user would you like to get the profile of?",
                    default: msg => msg.author
                }
            ]
        });
    }

    run(msg, { user }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let boots = this.client.equip.get(user.id, "boots").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let leggings = this.client.equip.get(user.id, "leggings").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let chestplate = this.client.equip.get(user.id, "chestplate").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let helmet = this.client.equip.get(user.id, "helmet").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let sword = this.client.equip.get(user.id, "sword").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let bow = this.client.equip.get(user.id, "bow").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let shield = this.client.equip.get(user.id, "shield").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let staff = this.client.equip.get(user.id, "staff").map(i => `${i.name} => Damage: ${i.damage} => Health: ${i.health} => ID: ${i.id}`)
        let spell = this.client.equip.get(user.id, "spell").map(i => `${i.name}\nDescription: ${i.description}\nDamage: ${i.damage == undefined ? 0 : i.damage} / ${i.health == undefined ? 0 : i.health} health.`)
        let pet = this.client.equip.get(user.id, "pet").map(i => `${i.name}\nDamage: ${i.damage}\nType: ${i.type}\nPreview: [here](${i.img})\nid: ${i.id}`)
        if (pet.length === 0) pet = 'None';
        if (spell.length === 0) spell = 'None';
        if (boots.length === 0) boots = 'None'
        if (leggings.length === 0) leggings = 'None'
        if (chestplate.length === 0) chestplate = 'None'
        if (helmet.length === 0) helmet = 'None'
        if (bow.length === 0) bow = 'None';
        if (sword.length === 0) sword = "None";
        if(shield.length === 0) shield = 'None';
        if (staff.length === 0) staff = 'None';
      
      
        let embed = new RichEmbed()
        .setTitle(`${user.tag}'s profile (${this.client.profile.get(user.id, "character").class})`)
        .addField('Helmet ⛑', helmet,true)
        .addField('Chestplate 🎽', chestplate,true)
        .addField('Leggings 👖', leggings,true)
        .addField('Boots 👟', boots,true)
        .addField('Level', this.client.profile.get(`${user.id}`, "level"),true)
        .addField('Sword ⚔', sword,true)
        .addField('Spell', spell)
        .addField('Bow 🏹', bow,true)
        .addField('Shield 🛡', shield,true)
        .addField('Pet', pet, true)
        .addField('Staff 🕎', staff,true)
        .addField('Orbs 🔮', this.client.profile.get(user.id, "orbs"), true)
        .addField(`Damage 🎯`, this.client.profile.get(user.id, "damage"),true)
        .addField('Health 🌡', this.client.profile.get(user.id, "health"),true)
        .setColor("RANDOM");
        msg.embed(embed)

    }
};