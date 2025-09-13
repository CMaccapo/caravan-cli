const Card = require("../models/Card");
const Deck = require("../models/Deck");
const Player = require("../models/Player");
const Game = require("../core/Game");
const Actions = require("../core/Actions");

class FakeUI {
  constructor(inputs = []) {
    this.inputs = inputs;
    this.index = 0;
    this.logs = [];
    this.lastCardIndex = null;
    this.lastCaravanIndex = null; 
  }

  pushInputs(newInputs) {
    this.inputs.push(...newInputs);
  }

  async ask(prompt) {
    let answer;

    if (prompt.includes("card index") && this.currentPlayer) {
      const defaultCardIndex = "0";
      const idx = this.nextNumericCardIndex();
      answer = idx >= 0 ? idx.toString() : defaultCardIndex;
      this.lastCardIndex = parseInt(answer, 10);
    } 
    else if (prompt.includes("caravan index")){
      const defaultCaravanIndex = "0";
      const idx = this.nextEmptyCaravanIndex();
      answer = idx >= 0 ? idx.toString() : defaultCaravanIndex;
      this.lastCaravanIndex = parseInt(answer, 10);
    } 
    else {
      answer = this.inputs[this.index++] || "0";
    }
    //console.log(`${prompt}\n${answer}`);

    return answer;
  }
  nextNumericCardIndex(){
    return this.currentPlayer.hand.findIndex(c => c.isNumeric && c.isNumeric());
  }
  nextEmptyCaravanIndex(){
    return this.currentPlayer.caravans.findIndex(c => c.isEmpty());
  }

  async askAction(player) {
    return this.ask(`Action for ${player.name}: `);
  }

  printState(players, deck) {}
  notify(msg) { this.logs.push(msg); }
  close() {}
}


describe("Game - Play Sim", () => {
  let deck, p1, p2, players, ui, game;

  beforeAll(() => {
    deck = new Deck();
    p1 = new Player("P1", deck);
    p2 = new Player("P2", deck);
    players = [p1, p2];

    ui = new FakeUI();

    game = new Game(players, deck, ui);
  });

  test("Pregame", async () => {
    expect(game.phase).toBe("pregame");

    for (let turn = 0; turn < 6; turn++) {
      await game.takeTurn();
    }

    players.forEach(player => {
      player.caravans.slice(0, 3).forEach(caravan => {
        expect(caravan.size()).toBe(1);
      });
    });
  });

  test("Main Phase begins", () => {
    expect(game.phase).toBe("main");
    players.forEach(player => {
      expect(player.hand.length).toBe(5);
    });
  });

  test("1Action - Place on My Field", async () => {
    ui.pushInputs("1");
    await game.takeTurn();
    
    expect(ui.currentPlayer.caravans[0].size()).toBe(2);
  });
  test("2Action - Place on Other Field", async () => {
    ui.pushInputs("2");
    await game.takeTurn();
    
    expect(ui.currentOpponent.caravans[0].size()).toBe(3);
  });
  test("3Action - Clear Caravan", async () => {
    ui.pushInputs("3");
    await game.takeTurn();
    expect(ui.currentPlayer.caravans[0].size()).toBe(0);
  });
  test("4Action - Discard 1", async () => {
    ui.pushInputs("4");
    const initialCard = p2.hand[ui.lastCardIndex];
    await game.takeTurn();
    expect(ui.currentPlayer.hand[ui.lastCardIndex]).not.toBe(initialCard);
  });
});
describe("Game - Basic", () => {
  test("turn switches correctly", async () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);

    const ui = new FakeUI(["0", "0", "0", "0"]);
    const game = new Game([p1, p2], deck, ui);

    expect(game.current).toBe(0);
    await game.takeTurn();
    expect(game.current).toBe(1);
    await game.takeTurn();
    expect(game.current).toBe(0);
  });
});
describe("Game - Win States", () => {
  const cardA = new Card("A", "♥", "numeric");
  const card21 = new Card("21", "♥", "numeric");
  const card26 = new Card("26", "♥", "numeric");
  test("P1 Wins: 3 P1 selling", () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI([]);
    const game = new Game([p1, p2], deck, ui);
    
    p1.caravans[0].addCard(card21);
    p1.caravans[1].addCard(card26);
    p1.caravans[2].addCard(card21);

    expect(p1.getNumSellableCaravans()).toBe(3);
    expect(game.getWinner()).toBe(p1);

  });
  test("P2 Wins: 2 P2, 1 P1 selling", () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI([]);
    const game = new Game([p1, p2], deck, ui);

    p2.caravans[0].addCard(card21);
    p2.caravans[1].addCard(card26);

    p1.caravans[2].addCard(card21);

    expect(p1.getNumSellableCaravans()).toBe(1);
    expect(p2.getNumSellableCaravans()).toBe(2);
    expect(game.getWinner()).toBe(p2);

  });
  test("P1 Wins: 3 conflict", () => {
    const deck = new Deck();
    const p1 = new Player("P1", deck);
    const p2 = new Player("P2", deck);
    const ui = new FakeUI([]);
    const game = new Game([p1, p2], deck, ui);

    p1.caravans[0].addCard(card21);
    p1.caravans[1].addCard(card21);
    p1.caravans[2].addCard(card21);

    p2.caravans[0].addCard(card26);
    p2.caravans[1].addCard(card26);
    p2.caravans[2].addCard(card26);

    expect(p1.getNumSellableCaravans()).toBe(3);
    expect(p2.getNumSellableCaravans()).toBe(3);
    expect(game.getCaravanWinner(1)).toBe(p2);
    expect(game.getWinner()).toBe(p2);

  });
});
