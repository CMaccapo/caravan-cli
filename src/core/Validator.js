const Validator = {
  canPlaceOnOwn(player, cardIndex, caravanIndex, phase) {
    const card = player.hand[cardIndex];
    const caravan = player.caravans[caravanIndex];

    if (!card || !caravan) return false;

    if (card.type != "numeric") return false;
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
