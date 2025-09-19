class ActionChoice {
  constructor({ type, player, opponent, phase, handCardIndex, targetPlayer, caravanIndex, targetCardIndex }) {
    this.type = type; // "place", "attach", "discardCaravan", "discardHand"
    this.player = player;
    this.opponent = opponent;
    this.handCardIndex = handCardIndex;
    this.phase = phase;
    this.targetPlayer = targetPlayer;
    this.caravanIndex = caravanIndex;
    this.targetCardIndex = targetCardIndex;
  }
}

module.exports = ActionChoice;
