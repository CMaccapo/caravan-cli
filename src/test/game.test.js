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
  ask() {
    return Promise.resolve(this.inputs[this.index++] || "1");
  }
  askAction() {
    return this.ask();
  }
  printState() {}
  notify(msg) { this.logs.push(msg); }
  close() {}
}

describe("Game - normal and edge behavior", () => {
  test("game plays two turns without crashing", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);

    // inputs: P1 places first card in own slot, P2 tries invalid card index
    const ui = new FakeUI(["0", "0", "999", "0"]);
    const game = new Game([p1, p2], deck, ui);

    await game.takeTurn(); // P1
    await game.takeTurn(); // P2

    // Check P1 slot 0 has a card
    expect(p1.slots[0].length).toBe(1);

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
