const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const Win = 3
const Draw = 1
const Lose = 0

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (myTournament.rounds.length === 0) return `The tournament ${myTournament.tournamentName} hasn't been started yet!`

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
  rersultEffects(match, round, myTournament)
  round.started = true
  await tournament.set(myTournament)
}

const rersultEffects = (match, round, myTournament) => {
  if (match.score.player1 === match.score.player2) { 
    if (myTournament.type === 'swiss') {
      round.points[match.player1] = Draw
      round.points[match.player2] = Draw
    }
    throw new Error('You cant draw in a knockout tournament')
  }

  if (match.score.player1 > match.score.player2) {
    if (myTournament.type === 'swiss') {
      round.points[match.player1] = Win
      round.points[match.player2] = Lose
    } else {
      myTournament.players.splice(myTournament.players.indexOf(match.player2), 1)
    }
  }

  if (match.score.player1 < match.score.player2) {
    if (myTournament.type === 'swiss') { 
      round.points[match.player1] = Lose
      round.points[match.player2] = Win
    } else {
      myTournament.players.splice(myTournament.players.indexOf(match.player1), 1)
    }
  }
}

const setScores = (match, p1Score, p2Score) => {
  match.score.player1 = Number(p1Score)
  match.score.player2 = Number(p2Score)
  match.completed = true
}

module.exports = { execute }