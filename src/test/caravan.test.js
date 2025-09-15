const Caravan = require("../models/Caravan");
const Card = require("../models/Card");

describe("Card - expected behavior", () => {
  const cards = [
    new Card("A", "♠"), 
    new Card("6", "♦")
  ];
  let caravan;
  beforeEach(() => {
    caravan = new Caravan();
  });
  test("Adding 1st card changes suit", () => {
    caravan.addCard(cards[0]);
    expect(caravan.suit).toBe("♠");
  });
  test("Adding 2nd card changes suit and dir", () => {
    caravan.addCard(cards[0]);
    caravan.addCard(cards[1]);
    expect(caravan.suit).toBe("♦");
    expect(caravan.direction).toBe("asc");
  });
});
