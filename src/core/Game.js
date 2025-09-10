const Actions = require("./Actions");

class Game {
  constructor(players, deck, ui) {
    this.players = players;
    this.deck = deck;
    this.ui = ui;
    this.current = 0;
  }

  otherPlayerIndex() {
    return (this.current + 1) % this.players.length;
  }

  async takeTurn() {
    let player = this.players[this.current];
    let opponent = this.players[this.otherPlayerIndex()];

    this.ui.printState(this.players, this.deck);

    const choice = await this.ui.askAction(player);
    await Actions.execute(choice, player, opponent, this.deck, this.ui);

    this.current = this.otherPlayerIndex();
  }
}

module.exports = Game;
