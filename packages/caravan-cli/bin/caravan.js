#!/usr/bin/env node
const { Card, Deck, Player, Game } = require("caravan-core");
const ConsoleUI = require("../src/ui/ConsoleUI");

async function main() {
  const deck = new Deck();
  const ui = new ConsoleUI();

  const players = [
    new Player("Player 1", deck),
    new Player("Player 2", deck),
  ];

  ui.clearScreen();

  const game = new Game(players, deck, ui);

  await game.start();
  
  ui.notify(`Winner: ${game.getWinner().name}`);
  ui.notify("Game over!");
  ui.close();
}

main();
