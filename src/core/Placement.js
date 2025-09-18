const FaceCardRules = require("./FaceCardRules");

const Placement = {
  pregamePlace(player, cardIndex, caravanIndex){
    player.caravans[caravanIndex].addCard(player.hand.cards[cardIndex]);
    actionChoice.player.hand.removeCard(player.hand.cards[cardIndex]);
    return true;
  },

  place(actionChoice) {
    actionChoice.targetPlayer.caravans[actionChoice.caravanIndex].addCard(actionChoice.player.hand.cards[actionChoice.handCardIndex]);
    actionChoice.player.hand.removeCard(actionChoice.player.hand.cards[actionChoice.handCardIndex]);
    return true;
  },

  attach(actionChoice) {
    const card = actionChoice.player.hand.cards[actionChoice.handCardIndex];
    const targetCaravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];
    const targetCard = targetCaravan.cards[actionChoice.targetCardIndex];
    
    targetCard.attachCard(card);
    actionChoice.player.hand.removeCard(card);
    
    return FaceCardRules[card.value](actionChoice, card);
  },

  discardCaravan(player, caravanIndex) {
    player.caravans[caravanIndex].clear();
    return true;
  },

  discardHandCard(player, cardIndex) {
    player.hand.removeCard(player.hand.cards[cardIndex]);
    return true;
  }
};

module.exports = Placement;
