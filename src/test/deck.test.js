const Deck = require("../models/Deck");

describe("Deck - expected behavior", () => {
  test("deck starts with 52 cards", () => {
    const d = new Deck();
    expect(d.count).toBe(52);
  });

  test("draw reduces deck size", () => {
    const d = new Deck();
    d.draw();
    expect(d.count).toBe(51);
  });
});

describe("Deck - edge cases / unexpected behavior", () => {
  test("drawing from empty deck returns undefined", () => {
    const d = new Deck();
    d.cards = [];
    expect(d.draw()).toBeUndefined();
  });

  test("shuffle on empty deck does not throw", () => {
    const d = new Deck();
    d.cards = [];
    expect(() => d.shuffle()).not.toThrow();
  });
});
