const Deck = require("../models/Deck");

describe("Deck - expected behavior", () => {
  test("deck starts with 54 cards", () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(54);
  });

  test("draw reduces deck size", () => {
    const deck = new Deck();
    deck.draw();
    expect(deck.count).toBe(53);
  });
});

describe("Deck - edge cases / unexpected behavior", () => {
  test("drawing from empty deck returns undefined", () => {
    const deck = new Deck();
    deck.cards = [];
    expect(deck.draw()).toBeUndefined();
  });

  test("shuffle on empty deck does not throw", () => {
    const deck = new Deck();
    deck.cards = [];
    expect(() => deck.shuffle()).not.toThrow();
  });
});
