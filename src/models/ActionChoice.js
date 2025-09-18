class ActionChoice {
  constructor({ type, player, opponent, targetPlayer, handCardIndex, caravanIndex, targetCardIndex }) {
    this.type = type; // "place", "attachOwn", "attachOpponent", "discardCaravan", "discardHand"
    this.player = player;
    this.opponent = opponent ?? null;
    this.handCardIndex = handCardIndex ?? null;
    this.targetPlayer = targetPlayer;
    this.caravanIndex = caravanIndex ?? null;
    this.targetCardIndex = targetCardIndex ?? null;
  }
}

module.exports = ActionChoice;
