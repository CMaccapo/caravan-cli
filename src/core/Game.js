const Actions = require("./Actions");
const Placement = require("./Placement");
const playField = require("../models/PlayField");

class Game {
  constructor(players, deck, ui) {
    this.players = players;
    this.playField = new playField(players);
    this.deck = deck;
    this.ui = ui;
    this.current = 0;
    this.phase = "pregame"; // "pregame" | "main"
  }

  async takeTurn(maxAttempts = 10) {
    const player = this.players[this.current];
    const opponent = this.players[(this.current + 1) % this.players.length];

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
        success = await Actions.execute("1", player, opponent, this.deck, this.ui, this.phase);
      } else {
        const choice = await this.ui.askAction(player);
        success = await Actions.execute(choice, player, opponent, this.deck, this.ui, this.phase, this.playField);
      }

      if (!success) {
        this.ui.notify("Invalid action. Please try again.");
      }
    }

    this.drawIfNeeded(player);
    if (this.pregameIsOver()) {
      this.switchPhase();
    }
    this.current = (this.current + 1) % this.players.length;
  }

  pregameIsOver(){
    if (this.phase === "pregame" && this.players.every(p => p.hand.length <= 5)) return true;
  }
  switchPhase(){
    this.phase = "main";
    this.ui.notify("Pregame complete! Switching to main phase.");
  }
  drawIfNeeded(player){
    if (player.hand.length < 5 && this.deck.count > 0) {
      player.draw(this.deck);
      this.ui.notify(`${player.name} draws a card.`);
    }
  }

  isOver(){
    if (this.deck.count < 1) {
      return true;
    }

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
    const player0 = this.players[0];
    const player1 = this.players[1];

    for (let ci=0; ci<3; ci++){
      winners.push(this.getCaravanWinner(ci));
    }
  
    const count0 = winners.filter(p => p === player0).length;
    const count1 = winners.filter(p => p === player1).length;

    if (count0 > count1) {
      return player0;
    }
    if (count1 > count0) {
      return player1;
    }

    return null;
  }

  getCaravanWinner(ci){
    let result = null;
    this.players.forEach((player, pi) => {
      if (this.isInCompetition(ci)){
        result = this.resolveCompetition(ci);
      }
      else if (player.caravans[ci].isSellable()) {
        result = player;
      }
    });
    return result;
  }
  isInCompetition(ci) {
    return this.players.every(player => player.caravans[ci].isSellable());
  }
  resolveCompetition(ci) {
    const player0 = this.players[0];
    const player1 = this.players[1];
    const caravan0 = player0.caravans[ci];
    const caravan1 = player1.caravans[ci];

    if (caravan0.getPoints() > caravan1.getPoints()){
      return player0;
    }
    else if (caravan1.getPoints() > caravan0.getPoints()){
      return player1;
    }

    return null;
  }

}

module.exports = Game;
