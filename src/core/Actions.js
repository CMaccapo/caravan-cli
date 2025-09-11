const Placement = require("./Placement");
const Hand = require("./Hand");

const Actions = {
  async execute(choice, player, opponent, deck, ui) {
    switch (choice) {
      case "1": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose slot index (0-2): "), 10);
        if (!Placement.placeOnOwn(player, cIdx, sIdx)) ui.notify("Invalid placement.");
        break;
      }
      case "2": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose opponent slot index (0-2): "), 10);
        if (!Placement.placeOnOpponent(player, cIdx, opponent, sIdx)) ui.notify("Invalid placement.");
        break;
      }
      case "3": {
        const sIdx = parseInt(await ui.ask("Choose slot index (0-2): "), 10);
        if (!Placement.discardSlot(player, sIdx)) ui.notify("Invalid slot.");
        break;
      }
      case "4": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        if (!Placement.discardHandCard(player, cIdx)) ui.notify("Invalid card.");
        break;
      }
      default:
        ui.notify("Invalid choice. Skipping turn.");
    }

    Hand.drawIfNeeded(player, deck, 5, ui);
  }
};

module.exports = Actions;
