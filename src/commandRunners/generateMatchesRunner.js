const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let savedTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let players = savedTournament.players.slice() // Copy Players Array.

  let matchesString = `Round ${savedTournament.currentRound} Matches Generated!\n`

  while (players.length !== 0) {
    let newMatch = {
      player1: popRandomElement(players),
      player2: popRandomElement(players),
      score: {
        player1: null,
        player2: null
      }
    }
    matchesString += `<${newMatch.player1}> vs <${newMatch.player2}>\n`
    savedTournament.rounds[savedTournament.currentRound - 1].matches.push(newMatch)
  }
  await tournament.set(savedTournament)

  return matchesString
}
const popRandomElement = (players)=> {
  const playerIndex = Math.floor(Math.random() * players.length)
  return players.splice(playerIndex, 1)[0]
}

module.exports = { execute }
