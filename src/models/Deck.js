const Card = require("./Card");

class Deck {
  constructor() {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
    const types = ["numeric", "special"]
    this.cards = [];

    for (let s of suits) {
      for (let v of values) {
        let t = types[1];
        if (!isNaN(v) || v == "A") {
          t = types[0];
        }
        this.cards.push(new Card(v, s, t));
      }
    }
    this.addJoker();
    this.addJoker();
    this.shuffle();
  }
  addJoker(){
    this.cards.push(new Card("Jo", "", "special"));
  }
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw() {
    return this.cards.pop();
  }

  get count() {
    return this.cards.length;
  }
}

module.exports = Deck;
