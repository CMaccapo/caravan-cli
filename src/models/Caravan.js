class Caravan {
  constructor() {
    this.cards = [];
    this.direction = null;
    this.suit = null;
  }

  toString() {
    return this.cards.map(card => {
      if (card.type === "numeric") {
        const attachments = card.attachments?.map(att => att.toString()).join(", ");
        return attachments ? `${card.toString()} [${attachments}]` : card.toString();
      }
      return card.toString();
    }).join(", ");
  }

  setDirection(){
    if (this.cards.length >= 2){
      const lastCard = this.cards[this.cards.length-1];
      const nextLastCard = this.cards[this.cards.length-2];

      if (lastCard.points > nextLastCard.points){
        this.direction = "asc"; 
      }
      else if (lastCard.points < nextLastCard.points){
        this.direction = "desc"; 
      }
    }
    else{
      this.direction = null;
    }
  }
  reverseDirection(){
    if (this.direction == "asc") this.direction = "desc";
    else if (this.direction == "desc") this.direction = "asc";
    return true;
  }
  setSuit(suit){
    if (suit == null) {
      if (this.cards.length > 0){
        this.suit = this.cards[this.cards.length-1].suit;
      }
      else{
        this.suit = null;
      }
    }
    else {
      this.suit = suit;
    }
    return true;
  }

  addCard(card) {
    if (!card) return false;
    this.cards.push(card);
    this.setDirection();
    this.setSuit();
    return true;
  }

  removeCard(pickedCard) {
    if (!pickedCard) return false;
    if (!this.cards.includes(pickedCard)) return false;
    this.cards = this.cards.filter(card => card !== pickedCard);
    this.setDirection();
    this.setSuit();
    return true;
  }

  removeSuit(suit) {
    if (!suit) return false;
    if (this.cards.length === 0) return true;

    for (card of this.cards){
      if (card.suit === suit){
        this.removeCard(card);
      }
    }
    return true;
  }
  removeValue(value) {
    if (!value) return false;
    if (this.cards.length === 0) return true;

    for (card of this.cards){
      if (card.value === value){
        this.removeCard(card);
      }
    }
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
