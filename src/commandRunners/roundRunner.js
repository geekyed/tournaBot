const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { determineTotalRounds } = require('./helpers/determineTotalRounds')
const generateMatchesRunner = require('./generateMatchesRunner')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  if (round.matches.every( m => m.completed ) && myTournament.currentRound < determineTotalRounds(myTournament.players.length) ) {
    myTournament.currentRound++
    await tournament.set(myTournament)
    let response = `Round ${myTournament.currentRound - 1} Ended.\n\n`
    response += await generateMatchesRunner.execute(data)
    return response
  }
  return 'Round not incremented.'
}

module.exports = { execute }