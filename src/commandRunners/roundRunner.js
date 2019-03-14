const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { determineTotalRounds } = require('./helpers/determineTotalRounds')
const generateMatchesRunner = require('./generateMatchesRunner')
const pointsRunner = require('./pointsRunner')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  if (round.matches.every( m => m.completed )) {
    let response = `Round ${myTournament.currentRound} Ended.\n\n`

    if (myTournament.currentRound === determineTotalRounds(myTournament.players.length)) {
      response += 'The tournament has finished!\n\n'
      response += await pointsRunner.execute(data)
      return response
    }

    myTournament.currentRound++
    await tournament.set(myTournament)
    
    response += await generateMatchesRunner.execute(data)
    return response
  }
  return 'It doesnt look like the current round has finished!'
}

module.exports = { execute }