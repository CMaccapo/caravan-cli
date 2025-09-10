const Deck = require("../models/Deck");

describe("Deck", () => {
  test("deck starts with 52 cards", () => {
    const d = new Deck();
    expect(d.count).toBe(52);
  });

  test("draw reduces deck size", () => {
    const d = new Deck();
    const card = d.draw();
    expect(card).toBeDefined();
    expect(d.count).toBe(51);
  });

  test("shuffle changes order (most of the time)", () => {
    const d1 = new Deck();
    const d2 = new Deck();
    expect(d1.cards.map(c => c.toString())).not.toEqual(
      d2.cards.map(c => c.toString())
    );
  });
});
