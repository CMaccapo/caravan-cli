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
  pushInputs(newInputs) {
    this.inputs.push(...newInputs);
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
describe("Game End", () => {
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


describe("Direction", () => { 
  let deck, p1, p2, ui, game;
  const caravanIndex = 0;

  beforeEach(() => {
    deck = new Deck();
    p1 = new Player("P1", deck);
    p2 = new Player("P2", deck);

    // Reset hand every test (fixed order, so we know indexes)
    p1.hand = [
      new Card("6", "♦", "numeric"), // index 0
      new Card("8", "♠", "numeric"), // index 1
      new Card("2", "♥", "numeric"), // index 2
      new Card("3", "♦", "numeric")  // index 3
    ];

    // Reset caravan every test
    p1.caravans[caravanIndex].cards = [new Card("5", "♥", "numeric")];
    p1.caravans[caravanIndex].direction = "asc";

    ui = new SilentUI();
    game = new Game([p1, p2], deck, ui);
    game.phase = "main"; 
  });

  describe("Happy", () => {
    test("Add ascending card to ascending caravan", async () => {
      // hand[0] = 6♦ (ascending, valid after 5♥ asc)
      ui.pushInputs(["0", caravanIndex.toString()]);
      const success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(true);
      expect(p1.caravans[caravanIndex].cards.length).toBe(2);
      expect(p1.caravans[caravanIndex].direction).toBe("asc");
      expect(p1.caravans[caravanIndex].cards[1].value).toBe("6");
    });

    test("Add card of same suit to reverse direction", async () => {
      p1.caravans[caravanIndex].direction = "asc";
      // hand[2] = 2♥ (same suit as last card 5♥, should override)
      ui.pushInputs(["2", caravanIndex.toString()]);
      const success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(true);
      expect(p1.caravans[caravanIndex].cards.length).toBe(2);
    
      expect(p1.caravans[caravanIndex].direction).toBe("desc");
    });
  });

  describe("Sad", () => {
    test("Add descending card to ascending caravan, different suit", async () => {
      p1.caravans[caravanIndex].direction = "asc";
      ui.pushInputs(["3", caravanIndex.toString()]);
      const success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(false);
      expect(p1.caravans[caravanIndex].cards.length).toBe(1);
      expect(p1.caravans[caravanIndex].direction).toBe("asc");
    });

    test("Add ascending card to descending caravan, different suit", async () => {
      p1.caravans[caravanIndex].direction = "desc";
      ui.pushInputs(["0", caravanIndex.toString()]);
      const success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(false);
      expect(p1.caravans[caravanIndex].cards.length).toBe(1);
      expect(p1.caravans[caravanIndex].direction).toBe("desc");
    });
  });
});
