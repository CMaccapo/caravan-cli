const FaceCardRules = {
  J: (caravan, targetCard) => {
    return caravan.removeCard(targetCard);
  },
  Q: (caravan, targetCard) => {
    return true;
  },
  K: (caravan, targetCard) => {
    return true;
  }
};

module.exports = FaceCardRules;