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

  async waitForTurn(players, deck, name, errorMessage = null) {
    this.clearScreen();
    this.printState(players, deck);
    if (errorMessage) this.notify(errorMessage);
    await this.ask(`${name}, press ENTER to start your turn...`);
  
  }

  clearScreen() {
    if (process.platform === "win32") {
      try {
        execSync("cls", { stdio: "inherit" });
      } catch {
        console.clear(); 
      }
    } else {
      process.stdout.write("\x1B[2J\x1B[3J\x1B[H");
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
