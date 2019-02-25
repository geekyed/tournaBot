const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let savedTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (savedTournament.rounds[savedTournament.currentRound - 1].started) {
    throw new Error(`You cant regenerate matches for round ${savedTournament.currentRound}, as results have already been recorded!`)
  } 

  let players = savedTournament.players.slice() // Copy Players Array.
  let matchesString = `Round ${savedTournament.currentRound} Matches Generated!\n`

  savedTournament.rounds[savedTournament.currentRound - 1].matches = [] // Ensure we overwrite
  while (players.length !== 0) {
    const player1 = popRandomElement(players)
    const player2 = popRandomElement(players)
    let newMatch = {
      player1,
      player2,
      completed: player2 === 'Bye',
      score: {
        player1: player2 === 'Bye' ? 2 :0,
        player2: 0
      }
    }
    matchesString += `${newMatch.player1} vs ${newMatch.player2}\n`
    savedTournament.rounds[savedTournament.currentRound - 1].matches.push(newMatch)
  }
  await tournament.set(savedTournament)

  return matchesString
}
const popRandomElement = (players)=> {
  if(players.length === 0) return 'Bye'
  const playerIndex = Math.floor(Math.random() * players.length)
  return players.splice(playerIndex, 1)[0]
}

module.exports = { execute }
