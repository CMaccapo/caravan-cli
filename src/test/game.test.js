const Deck = require("../models/Deck");
const Player = require("../models/Player");
const Game = require("../core/Game");
const Actions = require("../core/Actions");

// fake UI with pre-programmed inputs
class FakeUI {
  constructor(inputs) {
    this.inputs = inputs;
    this.index = 0;
    this.logs = [];
  }

  async ask(_prompt) {
    return this.inputs[this.index++] || "1"; // default to "1" if inputs exhausted
  }

  async askAction(player) {
    return this.ask(`Action for ${player.name}: `);
  }

  printState(players, deck) {
    // do nothing in test
  }

  notify(msg) {
    this.logs.push(msg);
  }

  close() {}
}

describe("Game - normal and edge behavior", () => {
  test("pregame", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);

    const ui = new FakeUI([
      "0", "0", //P1
      "0", "0", //P2
      "1", "1", 
      "1", "1",
      "2", "2", 
      "2", "2",
    ]);

    const game = new Game([p1, p2], deck, ui);

    await game.takeTurn();
    await game.takeTurn();
    await game.takeTurn();
    await game.takeTurn();
    await game.takeTurn();
    await game.takeTurn();

    const players = [p1, p2];

    // Check P1 caravan 0 has a card
    players.forEach(player => {
      player.caravans.slice(0, 3).forEach(caravan => {
        expect(caravan.size()).toBe(1);
      });
    });

    // P2's hand should remain same size (invalid input)
    players.forEach((player, pi) => {
      expect(p1.hand.length).toBe(5);
    });

  });

  test("turn switches correctly", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);

    const ui = new FakeUI(["0", "0", "0", "0"]);
    const game = new Game([p1, p2], deck, ui);

    expect(game.current).toBe(0);
    await game.takeTurn();
    expect(game.current).toBe(1);
    await game.takeTurn();
    expect(game.current).toBe(0);
  });
});
