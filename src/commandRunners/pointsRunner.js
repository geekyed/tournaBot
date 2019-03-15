const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { collateTotalScores } = require('./helpers/collateTotalScores')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (myTournament.type != 'swiss') return 'Only swiss tournamnents have points.'
  if (myTournament.rounds.length === 0) return `The tournament ${myTournament.tournamentName} hasn't been started yet!`

  let totalScores = collateTotalScores(myTournament).reverse()

  let pointsResponse = 'Current points standings:\n\n'
  totalScores.forEach(score => pointsResponse += `${score.points}pts ${score.name} (OMWP ${Math.round(score.oppMatchWinPerc)}\%  GWP ${Math.round(score.gameWinPerc)}\% OGWP ${Math.round(score.oppGameWinPerc)}\%)\n`)

  return pointsResponse
}
module.exports = { execute }