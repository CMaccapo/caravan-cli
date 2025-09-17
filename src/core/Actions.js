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
    let targetPlayer;
    
    switch (choice) {
      case "1": {
        let actionChoice = await promptActionChoice(
          "place",
          ui,
          player,
          opponent,
          player
        );
        if (actionChoice === false) return false;
        if (actionChoice.type == "place"){
          if (!Validator.canPlace(actionChoice, phase)) return false;
          return Placement.place(actionChoice);
        }
        if (actionChoice.type == "attach"){
          if (!Validator.canAttach(actionChoice, phase)) return false;
          return Placement.attach(actionChoice);
        }
      }
      case "2": {   
        let fieldIndex = await ui.ask("Field: Yourself[0] Opponent[1]: ");
        fieldIndex = parseInt(fieldIndex, 10);
        let targetPlayer;

        if (fieldIndex == 0) targetPlayer = player;
        if (fieldIndex == 1) targetPlayer = opponent;

        let actionChoice = await promptActionChoice(
          "attach",
          ui,
          player,
          opponent,
          targetPlayer
        );
        if (actionChoice === false) return false;
        if (!Validator.canAttach(actionChoice, phase)) return false;
        return Placement.attach(actionChoice);
      }
      case "3": {
        let actionChoice = await promptActionChoice(
          "discardCaravan",
          ui,
          player,
          opponent,
          opponent
        );
        if (actionChoice === false) return false;
        if (!Validator.canDiscardCaravan(player, actionChoice.caravanIndex)) return false;
        return Placement.discardCaravan(player, actionChoice.caravanIndex);
      }
      case "4": {
        let actionChoice = await promptActionChoice(
          "discardHand",
          ui,
          player,
          opponent,
          opponent
        );
        if (actionChoice === false) return false;
        if (!Validator.canDiscardHandCard(player, actionChoice.handCardIndex)) return false;
        return Placement.discardHandCard(player, actionChoice.handCardIndex);
      }

      default:
        return false; // invalid choice
    }
  }
};
async function promptActionChoice(actionType, ui, player, opponent) {
  let handCardIndex = null;
  let caravanIndex = null;
  let targetCardIndex = null;

  if (!player) return false;
  //choose card index
  if (actionType !== "discardCaravan") {
    const handInput = await ui.ask("Choose card index from hand: ");
    handCardIndex = parseInt(handInput, 10);
    if (!player.hand[handCardIndex]) return false;
    if ((actionType = setType(player.hand[handCardIndex].type)) === false) return false;
  }
  //choose field if attach
  if (actionType.includes("attach")) {
    let fieldIndex = await ui.ask("Field: Yourself[0] Opponent[1]: ");
    fieldIndex = parseInt(fieldIndex, 10);

    if (fieldIndex == 0) targetPlayer = player;
    if (fieldIndex == 1) targetPlayer = opponent;
    if (!targetPlayer) return false;
  }
  //choose caravan
  if (actionType !== "discardHand") {
    targetPlayer = player;
    const caravanInput = await ui.ask("Choose caravan index (0-2): ");
    caravanIndex = parseInt(caravanInput, 10);
    if (!targetPlayer.caravans[caravanIndex]) return false;
  }
  //choose target card if attach
  if (actionType.includes("attach")) {
    const handCardValue = player.hand[handCardIndex].value;
    targetCardIndex = await getAttachToIndex(ui, targetPlayer, caravanIndex, handCardValue);
    if (!targetPlayer.caravans[caravanIndex].cards[targetCardIndex]) return false;
  }

  return new ActionChoice({
    type: actionType,
    player,
    opponent,
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
function setType(type){
  if (!type) return false;
  switch (type) {
    case "numeric": {
      return "place";
    }
    case "special": {
      return "attach";
    }
    default:
      return false;
  }
}

module.exports = Actions;
