const Caravan = require("../models/Caravan");
const Card = require("../models/Card");

describe("Cards", () => {
    const cards = [
        new Card("A", "♠"), 
        new Card("6", "♦")
    ];
    let caravan;
    beforeEach(() => {
        caravan = new Caravan();
    });
    describe("Card - expected behavior", () => {
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
        test("Removing 2nd card changes suit and dir", () => {
            caravan.addCard(cards[0]);
            caravan.addCard(cards[1]);
            caravan.removeCard(cards[1]);
            expect(caravan.suit).toBe("♠");
            expect(caravan.direction).toBe(null);
        });
    });
    describe("Card - unexpected behavior", () => {
        test("Removing nonexistent card fails", () => {
            caravan.addCard(cards[0]);
            caravan.removeCard(cards[1]);
            expect(caravan.cards.length).toBe(1);
        });
    });
});
