const { Command } = require('discord.js-commando');
const moment = require('moment')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'use',
            group: 'commands',
            memberName: 'use',
            description: 'Use boosters which gives you extra stuff.',
            examples: ['use'],
            args: [
                {
                    key:"item",
                    oneOf: ["xp booster"],
                    type:"string",
                    prompt:"Which booster would you like to use?"
                }
            ]
        });
    }

   async run(msg, { item }) {

        let arr = this.client.profile.get(msg.author.id, "items")

        let data = arr.findIndex(i => i.name === item.toLowerCase())
        
      

        console.log(arr[data])
        
        if (data < 0) return msg.say('You do not own that kind of booster.')

        if (arr[data].mark !== "booster") return msg.say('That is not a booster!') 

        if (this.client.boosters.get(msg.author.id, arr[data].type) !== "disabled") return msg.say('You already have an ' + arr[data].type + ' booster enabled.')
        msg.say('`' + msg.author.tag + '`' + `, Are you sure about using \`` + arr[data].name + '`?')
        const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
           time: 60000,
           max: 1,
        })

        
        if (msgs.first().content !== "yes") msg.say(`Cancelled usage.`)

        msg.say(`Successfully used an ${arr[data].type} booster! will stay on for 30 minutes.`)

        this.client.profile.delete(msg.author.id, `items.${data}`)
        this.client.boosters.set(msg.author.id, "enabled", arr[data].type)
        this.client.boosters.set(msg.author.id, Date.now(), arr[data].type + 'time')


        
        setTimeout(() => {
            msg.author.send('Your ' + arr[data].type + ' booster has ran out!' )
            this.client.boosters.set(msg.author.id, "disabled", arr[data].type)
            this.client.boosters.set(msg.author.id, "no", arr[data].type + 'time')
        }, 1800000);
    }
};
