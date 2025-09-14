const Card = require("../models/Card");
const Deck = require("../models/Deck");
const Player = require("../models/Player");
const Game = require("../core/Game");
const Validator = require("../core/Validator");
const Actions = require("../core/Actions");

class SilentUI {
  constructor(inputs = []) {
    this.inputs = inputs;
    this.index = 0;
    this.logs = [];
  }
  async ask() {
    return this.inputs[this.index++];
  }
  async askAction() {
    return this.ask();
  }
  notify(msg) { this.logs.push(msg); }
  printState() {}
  close() {}
}

describe("Game (Static) - Happy", () => {
  test("Pregame numeric card allowed", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    p1.hand = [new Card("5", "♠", "numeric")]; // controlled
    const ui = new SilentUI(["0", "0"]);
    const game = new Game([p1, p2], deck, ui);

    await Actions.execute("1", p1, p2, deck, ui);

    expect(p1.caravans[0].size()).toBe(1);
  });

  test("Caravan win", () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new SilentUI([]);
    const game = new Game([p1, p2], deck, ui);

    p1.caravans[0].addCard(new Card("23", "♠", "numeric"));
    p1.caravans[1].addCard(new Card("21", "♠", "numeric"));
    p1.caravans[2].addCard(new Card("26", "♠", "numeric"));

    expect(game.getWinner()).toBe(p1);
  });
});

describe("Game (Static) - Sad", () => {
  test("Pregame disallows face card", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    p1.hand = [new Card("K", "♠", "special")]; // invalid
    const ui = new SilentUI(["0", "0"]);

    const result = await Actions.execute("1", p1, p2, deck, ui);

    expect(result).toBe(false);
  });

  test("Invalid discard index rejected", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const ui = new SilentUI(["99"]);
    const game = new Game([p1, new Player("P2", deck)], deck, ui);

    const success = await Actions.execute("4", p1, game.players[1], deck, ui);
    expect(success).toBe(false);
    });

});
