const { Card, Caravan } = require("caravan-core");

describe("Cards", () => {
    const cards = [
        new Card("A", "♠", "numeric"), 
        new Card("6", "♦", "numeric"),
        new Card("A", "♦", "numeric")
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
        test("Forcing sam val Sandwich returns null dir", () => {
            caravan.addCard(cards[0]);
            caravan.addCard(cards[1]);
            caravan.addCard(cards[2]);
            caravan.removeCard(cards[1]);
            expect(caravan.suit).toBe("♦");
            expect(caravan.direction).toBe(null);
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
