class Game {
  constructor(players, deck, ui) {
    this.players = players;
    this.deck = deck;
    this.ui = ui;
    this.current = 0;
    this.phase = "pregame"; // "pregame" | "main"
  }

  async takeTurn() {
    let player = this.players[this.current];
    let opponent = this.players[(this.current + 1) % this.players.length];

    this.ui.printState(this.players, this.deck);

    if (this.phase === "pregame") {
      await this.pregameTurn(player);
      // After action, check if both players are ready
      if (this.players.every(p => p.hand.length <= 5)) {
        this.phase = "main";
        this.ui.notify("Pregame complete! Switching to main phase.");
      }
    } else {
      const choice = await this.ui.askAction(player);
      await Actions.execute(choice, player, opponent, this.deck, this.ui);
    }

    this.current = (this.current + 1) % this.players.length;
  }

  async pregameTurn(player) {
    this.ui.notify(`${player.name}'s pregame turn (must place a card on your own mat).`);
    const cIdx = parseInt(await this.ui.ask("Choose card index from hand: "), 10);
    const sIdx = parseInt(await this.ui.ask("Choose slot index (0-2): "), 10);

    if (player.hand[cIdx] && player.slots[sIdx]) {
      player.slots[sIdx].push(player.hand[cIdx]);
      player.hand.splice(cIdx, 1);
    } else {
      this.ui.notify("Invalid input. Skipping turn.");
    }
  }
}

module.exports = Game;
