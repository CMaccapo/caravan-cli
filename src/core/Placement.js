const Placement = {
  placeOnOwn(player, cardIndex, slotIndex) {
    if (!player.hand[cardIndex] || !player.slots[slotIndex]) return false;
    player.slots[slotIndex].push(player.hand[cardIndex]);
    player.hand.splice(cardIndex, 1);
    return true;
  },

  placeOnOpponent(actor, cardIndex, opponent, slotIndex) {
    if (!actor.hand[cardIndex] || !opponent.slots[slotIndex]) return false;
    opponent.slots[slotIndex].push(actor.hand[cardIndex]);
    actor.hand.splice(cardIndex, 1);
    return true;
  },

  discardCaravan(player, slotIndex) {
    if (!player.slots[slotIndex]) return false;
    player.slots[slotIndex] = [];
    return true;
  },

  discardHandCard(player, cardIndex) {
    if (!player.hand[cardIndex]) return false;
    player.hand.splice(cardIndex, 1);
    return true;
  }
};

module.exports = Placement;
