const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'equipspell',
            group: 'commands',
            memberName: 'equipspell',
            description: 'Equip a spell.',
            examples: ['equipspell'],
            args: [
                {
                    key:"spell",
                    type:"integer",
                    prompt:"Which spell would you like to equip? give me the ID."
                }
            ]
        });
    }

    run(msg, { spell }) {
      let array = this.client.profile.get(msg.author.id, "items")
      let data = array.findIndex(obj => obj.id === spell)
      if (data < 0) return msg.say('I could not find a spell of that ID!')
    if (this.client.equip.get(msg.author.id, "spell")[0] != undefined) {
        this.client.profile.push(msg.author.id, this.client.equip.get(msg.author.id, "spell")[0], "items")
        this.client.equip.delete(msg.author.id, `spell.0`)
    }
      this.client.equip.push(msg.author.id, array[data], "spell")

      this.client.profile.delete(msg.author.id, `items.${data}`)
      msg.say('Successfully equipped spell ' + array[data].name)
    }
  
};