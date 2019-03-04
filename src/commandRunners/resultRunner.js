const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  for (let i in round.matches) {
    let match = round.matches[i]

    if (match.player1.includes(data.userID)) {
      return processMatch(match, round, myTournament, data.score.user, data.score.opponent)
    }
    // Is user player 2 of this match?
    if (match.player2.includes(data.userID)) {
      return processMatch(match, round, myTournament, data.score.opponent, data.score.user)
    }
  }

  throw new Error(`no current match found in tournament: ${myTournament.tournamentName}, 
    in channel: <#${data.channelID}> for player: <@${data.userID}>`)
}

const processMatch = async (match, round, myTournament, p1Score, p2Score) => {
  setScores(match, p1Score, p2Score)
  console.log('scores set')
  administerRound(myTournament, round)
  console.log('admin done')

  resultString = setPoints(match, round)
  console.log('points set')

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
    return `Result saved, oh you drew ${match.player1}`
  }

  if (match.score.player1 > match.score.player2) {
    round.points[match.player1] = 3
    round.points[match.player2] = 0
    return `Result saved, congrats on the win ${match.player1}!`
  }

  if (match.score.player1 < match.score.player2) {
    round.points[match.player1] = 0
    round.points[match.player2] = 3
    return `Result saved, better luck next time ${match.player1}`
  }

  throw new Error('There\'s something worng with the format of your score')
}

const setScores = (match, p1Score, p2Score) => {
  match.score.player1 = p1Score
  match.score.player2 = p2Score
  match.completed = true
}

module.exports = { execute }