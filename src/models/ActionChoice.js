class ActionChoice {
  constructor({ type, player, targetPlayer, handCardIndex, caravanIndex, targetCardIndex }) {
    this.type = type; // "place", "attachOwn", "attachOpponent", "discardCaravan", "discardHand"
    this.player = player;
    this.targetPlayer = targetPlayer;
    this.handCardIndex = handCardIndex ?? null;
    this.caravanIndex = caravanIndex ?? null;
    this.targetCardIndex = targetCardIndex ?? null;
  }
}

module.exports = ActionChoice;
