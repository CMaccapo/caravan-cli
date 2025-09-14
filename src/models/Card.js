class Card {
  constructor(value, suit, type) {
    this.value = value;
    this.suit = suit;
    this.type = type;
    this.points = this.setPoints();
  }
  toString() {
    return `${this.value}${this.suit}`;
  }
  setPoints(){
    if (this.value === 'A') {
      return 1;
    } else if (!isNaN(this.value)) {
      return parseInt(this.value, 10);;
    } else {
      return 0;
    }
  }

}
module.exports = Card;
