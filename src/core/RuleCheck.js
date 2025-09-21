const RuleCheck = {
  canPlace(actionChoice, phase) {
    const card = actionChoice.player.hand.cards[actionChoice.handCardIndex];
    const caravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];
    
    if (card.type !== "numeric") return false;
    if (phase === "pregame") {
      if (!caravan.isEmpty()) return false;
    }
    let lastCard = null;
    if (caravan.cards.length > 0){
      lastCard = caravan.cards[caravan.cards.length - 1];
    }
    if(lastCard){
      if (card.suit === lastCard.suit) return true;
      if (caravan.direction === "asc" && card.points < lastCard.points) return false;
      if (caravan.direction === "desc" && card.points > lastCard.points) return false;
      if (card.points === lastCard.points) return false;
    }
    return true;
  },
  canAttach(actionChoice, phase){
    const card = actionChoice.player.hand.cards[actionChoice.handCardIndex];
    const caravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];

    if (card.type !== "special") return false;
    if (phase === "pregame") return false;

    return true;
  }
};

module.exports = RuleCheck;
