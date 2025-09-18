const Actions = require("./Actions");
const Placement = require("./Placement");

class Game {
  constructor(players, deck, ui) {
    this.players = players;
    this.deck = deck;
    this.ui = ui;
    this.currentPlayer = players[0];
    this.otherPlayer = players[1];
    this.players[0].opponent = players[1];
    this.players[1].opponent = players[0];
    this.phase = "pregame"; // "pregame" | "main"
  }

  async takeTurn(maxAttempts = 10) {
    const player = this.currentPlayer;
    const opponent = this.otherPlayer;

    this.ui.currentPlayer = player;
    this.ui.currentOpponent = opponent;
    this.ui.printState(this.players, this.deck);

    let success = false;
    let attempts = 0;

    while (!success) {
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error(`[Game.takeTurn] exceeded ${maxAttempts} attempts (likely bad UI inputs)`);
      }

      if (this.phase === "pregame") {
        this.ui.notify(`${player.name}'s pregame turn.`);
        success = await Actions.execute("1",this);
      } else {
        const choice = await this.ui.askAction(player);
        success = await Actions.execute(choice, this);
      }

      if (!success) {
        this.ui.notify("\nInvalid action. Please try again.");
      }
    }

    this.drawIfNeeded(player);
    if (this.pregameIsOver()) {
      this.switchPhase();
    }
    this.switchPlayers();
  }

  switchPlayers(){ 
    this.currentPlayer = this.players.find(player => player !== this.currentPlayer);
    this.otherPlayer = this.players.find(player => player !== this.currentPlayer);
  }

  pregameIsOver(){
    if (this.phase === "pregame" && this.players.every(p => p.hand.cards.length <= 5)) return true;
  }
  switchPhase(){
    this.phase = "main";
    this.ui.notify("Pregame complete! Switching to main phase.");
  }
  drawIfNeeded(player){
    if (player.hand.cards.length < 5 && this.deck.count > 0) {
      player.draw(this.deck);
      this.ui.notify(`${player.name} draws a card.`);
    }
  }

  isOver(){
    if (this.deck.count < 1) return true;

    let flags = [0,0,0];
    this.players.forEach((player, pi) => {
      player.caravans.forEach((caravan, ci) => {
        if (caravan.isSellable()) {
          flags[ci] = 1;
        }
      });
    });
    return flags.every(value => value === 1);
  }
  getWinner() {
    let winners = [];

    for (let ci=0; ci<3; ci++){
      winners.push(this.getCaravanWinner(ci));
    }
    const count0 = winners.filter(p => p === this.players[0]).length;
    const count1 = winners.filter(p => p === this.players[1]).length;

    if (count0 > count1) return this.players[0];
    if (count1 > count0) return this.players[1];

    return null;
  }

  getCaravanWinner(ci) {
    const winner = this.players.find(player => player.caravanIsSelling(ci));
    return winner || null;
  }

}

module.exports = Game;
