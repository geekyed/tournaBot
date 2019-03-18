const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { determineTotalRounds } = require('./helpers/determineTotalRounds')
const generateMatchesRunner = require('./generateMatchesRunner')
const pointsRunner = require('./pointsRunner')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.tournamentName} hasn't been started yet!`)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  if (!round.matches.every( m => m.completed )) throw new Error('It doesnt look like the current round has finished!')

  if (swissTournamentFinished) return { header: 'The tournament has finished!', message: await pointsRunner.execute(data) }
  if (knockoutTournamentFinished) return { header: 'The tournament has finished!', message: `${myTournament.players[0]} is our Winner!` }

  myTournament.currentRound++
  await tournament.set(myTournament)
  
  let { message } = await generateMatchesRunner.execute(data)
  return { header: `Round ${myTournament.currentRound} ended, new matches generated`, message }
}

const knockoutTournamentFinished = (myTournament) => myTournament.type === 'knockout' && myTournament.players.length === 1

const swissTournamentFinished = (myTournament) => myTournament.type === 'swiss' &&  myTournament.currentRound === determineTotalRounds(myTournament.players.length)

module.exports = { execute }