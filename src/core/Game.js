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

  async start() {
    while (!this.isOver()) {
      let valid = false;
      let error = null;

      while (!valid) {
        await this.ui.waitForTurn(this.players, this.deck, this.currentPlayer.name, error);
        const result = await this.takeTurn();
        if (result.success) {
        valid = true;
        error = null;
        } else {
          valid = false;
          error = result.error;
        }
      }

      this.drawIfNeeded(this.currentPlayer);
      if (this.pregameIsOver()) {
        this.switchPhase();
      }
      this.switchPlayers();
    }
  }

  async takeTurn() {
    this.ui.clearScreen();
    this.ui.printState(this.players, this.deck);

    if (this.phase === "pregame") {
      this.ui.notify(`${this.currentPlayer.name}'s pregame turn.`);
      return await Actions.execute("1",this);
    } else {
      const choice = await this.ui.askAction(this.currentPlayer);
      return await Actions.execute(choice, this);
    }
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

    return (this.getWinner() !== null);
  }

  getWinner() {
    let winners = [];

    for (let ci=0; ci<3; ci++){
      const winner = this.getCaravanWinner(ci);
      if (!winner) return null;
      winners.push(winner);
    }


    if (winners.filter(p => p === this.players[0]).length >= 2) return this.players[0];
    if (winners.filter(p => p === this.players[1]).length >= 2) return this.players[1];

    return null;
  }

  getCaravanWinner(ci) {
    const winner = this.players.find(player => player.caravanIsSelling(ci));
    return winner || null;
  }

}

module.exports = Game;
