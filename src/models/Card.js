class Card {
  constructor(value, suit, type) {
    this.value = value;
    this.suit = suit;
    this.type = type;
  }
  toString() {
    return `${this.value}${this.suit}`;
  }

}
module.exports = Card;
