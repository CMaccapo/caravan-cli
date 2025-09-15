const Placement = require("./Placement");
const Validator = require("./Validator");

const Actions = {
  async execute(choice, player, opponent, deck, ui, phase) {
    switch (choice) {
      case "1": {
        const cIdx = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const sIdx = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);

        if (player.hand[cIdx] != null && player.hand[cIdx].type == "numeric"){
          if (!Validator.canPlaceOnOwn(player, cIdx, sIdx, phase)) return false;
          return Placement.placeOnOwn(player, cIdx, sIdx);
        }
        else if (player.hand[cIdx] != null && player.hand[cIdx].type == "special"){
          const attachToIndex = parseInt(await ui.ask("Choose index to attach card to in caravan: "), 10);
          //if (!Validator.canPlaceOnOwn(player, cIdx, sIdx, attachToIndex)) return false;
          return Placement.attachToOwn(player, cIdx, sIdx, attachToIndex);
        }
        
        return false;
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

  }
};

module.exports = Actions;
