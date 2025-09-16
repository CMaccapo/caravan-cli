class PlayField {
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
  getACaravan(playerIndex, caravanIndex) {
    return this.players[playerIndex].caravans[caravanIndex];
  }
  getACard(playerIndex, caravanIndex, cardIndex) {
    return this.players[playerIndex].caravans[caravanIndex].cards[cardIndex];
  }
  removeAllValue(value){
    if (!value) return false;
    this.cards = this.cards.filter(card => card.value !== value);
    return true;
  }
  removeAllSuit(suit){
    if (!suit) return false;
    this.cards =  this.cards.filter(card => card.suit !== suit);
    return true;
  }
}

module.exports = PlayField;