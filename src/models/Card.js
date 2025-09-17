class Card {
  constructor(value, suit, type) {
    this.value = value;
    this.suit = suit;
    this.type = type;
    this.points = this.setPoints();
    this.attachments = [];
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
  doublePoints(){
    this.points = this.points*2;
    return true;
  }
  attachCard(cardToAttach){
    if (!cardToAttach) return false;
    this.attachments.push(cardToAttach);
    return true;
  }

}
module.exports = Card;
