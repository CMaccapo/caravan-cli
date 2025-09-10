const Deck = require("../models/Deck");
const Player = require("../models/Player");
const Actions = require("../core/Actions");

function makeUI(inputs = []) {
  let i = 0;
  return {
    ask: async () => inputs[i++],
    notify: jest.fn(),
  };
}

describe("Actions", () => {
  test("action 1 places card in own slot", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = makeUI(["0", "0"]); // card index 0, slot index 0

    const card = p1.hand[0];
    await Actions.execute("1", p1, p2, deck, ui);

    expect(p1.slots[0]).toContain(card);
    expect(p1.hand).not.toContain(card);
  });

  test("action 2 places card in opponent slot", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = makeUI(["0", "1"]); // card index 0, opponent slot 1

    const card = p1.hand[0];
    await Actions.execute("2", p1, p2, deck, ui);

    expect(p2.slots[1]).toContain(card);
    expect(p1.hand).not.toContain(card);
  });

  test("action 3 discards all cards from slot", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    p1.slots[2].push(p1.hand.pop()); // prefill slot 2
    const ui = makeUI(["2"]);

    await Actions.execute("3", p1, p2, deck, ui);
    expect(p1.slots[2]).toEqual([]);
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
