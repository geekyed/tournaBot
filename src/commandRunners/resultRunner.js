const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { determineTotalRounds }  = require('./helpers/determineTotalRounds')

const Win = 3
const Draw = 1
const Lose = 0

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  for (let i in round.matches) {
    let match = round.matches[i]

    if (match.player1.includes(data.userID)) {
      await processMatch(match, round, myTournament, data.score.user, data.score.opponent)
      return `Result saved: ${match.player1} ${match.score.player1} - ${match.score.player2} ${match.player2}`
    }
    if (match.player2.includes(data.userID)) {
      await processMatch(match, round, myTournament, data.score.opponent, data.score.user)
      return `Result saved: ${match.player1} ${match.score.player1} - ${match.score.player2} ${match.player2}`
    }
  }

  throw new Error(`no current match found in tournament: ${myTournament.tournamentName}, 
    in channel: <#${data.channelID}> for player: <@${data.userID}>`)
}

const processMatch = async (match, round, myTournament, p1Score, p2Score) => {
  setScores(match, p1Score, p2Score)
  setPoints(match, round)
  round.started = true
  await tournament.set(myTournament)
}

const setPoints = (match, round) => {
  if (match.score.player1 === match.score.player2) { 
    round.points[match.player1] = Draw
    round.points[match.player2] = Draw
  }

  if (match.score.player1 > match.score.player2) {
    round.points[match.player1] = Win
    round.points[match.player2] = Lose
  }

  if (match.score.player1 < match.score.player2) {
    round.points[match.player1] = Lose
    round.points[match.player2] = Win
  }
}

const setScores = (match, p1Score, p2Score) => {
  match.score.player1 = p1Score
  match.score.player2 = p2Score
  match.completed = true
}

module.exports = { execute }