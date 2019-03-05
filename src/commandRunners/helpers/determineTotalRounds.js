const determineTotalRounds = (numPlayers) => {
  if (numPlayers <= 2) return 1
  if (numPlayers <= 4) return 2
  if (numPlayers <= 8) return 3
  if (numPlayers <= 16) return 4
  if (numPlayers <= 32) return 5
  if (numPlayers <= 64) return 6
  if (numPlayers <= 128) return 7
  throw new Error(`Cannot determine rounds from number of players: ${numPlayers}`)
}
module.exports = { determineTotalRounds }