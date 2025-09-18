class Caravan {
  constructor() {
    this._cards = [];
    this.direction = null;
    this.suit = null;
  }
  get cardsStr() { 
    return (this._cards || [])
      .map((card, index) => `[${index}]${card ? card.toString() : ""}`)
      .join(" ");
  }
  get dirStr() {
    if (this.direction == "asc") return "↑";
    if (this.direction == "desc") return "↓";
    return "";
  }
  get suitStr() {
    if (!this.suit) return "";
    return this.suit;
  }

  get cards() {
    return this._cards;
  }

  set cards(value) {
    this._cards = value;
    this.updateState();
  }

  updateState() {
    this.setDirection();
    this.setSuit();
  }

  toString() {
    return this._cards.map(card => {
      if (card.type === "numeric") {
        const attachments = card.attachments?.map(att => att.toString()).join(", ");
        return attachments ? `${card.toString()} [${attachments}]` : card.toString();
      }
      return card.toString();
    }).join(", ");
  }

  setDirection() {
    if (this._cards.length >= 2) {
      const lastCard = this._cards[this._cards.length - 1];
      const nextLastCard = this._cards[this._cards.length - 2];

      if (lastCard.points > nextLastCard.points) {
        this.direction = "asc"; 
      } else if (lastCard.points < nextLastCard.points) {
        this.direction = "desc"; 
      }
    } else {
      this.direction = null;
    }
  }

  reverseDirection() {
    if (this.direction === "asc") this.direction = "desc";
    else if (this.direction === "desc") this.direction = "asc";
    return true;
  }

  setSuit(suit = null) {
    if (suit == null) {
      if (this._cards.length > 0) {
        this.suit = this._cards[this._cards.length - 1].suit;
      } else {
        this.suit = null;
      }
    } else {
      this.suit = suit;
    }
    return true;
  }

  addCard(card) {
    if (!card) return false;
    this._cards.push(card);
    this.updateState();
    return true;
  }

  removeCard(pickedCard) {
    if (!pickedCard) return false;
    if (!this._cards.includes(pickedCard)) return false;
    this._cards = this._cards.filter(card => card !== pickedCard);
    this.updateState();
    return true;
  }

  removeSuit(suit) {
    if (!suit) return false;
    this._cards = this._cards.filter(card => card.suit !== suit);
    this.updateState();
    return true;
  }

  removeValue(value) {
    if (!value) return false;
    this._cards = this._cards.filter(card => card.value !== value);
    this.updateState();
    return true;
  }

  clear() {
    this._cards = [];
    this.updateState();
    return true;
  }

  isEmpty() {
    return this._cards.length === 0;
  }

  size() {
    return this._cards.length;
  }

  getPoints() {
    return this._cards.reduce((sum, card) => sum + card.points, 0);
  }

  isSellable() {
    const points = this.getPoints();
    return points >= 21 && points <= 26;
  }
}

module.exports = Caravan;
