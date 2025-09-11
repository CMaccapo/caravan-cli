const Actions = require("./Actions");

class Game {
  constructor(players, deck, ui) {
    this.players = players;
    this.deck = deck;
    this.ui = ui;
    this.current = 0;
    this.phase = "pregame"; // "pregame" | "main"
  }

  async takeTurn() {
    const player = this.players[this.current];
    const opponent = this.players[(this.current + 1) % this.players.length];

    this.ui.printState(this.players, this.deck);

    let success = false;

    while (!success) {
      if (this.phase === "pregame") {
        success = await this.pregameAction(player);
      } else {
        const choice = await this.ui.askAction(player);
        success = await Actions.execute(choice, player, opponent, this.deck, this.ui);
        if (!success) this.ui.notify("Invalid action. Please try again.");
      }
    }

    // Draw if hand < 5 after a successful action
    if (player.hand.length < 5 && this.deck.count > 0) {
      player.draw(this.deck);
      this.ui.notify(`${player.name} draws a card.`);
    }

    // Check if pregame is over
    if (this.phase === "pregame" && this.players.every(p => p.hand.length <= 5)) {
      this.phase = "main";
      this.ui.notify("Pregame complete! Switching to main phase.");
    }

    this.current = (this.current + 1) % this.players.length;
  }

  async pregameAction(player) {
    this.ui.notify(`${player.name}'s pregame turn (must place a card on your own mat in an empty slot).`);

    const cIdx = parseInt(await this.ui.ask("Choose card index from hand: "), 10);
    const sIdx = parseInt(await this.ui.ask("Choose slot index (0-2): "), 10);

    if (!player.hand[cIdx]) {
      this.ui.notify("Invalid card index. Try again.");
      return false;
    }

    if (!player.slots[sIdx]) {
      this.ui.notify("Invalid slot index. Try again.");
      return false;
    }

    if (player.slots[sIdx].length > 0) {
      this.ui.notify("Slot is not empty. Choose an empty slot.");
      return false;
    }

    // Valid placement
    player.slots[sIdx].push(player.hand[cIdx]);
    player.hand.splice(cIdx, 1);
    return true;
  }
}

module.exports = Game;
