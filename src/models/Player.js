class Player {
  constructor(name, deck) {
    this.name = name;
    this.hand = [];
    this.caravans = [[], [], []]; // 3 caravans
    for (let i = 0; i < 8; i++) {
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

  caravansToString() {
    return this.caravans.map((s, i) => `[${i}](${s.join(" ")})`).join(" ");
  }
}

module.exports = Player;
