class Playfield {
  constructor(players) {
    this.players = players;
  }
  get cards() {
    return this.players.flatMap(p =>
      p.caravans.flatMap(c =>
        c.cards.flatMap(card => [card, ...(card.attachments || [])])
      )
    );
  }
  removeAllValue(value){
    if (!value) return false;
    return this.cards.filter(card => card.value !== value);
    // this.setDirection();
    // this.setSuit();
    return true;
  }
}

module.exports = Playfield;