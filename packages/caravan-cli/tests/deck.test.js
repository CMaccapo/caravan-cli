const { Card, Deck, Player, Game } = require("caravan-core");

describe("Initial hand reshuffle for all-face card hands", () => {
  it("should reshuffle if players have fewer than 3 numeric cards", async () => {
    // Force top of deck to be all face cards (special)
    const suits = ["♠", "♥", "♦", "♣"];
    const specialValues = ["J", "Q", "K", "Jo"];
    const numericValues = ["A", "2", "3", "4", "5"];
    
    // Create special cards first (to force bad initial hands)
    const specialCards = [];
    for (const suit of suits) {
      for (const value of specialValues) {
        specialCards.push(new Card(value, suit, "special"));
      }
    }

    // Followed by numeric cards (so reshuffle can draw them)
    const numericCards = [];
    for (const suit of suits) {
      for (const value of numericValues) {
        numericCards.push(new Card(value, suit, "numeric"));
      }
    }

    // Deck: special cards on top, numeric below
    const deck = new Deck([...specialCards, ...numericCards]);

    const player1 = new Player("Alice", deck);
    const player2 = new Player("Bob", deck);

    // Mock UI to ignore input/output
    const mockUI = { notify: () => {}, waitForTurn: async () => {} };

    const game = new Game([player1, player2], deck, mockUI);

    // Call the function that deals initial hands and reshuffles if needed
    await game.dealInitialHands();

    // Each player should have at least 3 numeric cards now
    const numericCount1 = player1.hand.cards.filter(c => c.type === "numeric").length;
    const numericCount2 = player2.hand.cards.filter(c => c.type === "numeric").length;

    expect(numericCount1).toBeGreaterThanOrEqual(3);
    expect(numericCount2).toBeGreaterThanOrEqual(3);
  });
});

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
