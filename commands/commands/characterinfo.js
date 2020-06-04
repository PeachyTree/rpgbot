const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js')
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'characterinfo',
            group: 'commands',
            memberName: 'characterinfo',
            description: 'Checks the info about a [GOD] || [TITAN] || [HALF-GOD].',
            examples: ['characterinfo'],
            args: [
                {
                    type:"string",
                    key:"god",
                    prompt:"Which Titan/God/HalfGod do you want get the info about?"
                }
            ]
        });
    }

    run(msg, { god }) {
        if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')

        let array = [{ name: "kronos", type: "titan", description: "(Cronus) The King of the Titanes, and the god of destructive time. He led his brothers in the castration of Ouranos (Uranus), and was himself deposed by Zeus. Kronos was cast into the pit of Tartaros after his defeat. Some say he was later released by Zeus and made King of Islands of the Blessed (home of the blessed dead).", level: 500}, { name: "hyperion", type: "titan", description: "Hyperion is Titan god of light and the cycles of day and night, sun and moon. He was cast into Tartaros by the gods at the end of the Titan-War.", level: 450}, 
        { name: "iapetos", type: "titan", description: "IAPETOS (Iapetus) The Titan god of mortality and life-span. He was cast into Tartaros at the end of the Titan-War along with his brothers.", level: 400}, { name: "koios", type: "titan", description: "KOIOS (Coeus) The Titan god of intelligence and the axis of heaven He is also known as Polos. Koios is one of the Titanes cast into Tartaros at the end of the Titan-War. He is sometimes described as a leader of the Gigantes (Giants).", level: 350}, { name: "krios", type: "titan", description: "KRIOS (Crius) The Titan god of the heavenly constellations, also known as Megamedes. He was cast into Tartaros at the end of the Titan-War. Krios was sometimes called a leader of the Gigantes (Giants).", level: 300}, 
        { name: "mylinos", type: "titan", description: "MYLINOS (Mylinus) A Gigante (Giant) or Titan of the island of Krete (Crete), destroyed by Zeus. He was probably identified with Olympos or Kronos.", level: 250}, { name: "okeanos", type: "titan", description: "OKEANOS (Oceanus) The Titan god of the earth-encircling river Okeanos, the place of rising and setting of the heavenly bodies. He is the only one of the Titanes not to participate in the castration of Ouranos (Uranus), and in the Titan-Wars remained neutral.", level: 200 }, 
        { name: "olymbros", type: "titan", description: "OLYMBROS (Olymbrus) An alternative name for one of the Titanes. He is the same as Olympos the Kretan (Cretan) mentor of Zeus.", level: 150}, { name: "ophion", type: "titan", description: "OPHION The eldest of the Titanes who was wrestled by Kronos (Cronus) for the throne of heaven and cast into the Ocean-stream. He is identified with both Ouranos (Uranus) and Okeanos (Oceanus).", level: 100}, 
        { name: "zeus", type: "god", description: "The most powerful of all, Zeus is god of the sky and the king of Olympus. His temper affects the weather, and he throws thunderbolts when he is unhappy. He is married to Hera but had many other lovers. His symbols include the oak and the thunderbolt.", level: 400}, { name: "poseidon", type: "god", description: "Poseidon is god of the sea. He is the most powerful god except for his brother, Zeus. He lives in a beautiful palace under the sea and caused earthquakes when he is in a temper. His symbols include the horse and the trident (a three-pronged pitchfork).", level: 350}, { name: "hades", type: "god", description: "Hades is king of the dead. He lives in the underworld, the heavily guarded land where he rules over the dead. He is the brother of Zeus and the husband of Persephone, Demeter’s daughter, whom he kidnapped.", level: 300}, 
        { name: "hera", type: "god", description: "Hera is the goddess of marriage and the queen of Olympus. She is Zeus's wife and sister; Her symbols include the peacock and the cow.", level: 275}, { name: "aphrodite", type: "god", description: "Aphrodite is the goddess of love and beauty, and the protector of sailors. She may have been the daughter of Zeus and the Titan Dione, or she may have risen from the sea on a shell. Her symbols include the myrtle tree and the dove.", level: 250}, { name: "apollo", type: "god", description: "Apollo is the god of music and healing. He is also an archer, and hunts with a silver bow. Apollo is the son of Zeus and the Titan Leto, and the twin of Artemis. His symbols include the laurel tree, the crow, and the dolphin.", level: 225}, 
        { name: "ares", type: "god", description: "Ares is the god of war. He is both cruel and a coward. Ares is the son of Zeus and Hera, but neither of his parents liked him. His symbols include the vulture and the dog, and he often carries a bloody spear.", level: 200}, { name: "artemis", type: "god", description: "Artemis is the goddess of the hunt and the protector of women in childbirth. She hunts with silver arrows and loved all wild animals. Artemis is the daughter of Zeus and Leto, and the twin of Apollo. Her symbols include the cypress tree and the deer.", level: 175}, { name: "athena", type: "god", description: "Athena is the goddess of wisdom. She is also skilled in the art of war, and helped heroes such as Odysseus and Hercules. Athena sprang full-grown from the forehead of Zeus, and became his favorite child. Her symbols include the owl and the olive tree.", level: 150}]

        let data = array.find(info => info.name === god.toLowerCase())
        if (!data) return msg.say('That God, Titan or halfgod does not exist.')
        let embed = new RichEmbed()
        .setTitle(`${data.name} | Info`)
        .addField('Description 📜', data.description)
        .addField('Type', data.type.toUpperCase())
        .addField('Unlocked at level', data.level)
        .setColor("RANDOM")
        msg.embed(embed)
    }
};