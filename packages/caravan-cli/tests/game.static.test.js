const { Card, Deck, Player, Game, RuleCheck, Actions } = require("caravan-core");

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
  let deck, p1, p2, ui, game;
  beforeEach(() => {
    deck = new Deck();
    p1 = new Player("P1", deck);
    p2 = new Player("P2", deck);
    ui = new SilentUI([]);
    game = new Game([p1, p2], deck, ui);

    p1.caravans[0].addCard(new Card("23", "♠", "numeric"));
    p1.caravans[1].addCard(new Card("22", "♠", "numeric"));

  });
  test("Caravan win", () => {
    p1.caravans[2].addCard(new Card("26", "♠", "numeric"));
    expect(game.getWinner()).toBe(p1);
  });
  test("Caravan win VS", () => {
    p1.caravans[2].addCard(new Card("26", "♠", "numeric"));
   
    p2.caravans[0].addCard(new Card("21", "♠", "numeric"));
    p2.caravans[1].addCard(new Card("21", "♠", "numeric"));
    p2.caravans[2].addCard(new Card("21", "♠", "numeric"));

    expect(game.getWinner()).toBe(p1);
  });
  test("Tie no win", () => {
    p1.caravans[2].addCard(new Card("26", "♠", "numeric"));
    
    p2.caravans[0].addCard(new Card("23", "♠", "numeric"));
    p2.caravans[1].addCard(new Card("22", "♠", "numeric"));
    p2.caravans[2].addCard(new Card("26", "♠", "numeric"));

    expect(game.getWinner()).toBe(null);
    expect(game.isOver()).toBe(false);
  });
  test("2 selling no win", () => {

    expect(game.getWinner()).toBe(null);
    expect(game.isOver()).toBe(false);
  });
  test("Over selling no win", () => {
    p1.caravans[2].addCard(new Card("27", "♠", "numeric"));

    expect(game.getWinner()).toBe(null);
    expect(game.isOver()).toBe(false);
  });
});

describe("Direction", () => { 
  let deck, p1, p2, ui, game;
  const caravanIndex = 0;

  beforeEach(() => {
    deck = new Deck();
    p1 = new Player("P1", deck);
    p2 = new Player("P2", deck);

    p1.hand.cards = [
      new Card("6", "♦", "numeric"),
      new Card("8", "♠", "numeric"), 
      new Card("2", "♥", "numeric"),
      new Card("3", "♦", "numeric"),
      new Card("5", "♦", "numeric") 
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
      name: "Add val to same val null",
      startDirection: null,
      cardIndex: 4,
      expectSuccess: false,
      expectDirection: null,
      expectCount: 1,
    },
     {
      name: "Add val to same val asc",
      startDirection: "asc",
      cardIndex: 4,
      expectSuccess: false,
      expectDirection: "asc",
      expectCount: 1,
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
    const result = await Actions.execute("1", game);

    expect(result.success).toBe(expectSuccess);
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

    p1.hand.cards = [
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
        setup: (p1) => { p1.caravans[0].addCard(p1.hand.cards[0]); },
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
          p1.caravans[0].addCard(p1.hand.cards[0]); // add second card to trigger reverse
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
          p1.caravans[0].addCard(p1.hand.cards[5]); // add Ace
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
      const result = await Actions.execute("1", game);
      expect(result.success).toBe(true);
      verify(p1, p2, caravanIndex, baseIndex);
    });
  });

  describe("Cards", () => {
    const cases = [
      {
        name: "Attach 1 Face Card Invalid Card",
        inputs: [1, 0, "11"], // invalid base index
        expectSuccess: false,
        verify: (p1, caravanIndex, baseIndex) => {
          expect(p1.caravans[caravanIndex].cards[0].attachments.length).toBe(0);
        },
      },
      {
        name: "Attach Invalid Hand",
        inputs: ["11", 0, 0], // invalid play index
        expectSuccess: false,
        verify: (p1, caravanIndex, baseIndex) => {
          expect(p1.caravans[caravanIndex].cards[baseIndex].attachments.length).toBe(0);
        },
      },
      {
        name: "Attach Invalid Caravan",
        inputs: [0, "11", 0], // invalid play index
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
        inputs: ["0", "11"], // invalid caravan index
        choice: "1",
        expectSuccess: false,
        verify: () => {}, // nothing changes
      },
      {
        name: "Clear Valid",
        inputs: ["0"],
        choice: "3",
        expectSuccess: true,
        verify: (p1, caravanIndex) => {
          expect(p1.caravans[caravanIndex].cards.length).toBe(0);
        },
      },
      {
        name: "Clear Invalid",
        inputs: ["11"],
        choice: "3",
        expectSuccess: false,
        verify: () => {},
      },
      {
        name: "Discard Valid",
        inputs: ["0"],
        choice: "2",
        expectSuccess: true,
        verify: (p1, caravanIndex) => {
          expect(p1.hand.cards[0]).toEqual({"attachments": [], "points": 0, "suit": "♣", "type": "special", "value": "Q"});
        },
      },
      {
        name: "Discard Invalid",
        inputs: ["11"],
        choice: "2",
        expectSuccess: false,
        verify: () => {},
      }
    ];

    test.each(cases)("$name", async ({ inputs, expectSuccess, verify, choice = "1" }) => {
      ui.pushInputs(inputs.map(String));
      const result = await Actions.execute(choice, game);
      expect(result.success).toBe(expectSuccess);
      verify(p1, caravanIndex, 0);
    });
  });
});
