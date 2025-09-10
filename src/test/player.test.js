const Deck = require("../src/models/Deck");
const Player = require("../src/models/Player");

describe("Player", () => {
  test("player starts with 7 cards in hand", () => {
    const deck = new Deck();
    const p = new Player("Tester", deck);
    expect(p.hand.length).toBe(7);
  });

  test("draw adds a card to hand", () => {
    const deck = new Deck();
    const p = new Player("Tester", deck);
    const before = p.hand.length;
    p.draw(deck);
    expect(p.hand.length).toBe(before + 1);
  });

  test("slots start empty", () => {
    const deck = new Deck();
    const p = new Player("Tester", deck);
    expect(p.slots).toEqual([[], [], []]);
  });
});
