const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  for (let i in round.matches) {
    let match = round.matches[i]

    if (match.player1.includes(data.userID)) {
      processMatch(match, round, myTournament, data.score.user, data.score.opponent)
      return `Result saved: ${match.player1} ${match.score.player1} - ${match.score.player2} ${match.player2}`
    }
    if (match.player2.includes(data.userID)) {
      processMatch(match, round, myTournament, data.score.opponent, data.score.user)
      return `Result saved: ${match.player1} ${match.score.player1} - ${match.score.player2} ${match.player2}`
    }
  }

  throw new Error(`no current match found in tournament: ${myTournament.tournamentName}, 
    in channel: <#${data.channelID}> for player: <@${data.userID}>`)
}

const processMatch = async (match, round, myTournament, p1Score, p2Score, isPlayer1) => {
  setScores(match, p1Score, p2Score)
  administerRound(myTournament, round)
  setPoints(match, round)

  await tournament.set(myTournament)

  return resultString
}

const administerRound = (myTournament, round) => {
  round.started = true

  const isRoundFinished = round.matches.every( m => m.completed )
  if (isRoundFinished && myTournament.currentRound < myTournament.rounds.length) myTournament.currentRound++
}

const setPoints = (match, round) => {
  if (match.score.player1 === match.score.player2) { 
    round.points[match.player1] = 1
    round.points[match.player2] = 1
  }

  if (match.score.player1 > match.score.player2) {
    round.points[match.player1] = 3
    round.points[match.player2] = 0
  }

  if (match.score.player1 < match.score.player2) {
    round.points[match.player1] = 0
    round.points[match.player2] = 3
  }

  throw new Error('There\'s something worng with the format of your score')
}

const setScores = (match, p1Score, p2Score) => {
  match.score.player1 = p1Score
  match.score.player2 = p2Score
  match.completed = true
}

module.exports = { execute }