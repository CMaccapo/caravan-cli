const Placement = require("./Placement");
const RuleCheck = require("./RuleCheck");
const ActionChoice = require("../models/ActionChoice");

const Actions = {
  async execute(choice, game) {
    const player = game.currentPlayer;
    const opponent = game.otherPlayer;
    const phase = game.phase;
    const ui = game.ui;

    let actionChoice;

    switch (choice) {
      case "1": {
        const result = await promptActionChoice("place", ui, player, opponent, phase);
        if (!result.success) return { success: false, error: result.error };

        const actionChoice = result.actionChoice;

        if (actionChoice.type === "place") {
          if (!RuleCheck.canPlace(actionChoice, phase)) {
            const msg = phase === "pregame"
              ? "Invalid Placement: Must place on empty caravan in pregame"
              : "Invalid Placement: Non-matching Suit or Direction";
            return { success: false, error: msg };
          }
          Placement.place(actionChoice);
          return { success: true };
        }

        if (actionChoice.type === "attach") {
          if (!RuleCheck.canAttach(actionChoice, phase)) {
            return { success: false, error: "Invalid attachment: Cannot attach this card here" };
          }
          Placement.attach(actionChoice);
          return { success: true };
        }
        break;
      }

      case "2": {
        const handCardIndex = await chooseIndex(player.hand, "Hand", ui);
        if (!player.hand.cards[handCardIndex]) return { success: false, error: "Invalid hand card index" };
        Placement.discardHandCard(player, handCardIndex);
        return { success: true };
      }

      case "3": {
        const caravanIndex = await chooseCaravan("discardCaravan", player, ui);
        if (!player.caravans[caravanIndex]) return { success: false, error: "Invalid caravan index" };
        Placement.discardCaravan(player, caravanIndex);
        return { success: true };
      }

      default:
        return { success: false, error: "Invalid action choice" };
    }
  }
};

async function promptActionChoice(actionType, ui, player, opponent, phase) {
  if (!player) return { success: false, error: "No player provided" };

  const handCardIndex = await chooseIndex(player.hand, "Hand", ui);
  if (handCardIndex === false || !player.hand.cards[handCardIndex])
    return { success: false, error: "Invalid hand card index" };

  actionType = setPlaceType(actionType, player.hand.cards[handCardIndex].type);
  if (actionType === false) return { success: false, error: "Invalid card type" };
  if (phase === "pregame" && actionType !== "place")
    return { success: false, error: "Cannot attach in pregame" };

  const fieldIndex = await chooseField(actionType, ui);
  if (fieldIndex === false) return { success: false, error: "Invalid field selection" };

  const targetPlayer = pickTargetPlayer(actionType, fieldIndex, player, opponent);
  if (!targetPlayer) return { success: false, error: "Invalid target player" };

  const caravanIndex = await chooseCaravan(actionType, targetPlayer, ui);
  if (caravanIndex === false || !targetPlayer.caravans[caravanIndex])
    return { success: false, error: "Invalid caravan selection" };

  let targetCardIndex = null;
  if (actionType === "attach") {
    targetCardIndex = await chooseTargetCard(actionType, player, targetPlayer, handCardIndex, caravanIndex, ui);
    if (targetCardIndex === false || !targetPlayer.caravans[caravanIndex].cards[targetCardIndex])
      return { success: false, error: "Invalid card selection for attachment" };
  }

  const actionChoice = new ActionChoice({
    type: actionType,
    player,
    opponent,
    handCardIndex,
    targetPlayer,
    caravanIndex,
    targetCardIndex
  });

  return { success: true, actionChoice };
}


async function chooseIndex(pickFrom, name, ui) {
  const input = await ui.ask(`\n${name}: ${pickFrom}\nChoose index from ${name}: `);
  const index = parseInt(input, 10);
  if (Number.isNaN(index) || index < 0 || index >= pickFrom.length) return false;
  return index;
}

function pickTargetPlayer(actionType, fieldIndex, player, opponent) {
  if (actionType === "attach") {
    return fieldIndex === 0 ? player : opponent;
  }
  return player;
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
    return await chooseIndex(["[0]Self", " [1]Opponent"], "Field", ui);
  }
}

async function chooseCaravan(actionType, targetPlayer, ui) {
    if (actionType === "discardHand") return false;
    const caravanIndex = await chooseIndex(targetPlayer.caravansStr, "Caravans", ui);
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
      targetCardIndex = await chooseIndex(targetPlayer.caravans[caravanIndex].cardsStr, "Cards", ui);
    }
    if (!targetPlayer.caravans[caravanIndex].cards[targetCardIndex]) return false;
    return targetCardIndex;
  }
}

module.exports = Actions;
