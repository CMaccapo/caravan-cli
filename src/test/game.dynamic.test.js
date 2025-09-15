const Deck = require("../models/Deck");
const Player = require("../models/Player");
const Game = require("../core/Game");
const Actions = require("../core/Actions");

class FakeUI {
  constructor(inputs = [], {autoValid = true} = {}) {
    this.inputs = inputs;
    this.index = 0;
    this.autoValid = autoValid;
    this.logs = [];
    this.currentPlayer = null;
  }

 async ask(prompt) {
  if (this.index < this.inputs.length) {
    const ans = this.inputs[this.index++];
    //console.log(`[FakeUI.ask] scripted: ${prompt} -> ${ans}`);
    return ans;
  }

  if (this.autoValid && prompt.includes("card index")) {
    const idx = this.currentPlayer.hand.findIndex(c => c.type === "numeric");
    //console.log(`[FakeUI.ask] auto card: ${prompt} -> ${idx}`);
    return String(idx >= 0 ? idx : 0);
  }

  if (this.autoValid && prompt.includes("caravan index")) {
    const idx = this.currentPlayer.caravans.findIndex(c => c.isEmpty());
    //console.log(`[FakeUI.ask] auto caravan: ${prompt} -> ${idx}`);
    return String(idx >= 0 ? idx : 0);
  }

  //console.log(`[FakeUI.ask] fallback invalid: ${prompt} -> 99`);
  return "99";
}


  async askAction() {
    return this.ask("Action: ");
  }
  notify(msg) { this.logs.push(msg); }
  printState() {}
  close() {}
}

describe("Game (Dynamic) - Happy", () => {
  test("Pregame auto-valid placements succeed", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI([], {autoValid:true});
    const game = new Game([p1, p2], deck, ui);

    // Each player places 3 cards (6 turns)
    for (let t = 0; t < 6; t++) {
      await game.takeTurn();
    }

    expect(p1.caravans.every(c => c.size() === 1)).toBe(true);
    expect(p2.caravans.every(c => c.size() === 1)).toBe(true);
    expect(game.phase).toBe("main");
  });

  test("Action 1 - Place on own caravan", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI(["1"], {autoValid:true});
    const game = new Game([p1, p2], deck, ui);
    game.phase = "main";

    await game.takeTurn();

    expect(p1.caravans.some(c => c.size() > 0)).toBe(true);
  });
  test("Action 2 - Attach to other caravan", async () => {
    
  });
  test("Action 3 - Clear Caravan", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI(["3"], {autoValid:true});
    const game = new Game([p1, p2], deck, ui);
    game.phase = "main";

    await game.takeTurn();

    expect(p1.caravans[0].size() == 0).toBe(true);
  });
  test("Action 4 - Discard Card", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const cardIndex = 0;
    const cardToDiscard = p1.hand[cardIndex];

    const ui = new FakeUI(["4", cardIndex.toString()], {autoValid:false});
    const game = new Game([p1, p2], deck, ui);
    game.phase = "main";

    await game.takeTurn();
    expect(p1.hand.includes(cardToDiscard)).toBe(false);    // card removed
  });
});
