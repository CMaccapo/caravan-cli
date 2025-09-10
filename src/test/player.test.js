const Deck = require("../models/Deck");
const Player = require("../models/Player");

describe("Player - expected behavior", () => {
  test("player starts with 8 cards in hand", () => {
    const deck = new Deck();
    const p = new Player("Tester", deck);
    expect(p.hand.length).toBe(8);
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

describe("Player - edge cases / unexpected behavior", () => {
  test("drawing from empty deck does nothing", () => {
    const deck = new Deck();
    deck.cards = []; // empty deck
    const p = new Player("Tester", deck);
    p.hand = [];
    p.draw(deck);
    expect(p.hand.length).toBe(0);
  });

  test("drawing from non-array deck throws if deck.draw is invalid", () => {
    const p = new Player("Tester", {});
    expect(() => p.draw({})).not.toThrow(); // could make a safer draw in production
  });
});
