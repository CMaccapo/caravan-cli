class Player {
  constructor(name, deck) {
    this.name = name;
    this.hand = [];
    this.slots = [[], [], []]; // 3 slots
    for (let i = 0; i < 7; i++) {
      this.draw(deck);
    }
  }

  draw(deck) {
    if (deck.count > 0) {
      this.hand.push(deck.draw());
    }
  }

  handToString() {
    return this.hand.map((c, i) => `[${i}]${c}`).join(" ");
  }

  slotsToString() {
    return this.slots.map((s, i) => `[${i}](${s.join(" ")})`).join(" ");
  }
}

module.exports = Player;
