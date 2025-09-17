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

    p1.caravans[caravanIndex].addCard(new Card("5", "♥", "numeric"));
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
    const success = await Actions.execute("1", game);

    expect(success).toBe(expectSuccess);
    expect(p1.caravans[caravanIndex].cards.length).toBe(expectCount);
    expect(p1.caravans[caravanIndex].direction).toBe(expectDirection);
  });
});

describe("Card Attachments", () => {
  let deck, p1, p2, ui, game;
  let caravanIndex;

  beforeEach(() => {
    deck = new Deck();
    p1 = new Player("P1", deck);
    p2 = new Player("P2", deck);
    caravanIndex = 0;

    p1.hand = [
      new Card("6", "♦", "numeric"),
      new Card("Q", "♣", "special"), 
      new Card("J", "♥", "special"),
      new Card("K", "♥", "special"),
      new Card("Jo", "", "special"),
      new Card("A", "♣", "numeric")
    ];

    p1.caravans[caravanIndex].addCard(new Card("5", "♥", "numeric"));
    p2.caravans[caravanIndex].addCard(new Card("5", "♣", "numeric"));

    ui = new SilentUI();
    game = new Game([p1, p2], deck, ui);
    game.phase = "main"; 
  });

  describe("Attachments Happy", () => {
    const cases = [
      {
        name: "Attach 1 Face Card to Self",
        playIndex: 1, fieldIndex: 0, baseIndex: 0,
        setup: () => {},
        verify: (p1, p2, caravanIndex, baseIndex) => {
          expect(p1.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(1);
        },
      },
      {
        name: "Attach 1 Face Card to Opponent",
        playIndex: 1, fieldIndex: 1, baseIndex: 0,
        setup: () => {},
        verify: (p1, p2, caravanIndex, baseIndex) => {
          expect(p2.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(1);
        },
      },
      {
        name: "Attach 1 Face Card 2nd Pos Self",
        playIndex: 1, fieldIndex: 0, baseIndex: 1,
        setup: (p1) => { p1.caravans[0].addCard(p1.hand[0]); },
        verify: (p1, p2, caravanIndex, baseIndex) => {
          expect(p1.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(1);
        },
      },
      {
        name: "Jack Removes Card - Opponent",
        playIndex: 2, fieldIndex: 1, baseIndex: 0,
        setup: () => {},
        verify: (p1, p2, caravanIndex) => {
          expect(p2.caravans[caravanIndex].cards.length).toBe(0);
        },
      },
      {
        name: "King Doubles Card - Self",
        playIndex: 3, fieldIndex: 0, baseIndex: 0,
        setup: () => {},
        verify: (p1, p2, caravanIndex, baseIndex) => {
          expect(p1.caravans[caravanIndex].cards[baseIndex].points).toBe(10);
        },
      },
      {
        name: "Queen changes suit",
        playIndex: 1, fieldIndex: 0, baseIndex: 0,
        setup: () => {},
        verify: (p1) => {
          expect(p1.caravans[0].suit).toBe("♣");
        },
      },
      {
        name: "Queen reverses direction",
        playIndex: 1, fieldIndex: 0, baseIndex: 1,
        setup: (p1) => {
          p1.caravans[0].addCard(p1.hand[0]); // add second card to trigger reverse
          expect(p1.caravans[0].direction).toBe("asc");
        },
        verify: (p1) => {
          expect(p1.caravans[0].direction).toBe("desc");
        },
      },
      {
        name: "Joker removes all with same suit as target Ace",
        playIndex: 4, fieldIndex: 0, baseIndex: 1,
        setup: (p1) => {
          p1.caravans[0].addCard(p1.hand[5]); // add Ace
        },
        verify: (p1, p2, caravanIndex) => {
          expect(p1.caravans[caravanIndex].cards.length).toBe(1);
          expect(p2.caravans[caravanIndex].cards.length).toBe(0);
        },
      },
      {
        name: "Joker removes all 5",
        playIndex: 4, fieldIndex: 0, baseIndex: 0,
        setup: () => {},
        verify: (p1, p2, caravanIndex) => {
          expect(p1.caravans[caravanIndex].cards.length).toBe(0);
          expect(p2.caravans[caravanIndex].cards.length).toBe(0);
        },
      },
    ];

    test.each(cases)("$name", async ({ playIndex, fieldIndex, baseIndex, setup, verify }) => {
      setup(p1, p2);
      ui.pushInputs([playIndex, fieldIndex, caravanIndex, baseIndex]);
      const success = await Actions.execute("1", game);
      expect(success).toBe(true);
      verify(p1, p2, caravanIndex, baseIndex);
    });
  });

  describe("Cards Sad", () => {
    const cases = [
      {
        name: "Attach 1 Face Card Invalid",
        inputs: [1, 0, 0, "11"], // invalid base index
        expectSuccess: false,
        verify: (p1, caravanIndex, baseIndex) => {
          expect(p1.caravans[caravanIndex].cards[0].attachments.length).toBe(0);
        },
      },
      {
        name: "Attach Invalid",
        inputs: ["11", 0, 0, 0], // invalid play index
        expectSuccess: false,
        verify: (p1, caravanIndex, baseIndex) => {
          expect(p1.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(0);
        },
      },
      {
        name: "Place Invalid",
        inputs: [11, 0], // invalid play index
        expectSuccess: false,
        verify: (p1, caravanIndex) => {
          expect(p1.caravans[caravanIndex].cards.length).toBe(1);
        },
      },
      {
        name: "Place card to invalid",
        inputs: [0, 11], // invalid caravan index
        choice: "2",
        expectSuccess: false,
        verify: () => {}, // nothing changes
      },
    ];

    test.each(cases)("$name", async ({ inputs, expectSuccess, verify, choice = "1" }) => {
      ui.pushInputs(inputs.map(String));
      const success = await Actions.execute(choice, game);
      expect(success).toBe(expectSuccess);
      verify(p1, caravanIndex, 0);
    });
  });
});
