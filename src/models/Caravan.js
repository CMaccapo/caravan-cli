class Caravan {
  constructor() {
    this.cards = [];
    this.direction = null;
  }

  setDirection(){
    const lastCard = this.cards[this.cards-1];
    const nextLastCard = this.cards[this.cards-2];
    //if (lastCard)
  }

  addCard(card) {
    if (!card) return false;
    this.addNumericCard(card)
    return true;
  }
  addNumericCard(card){
    this.cards.push(card);
  }

  clear() {
    this.cards = [];
    return true;
  }

  isEmpty() {
    return this.cards.length === 0;
  }

  size() {
    return this.cards.length;
  }

  getPoints() {
    let result = null;    
    for (const card of this.cards) {
      result += card.points;
    }
    return result;
  }
  
  isSellable() {
    if (this.getPoints() >= 21 && this.getPoints() <= 26) {
      return true;
    }
    return false;
  }
}

module.exports = Caravan;
