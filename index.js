const Card = require("./src/models/Card");
const Deck = require("./src/models/Deck");
const Player = require("./src/models/Player");

const Game = require("./src/core/Game");
const ConsoleUI = require("./src/ui/ConsoleUI");

async function main() {
  const deck = new Deck();
  const ui = new ConsoleUI();

  const players = [
    new Player("Player 1", deck),
    new Player("Player 2", deck),
  ];

  const game = new Game(players, deck, ui);

  while (!game.isOver()) {
    await game.takeTurn();
    game.getSellingCaravans();
  }
  ui.notify("Winner: ${game.getWinner()}");
  ui.notify("Game over!");
  ui.close();
}

main();
