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

    p1.hand = [
      new Card("6", "♦", "numeric"),
      new Card("8", "♠", "numeric"), 
      new Card("2", "♥", "numeric"),
      new Card("3", "♦", "numeric") 
    ];

    p1.caravans[caravanIndex].cards = [new Card("5", "♥", "numeric")];
    p1.caravans[caravanIndex].direction = "asc";

    ui = new SilentUI();
    game = new Game([p1, p2], deck, ui);
    game.phase = "main"; 
  });

  const cases = [
    {
      name: "Add ascending card to ascending caravan",
      startDirection: "asc",
      cardIndex: 0, // 6♦
      expectSuccess: true,
      expectDirection: "asc",
      expectCount: 2,
    },
    {
      name: "Same suit flips asc to desc",
      startDirection: "asc",
      cardIndex: 2, // 2♥
      expectSuccess: true,
      expectDirection: "desc", // override flips it
      expectCount: 2,
    },
    {
      name: "Add descending card to ascending caravan, different suit",
      startDirection: "asc",
      cardIndex: 3, // 3♦
      expectSuccess: false,
      expectDirection: "asc",
      expectCount: 1,
    },
    {
      name: "Add ascending card to descending caravan, different suit",
      startDirection: "desc",
      cardIndex: 0, // 6♦
      expectSuccess: false,
      expectDirection: "desc",
      expectCount: 1,
    },
  ];

  test.each(cases)("$name", async ({ startDirection, cardIndex, expectSuccess, expectDirection, expectCount }) => {
    p1.caravans[caravanIndex].direction = startDirection;

    ui.pushInputs([cardIndex.toString(), caravanIndex.toString()]);
    const success = await Actions.execute("1", p1, p2, deck, ui, "main");

    expect(success).toBe(expectSuccess);
    expect(p1.caravans[caravanIndex].cards.length).toBe(expectCount);
    expect(p1.caravans[caravanIndex].direction).toBe(expectDirection);
  });
});

describe("Card Attachments", () => {
  let deck, p1, p2, ui, game;
  let caravanIndex, playIndex, baseIndex;

  beforeEach(() => {
    deck = new Deck();
    p1 = new Player("P1", deck);
    p2 = new Player("P2", deck);
    caravanIndex = 0;
    playIndex = 0;
    baseIndex = 0;

    p1.hand = [
      new Card("6", "♦", "numeric"),
      new Card("Q", "♣", "special"), 
      new Card("J", "♥", "special"),
      new Card("K", "♥", "special")
    ];

    p1.caravans[caravanIndex].cards = [new Card("5", "♥", "numeric")];
    p2.caravans[caravanIndex].cards = [new Card("5", "♥", "numeric")];

    ui = new SilentUI();
    game = new Game([p1, p2], deck, ui);
    game.phase = "main"; 
  });
  describe("Attachments Happy", () => {
    test("Attach 1 Face Card", async () => {
      playIndex = 1;
      ui.pushInputs([playIndex, caravanIndex,baseIndex]);
      const success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(true);
      expect(p1.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(1);
    });
    test("Attach 1 Face Card to Opponent", async () => {
      playIndex = 1;
      ui.pushInputs([playIndex, caravanIndex, baseIndex]);
      const success = await Actions.execute("2", p1, p2, deck, ui, "main");

      expect(success).toBe(true);
      expect(p2.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(1);
    });
    test("Attach 1 Face Card 2nd Pos", async () => {
      playIndex = 0;
      baseIndex = 1;
      ui.pushInputs([playIndex, caravanIndex]);
      let success = await Actions.execute("1", p1, p2, deck, ui, "main");
      ui.pushInputs([playIndex, caravanIndex, baseIndex]);
      success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(true);
      expect(p1.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(1);
    });
    test("Jack Removes Card - Opponent", async () => {
      playIndex = 2;
      ui.pushInputs([playIndex, caravanIndex,baseIndex]);
      const success = await Actions.execute("2", p1, p2, deck, ui, "main");

      expect(success).toBe(true);
      expect(p2.caravans[caravanIndex].cards.length).toBe(0);
    });
    test("King Doubles Card - Self", async () => {
      playIndex = 3;
      ui.pushInputs([playIndex, caravanIndex,baseIndex]);
      const success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(true);
      expect(p1.caravans[caravanIndex].cards[baseIndex].points).toBe(10);
    });
    test("Queen changes suit", async () => {
      playIndex = 1;
      ui.pushInputs([playIndex, caravanIndex, baseIndex]);
      success = await Actions.execute("1", p1, p2, deck, ui, "main");
      
      expect(success).toBe(true);
      expect(p1.caravans[caravanIndex].suit).toBe("♣");
    });
    test("Queen reverses direction", async () => {
      ui.pushInputs([playIndex, caravanIndex]);
      await Actions.execute("1", p1, p2, deck, ui, "main");
      expect(p1.caravans[caravanIndex].direction).toBe("asc");

      baseIndex = 1;
      ui.pushInputs([playIndex, caravanIndex, baseIndex]);
      success = await Actions.execute("1", p1, p2, deck, ui, "main");
      
      expect(success).toBe(true);
      expect(p1.caravans[caravanIndex].direction).toBe("desc");
    });
  });
});
