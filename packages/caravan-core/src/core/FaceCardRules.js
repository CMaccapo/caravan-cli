const FaceCardRules = {
  "J": (actionChoice) => {
    const targetCaravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];
    const targetCard = targetCaravan.cards[actionChoice.targetCardIndex];

    return targetCaravan.removeCard(targetCard);
  },
  "Q": (actionChoice, playedCard) => {
    const targetCaravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];

    return targetCaravan.reverseDirection() && targetCaravan.setSuit(playedCard.suit);
  },
  "K": (actionChoice) => {
    const targetCaravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];
    const targetCard = targetCaravan.cards[actionChoice.targetCardIndex];

    return targetCard.doublePoints();
  },
  "Jo": (actionChoice) => {
    const targetCaravan = actionChoice.targetPlayer.caravans[actionChoice.caravanIndex];
    const targetCard = targetCaravan.cards[actionChoice.targetCardIndex];
    const players = [actionChoice.player, actionChoice.opponent]

    if (targetCard.value === "A"){
      return removeCardsWithSuit(players, targetCard)
    }
    return removeCardsWithValue(players, targetCard)
  }
};
function removeCardsWithSuit(players, targetCard) {
  for (const player of players) {
    for (const caravan of player.caravans) {
      if (!caravan.removeSuit(targetCard.suit)) {
        return false;
      }
    }
  }
  return true;
}
function removeCardsWithValue(players, targetCard) {
  for (const player of players) {
    for (const caravan of player.caravans) {
      if (!caravan.removeValue(targetCard.value)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = FaceCardRules;