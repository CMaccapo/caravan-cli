const readline = require("readline");

class ConsoleUI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  ask(question) {
    return new Promise((resolve) =>
      this.rl.question(question, (ans) => resolve(ans.trim()))
    );
  }

  async askAction(player) {
    console.log(`${player.name}'s turn.`);
    console.log("1) Place a card");
    console.log("2) Discard one card from hand");
    console.log("3) Clear a caravan");
    return await this.ask("Choose action: ");
  }

  printState(players, deck) { 
    console.log("\n=== GAME STATE ===");
    players.forEach((p) => {
      console.log(`\n${p.name}`);
      console.log("Hand:", p.handToString());
      console.log(`${p.name}'s caravans:`);
      p.caravans.forEach((caravan, index) => {
        console.log(`  Caravan ${index}: [${caravan.toString()}]`);
      });
    });
    console.log(`\nDeck: ${deck.count} cards left`);
    console.log("==================\n");
  }


  notify(message) {
    console.log(message);
  }

  close() {
    this.rl.close();
  }
}

module.exports = ConsoleUI;
