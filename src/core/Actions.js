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
        let actionChoice = await promptActionChoice(
          "attach",
          ui,
          player,
          opponent
        );
        
        if (!Validator.canAttach(actionChoice, phase)) return false;
        return Placement.attach(actionChoice, playField);
      }
      case "3": {
        let actionChoice = await promptActionChoice(
          "discardCaravan",
          ui,
          player,
          opponent
        );
        
        if (!Validator.canDiscardCaravan(player, actionChoice.caravanIndex)) return false;
        return Placement.discardCaravan(player, actionChoice.caravanIndex);
      }
      case "4": {
        let actionChoice = await promptActionChoice(
          "discardHand",
          ui,
          player,
          opponent
        );

        if (!Validator.canDiscardHandCard(player, actionChoice.handCardIndex)) return false;
        return Placement.discardHandCard(player, actionChoice.handCardIndex);
      }

      default:
        return false; // invalid choice
    }
  }
};
async function promptActionChoice(actionType, ui, player, targetPlayer) {
  let handCardIndex = null;
  let caravanIndex = null;
  let targetCardIndex = null;

  const isPlacingOrAttaching = actionType === "place" || actionType === "attach" || actionType === "discardHand";
  if (isPlacingOrAttaching) {
    const handInput = await ui.ask("Choose card index from hand: ");
    handCardIndex = parseInt(handInput, 10);
  }

  if (actionType !== "discardHand") {
    const caravanInput = await ui.ask("Choose caravan index (0-2): ");
    caravanIndex = parseInt(caravanInput, 10);
  }

  if (actionType.includes("attach")) {
    const handCardValue = player.hand[handCardIndex].value;
    targetCardIndex = await getAttachToIndex(ui, targetPlayer, caravanIndex, handCardValue);
  }

  return new ActionChoice({
    type: actionType,
    player,
    targetPlayer,
    handCardIndex,
    caravanIndex,
    targetCardIndex
  });
}

async function getAttachToIndex(ui, player, caravanIndex, card) {
  if (card.value === "Q") {
    return player.caravans[caravanIndex].cards.length - 1;
  } else {
    return parseInt(await ui.ask("Choose index to attach card to in caravan: "), 10);
  }
}

module.exports = Actions;
