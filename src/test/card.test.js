const Card = require("../models/Card");

describe("Card - expected behavior", () => {
  test("toString returns value + suit", () => {
    const c = new Card("A", "♠");
    expect(c.toString()).toBe("A♠");
  });
});

describe("Card - edge cases / unexpected behavior", () => {
  test("creating card with empty strings still works", () => {
    const c = new Card("", "");
    expect(c.toString()).toBe("");
  });

  test("creating card with number values works", () => {
    const c = new Card(5, "♦");
    expect(c.toString()).toBe("5♦");
  });
});

