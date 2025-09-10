const Card = require("../models/Card");

describe("Card", () => {
  test("toString returns value + suit", () => {
    const c = new Card("A", "♠");
    expect(c.toString()).toBe("A♠");
  });
});
