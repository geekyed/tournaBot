const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { collateTotalScores } = require('./helpers/collateTotalScores')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let totalScores = collateTotalScores(myTournament).reverse()

  let pointsResponse = 'Current points standings:\n\n'
  totalScores.forEach(score => pointsResponse += `${score.points}pts ${score.name} (OWP ${Math.round(score.oppMatchWinPerc)}\%  GWP ${Math.round(score.gameWinPerc)}\%)\n`)

  return pointsResponse
}
module.exports = { execute }