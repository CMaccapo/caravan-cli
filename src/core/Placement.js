const FaceCardRules = require("./FaceCardRules");

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

  attach(playerPlaying, handIndex, caravanIndex, attachToIndex, playerPlayed, playField) {
    const cardToAttach = playerPlaying.hand[handIndex];
    const targetCard = playerPlayed.caravans[caravanIndex].cards[attachToIndex];
    
    targetCard.attachCard(cardToAttach);
    playerPlaying.hand.splice(handIndex, 1);
    
    return FaceCardRules[cardToAttach.value](playerPlayed.caravans[caravanIndex], targetCard, cardToAttach, playField);
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
