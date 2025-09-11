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
    console.log("1) Place card in your field");
    console.log("2) Place card in opponent's field");
    console.log("3) Clear a caravan");
    console.log("4) Discard one card from hand");
    return await this.ask("Choose action: ");
  }

  printState(players, deck) {
    console.log("\n=== GAME STATE ===");
    players.forEach((p) => {
      console.log(`\n${p.name}`);
      console.log("Hand:", p.handToString());
      console.log("Caravans:");
      this.printCaravansGrid(p.caravans);
    });
    console.log(`\nDeck: ${deck.count} cards left`);
    console.log("==================\n");
  }

  // Render caravans as a 3-column grid
  printCaravansGrid(caravans) {
    const caravanLabels = ["[0]", "[1]", "[2]"];

    // First line: caravan headers
    console.log(caravanLabels.map((lbl) => lbl.padEnd(15)).join(""));

    // Get the maximum caravan height (so we can print row by row)
    const maxHeight = Math.max(...caravans.map((s) => s.length));

    for (let row = 0; row < maxHeight; row++) {
      let rowStr = "";
      for (let col = 0; col < 3; col++) {
        let card = caravans[col][row] ? caravans[col][row].toString() : "";
        rowStr += card.padEnd(15);
      }
      console.log(rowStr);
    }

    // If all caravans are empty, still show placeholders
    if (maxHeight === 0) {
      console.log(" ".padEnd(15) + " ".padEnd(15) + " ".padEnd(15));
    }
  }

  notify(message) {
    console.log(message);
  }

  close() {
    this.rl.close();
  }
}

module.exports = ConsoleUI;
