class Caravan {
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    if (!card) return false;
    if (card.type == "numeric" || 1==1){
      this.addNumericCard(card)
    }
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
    return this.cards.reduce((sum, card) => sum + card.getPoints(), 0);
  }
  
  isSellable() {
    if (this.getPoints() >= 21 && this.getPoints() <= 26) {
      return true;
    }
    return false;
  }
}

module.exports = Caravan;
