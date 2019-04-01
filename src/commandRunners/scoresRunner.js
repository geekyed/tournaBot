const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)
  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.tournamentName} hasn't been started yet!`)

  let message = ''

  myTournament.rounds.forEach((round, i) => {
    message += getRoundScoresString(round, i)
  })
  return { header: 'Scores', message } 
}

const getRoundScoresString = (round, i) => {
  let roundScores = ` Round: ${i + 1}\n`
  round.matches.forEach( match => {
    roundScores += `    ${nameWithoutAt(match.player1)} ${match.score.player1} - ${match.score.player2} ${nameWithoutAt(match.player2)}\n`
  })
  return roundScores
}

const nameWithoutAt = player => {
  return player.includes('@') ? player.split('|')[1].slice(0, -1) : player
}

module.exports = { execute }