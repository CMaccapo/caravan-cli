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
  let handCardIndex, caravanIndex, targetCardIndex;
  let targetPlayer = player;
  let fieldIndex = 0;

  if (!player) return false;

  handCardIndex = await chooseHandCard(actionType, player, ui);
  if (!player.hand.cards[handCardIndex]) return false;

  actionType = setPlaceType(actionType, player.hand.cards[handCardIndex].type);
  if ((actionType) === false) return false;
  
  async function chooseHandCard(actionType, player, ui){
    if (actionType === "discardCaravan") return false;
    return await chooseIndex(player.hand, "Hand", ui);
  }
  
  fieldIndex = await chooseField(actionType, ui);
  if (fieldIndex === false) return false;
  
  targetPlayer = pickTargetPlayer(actionType, fieldIndex, player, opponent);
  if (!targetPlayer) return false;
  
  caravanIndex = await chooseCaravan(actionType, targetPlayer, ui);
  if (!targetPlayer.caravans[caravanIndex]) return false;
  
  targetCardIndex = await chooseTargetCard(actionType, player, targetPlayer, handCardIndex, caravanIndex, ui);

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

function pickTargetPlayer(actionType, fieldIndex, player, opponent){
  if(actionType=="attach"){
    switch(fieldIndex){
      case 0: return player;
      case 1: return opponent;
    }
  }
  else if (actionType=="place") return player;
  else if (actionType=="discardHand") return player;
  else if (actionType=="discardCaravan") return player;
}

function setPlaceType(actionType, type){
  if (!type) return false;
  if (actionType.includes("discard")) return false;
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

async function chooseField(actionType, ui){
  if (actionType.includes("attach")) {
    return await chooseIndex(["Yourself[0]", "Opponent[1]"], "Field", ui);
  }
}

async function chooseCaravan(actionType, targetPlayer, ui) {
    if (actionType === "discardHand") return false;
    const caravanIndex = await chooseIndex([0,1,2], "Caravans", ui);
    if (!targetPlayer.caravans[caravanIndex]) return false;
    return caravanIndex;
  }

async function chooseTargetCard(actionType, player, targetPlayer, handCardIndex, caravanIndex, ui){
  if (actionType.includes("attach")) {
    const handCardValue = player.hand.cards[handCardIndex].value;
    let targetCardIndex;

    if (handCardValue === "Q") {
      targetCardIndex = targetPlayer.caravans[caravanIndex].cards.length - 1;
    } else {
      targetCardIndex = await chooseIndex(targetPlayer.caravans[caravanIndex].cards, "Cards", ui);
    }
    if (!targetPlayer.caravans[caravanIndex].cards[targetCardIndex]) return false;
    return targetCardIndex;
  }
}

module.exports = Actions;
