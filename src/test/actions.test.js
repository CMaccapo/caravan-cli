const Deck = require("../models/Deck");
const Player = require("../models/Player");
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
describe("Actions", () => {
  let deck, p1, p2, cardIndex, caravanIndex, ui;
  beforeEach(() => {
      deck = new Deck();
      p1 = new Player("P1", deck);
      p2 = new Player("P2", deck);
      cardIndex = p1.hand.findIndex(c => c.type === "numeric");
      caravanIndex = 0;
      ui = new FakeUI([cardIndex.toString(), caravanIndex.toString()], {autoValid:false});
    });
  describe("Action 1 Happy", () => {
    test("Action 1 - Valid placement succeeds", async () => {
      const success = await Actions.execute("1", p1, p2, deck, ui);

      expect(success).toBe(true);  
      expect(p1.caravans[caravanIndex].cards.length).toBe(1); // card added to caravan
      expect(p1.hand.includes(p1.caravans[caravanIndex].cards[cardIndex])).toBe(false); // card is no longer in hand
    });
    test("Action 1 - Can place on nonempty in main", async () => {
      await Actions.execute("1", p1, p2, deck, ui, "main");
      cardIndex = p1.hand.findIndex(c => c.type === "numeric");
      ui = new FakeUI([cardIndex.toString(), caravanIndex.toString()], {autoValid:false});
      
      const success = await Actions.execute("1", p1, p2, deck, ui, "main");

      expect(success).toBe(true);  
      expect(p1.caravans[caravanIndex].cards.length).toBe(2);
    });
  });
  describe("Action 1 Sad", () => {
    test("Action 1 - Invalid card  fails", async () => {
      cardIndex = 10;
      ui = new FakeUI([cardIndex.toString(), caravanIndex.toString()], {autoValid:false});

      const success = await Actions.execute("1", p1, p2, deck, ui);

      expect(success).toBe(false); 
      expect(p1.caravans[caravanIndex].cards.length).toBe(0);
    });
    test("Action 1 - Pregame Add to Nonempty Fails", async () => {
      await Actions.execute("1", p1, p2, deck, ui, "pregame");
      cardIndex = p1.hand.findIndex(c => c.type === "numeric");
      ui = new FakeUI([cardIndex.toString(), caravanIndex.toString()], {autoValid:false});
      
      const success = await Actions.execute("1", p1, p2, deck, ui, "pregame");

      expect(success).toBe(false); 
      expect(p1.caravans[caravanIndex].cards.length).toBe(1);
    });
  });
});