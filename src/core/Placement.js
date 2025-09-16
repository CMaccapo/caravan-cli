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

  attach(playerPlaying, handIndex, caravanIndex, attachToIndex, playerPlayed) {
    playerPlayed.caravans[caravanIndex].cards[attachToIndex].attachCard(playerPlaying.hand[handIndex]);
    playerPlaying.hand.splice(handIndex, 1);
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
