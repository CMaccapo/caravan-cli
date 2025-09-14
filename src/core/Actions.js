const Placement = require("./Placement");
const Validator = require("./Validator");

const Actions = {
  async execute(choice, player, opponent, deck, ui) {
    switch (choice) {
      case "1": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);
        
        if (!Validator.canPlaceOnOwn(player, cIdx, sIdx, phase="main")) return false;
        return Placement.placeOnOwn(player, cIdx, sIdx); // returns true/false
      }
      case "2": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose opponent caravan index (0-2): "), 10);
        
        if (!Validator.canPlaceOnOpponent(player, cIdx, opponent, sIdx)) return false;
        return Placement.placeOnOpponent(player, cIdx, opponent, sIdx);
      }
      case "3": {
        const sIdx = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);
        
        if (!Validator.canDiscardCaravan(player, sIdx)) return false;
        return Placement.discardCaravan(player, sIdx);
      }
      case "4": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);

        if (!Validator.canDiscardHandCard(player, cIdx)) return false;
        return Placement.discardHandCard(player, cIdx);
      }
      default:
        return false; // invalid choice
    }

  },
  async pregameExecute(player, opponent, deck, ui) {
    const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
    const sIdx = parseInt(await ui.ask("Choose empty caravan index (0-2): "), 10);

    if (!Validator.canPlaceOnOwn(player, cIdx, sIdx, phase="pregame")) return false;
    return Placement.pregamePlace(player, cIdx, sIdx); 
  }
};

module.exports = Actions;
