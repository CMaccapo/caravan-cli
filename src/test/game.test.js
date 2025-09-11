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

describe("Game- Normal 8-turn", () => {
  const deck = new Deck();
  const p1 = new Player("P1", deck);
  const p2 = new Player("P2", deck);
  const players = [p1, p2];
  const ui = new FakeUI([
      "0", "0", //P1
      "0", "0", //P2
      "1", "1", 
      "1", "1",
      "2", "2", 
      "2", "2",
      //place in own field
      "1", "0", "0", 
      "1", "4", "2"
      //place in opponent field
    ]);

    const game = new Game([p1, p2], deck, ui);

  test("Pregame", async () => {
    expect(game.phase).toBe("pregame");
    for (let turn = 0; turn < 6; turn++) {
      await game.takeTurn();
    }

    // Check P1 caravan 0 has a card
    players.forEach(player => {
      player.caravans.slice(0, 3).forEach(caravan => {
        expect(caravan.size()).toBe(1);
      });
    });

  });
  test("Main Phase", async () => {
    expect(game.phase).toBe("main");
    //check each player has 5 cards in main phase
    players.forEach((player, pi) => {
      expect(p1.hand.length).toBe(5);
    });
  });
  test("Action - P1 place 0 on own 0", async () => {
    await game.takeTurn();
    expect(p1.caravans[0].size()).toBe(2);
  });
  test("Action - P2 place 4 on own 2", async () => {
    await game.takeTurn();
    expect(p2.caravans[2].size()).toBe(2);
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
