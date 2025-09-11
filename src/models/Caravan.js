class Caravan {
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    if (!card) return false;
    this.cards.push(card);
    return true;
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
}

module.exports = Caravan;
