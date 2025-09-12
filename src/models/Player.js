const Caravan = require("./Caravan");

class Player {
  constructor(name, deck, caravanCount=3) {
    this.name = name;
    this.hand = [];
    this.caravans = Array.from({ length: caravanCount }, () => new Caravan());
    for (let i = 0; i < 8; i++) {
      this.draw(deck);
    }
  }

  draw(deck) {
    if (deck.count > 0) {
      this.hand.push(deck.draw());
    }
  }

  handToString() {
    return this.hand.map((card, index) => `[${index}]${card}`).join(" ");
  }

  getNumSellableCaravans(){
    let result = 0;
    this.caravans.forEach((caravan, ci) => {
      if(caravan.isSellable()){
        result = result +1;
      }
    });
    return result;
  }
}

module.exports = Player;
