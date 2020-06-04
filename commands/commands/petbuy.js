const { Command } = require('discord.js-commando');
const arr = require('../../json/pets')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'petbuy',
            group: "commands",
            aliases: ["buy-pet", "buypet", "pet-buy"],
            memberName: 'petbuy',
            description: 'Buy a pet from the pet shop.',
            examples: ['petbuy'],
            args: [
                {
                    key:"pet",
                    type:"string",
                    prompt:"What's the name of the pet you want to buy? [case sensitive]"
                }
            ]
        });
    }

   async run(msg, { pet }) {

        let data = arr.findIndex(obj => obj.name === pet)
        if (data < 0) return msg.say('I could not find that pet, make sure you entered the name correctly (case sensitive).')

        if (this.client.profile.get(msg.author.id, "orbs") < arr[data].price) return msg.say(arr[data].price + ' orbs required to purchase this pet!')

        msg.say(`Are you sure about buying the pet **${arr[data].name}**?`)
        const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
            max: 1,
            time: 30000,
        })

        if (!msgs.size) return msg.say('You did not respond with yes or no withing 30 seconds. cancelled purchase.')
        if (msgs.first().content !== "yes") return msg.say('Cancelled purchase.')


        this.client.util.math(this.client.user.id, "+", 1, "weaponids")
        msg.say('You purchased the pet **' + arr[data].name + `(${arr[data].type})**!`)
        this.client.profile.math(msg.author.id, "-", arr[data].price, "orbs")
        this.client.profile.push(msg.author.id, { id: this.client.util.get(this.client.user.id, "weaponids"), name: arr[data].name, damage: arr[data].damage, type: arr[data].type, img: arr[data].img, level: arr[data].level, evolution: arr[data].evolution, thing: arr[data].thing }, "pets")
        this.client.util.math(this.client.user.id, "+", 1, "weaponids")

        
    }
};