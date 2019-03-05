const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (isRoundStarted(myTournament)) {
    throw new Error('You cannot regenerate a round once a match has been played.')
  }

  let round = initialiseRound(myTournament)
  
  let totalScores = collateTotalScore(myTournament)

  let matchesString = `Round ${myTournament.currentRound} matches generated!\n`

  while (totalScores.length !== 0) {
    const player1 = totalScores.pop()
    const player2 = totalScores.pop()
    
    matchesString += `${player1.name} ${player1.points}pts vs ${player2.name} ${player2.points}pts\n`
    round.matches.push(createMatch(player1, player2))
    if (player2 === 'Bye') round.points[player1] = 3
  }

  myTournament.rounds.push(round)
  await tournament.set(myTournament)

  return matchesString
}

const initialiseRound = (myTournament) => {
  let round = { matches:[], started: false, points: {} }
  for (let i in myTournament.players) round.points[myTournament.players[i]] = 0
  return round
}

const isRoundStarted = (myTournament) => {
  const roundIndex = myTournament.currentRound - 1
  typeof myTournament.rounds[roundIndex] !== 'undefined' && 
  myTournament.rounds[roundIndex].started
}

const createMatch = (player1, player2) => {
  return newMatch = {
    player1: player1.name,
    player2: player2.name,
    completed: this.player2 === 'Bye',
    score: {
      player1: 0,
      player2: 0
    }
  }
}

const collateTotalScore = (myTournament) => {
  let totalScores = []
  for (let i in myTournament.players) {
    let points = 0
    for (let j in myTournament.rounds) {
      points += myTournament.rounds[j].points[myTournament.players[i]]
    }
    totalScores.push({ name: myTournament.players[i], points })
  }
  return totalScores.sort((a, b) => a.points - b.points)
}

module.exports = { execute }
