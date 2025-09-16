const FaceCardRules = {
  "J": (caravan, targetCard, playedCard) => {
    return caravan.removeCard(targetCard);
  },
  "Q": (caravan, targetCard, playedCard) => {
    return caravan.reverseDirection() && caravan.setSuit(playedCard.suit);
  },
  "K": (caravan, targetCard, playedCard) => {
    return targetCard.doublePoints();
  },
  "?": (caravan, targetCard, playedCard, playField) => {
    if (targetCard.value === "A"){
      return playField.removeAllSuit(targetCard.suit);
    }
    return playField.removeAllValue(targetCard.value);
  }
};

module.exports = FaceCardRules;