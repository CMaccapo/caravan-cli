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

      default:
        return false; // invalid choice
    }
  }
};
async function promptActionChoice(actionType, ui, player, opponent) {
  let handCardIndex = null;
  let caravanIndex = null;
  let targetCardIndex = null;
  let targetPlayer = null;

  if (!player) return false;
  //choose card index
  if (actionType !== "discardCaravan") {
    handCardIndex = await chooseIndex(player.hand, "Hand", ui);
    if (!player.hand.cards[handCardIndex]) return false;
    if (actionType !== "discardHand") {
      if ((actionType = setType(player.hand.cards[handCardIndex].type)) === false) return false;
    }
  }
  //choose field if attach
  if (actionType.includes("attach")) {
    const fieldIndex = await chooseIndex(["Yourself[0]", "Opponent[1]"], "Field", ui);

    targetPlayer = pickTargetPlayer(fieldIndex, player, opponent);
    if (!targetPlayer) return false;
  }
  else if (actionType.includes("place")){
    targetPlayer = player;
  }
  //choose caravan
  if (actionType !== "discardHand") {
    caravanIndex = await chooseIndex([0,1,2], "Caravans", ui);
    if (!targetPlayer.caravans[caravanIndex]) return false;
  }
  //choose target card if attach
  if (actionType.includes("attach")) {
    const handCardValue = player.hand.cards[handCardIndex].value;

    if (handCardValue === "Q") {
      targetCardIndex =  targetPlayer.caravans[caravanIndex].cards.length - 1;
    } else {
      targetCardIndex = await chooseIndex(targetPlayer.caravans[caravanIndex].cards, "Cards", ui);
    }
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

async function chooseIndex(pickFrom, name, ui){
  const handInput = await ui.ask(`
    ${name}: ${pickFrom} 
    Choose index from ${name}: `);
  return parseInt(handInput, 10);
}
function pickTargetPlayer(fieldIndex, player, opponent){
  switch(fieldIndex){
    case 0: return player;
    case 1: return opponent;
    default: return false;
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
      return null;
  }
}

module.exports = Actions;
