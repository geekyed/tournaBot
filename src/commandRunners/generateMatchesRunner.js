const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  const totalRounds = getTotalRounds(myTournament.players.length)

  // If it's the first round we need to intialise the rounds array.
  if (myTournament.currentRound === 1) myTournament.rounds = []
  let round = { matches:[], started: false, points: {} }

  let totalScores = []
  for (let i in myTournament.players) {
    round.points[myTournament.players[i]] = 0 // init this rounds points
    let points = 0
    for (let j in myTournament.rounds) { // get previous rounds points
      points += myTournament.rounds[j].points[myTournament.players[i]]
    }
    totalScores.push({ player: myTournament.players[i], points })
  }


  totalScores.sort((a, b) => a.points - b.points)

  let matchesString = `Round ${myTournament.currentRound} matches generated!\n`

  while (totalScores.length !== 0) {
    const player1 = totalScores.pop().player
    const player2 = totalScores.pop().player
    let newMatch = {
      player1,
      player2,
      completed: this.player2 === 'Bye',
      score: {
        player1: 0,
        player2: 0
      }
    }
    matchesString += `${newMatch.player1} vs ${newMatch.player2}\n`
    round.matches.push(newMatch)
    if (player2 === 'Bye') round.points[player1] = 3
  }

  myTournament.rounds.push(round)
  await tournament.set(myTournament)

  return matchesString
}

const getTotalRounds = (numPlayers) => {
  if (numPlayers <= 2) return 1
  if (numPlayers <= 4) return 2
  if (numPlayers <= 8) return 3
  if (numPlayers <= 16) return 4
  if (numPlayers <= 32) return 5
  if (numPlayers <= 64) return 6
  if (numPlayers <= 128) return 7
  throw new Error(`Not sure how many rounds to generate!`)
}

module.exports = { execute }
