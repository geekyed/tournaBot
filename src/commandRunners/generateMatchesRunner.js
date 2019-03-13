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
    const player2 = getPlayer2(player1, totalScores, myTournament.rounds)

    matchesString += `${player1.name} ${player1.points}pts vs ${player2.name} ${player2.points}pts\n`
    round.matches.push(createMatch(player1.name, player2.name))
    if (player2.name === 'Bye') round.points[player1.name] = 3
  }

  myTournament.rounds[myTournament.currentRound - 1] = round
  await tournament.set(myTournament)

  return matchesString
}

const getPlayer2 = (player1, totalScores, rounds) => {

  // P1 is last in the bunch so gets a bye.
  if (totalScores.length === 0) return { name: 'Bye', points: 0 }
  
  let p2Index = totalScores.length - 1
  // players cant play twice
  while (playersHavePlayed(player1.name, totalScores[p2Index].name, rounds)) {
    p2Index--
    if(p2Index < 0) throw new Error(`Somethings gone wrong ${player1.name} has played everyone`)
  }

  return totalScores.splice(p2Index, 1)[0]
}

const playersHavePlayed = (player1Name, player2Name, rounds) => {
  for(let i = 0; i < rounds.length; i++) {
    if (getPlayersMatchIndexForRound(player1Name, rounds[i]) === getPlayersMatchIndexForRound(player2Name, rounds[i])) return true
  }
  return false
}

const getPlayersMatchIndexForRound = (playerName, round) => round.matches.findIndex(match => match.player1 === playerName || match.player2 === playerName)

const initialiseRound = (myTournament) => {
  let round = { matches:[], started: false, points: {} }
  for (let i in myTournament.players) round.points[myTournament.players[i]] = 0
  return round
}

const isRoundStarted = (myTournament) => {
  const roundIndex = myTournament.currentRound - 1
  return typeof myTournament.rounds[roundIndex] !== 'undefined' && myTournament.rounds[roundIndex].started
}

const createMatch = (player1name, player2Name) => {
  return newMatch = {
    player1: player1name,
    player2: player2Name,
    completed: player2Name === 'Bye',
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
  return myTournament.currentRound !== 1 ? totalScores.sort((a, b) => a.points - b.points) : totalScores.sort(() => {return 0.5 - Math.random()})
}

module.exports = { execute }
