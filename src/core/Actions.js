const Actions = {
  async execute(choice, player, opponent, deck, ui) {
    switch (choice) {
      case "1": { // place in own slot
        let cIdx = await ui.ask("Choose card index from hand: ");
        let sIdx = await ui.ask("Choose slot index (0-2): ");
        if (player.hand[cIdx]) {
          player.slots[sIdx].push(player.hand[cIdx]);
          player.hand.splice(cIdx, 1);
        }
        break;
      }
      case "2": { // place in opponent slot
        let cIdx = await ui.ask("Choose card index from hand: ");
        let sIdx = await ui.ask("Choose opponent slot index (0-2): ");
        if (player.hand[cIdx]) {
          opponent.slots[sIdx].push(player.hand[cIdx]);
          player.hand.splice(cIdx, 1);
        }
        break;
      }
      case "3": { // discard all from slot
        let sIdx = await ui.ask("Choose slot index (0-2): ");
        player.slots[sIdx] = [];
        break;
      }
      case "4": { // discard one card from hand
        let cIdx = await ui.ask("Choose card index from hand: ");
        if (player.hand[cIdx]) {
          player.hand.splice(cIdx, 1);
        }
        break;
      }
      default:
        ui.notify("Invalid choice. Skipping turn.");
    }

    // End of turn: auto draw if < 5 cards
    if (player.hand.length < 5 && deck.count > 0) {
      player.draw(deck);
      ui.notify(`${player.name} draws a card.`);
    }
  }
};

module.exports = Actions;
