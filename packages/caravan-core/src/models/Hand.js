class Hand {
  constructor(cards) {
    this._cards = [];
  }
  get cards() {
    return this._cards;
  }
  set cards(value) {
    this._cards = value;
  }

  toString() {
    return this._cards.map((card, index) => `[${index}]${card}`).join(" ");
  }
  addCard(card) {
    if (!card) return false;
    this._cards.push(card);
    return true;
  }

  removeCard(pickedCard) {
    if (!pickedCard) return false;
    if (!this._cards.includes(pickedCard)) return false;
    this._cards = this._cards.filter(card => card !== pickedCard);
    return true;
  }

}
module.exports = Hand;
