// src/core/Hand.js
const Hand = {
  needsDraw(player, min = 5) {
    return player.hand.length < min;
  },

  drawIfNeeded(player, deck, min = 5, ui) {
    if (Hand.needsDraw(player, min) && deck.count > 0) {
      player.draw(deck);
      if (ui) ui.notify(`${player.name} draws a card.`);
      return true;
    }
    return false;
  }
};

module.exports = Hand;
