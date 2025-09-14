const Validator = {
  canPlaceOnOwn(player, cardIndex, caravanIndex, phase = "main") {
    const card = player.hand[cardIndex];
    const caravan = player.caravans[caravanIndex];

    if (!card || !caravan) return false;

    if (phase === "pregame") {
      if (!card.type == "numeric") return false;         // only numeric cards
      if (!caravan.isEmpty()) return false;       // only empty caravans
    }

    return true;
  },

  canPlaceOnOpponent(player, cardIndex, opponent, caravanIndex) {
    const card = player.hand[cardIndex];
    const caravan = opponent.caravans[caravanIndex];
    return !!card && !!caravan;
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
