const Placement = require("./Placement");

const Actions = {
  async execute(choice, player, opponent, deck, ui) {
    switch (choice) {
      case "1": { // own slot
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose slot index (0-2): "), 10);
        if (player.hand[cIdx] && player.slots[sIdx]) {
          player.slots[sIdx].push(player.hand[cIdx]);
          player.hand.splice(cIdx, 1);
        }
        break;
      }
      case "2": { // opponent slot
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose opponent slot index (0-2): "), 10);
        if (player.hand[cIdx] && opponent.slots[sIdx]) {
          opponent.slots[sIdx].push(player.hand[cIdx]);
          player.hand.splice(cIdx, 1);
        }
        break;
      }
      case "3": { // discard slot
        const sIdx = parseInt(await ui.ask("Choose slot index (0-2): "), 10);
        if (player.slots[sIdx]) player.slots[sIdx] = [];
        break;
      }
      case "4": { // discard hand card
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        if (player.hand[cIdx]) player.hand.splice(cIdx, 1);
        break;
      }
      default:
        ui.notify("Invalid choice. Skipping turn.");
    }

    // draw if hand < 5
    if (player.hand.length < 5 && deck.count > 0) {
      player.draw(deck);
      ui.notify(`${player.name} draws a card.`);
    }
  }
};

module.exports = Actions;
