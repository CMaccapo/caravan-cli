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
    this.ui.notify(`${player.name}'s pregame turn (must place a card on your own mat in an empty caravan).`);

    const cIdx = parseInt(await this.ui.ask("Choose card index from hand: "), 10);
    const sIdx = parseInt(await this.ui.ask("Choose caravan index (0-2): "), 10);

    if (!player.hand[cIdx]) {
      this.ui.notify("Invalid card index. Try again.");
      return false;
    }

    if (!player.caravans[sIdx]) {
      this.ui.notify("Invalid caravan index. Try again.");
      return false;
    }

    if (!player.caravans[sIdx].isEmpty()) {
      this.ui.notify("caravan is not empty. Choose an empty caravan.");
      return false;
    }

    // Valid placement
    player.caravans[sIdx].addCard(player.hand[cIdx]);
    player.hand.splice(cIdx, 1);
    return true;
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
    let result;

    for (let ci=0; ci<3; ci++){
      winners.push(this.getCaravanWinner(ci));
    }

    const count0 = winners.filter(p => p === this.players[0]).length;
    const count1 = winners.filter(p => p === this.players[1]).length;

    if (count0 > count1) return player[0];
    if (count1 > count0) return player[1];

    return result;
  }

  getSellingCaravans(){
    for (let ci=0; ci<3; ci++){
      console.log("ASSDDDDDDDDAS"+this.getCaravanWinner(ci));
    }
  }
  getCaravanWinner(ci){
    this.players.forEach((player, pi) => {
      if (this.isInCompetition(ci)){
        console.log("CCCCCCCCCCCCCCcc"+player.name);
        return this.resolveCompetition(ci);
      }
      else if (player.caravans[ci].isSellable()) {
        console.log("BBBBBBBBBBBBB"+player.name);
        return player;
      }
    });
    return null;
  }
  isInCompetition(ci) {
    return this.players.every(player => player.caravans[ci].isSellable());
  }
  resolveCompetition(ci) {
    const caravan0 = player[0].caravan[ci];
    const caravan1 = player[1].caravan[ci];

    return caravan0.getPoints() > caravan1.getPoints() ? player[0] : player[1];
  }

}

module.exports = Game;
