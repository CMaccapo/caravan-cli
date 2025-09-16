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
  "?": (caravan, targetCard, playedCard, playfield) => {
    return targetCard.doublePoints();
  }
};

module.exports = FaceCardRules;