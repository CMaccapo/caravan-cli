class ActionChoice {
  constructor({ type, playerIndex, targetPlayerIndex, cardIndex, caravanIndex, attachToIndex }) {
    this.type = type; // "place", "attachOwn", "attachOpponent", "discardCaravan", "discardHand"
    this.playerIndex = playerIndex;
    this.targetPlayerIndex = targetPlayerIndex ?? playerIndex; // default to self
    this.cardIndex = cardIndex ?? null;
    this.caravanIndex = caravanIndex ?? null;
    this.attachToIndex = attachToIndex ?? null;
  }
}

module.exports = ActionChoice;
