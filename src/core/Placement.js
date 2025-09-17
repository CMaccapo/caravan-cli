const FaceCardRules = require("./FaceCardRules");

const Placement = {
  pregamePlace(player, cardIndex, caravanIndex){
    player.caravans[caravanIndex].addCard(player.hand[cardIndex]);
    player.hand.splice(cardIndex, 1);
    return true;
  },

  place(actionChoice) {
    actionChoice.targetPlayer.caravans[actionChoice.caravanIndex].addCard(actionChoice.player.hand[actionChoice.handCardIndex]);
    actionChoice.player.hand.splice(actionChoice.handCardIndex, 1);
    return true;
  },

  attach(actionChoice) {
    const card = actionChoice.player.hand[actionChoice.handCardIndex];
    const targetCaravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];
    const targetCard = targetCaravan.cards[actionChoice.targetCardIndex];
    
    targetCard.attachCard(card);
    actionChoice.player.hand.splice(actionChoice.handCardIndex, 1);
    
    return FaceCardRules[card.value](actionChoice, card);
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
