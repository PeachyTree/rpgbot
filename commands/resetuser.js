const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resetuser',
            group: 'util',
            memberName: 'resetuser',
            description: 'resetuser',
            ownerOnly: true,
            examples: ['resetuser <user>'],
            args: [
                {
                    type:"user",
                    prompt:"user?",
                    key:"user",
                    default: msg => msg.author
                }
            ]
        });
    }

    run(msg, { user }) {
      this.client.clash.delete(user.id)
      this.client.profile.delete(user.id)
      this.client.equip.delete(user.id)
      this.client.boosters.delete(user.id)
      this.client.adventure.delete(user.id)
        return msg.say('Successfully reset the ' + user);
                       }
};