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
    console.log("1) Place card in your slot");
    console.log("2) Place card in opponent's slot");
    console.log("3) Discard all cards from your slot");
    console.log("4) Discard one card from hand");
    return await this.ask("Choose action: ");
  }

  printState(players, deck) {
    console.log("\n=== GAME STATE ===");
    players.forEach((p) => {
      console.log(`\n${p.name}`);
      console.log("Hand:", p.handToString());
      console.log("Slots:");
      this.printSlotsGrid(p.slots);
    });
    console.log(`\nDeck: ${deck.count} cards left`);
    console.log("==================\n");
  }

  // Render slots as a 3-column grid
  printSlotsGrid(slots) {
    const slotLabels = ["[0]", "[1]", "[2]"];

    // First line: slot headers
    console.log(slotLabels.map((lbl) => lbl.padEnd(15)).join(""));

    // Get the maximum slot height (so we can print row by row)
    const maxHeight = Math.max(...slots.map((s) => s.length));

    for (let row = 0; row < maxHeight; row++) {
      let rowStr = "";
      for (let col = 0; col < 3; col++) {
        let card = slots[col][row] ? slots[col][row].toString() : "";
        rowStr += card.padEnd(15);
      }
      console.log(rowStr);
    }

    // If all slots are empty, still show placeholders
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
