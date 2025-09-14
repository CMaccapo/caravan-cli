class Caravan {
  constructor() {
    this.cards = [];
    this.direction = null;
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

  addCard(card) {
    if (!card) return false;
    this.addNumericCard(card)
    this.setDirection();
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
