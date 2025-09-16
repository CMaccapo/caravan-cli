const Placement = require("./Placement");
const Validator = require("./Validator");
const ActionChoice = require("../models/ActionChoice");

const Actions = {
  async execute(choice, game) {
    const player = game.currentPlayer;
    const opponent = game.otherPlayer;
    const deck = game.deck;
    const phase = game.phase;
    const ui = game.ui;
    const playField = game.playField;
    switch (choice) {
      case "1": {
        const handCardIndex = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const caravanIndex = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);

        if (!Validator.placeExists(player, handCardIndex, caravanIndex, phase)) return false;

        if (player.hand[handCardIndex].type == "numeric"){
          let actionChoice = new ActionChoice({
            type: "place",
            player: player,
            targetPlayer: player,
            handCardIndex: handCardIndex,
            caravanIndex: caravanIndex
          });
          if (!Validator.canPlace(actionChoice, phase)) return false;
          return Placement.place(actionChoice);
        }
        else if (player.hand[handCardIndex].type === "special"){
          const attachToIndex = await getAttachToIndex(
            ui,
            player, 
            caravanIndex,
            player.hand[handCardIndex].value
          ) 
          let actionChoice = new ActionChoice({
            type: "attach",
            player: player,
            targetPlayer: player,
            handCardIndex: handCardIndex,
            caravanIndex: caravanIndex,
            targetCardIndex: attachToIndex
          });
          if (!Validator.canAttach(actionChoice, phase)) return false;
          return Placement.attach(actionChoice, playField);
        }
        
        return false;
      }
      case "2": {
        const handCardIndex = parseInt(await ui.ask("Choose card index from hand: "), 10);
        const caravanIndex = parseInt(await ui.ask("Choose opponent caravan index (0-2): "), 10);
        const attachToIndex = await getAttachToIndex(
          ui,
          opponent, 
          caravanIndex,
          player.hand[handCardIndex].value
        )
        let actionChoice = new ActionChoice({
          type: "attach",
          player: player,
          targetPlayer: opponent,
          handCardIndex: handCardIndex,
          caravanIndex: caravanIndex,
          targetCardIndex: attachToIndex
        });
        
        if (!Validator.canAttach(actionChoice, phase)) return false;
        return Placement.attach(actionChoice, playField);
      }
      case "3": {
        const caravanIndex = parseInt(await ui.ask("Choose caravan index (0-2): "), 10);
        
        if (!Validator.canDiscardCaravan(player, caravanIndex)) return false;
        return Placement.discardCaravan(player, caravanIndex);
      }
      case "4": {
        const handCardIndex = parseInt(await ui.ask("Choose card index from hand: "), 10);

        if (!Validator.canDiscardHandCard(player, handCardIndex)) return false;
        return Placement.discardHandCard(player, handCardIndex);
      }

      default:
        return false; // invalid choice
    }
  }
};
async function getAttachToIndex(ui, player, caravanIndex, card) {
  if (card.value === "Q") {
    return player.caravans[caravanIndex].cards.length - 1;
  } else {
    return parseInt(await ui.ask("Choose index to attach card to in caravan: "), 10);
  }
}

module.exports = Actions;
