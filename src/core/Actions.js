const Placement = require("./Placement");
const Validator = require("./Validator");

const Actions = {
  async execute(choice, player, opponent, deck, ui, phase) {
    switch (choice) {
      case "1": {
        const cardIndex = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const caravanIndex = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);

        if (!Validator.placeExists(player, cardIndex, caravanIndex, phase)) return false;


        if (player.hand[cardIndex].type == "numeric"){
          if (!Validator.canPlaceOnOwn(player, cardIndex, caravanIndex, phase)) return false;
          return Placement.placeOnOwn(player, cardIndex, caravanIndex);
        }
        else if (player.hand[cardIndex].type == "special"){
          const attachToIndex = parseInt(await ui.ask("Choose index to attach card to in caravan: "), 10);
          if (!Validator.canAttach(player, cardIndex, caravanIndex, player, phase)) return false;
          return Placement.attach(player, cardIndex, caravanIndex, attachToIndex, player);
        }
        
        return false;
      }
      case "2": {
        const cardIndex = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const caravanIndex = parseInt(await ui.ask("Choose opponent caravan index (0-2): "), 10);
        const attachToIndex = parseInt(await ui.ask("Choose index to attach card to in caravan: "), 10);
        
        if (!Validator.canAttach(player, cardIndex, caravanIndex, opponent, phase)) return false;
        return Placement.attach(player, cardIndex, caravanIndex, attachToIndex, opponent);
      }
      case "3": {
        const caravanIndex = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);
        
        if (!Validator.canDiscardCaravan(player, caravanIndex)) return false;
        return Placement.discardCaravan(player, caravanIndex);
      }
      case "4": {
        const cardIndex = parseInt(await ui.ask("Choose card index from hand: "), 10);

        if (!Validator.canDiscardHandCard(player, cardIndex)) return false;
        return Placement.discardHandCard(player, cardIndex);
      }

      default:
        return false; // invalid choice
    }

  }
};

module.exports = Actions;
