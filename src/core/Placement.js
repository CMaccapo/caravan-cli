const Placement = {
  pregamePlace(player, cardIndex, caravanIndex){
    player.caravans[caravanIndex].addCard(player.hand[cardIndex]);
    player.hand.splice(cardIndex, 1);
    return true;
  },

  placeOnOwn(player, cardIndex, caravanIndex) {
    player.caravans[caravanIndex].addCard(player.hand[cardIndex]);
    player.hand.splice(cardIndex, 1);
    return true;
  },

  attachToOwn(player, handIndex, caravanIndex, attachToIndex) {
    player.caravans[caravanIndex].cards[attachToIndex].attachCard(player.hand[handIndex]);
    player.hand.splice(handIndex, 1);
    return true;
  },

  placeOnOpponent(actor, cardIndex, opponent, caravanIndex) {
    opponent.caravans[caravanIndex].addCard(actor.hand[cardIndex]);
    actor.hand.splice(cardIndex, 1);
    return true;
  },

  discardCaravan(player, caravanIndex) {
    player.caravans[caravanIndex].clear();
    return true;
  },

  discardHandCard(player, cardIndex) {
    player.hand.splice(cardIndex, 1);
    return true;
  }
};

module.exports = Placement;
