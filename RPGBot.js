require("dotenv").config();
const { RPGBOT_TOKEN, RPGBOT_PREFIX, OWNER_ID }
const { CommandoClient } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const path = require('path');
const Enmap = require('enmap');
const client = new CommandoClient({
    commandPrefix: RPGBOT_PREFIX,
    unknownCommandResponse: false,
    owner: OWNER_ID,
    disableEveryone: true
});

client.equip = new Enmap({name:"equip"})
client.boosters = new Enmap({name:"boosters"})
client.profile = new Enmap({name:"profile"})
client.clash = new Enmap({name:"guild"})
client.util = new Enmap({name:"util"})
client.marketplace = new Enmap({name:"marketplace"})
client.adventure = new Enmap({name:"adventure"})
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['commands', 'test'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({help: false})
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('UP and RUNNING');
    client.user.setActivity('!help');
});
client.on('message', msg => {
  if (msg.author.bot) return;
  client.boosters.ensure(msg.author.id, {
     xp: "disabled",
     xptime: "no",
  })
    client.profile.ensure(`${msg.author.id}`, {
        orbs: 0,
        weapons: [],
        id: msg.author.id,
        items: [],
        level: 1,
        lastCollected: "no",
        pets: [],
        character: "none",
        workers: [],
        levelpoints: 0,
        damage: 0,
        started: "no",
        elo: 100,
        health: 0,
    })
  
  client.equip.ensure(msg.author.id, {
      boots: [],
      necklace: [],
      sword: [],
      bow: [],
      helmet: [],
      shield: [],
      leggings: [],
      staff: [],
      chestplate: [],
      pet: [],
      spell: [],
  })
  client.util.ensure(client.user.id, {
    guildnames: [],
    weaponids: 1,
  })
  
  client.clash.ensure(`${msg.author.id}`, {
            name: "none",
            members: 0,
            id: "none",
            role: 'none',
            deposits: [],
            orbs: 0,
            storage: [],
            memberids: [],
  })
  
      const curLevel = Math.floor(0.1 * Math.sqrt(client.profile.get(`${msg.author.id}`, "levelpoints")));

      if (client.profile.get(`${msg.author.id}`, "level") < curLevel) {
                let money = curLevel * 50 / 0.50
      let embed = new RichEmbed()
      .setAuthor(`🆙`, msg.author.displayAvatarURL)
      .setDescription(`You've leveled up to level **${curLevel}**!\nReward: **${money} 🔮**`)
      .setColor("RANDOM")
     msg.channel.send(embed)
      client.profile.math(msg.author.id, "+", money, "orbs")
      client.profile.set(`${msg.author.id}`, curLevel, "level");
    }

})
client.on('guildCreate', guild => {
  let mems = guild.members.map(mem => mem.id)
    /*for(const data of mems) {
      client.profile.ensure(`${data}`, {
        orbs: 0,
        weapons: [],
        id: data,
        pets: [],
        items: [],
        level: 1,
        character: "none",
        workers: [],
        levelpoints: 0,
        damage: 0,
        health: 0,
        lastTrivia: 0,
        started: "no",
        lastCollected: "no",
    })
      
        client.clash.ensure(`${data}`, {
            name: "none",
            members: 0,
            id: "none",
            role: 'none',
            deposits: [],
            memberids: [],
            orbs: 0,
            storage: []
  })
  */
    //    }
        

})

client.login(RPGBOT_TOKEN);