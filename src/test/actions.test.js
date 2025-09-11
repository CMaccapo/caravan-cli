const Deck = require("../models/Deck");
const Player = require("../models/Player");
const Actions = require("../core/Actions");
const Placement = require("../core/Placement");
const Hand = require("../core/Hand");

// stub UI to simulate user input
function makeUI(inputs = []) {
  let i = 0;
  return {
    ask: async () => inputs[i++],
    notify: jest.fn(),
  };
}

describe("Actions - expected behavior", () => {
  test("action 1 places card in own caravan", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = makeUI(["0", "0"]); // card index 0, caravan 0

    const card = p1.hand[0];
    await Actions.execute("1", p1, p2, deck, ui);

    expect(p1.caravans[0]).toContain(card);
    expect(p1.hand).not.toContain(card);
  });

  test("action 4 discards one card from hand", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = makeUI(["0"]);

    const card = p1.hand[0];
    await Actions.execute("4", p1, p2, deck, ui);
    expect(p1.hand).not.toContain(card);
  });
});

describe("Actions - edge cases / unexpected behavior", () => {
  test("action 1 with invalid card index does not crash", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = makeUI(["999", "0"]); // invalid card index

    await expect(Actions.execute("1", p1, p2, deck, ui)).resolves.not.toThrow();
    expect(p1.caravans[0].length).toBe(0); // nothing added
  });

  test("action 2 with invalid caravan index does not crash", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = makeUI(["0", "999"]); // invalid opponent caravan index

    await expect(Actions.execute("2", p1, p2, deck, ui)).resolves.not.toThrow();
    expect(p2.caravans.every(s => s.length === 0)).toBe(true); // nothing added
  });

  test("action 3 with invalid caravan index does nothing", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = makeUI(["999"]);

    await expect(Actions.execute("3", p1, p2, deck, ui)).resolves.not.toThrow();
    expect(p1.caravans.length).toBe(3); // still 3 caravans
  });
});
