const Caravan = require("./Caravan");
const Hand = require("./Hand");

class Player {
  constructor(name, deck, caravanCount=3) {
    this.name = name;
    this.hand = new Hand();
    this.caravans = Array.from({ length: caravanCount }, () => new Caravan());
    for (let i = 0; i < 8; i++) {
      this.draw(deck);
    }
  }
  get caravansStr() {
    return (this.caravans || [])
      .map((caravan, index) => `[${index}]${caravan ? caravan.toString() : "[]"}`)
      .join(" ");
  }

  draw(deck) {
    if (deck.count > 0) {
      this.hand.addCard(deck.draw());
    }
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
