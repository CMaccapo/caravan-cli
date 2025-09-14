const Placement = {
  pregamePlace(player, cardIndex, caravanIndex){
    player.caravans[caravanIndex].addCard(player.hand[cardIndex]);
    player.hand.splice(cardIndex, 1);
    return true;
  },

  placeOnOwn(player, cardIndex, caravanIndex) {
    if (!player.hand[cardIndex] || !player.caravans[caravanIndex]) return false;
    player.caravans[caravanIndex].addCard(player.hand[cardIndex]);
    player.hand.splice(cardIndex, 1);
    return true;
  },

  placeOnOpponent(actor, cardIndex, opponent, caravanIndex) {
    if (!actor.hand[cardIndex] || !opponent.caravans[caravanIndex]) return false;
    opponent.caravans[caravanIndex].addCard(actor.hand[cardIndex]);
    actor.hand.splice(cardIndex, 1);
    return true;
  },

  discardCaravan(player, caravanIndex) {
    if (!player.caravans[caravanIndex]) return false;
    player.caravans[caravanIndex].clear();
    return true;
  },

  discardHandCard(player, cardIndex) {
    if (!player.hand[cardIndex]) return false;
    player.hand.splice(cardIndex, 1);
    return true;
  }
};

module.exports = Placement;
