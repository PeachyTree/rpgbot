const { RichEmbed } = require('discord.js')
let question1 = require(`../../json/trivias.json`)
let question = question1[Math.floor(Math.random() * question1.length)];
const { Command } = require('discord.js-commando');
const moment = require('moment')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'trivia',
            group: 'commands',
            memberName: 'trivia',
            description: 'Play trivia and earn rewards.',
            examples: ['trivia']
        });
    }

    run(msg) {
              if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')
        let thing = 1;  
        let rewards;
        let random = Math.floor(Math.random() * 1000) + 1;
        if (random >= 1 && random <= 800) rewards = {crate: "Normal Crate", rewards: [ {name:"Skullforge Katana", damage: 34, type: "sword"}, {name:"Peacekeeper Sword", damage: 70, type: "sword"}, {name:"Isolated Greatsword", damage: 44, type: "sword"}, {name: "The Black Blade", damage: 58, type:"sword"}], type: "normal"}
        if (random >= 801 && random <= 900) rewards = {crate: "Uncommon Crate", rewards: [ {name:"Night's Fall", damage: 90, type: "bow"}, {name:"Lich Slicer", damage: 98, type: "sword"}, {name:"Sailor's Gold Warblade", damage: 104, type:"sword"}, {name:"Chain Leggings", damage: 0, health: 175, type:"leggings"}], type:"uncommon"}
        if (random >= 901 && random <= 940) rewards = {crate: "Rare Crate", rewards: [ {name:"Tyrannical Leggings of Storms", damage: 0, health: 240, type:"leggings"}, {name:"Honed Skeletal Boots", damage: 0, health: 165, type:"boots"}, {name:"Tormented Blade", damage: 124, type:"sword"}, {name:"Twilight Silver Swiftblade", damage: 142, type:"sword"}], type:"rare"}
        if (random >= 941 && random <= 980) rewards = {crate:"Very Rare Crate", rewards: [ {name:"Wrathful Mageblade", damage: 198, type:"sword"}, {name:"Pride's Silver Quickblade", damage: 202, type:"sword"}, {name:"Frost Longsword", damage: 178, type:"sword"}, {name:"Helmet of Fire", damage: 4, health: 302, type:"helmet"}], type:"very rare"}
        if (random >= 981 && random <= 1000) rewards = {crate:"Legendary Crate", rewards: [ {name:"Godslayer", damage: 392, type:"sword"}, {name:"Helmet of Demonic Wars", damage: 0, health: 720, type:"helmet"}, {name:"Holy Ivory Helmet", health: 680, type:"helmet"}, {name:"Feral Sword", damage: 323, type:"sword"}, {name:"Chestplate of Unholy Magic", health: 1200, type:"chestplate"}], type:"legendary"}
        console.log(rewards) 
        console.log(random)
        let user = this.client.profile.get(msg.author.id);
        if (user.lastTrivia + 2.16e+7 > Date.now()) return msg.channel.send(`There is a cooldown of ${moment((user.lastTrivia + 43200000) - Date.now()).format("HH:mm:ss")} hours to use this command.`);
        triva (60000, this.client);
        function triva(time, client) {
          
          let embed = new RichEmbed()
              .setTitle(`Trivia`)
              .setDescription(`${question.question}\n${question.answers.map(i => `*${thing++})* **_${i}_**\n`)}`.replace(',', '').replace(',', '').replace(',', '').replace(',', '').replace(',', ''))
              .setFooter(`Please use the numbers, don't use the answer texts. You have 60 seconds to answer.`)
              .setColor("RANDOM")
          
          msg.channel.send(embed).then(m => {
            const filter = m => m.author.id === msg.author.id && !m.author.bot;
            msg.channel.awaitMessages(filter, {
              max: 1,
              time: time,
              error: ['time']
            }).then(response => {
              let answer = response.map(r => r.content)[0].toLowerCase();
              if (isNaN(answer)) return incorrect(msg, question, rewards)
              if (question.answers.indexOf(question.answer) + 1 == answer) {
                // Correct answer
                client.profile.push(msg.author.id, {name: rewards.crate, rewards: rewards.rewards, type: rewards.type }, "items")
                msg.channel.send(
                  new RichEmbed()
                    .setDescription(`You got it right!\nReward: **${rewards.crate}**`)
                    .setColor("RANDOM")
                );
              } else {
                // Incorrect answer
               incorrect(msg, question, rewards)
               return;
              }
            }).catch(err => {console.log(err)
              msg.channel.send(`Time's up! you took too long to answer.`)});
              return;
          });
          client.profile.set(msg.author.id, Date.now(), "lastTrivia")
        }
    }
};

function incorrect(msg, question, rewards) {
   let embed = new RichEmbed()
   .setTitle('Incorrect Answer!')
   .setDescription(`Correct Answer: **${question.answer}**\nReward Lost: **${rewards.crate}**`)
   .setColor("RANDOM")
   msg.embed(embed)
}