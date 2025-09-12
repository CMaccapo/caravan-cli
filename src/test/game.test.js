const Card = require("../models/Card");
const Deck = require("../models/Deck");
const Player = require("../models/Player");
const Game = require("../core/Game");
const Actions = require("../core/Actions");

// fake UI with pre-programmed inputs
class FakeUI {
  constructor(inputs = []) {
    this.inputs = inputs;
    this.index = 0;
    this.logs = [];
  }

  pushInputs(newInputs) {
    this.inputs.push(...newInputs);
  }

  async getInput() {
    if (this.index >= this.inputs.length) {
      throw new Error("No more inputs!");
    }
    return this.inputs[this.index++];
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

describe("Game - Normal 8-turn", () => {
  let deck, p1, p2, players, ui, game;

  beforeAll(() => {
    deck = new Deck();
    p1 = new Player("P1", deck);
    p2 = new Player("P2", deck);
    players = [p1, p2];

    ui = new FakeUI([
      "0", "0", // P1
      "0", "0", // P2
      "1", "1", 
      "1", "1",
      "2", "2", 
      "2", "2",
    ]);

    game = new Game(players, deck, ui);
  });

  test("Pregame", async () => {
    expect(game.phase).toBe("pregame");

    for (let turn = 0; turn < 6; turn++) {
      await game.takeTurn();
    }

    players.forEach(player => {
      player.caravans.slice(0, 3).forEach(caravan => {
        expect(caravan.size()).toBe(1);
      });
    });
  });

  test("Main Phase begins", () => {
    expect(game.phase).toBe("main");
    players.forEach(player => {
      expect(player.hand.length).toBe(5);
    });
  });

  test("1Action - P1 place 0 on own 0", async () => {
    ui.pushInputs(["1", "0", "0"]); // add inputs just before this step
    await game.takeTurn();
    expect(p1.caravans[0].size()).toBe(2);
  });
  test("1Action - P2 place 4 on own 2", async () => {
    ui.pushInputs(["1", "4", "2"]);
    await game.takeTurn();
    expect(p2.caravans[2].size()).toBe(2);
  });
  test("2Action - P1 place 0 on other 0", async () => {
    ui.pushInputs(["2", "0", "0"]);
    await game.takeTurn();
    expect(p2.caravans[0].size()).toBe(2);
  });
  test("2Action - P2 place 4 on other 2", async () => {
    ui.pushInputs(["2", "4", "2"]);
    await game.takeTurn();
    expect(p1.caravans[2].size()).toBe(2);
  });
  test("3Action - P1 clears own 0", async () => {
    ui.pushInputs(["3", "0"]);
    await game.takeTurn();
    expect(p1.caravans[0].size()).toBe(0);
  });
  test("3Action - P2 clears own 2", async () => {
    ui.pushInputs(["3", "2"]);
    await game.takeTurn();
    expect(p2.caravans[2].size()).toBe(0);
  });
  test("4Action - P1 discards #0", async () => {
    ui.pushInputs(["4", "0"]);
    const initialCard = p1.hand[0];
    await game.takeTurn();
    expect(p1.hand[0]).not.toBe(initialCard);
  });
  test("4Action - P2 discards #4", async () => {
    ui.pushInputs(["4", "4"]);
    const initialCard = p2.hand[4];
    await game.takeTurn();
    expect(p1.hand[4]).not.toBe(initialCard);
  });
});
describe("Game - Basic", () => {
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
describe("Game - Win States", () => {
  const cardA = new Card("A", "♥", "numeric");
  const card21 = new Card("21", "♥", "numeric");
  const card26 = new Card("26", "♥", "numeric");
  test("P1 Wins: 3 P1 selling", () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI([]);
    const game = new Game([p1, p2], deck, ui);
    
    p1.caravans[0].addCard(card21);
    p1.caravans[1].addCard(card26);
    p1.caravans[2].addCard(card21);

    expect(p1.getNumSellableCaravans()).toBe(3);
    expect(game.getWinner()).toBe(p1);

  });
  test("P2 Wins: 2 P2, 1 P1 selling", () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI([]);
    const game = new Game([p1, p2], deck, ui);

    p2.caravans[0].addCard(card21);
    p2.caravans[1].addCard(card26);

    p1.caravans[2].addCard(card21);

    expect(p1.getNumSellableCaravans()).toBe(1);
    expect(p2.getNumSellableCaravans()).toBe(2);
    expect(game.getWinner()).toBe(p2);

  });
  test("P1 Wins: 3 conflict", () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI([]);
    const game = new Game([p1, p2], deck, ui);

    p1.caravans[0].addCard(card21);
    p1.caravans[1].addCard(card21);
    p1.caravans[2].addCard(card21);

    p2.caravans[0].addCard(card26);
    p2.caravans[1].addCard(card26);
    p2.caravans[2].addCard(card26);

    expect(p1.getNumSellableCaravans()).toBe(0);
    expect(p2.getNumSellableCaravans()).toBe(3);
    expect(game.getWinner()).toBe(p2);

  });
});
