const Validator = {
  placeExists(player, cardIndex, caravanIndex){
    const card = player.hand[cardIndex];
    const caravan = player.caravans[caravanIndex];
    if (!card || !caravan) return false;
    return true;
  },
  canPlace(actionChoice, phase) {
    const card = actionChoice.player.hand[actionChoice.handCardIndex];
    const caravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];
    
    if (card.type !== "numeric") return false;
    if (phase === "pregame") {
      if (!caravan.isEmpty()) return false;
    }

    if(caravan.direction !== null){
      const lastCard = caravan.cards[caravan.cards.length - 1];
      if (card.suit === lastCard.suit) return true;
      if (caravan.direction === "asc" && card.points < lastCard.points) return false;
      if (caravan.direction === "desc" && card.points > lastCard.points) return false;
    }
    return true;
  },
  canAttach(actionChoice, phase){
    const card = actionChoice.player.hand[actionChoice.handCardIndex];
    const caravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];

    if (!card || !caravan) return false;

    if (card.type !== "special") return false;
    if (phase === "pregame") return false;

    return true;
  },

  canDiscardCaravan(player, caravanIndex) {
    const caravan = player.caravans[caravanIndex];
    return !!caravan;
  },

  canDiscardHandCard(player, cardIndex) {
    return !!player.hand[cardIndex];
  }
};

module.exports = Validator;
