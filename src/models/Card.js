class Card {
  constructor(value, suit, type) {
    this.value = value;
    this.suit = suit;
    this.type = type;
  }
  toString() {
    return `${this.value}${this.suit}`;
  }
  getPoints(){
    if (card === 'A') {
      return 1;
    } else if (!isNaN(card)) {
      return parseInt(card, 10);;
    } else {
      return 0;
    }
  }

}
module.exports = Card;
