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
  test("game plays two turns without crashing", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);

    // Inputs: action choice, card index, caravan index, repeat for next player
    const ui = new FakeUI([
      "1", "0", "0", // P1: action 1, card 0 -> caravan 0
      "1", "0", "999", // P2: action 1, card 0 -> caravan invalid
    ]);

    const game = new Game([p1, p2], deck, ui);

    await game.takeTurn(); // P1
    await game.takeTurn(); // P2

    // Check P1 caravan 0 has a card
    expect(p1.caravans[0].length).toBe(1);

    // P2's hand should remain same size (invalid input)
    expect(p2.hand.length).toBe(7);
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
