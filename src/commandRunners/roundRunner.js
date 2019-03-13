const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { determineTotalRounds } = require('./helpers/determineTotalRounds')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  if (round.matches.every( m => m.completed ) && myTournament.currentRound < determineTotalRounds(myTournament.players.length) ) {
    myTournament.currentRound++
    await tournament.set(myTournament)
    return `Starting round ${myTournament.currentRound}, you can now generate new pairings.`
  }
  return 'Round not incremented.'
}

module.exports = { execute }