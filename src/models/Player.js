const Caravan = require("./Caravan");
const Hand = require("./Hand");

class Player {
  constructor(name, deck, caravanCount=3) {
    this.name = name;
    this.opponent = null;
    this.hand = new Hand();
    this.caravans = Array.from({ length: caravanCount }, () => new Caravan());
    for (let i = 0; i < 8; i++) {
      this.draw(deck);
    }
  }
  get caravansStr() {
    return (this.caravans || [])
      .map((caravan, index) => {
        if (!caravan) return `\n[${index}] []`; // empty slot

        const isSelling = this.caravanIsSelling(index);
        const dollar = isSelling ? "$" : " ";

        return `\n${dollar}${caravan.points}pts\t[${index}]${caravan.suitStr}${caravan.dirStr}: ${caravan.toString()}`;
      })
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

  caravanIsSelling(index) {
    const myCaravan = this.caravans[index];
    const oppCaravan = this.opponent.caravans[index];

    if (!myCaravan || !myCaravan.isSellable()) return false;
    if (!oppCaravan || !oppCaravan.isSellable()) return true;

    return myCaravan.points > oppCaravan.points;
  }
}


module.exports = Player;
