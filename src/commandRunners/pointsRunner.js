const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { collateTotalScores } = require('./helpers/collateTotalScores')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (myTournament.type != 'swiss') throw new Error('Only swiss tournamnents have points.')
  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.tournamentName} hasn't been started yet!`)

  let totalScores = collateTotalScores(myTournament).reverse()

  let message = ''
  totalScores.forEach(score => message += `${score.points}pts ${score.name} (OMWP ${Math.round(score.oppMatchWinPerc)}\%  GWP ${Math.round(score.gameWinPerc)}\% OGWP ${Math.round(score.oppGameWinPerc)}\%)\n`)

  return { header: 'Current points standings', message }
}
module.exports = { execute }