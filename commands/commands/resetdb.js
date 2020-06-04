const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resetdb',
            group: 'util',
            memberName: 'resetdb',
            description: 'resetdb',
            ownerOnly: true,
            examples: ['resetdb']
        });
    }

    run(msg) {
      this.client.clash.deleteAll()
      this.client.profile.deleteAll()
      this.client.marketplace.deleteAll()
      this.client.util.deleteAll()
      this.client.equip.deleteAll()
      this.client.adventure.deleteAll()
        return msg.say('Successfully reset the db.');
                       }
};