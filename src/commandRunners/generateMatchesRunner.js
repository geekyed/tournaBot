const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  //const totalRounds = getTotalRounds(myTournament.players.length)

  // If it's the first round we need to intialise the rounds array.
  if (myTournament.currentRound === 1) myTournament.rounds = []
  let round = { matches:[], started: false, points: {} }

  for (let j in myTournament.players) {
    round.points[myTournament.players[j]] = 0
  }

  let players = myTournament.players.slice() // Copy players array.
  let matchesString = `Round ${myTournament.currentRound} matches generated!\n`
  while (players.length !== 0) {
    const { player1, player2 } = generatePairing(myTournament.currentRound, players)
    let newMatch = {
      player1,
      player2,
      completed: player2 === 'Bye',
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

const generatePairing = (roundNumber, players) =>  {
  if (roundNumber === 1 ) {
    return { 
      player1: popRandomElement(players), 
      player2: popRandomElement(players)
    }
  }
  return { 
    player1: 0, 
    player2: 0
  }
}

const popRandomElement = (players)=> {
  if(players.length === 0) return 'Bye'
  const playerIndex = Math.floor(Math.random() * players.length)
  return players.splice(playerIndex, 1)[0]
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
