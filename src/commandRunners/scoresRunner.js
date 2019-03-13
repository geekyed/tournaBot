const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let scoresString = 'Scores!\n'

  myTournament.rounds.forEach((round, i) => {
    scoresString += getRoundScoresString(round, i)
  })
  return scoresString
}

const getRoundScoresString = (round, i) => {
  let roundScores = ` Round: ${i + 1}\n`
  round.matches.forEach( ( match, j) => {
    roundScores += `    Match: ${j + 1}\n`
    roundScores += `      ${match.player1} ${match.score.player1} - ${match.score.player2} ${match.player2}\n`
  })
  return roundScores
}

module.exports = { execute }