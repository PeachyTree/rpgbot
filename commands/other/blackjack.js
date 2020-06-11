// Copyright (©) 2020 Azura Apple. All rights reserved. MIT License.

const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { shuffle, verify } = require('../../util/jack');
const suits = ['♣', '♥', '♦', '♠'];
const faces = ['Jack', 'Queen', 'King'];

module.exports = class BlackjackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'blackjack',
			group: 'other',
			memberName: 'blackjack',
            description: 'Play a game of blackjack.',
            args: [
                {
                    type:"integer",
                    key:"bet",
                    prompt:"How much would you like to bet?"
                }
            ]
		});

		this.decks = new Map();
	}

	async run(msg, { bet }) {

		if (this.client.profile.get(msg.author.id, "started") == "no") return msg.say('You have not started your adventure, use `!start`.')
        if (msg.content.includes('-')) return msg.say('Negative values may not be used.')
        let deckCount = 1
        const money = bet * 2
		if (this.decks.has(msg.channel.id)) return msg.reply('One game per channel, to prevent spam.');
		try {
			this.decks.set(msg.channel.id, this.generateDeck(deckCount));
			const dealerHand = [];
			this.draw(msg.channel, dealerHand);
			this.draw(msg.channel, dealerHand);
			const playerHand = [];
			this.draw(msg.channel, playerHand);
			this.draw(msg.channel, playerHand);
			const dealerInitialTotal = this.calculate(dealerHand);
			const playerInitialTotal = this.calculate(playerHand);
			if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
				this.decks.delete(msg.channel.id);
				return msg.say('Both of you hit 21! Nobody wins.');
			} else if (dealerInitialTotal === 21) {
				this.decks.delete(msg.channel.id);
                msg.say('Dealer hit blackjack right away, good game 🃏\nLost: **' + bet + ' 🔮**');
                this.client.profile.math(msg.author.id, "-", bet, "orbs")
                return;
			} else if (playerInitialTotal === 21) {
				this.decks.delete(msg.channel.id);
                msg.say('You hit blackjack right away, good game 🃏\nWin: **' + money + ' 🔮**');
                this.client.profile.math(msg.author.id, "+", money, "orbs")
                return; 
			}
			let playerTurn = true;
			let win = false;
			let reason;
			while (!win) {
				if (playerTurn) {
					await msg.say(stripIndents`
						**First Dealer Card:** ${dealerHand[0].display}
						**You (${this.calculate(playerHand)}):**
						${playerHand.map(card => card.display).join('\n')}
						_Hit?_
					`);
					const hit = await verify(msg.channel, msg.author);
					if (hit) {
						const card = this.draw(msg.channel, playerHand);
						const total = this.calculate(playerHand);
						if (total > 21) {
							reason = `You drew ${card.display}, total of ${total}! Bust`;
							break;
						} else if (total === 21) {
							reason = `You drew ${card.display} and hit 21`;
							win = true;
						}
					} else {
						const dealerTotal = this.calculate(dealerHand);
						await msg.say(`Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`);
						playerTurn = false;
					}
				} else {
					const inital = this.calculate(dealerHand);
					let card;
					if (inital < 17) card = this.draw(msg.channel, dealerHand);
					const total = this.calculate(dealerHand);
					if (total > 21) {
						reason = `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
						win = true;
					} else if (total >= 17) {
						const playerTotal = this.calculate(playerHand);
						if (total === playerTotal) {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-${total}`;
							break;
						} else if (total > playerTotal) {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-**${total}**`;
							break;
						} else {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}**${playerTotal}**-${total}`;
							win = true;
						}
					} else {
						await msg.say(`Dealer drew ${card.display}, total of ${total}.`);
					}
				}
			}
			this.decks.delete(msg.channel.id);
			if (win) return msg.say(`${reason}! You won!`);
			return msg.say(`${reason}! Too bad.`);
		} catch (err) {
			this.decks.delete(msg.channel.id);
			throw err;
		}
	}

	generateDeck(deckCount) {
		const deck = [];
		for (let i = 0; i < deckCount; i++) {
			for (const suit of suits) {
				deck.push({
					value: 11,
					display: `${suit} Ace`
				});
				for (let j = 2; j <= 10; j++) {
					deck.push({
						value: j,
						display: `${suit} ${j}`
					});
				}
				for (const face of faces) {
					deck.push({
						value: 10,
						display: `${suit} ${face}`
					});
				}
			}
		}
		return shuffle(deck);
	}

	draw(channel, hand) {
		const deck = this.decks.get(channel.id);
		const card = deck[0];
		deck.shift();
		hand.push(card);
		return card;
	}

	calculate(hand) {
		return hand.sort((a, b) => a.value - b.value).reduce((a, b) => {
			let { value } = b;
			if (value === 11 && a + value > 21) value = 1;
			return a + value;
		}, 0);
	}
};