const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

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
    totalScores.push({ name: myTournament.players[i], points })
  }

  totalScores.sort((a, b) => a.points - b.points)

  let matchesString = `Round ${myTournament.currentRound} matches generated!\n`

  while (totalScores.length !== 0) {
    const player1 = totalScores.pop()
    const player2 = totalScores.pop()
    let newMatch = {
      player1: player1.name,
      player2: player2.name,
      completed: this.player2 === 'Bye',
      score: {
        player1: 0,
        player2: 0
      }
    }

    matchesString += `${player1.name} ${player1.points}pts vs ${player2.name} ${player2.points}pts\n`
    round.matches.push(newMatch)
    if (player2 === 'Bye') round.points[player1] = 3
  }

  myTournament.rounds.push(round)
  await tournament.set(myTournament)

  return matchesString
}



module.exports = { execute }
