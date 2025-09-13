const Placement = require("./Placement");
const Hand = require("./Hand");

const Actions = {
  async execute(choice, player, opponent, deck, ui) {
    switch (choice) {
      case "1": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);
        return Placement.placeOnOwn(player, cIdx, sIdx); // returns true/false
      }
      case "2": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose opponent caravan index (0-2): "), 10);
        return Placement.placeOnOpponent(player, cIdx, opponent, sIdx);
      }
      case "3": {
        const sIdx = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);
        return Placement.discardCaravan(player, sIdx);
      }
      case "4": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        return Placement.discardHandCard(player, cIdx);
      }
      default:
        return false; // invalid choice
    }

    Hand.drawIfNeeded(player, deck, 5, ui);
  },
  async pregameExecute(player, opponent, deck, ui) {
    const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
    const sIdx = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);
    return Placement.pregamePlace(player, cIdx, sIdx); 
  }
};

module.exports = Actions;
