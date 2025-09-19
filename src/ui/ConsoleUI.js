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
    console.log("Hand:", player.hand.toString());
    console.log("1) Place a card");
    console.log("2) Discard one card from hand");
    console.log("3) Clear a caravan");
    const choice = await this.ask("Choose action: ");
    if (!["1", "2", "3"].includes(choice)) return false;
    
    return choice;
  }

  printState(players, deck) { 
    console.log("\n=== GAME STATE ===");
    players.forEach((p) => {
      console.log(`\n${p.name}`);
      console.log(`Caravans:`);
      console.log(p.caravansStr);
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
